import fs from 'fs';
import path from 'path';
import readline from 'readline';

export interface ExampleMeta {
  id: string;
  name: string;
  type: 'project' | 'script';
  description: string;
  framework: string;
  path: string;
  tags: string[];
}

export const AVAILABLE_EXAMPLES: ExampleMeta[] = [
  {
    id: 'nextjs-saas-starter',
    name: 'Next.js 15 AI SaaS Starter',
    type: 'project',
    description: 'Production B2B SaaS with customer wallets, Stripe checkout, <VibezReceipt />, margins & 2026 models',
    framework: 'Next.js 15 (App Router)',
    path: 'nextjs-saas-starter',
    tags: ['Next.js 15', 'Stripe', 'React 19', 'Full SaaS'],
  },
  {
    id: 'nextjs-app-router-openai',
    name: 'Next.js App Router OpenAI Minimal',
    type: 'project',
    description: 'Minimal 1-line streamText model wrapper with @ai-sdk/openai, auto-metering & safety fuse',
    framework: 'Next.js 15 (App Router)',
    path: 'nextjs-app-router-openai',
    tags: ['Next.js 15', 'OpenAI', '1-Line Wrapper'],
  },
  {
    id: '01-local-cost-meter',
    name: 'Local Token & Cost Calculator',
    type: 'script',
    description: 'Free standalone inference cost calculation and token aggregation without Stripe keys',
    framework: 'TypeScript / Node.js',
    path: '01-local-cost-meter.ts',
    tags: ['Zero Config', 'Free', 'Local'],
  },
  {
    id: '02-vercel-ai-sdk',
    name: 'AI SDK Multi-Tenant Route Wrapper',
    type: 'script',
    description: 'B2B multi-tenant model wrapper with organization metadata, 30% profit margin & runaway fuse',
    framework: 'AI SDK / TypeScript',
    path: '02-vercel-ai-sdk.ts',
    tags: ['B2B', 'Multi-Tenant', 'Margins'],
  },
  {
    id: '03-native-openai-stream',
    name: 'Native OpenAI Stream Tracking',
    type: 'script',
    description: 'Wrap native openai.chat.completions.create streams with 0ms added latency',
    framework: 'OpenAI SDK',
    path: '03-native-openai-stream.ts',
    tags: ['Native SDK', '0ms Latency'],
  },
  {
    id: '04-claude-thinking',
    name: 'Claude 3.7 Sonnet Extended Thinking',
    type: 'script',
    description: 'Track reasoning and thinking token streams with Anthropic SDK',
    framework: 'Anthropic SDK',
    path: '04-claude-thinking.ts',
    tags: ['Reasoning', 'Claude 3.7', 'Thinking'],
  },
  {
    id: '05-reasoning-agent-stream',
    name: 'Autonomous Reasoning Agent Loop',
    type: 'script',
    description: 'Multi-step agent loop handling reasoning deltas, prompt caching & runaway circuit breaker',
    framework: 'AI SDK / Agents',
    path: '05-reasoning-agent-stream.ts',
    tags: ['Agents', 'Reasoning Deltas', 'Safety Fuse'],
  },
];

/**
 * Locate the examples directory across local workspace and installed package paths
 */
export function findExamplesDir(): string {
  const candidates = [
    path.resolve(__dirname, '../../examples'),
    path.resolve(__dirname, '../examples'),
    path.resolve(__dirname, '../../../examples'),
    path.resolve(process.cwd(), 'examples'),
    path.resolve(process.cwd(), 'node_modules/vibezcheck/examples'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }

  return path.resolve(__dirname, '../../examples');
}

/**
 * Copy directory recursively, skipping node_modules and transient folders
 */
export function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'dist', 'coverage', '.turbo'].includes(entry.name)) {
        continue;
      }
      copyDir(srcPath, destPath);
    } else {
      if (entry.name === '.env.local' || entry.name.endsWith('.log')) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function prompt(question: string, defaultVal: string = ''): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const promptText = defaultVal
      ? `\x1b[32m?\x1b[0m \x1b[1m${question}\x1b[0m \x1b[90m(${defaultVal})\x1b[0m: `
      : `\x1b[32m?\x1b[0m \x1b[1m${question}\x1b[0m: `;

    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultVal);
    });
  });
}

/**
 * Display formatted catalogue of all available examples
 */
export function listExamples(): void {
  console.log('\x1b[1m✦ VibezCheck Official Examples & Starters\x1b[0m\n');

  AVAILABLE_EXAMPLES.forEach((ex, index) => {
    const num = `[${index + 1}]`.padEnd(4);
    const typeTag = ex.type === 'project' 
      ? '\x1b[42m\x1b[30m PROJECT \x1b[0m' 
      : '\x1b[44m\x1b[37m SCRIPT  \x1b[0m';
    
    console.log(`${num} ${typeTag} \x1b[1m${ex.name}\x1b[0m \x1b[90m(${ex.id})\x1b[0m`);
    console.log(`    \x1b[90mFramework:\x1b[0m ${ex.framework}`);
    console.log(`    \x1b[90mDescription:\x1b[0m ${ex.description}`);
    console.log(`    \x1b[90mCommand:\x1b[0m \x1b[36mnpx vibezcheck example ${ex.id}\x1b[0m\n`);
  });
}

/**
 * Scaffold selected example into target directory
 */
export async function scaffoldExample(exampleInput?: string, targetDirInput?: string): Promise<boolean> {
  const examplesBase = findExamplesDir();

  let selected = AVAILABLE_EXAMPLES.find(
    (e) => e.id.toLowerCase() === exampleInput?.toLowerCase()
  );

  // Check if numeric selection was entered (e.g. "1")
  if (!selected && exampleInput && !isNaN(Number(exampleInput))) {
    const idx = Number(exampleInput) - 1;
    if (idx >= 0 && idx < AVAILABLE_EXAMPLES.length) {
      selected = AVAILABLE_EXAMPLES[idx];
    }
  }

  // Interactive selection if not found or not provided
  if (!selected) {
    listExamples();
    const choice = await prompt('Select an example number (1-7) or name', '1');
    if (!choice) return false;

    if (!isNaN(Number(choice))) {
      const idx = Number(choice) - 1;
      selected = AVAILABLE_EXAMPLES[idx];
    } else {
      selected = AVAILABLE_EXAMPLES.find(
        (e) => e.id.toLowerCase() === choice.toLowerCase()
      );
    }

    if (!selected) {
      console.log(`\x1b[31m✕ Unknown example selection: ${choice}\x1b[0m`);
      return false;
    }
  }

  // Destination directory
  const defaultDir = selected.type === 'project' ? `./${selected.id}` : './';
  const targetDir = targetDirInput || (await prompt('Enter destination directory', defaultDir));
  const resolvedTarget = path.resolve(process.cwd(), targetDir);

  const sourcePath = path.join(examplesBase, selected.path);

  if (!fs.existsSync(sourcePath)) {
    console.log(`\x1b[31m✕ Could not locate template files at: ${sourcePath}\x1b[0m`);
    return false;
  }

  console.log(`\n\x1b[38;2;212;255;50m✦\x1b[0m Creating \x1b[1m${selected.name}\x1b[0m in \x1b[36m${path.relative(process.cwd(), resolvedTarget) || '.'}\x1b[0m...`);

  if (selected.type === 'project') {
    copyDir(sourcePath, resolvedTarget);

    console.log(`
\x1b[32m✓ Successfully created ${selected.name}![0m

\x1b[1mNext Steps:\x1b[0m
  1. \x1b[33mcd ${path.relative(process.cwd(), resolvedTarget) || '.'}\x1b[0m
  2. \x1b[33mpnpm install\x1b[0m (or \x1b[33mnpm install\x1b[0m)
  3. \x1b[33mcp .env.example .env.local\x1b[0m and add your API keys
  4. \x1b[33mpnpm dev\x1b[0m to start the app
`);
  } else {
    // Single file script
    fs.mkdirSync(resolvedTarget, { recursive: true });
    const destFile = path.join(resolvedTarget, path.basename(selected.path));
    fs.copyFileSync(sourcePath, destFile);

    console.log(`
\x1b[32m✓ Successfully saved ${path.basename(destFile)}![0m

\x1b[1mTo run this example:\x1b[0m
  \x1b[33mnpx ts-node ${path.relative(process.cwd(), destFile)}\x1b[0m
`);
  }

  return true;
}

/**
 * Handler for CLI command: npx vibezcheck examples [name] [dir]
 */
export async function handleExamplesCommand(args: string[]): Promise<void> {
  // If user passed --list or -l
  if (args.includes('--list') || args.includes('-l')) {
    listExamples();
    return;
  }

  const exampleParam = args[0] && !args[0].startsWith('-') ? args[0] : undefined;
  const targetDirParam = args[1] && !args[1].startsWith('-') ? args[1] : undefined;

  await scaffoldExample(exampleParam, targetDirParam);
}
