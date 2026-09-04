import fs from 'fs';
import path from 'path';
import os from 'os';
import { auditFile, applyFixToFile, runAudit } from '../src/cli/audit';

describe('VibezCheck CLI: Kind & Minimalist Audit Scanner', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibezcheck-audit-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  it('detects unmetered streamText route with raw openai provider', () => {
    const filePath = path.join(tempDir, 'route.ts');
    const content = `import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const result = streamText({
    model: openai('gpt-4o'),
    prompt: 'Hello',
  });
  return result.toTextStreamResponse();
}
`;
    fs.writeFileSync(filePath, content, 'utf-8');

    const findings = auditFile(filePath, tempDir);
    expect(findings).toHaveLength(1);
    expect(findings[0].status).toBe('unmetered');
    expect(findings[0].modelOrProvider).toBe("openai('gpt-4o')");
    expect(findings[0].suggestedFix).toContain("vibezcheck(openai('gpt-4o'))");
    expect(findings[0].line).toBe(6);
  });

  it('detects protected route metered with vibezcheck', () => {
    const filePath = path.join(tempDir, 'route.ts');
    const content = `import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini')),
    prompt: 'Hello',
  });
  return result.toTextStreamResponse();
}
`;
    fs.writeFileSync(filePath, content, 'utf-8');

    const findings = auditFile(filePath, tempDir);
    expect(findings).toHaveLength(1);
    expect(findings[0].status).toBe('protected');
    expect(findings[0].details).toContain('$0.50 safety fuse');
  });

  it('detects raw direct client initialization (new OpenAI)', () => {
    const filePath = path.join(tempDir, 'direct.ts');
    const content = `import OpenAI from 'openai';

const client = new OpenAI();
export async function POST() {
  return client.chat.completions.create({
    model: 'gpt-4o',
    messages: [],
  });
}
`;
    fs.writeFileSync(filePath, content, 'utf-8');

    const findings = auditFile(filePath, tempDir);
    expect(findings).toHaveLength(1);
    expect(findings[0].status).toBe('unprotected_direct');
  });

  it('safely applies fix with .bak backup and import injection', () => {
    const filePath = path.join(tempDir, 'unmetered-route.ts');
    const originalContent = `import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const result = streamText({
    model: openai('gpt-4o'),
    prompt: 'test',
  });
  return result.toTextStreamResponse();
}
`;
    fs.writeFileSync(filePath, originalContent, 'utf-8');

    const success = applyFixToFile(filePath);
    expect(success).toBe(true);

    // Verify .bak file
    const backupPath = `${filePath}.bak`;
    expect(fs.existsSync(backupPath)).toBe(true);
    expect(fs.readFileSync(backupPath, 'utf-8')).toBe(originalContent);

    // Verify fixed content
    const patchedContent = fs.readFileSync(filePath, 'utf-8');
    expect(patchedContent).toContain("import { vibezcheck } from 'vibezcheck';");
    expect(patchedContent).toContain("model: vibezcheck(openai('gpt-4o'))");

    // Re-auditing patched file should now report protected
    const reAuditFindings = auditFile(filePath, tempDir);
    expect(reAuditFindings[0].status).toBe('protected');
  });

  it('runs sub-second audit across multi-route project', async () => {
    const apiDir = path.join(tempDir, 'app', 'api', 'chat');
    fs.mkdirSync(apiDir, { recursive: true });

    fs.writeFileSync(
      path.join(apiDir, 'route.ts'),
      `import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export async function POST() {
  return streamText({
    model: vibezcheck('openai/gpt-4o-mini'),
    prompt: 'hi'
  });
}
`,
      'utf-8'
    );

    const summary = await runAudit({ dir: tempDir });
    expect(summary.scannedFiles).toBeGreaterThanOrEqual(1);
    expect(summary.aiRoutesCount).toBe(1);
    expect(summary.protectedCount).toBe(1);
    expect(summary.unmeteredCount).toBe(0);
    expect(summary.scanTimeMs).toBeLessThan(1000); // Super fast
  });
});
