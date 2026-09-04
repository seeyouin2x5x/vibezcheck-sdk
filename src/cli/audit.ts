import fs from 'fs';
import path from 'path';
import readline from 'readline';

export interface RouteAuditFinding {
  file: string;
  relativePath: string;
  status: 'protected' | 'unmetered' | 'unprotected_direct';
  line: number;
  rawSnippet: string;
  suggestedFix?: string;
  modelOrProvider?: string;
  details: string;
}

export interface AuditOptions {
  dir?: string;
  fix?: boolean;
  ci?: boolean;
  json?: boolean;
  silent?: boolean;
}

export interface AuditSummary {
  scannedFiles: number;
  aiRoutesCount: number;
  protectedCount: number;
  unmeteredCount: number;
  scanTimeMs: number;
  findings: RouteAuditFinding[];
}

const IGNORED_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.turbo',
  'coverage',
  '.cache',
  '.vercel',
  'tests',
  'test',
  '__tests__',
  'examples',
  'fixtures',
]);

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

/**
 * Discovers API and server route files in the project.
 */
export function findRouteFiles(rootDir: string): string[] {
  const targetSubdirs = [
    path.join('app', 'api'),
    path.join('src', 'app', 'api'),
    path.join('pages', 'api'),
    path.join('src', 'pages', 'api'),
    'routes',
    path.join('src', 'routes'),
    path.join('server', 'api'),
    path.join('server', 'routes'),
  ];

  const foundFiles: string[] = [];

  // Check designated route directories first
  let searchedDesignated = false;
  for (const rel of targetSubdirs) {
    const full = path.join(rootDir, rel);
    if (fs.existsSync(full)) {
      searchedDesignated = true;
      scanDirRecursive(full, foundFiles);
    }
  }

  // If no designated route folders exist or very few files, scan app/ and src/app/
  if (foundFiles.length === 0) {
    const appDir = fs.existsSync(path.join(rootDir, 'app'))
      ? path.join(rootDir, 'app')
      : fs.existsSync(path.join(rootDir, 'src', 'app'))
      ? path.join(rootDir, 'src', 'app')
      : rootDir;

    scanDirRecursive(appDir, foundFiles);
  }

  return Array.from(new Set(foundFiles));
}

function scanDirRecursive(currentDir: string, results: string[]): void {
  try {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          scanDirRecursive(path.join(currentDir, entry.name), results);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (EXTENSIONS.has(ext)) {
          // Exclude spec/test files
          if (!entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
            results.push(path.join(currentDir, entry.name));
          }
        }
      }
    }
  } catch {
    // Gracefully ignore inaccessible dirs
  }
}

/**
 * Audits a single file for AI SDK and LLM usage.
 */
export function auditFile(filePath: string, rootDir: string): RouteAuditFinding[] {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return [];
  }

  // Fast pre-filter: Does this file even reference AI libraries?
  const hasAiKeywords =
    content.includes('streamText') ||
    content.includes('generateText') ||
    content.includes('streamObject') ||
    content.includes('generateObject') ||
    content.includes('OpenAI') ||
    content.includes('Anthropic') ||
    content.includes('vibezcheck');

  if (!hasAiKeywords) {
    return [];
  }

  const lines = content.split(/\r?\n/);
  const findings: RouteAuditFinding[] = [];

  // Check 1: Vercel AI SDK usage (streamText, generateText, etc.)
  const aiSdkRegex = /\b(streamText|generateText|streamObject|generateObject)\s*\(\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = aiSdkRegex.exec(content)) !== null) {
    const matchIndex = match.index;
    const lineNumber = content.substring(0, matchIndex).split(/\r?\n/).length;

    // Scan forward a few lines (up to 25 lines) to inspect the `model:` argument
    const snippetLines = lines.slice(lineNumber - 1, lineNumber + 25);
    const snippet = snippetLines.join('\n');

    // Look for model:
    const modelLineMatch = snippet.match(/model\s*:\s*([^,\n}]+)/);
    if (modelLineMatch) {
      const modelExpr = modelLineMatch[1].trim();
      const modelLineOffset = snippetLines.findIndex((l) => l.includes('model:'));
      const actualLine = lineNumber + (modelLineOffset >= 0 ? modelLineOffset : 0);
      const rawSnippet = lines[actualLine - 1] || modelLineMatch[0];

      const isProtected =
        modelExpr.includes('vibezcheck(') ||
        modelExpr.includes('session.model(') ||
        modelExpr.includes('vz.model(');

      if (isProtected) {
        findings.push({
          file: filePath,
          relativePath,
          status: 'protected',
          line: actualLine,
          rawSnippet,
          modelOrProvider: modelExpr,
          details: 'Metered with 0ms added latency and $0.50 safety fuse ceiling',
        });
      } else {
        // Raw unmetered AI call
        const suggestedFix = `model: vibezcheck(${modelExpr}),`;
        findings.push({
          file: filePath,
          relativePath,
          status: 'unmetered',
          line: actualLine,
          rawSnippet,
          suggestedFix,
          modelOrProvider: modelExpr,
          details: 'Direct provider call without cost limit or token metering',
        });
      }
    }
  }

  // Check 2: Direct raw client instantiation (new OpenAI(), new Anthropic())
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      (line.includes('new OpenAI(') || line.includes('new Anthropic(')) &&
      !content.includes('vibezcheck') &&
      !content.includes('wrapStream') &&
      !content.includes('trackUsage')
    ) {
      findings.push({
        file: filePath,
        relativePath,
        status: 'unprotected_direct',
        line: i + 1,
        rawSnippet: line.trim(),
        details: 'Direct client instance without circuit breaker fuse',
      });
      break; // One direct warning per file is sufficient
    }
  }

  return findings;
}

/**
 * Runs the audit across the project.
 */
export async function runAudit(options: AuditOptions = {}): Promise<AuditSummary> {
  const startTime = Date.now();
  const rootDir = options.dir ? path.resolve(options.dir) : process.cwd();

  const files = findRouteFiles(rootDir);
  const allFindings: RouteAuditFinding[] = [];

  for (const file of files) {
    const findings = auditFile(file, rootDir);
    allFindings.push(...findings);
  }

  const protectedCount = allFindings.filter((f) => f.status === 'protected').length;
  const unmeteredCount = allFindings.filter(
    (f) => f.status === 'unmetered' || f.status === 'unprotected_direct'
  ).length;

  const summary: AuditSummary = {
    scannedFiles: files.length,
    aiRoutesCount: allFindings.length,
    protectedCount,
    unmeteredCount,
    scanTimeMs: Date.now() - startTime,
    findings: allFindings,
  };

  return summary;
}

/**
 * Safely applies the 1-line vibezcheck wrap to an unmetered file.
 * Creates a `.bak` backup copy first.
 */
export function applyFixToFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Create backup
    fs.writeFileSync(`${filePath}.bak`, content, 'utf-8');

    let updated = content;

    // 1. Ensure import exists
    if (!updated.includes("from 'vibezcheck'") && !updated.includes('from "vibezcheck"')) {
      // Find the last import statement or place at top
      const importRegex = /^import\s+.*?;\s*$/gm;
      let lastImportMatch: RegExpExecArray | null = null;
      let match: RegExpExecArray | null;
      while ((match = importRegex.exec(updated)) !== null) {
        lastImportMatch = match;
      }

      const importStatement = "import { vibezcheck } from 'vibezcheck';\n";
      if (lastImportMatch) {
        const insertPos = lastImportMatch.index + lastImportMatch[0].length;
        updated = updated.slice(0, insertPos) + '\n' + importStatement + updated.slice(insertPos);
      } else {
        updated = importStatement + updated;
      }
    }

    // 2. Wrap model: <expr> with vibezcheck(<expr>)
    // Regex matches: model:\s*([a-zA-Z0-9_$]+(?:\([^)]*\)|'[^']*'|"[^"]*"))
    updated = updated.replace(
      /model\s*:\s*(?!vibezcheck\()([a-zA-Z0-9_$]+(?:\([^)]*\)|'[^']*'|"[^"]*"))/g,
      'model: vibezcheck($1)'
    );

    fs.writeFileSync(filePath, updated, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Renders the kind, minimalist terminal output.
 */
export async function displayAuditReport(
  summary: AuditSummary,
  options: AuditOptions = {}
): Promise<void> {
  // If JSON mode requested, output raw JSON and return
  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
    if (options.ci && summary.unmeteredCount > 0) {
      process.exit(1);
    }
    return;
  }

  console.log(`\n\x1b[38;2;212;255;50m✦\x1b[0m \x1b[1mvibezcheck audit\x1b[0m \x1b[90m(${summary.scanTimeMs}ms)\x1b[0m\n`);

  // Case 1: No AI routes detected
  if (summary.aiRoutesCount === 0) {
    console.log(`  \x1b[90mNo AI routes detected across ${summary.scannedFiles} files.\x1b[0m`);
    console.log(`  Ready to build your first metered route? Run: \x1b[36mnpx vibezcheck init\x1b[0m\n`);
    return;
  }

  // Case 2: All routes protected (The Calm State)
  if (summary.unmeteredCount === 0) {
    const routeWord = summary.protectedCount === 1 ? 'route' : 'routes';
    console.log(`  \x1b[32m✓ All ${summary.protectedCount} AI ${routeWord} are metered with $0.50 safety fuses.\x1b[0m`);
    console.log(`  \x1b[90mYour wallet is protected. You're good to ship.\x1b[0m\n`);
    return;
  }

  // Case 3: Unmetered routes found (The Kind Companion)
  const unmeteredFindings = summary.findings.filter((f) => f.status !== 'protected');
  const countWord = unmeteredFindings.length === 1 ? 'route' : 'routes';

  console.log(
    `  We noticed \x1b[33m${unmeteredFindings.length} ${countWord}\x1b[0m calling AI providers directly without a safety fuse:\n`
  );

  for (const finding of unmeteredFindings) {
    console.log(`  \x1b[1m→ ${finding.relativePath}:${finding.line}\x1b[0m`);
    console.log(`    \x1b[90mCurrent:\x1b[0m    \x1b[31m${finding.rawSnippet.trim()}\x1b[0m`);
    if (finding.suggestedFix) {
      console.log(`    \x1b[90m1-Line Fix:\x1b[0m \x1b[32m${finding.suggestedFix}\x1b[0m`);
    }
    console.log('');
  }

  console.log(`  \x1b[1mWhy this matters:\x1b[0m`);
  console.log(`  \x1b[90mUnmetered routes bill directly to your credit card without runaway limits.`);
  console.log(`  Wrapping them adds 0ms token metering, $0.50 runaway fuses, and prompt cache discounts.\x1b[0m\n`);

  // Auto-fix handling
  if (options.fix) {
    let fixedCount = 0;
    const uniqueFiles = Array.from(new Set(unmeteredFindings.map((f) => f.file)));
    for (const file of uniqueFiles) {
      if (applyFixToFile(file)) {
        fixedCount++;
        const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
        console.log(`  \x1b[32m✓ Safely wrapped ${rel}\x1b[0m \x1b[90m(backup saved as .bak)\x1b[0m`);
      }
    }
    console.log(`\n  \x1b[32m\x1b[1m🎉 All done!\x1b[0m \x1b[90mRun tests or build to verify.\x1b[0m\n`);
    return;
  }

  // Interactive prompt if TTY and not CI
  if (!options.ci && process.stdin.isTTY) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question(
        `  \x1b[38;2;212;255;50m⚡ Would you like VibezCheck to safely wrap these routes for you? (y/N): \x1b[0m`,
        (ans) => {
          rl.close();
          resolve(ans.trim().toLowerCase());
        }
      );
    });

    if (answer === 'y' || answer === 'yes') {
      const uniqueFiles = Array.from(new Set(unmeteredFindings.map((f) => f.file)));
      for (const file of uniqueFiles) {
        if (applyFixToFile(file)) {
          const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
          console.log(`  \x1b[32m✓ Safely wrapped ${rel}\x1b[0m \x1b[90m(backup saved as .bak)\x1b[0m`);
        }
      }
      console.log(`\n  \x1b[32m\x1b[1m🎉 All done!\x1b[0m \x1b[90mRun tests or build to verify.\x1b[0m\n`);
      return;
    }
  }

  // If CI mode and unmetered found, exit with non-zero
  if (options.ci) {
    console.log(`  \x1b[31m✖ CI check failed: ${summary.unmeteredCount} unmetered route(s) found.\x1b[0m\n`);
    process.exit(1);
  }
}
