import fs from 'fs';
import path from 'path';
import os from 'os';
import { AVAILABLE_EXAMPLES, findExamplesDir, scaffoldExample } from '../src/cli/examples';

describe('VibezCheck CLI: Examples Scaffolder', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibezcheck-examples-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  it('lists official examples covering Next.js starters and standalone scripts', () => {
    expect(AVAILABLE_EXAMPLES.length).toBeGreaterThanOrEqual(7);

    const saasStarter = AVAILABLE_EXAMPLES.find((e) => e.id === 'nextjs-saas-starter');
    expect(saasStarter).toBeDefined();
    expect(saasStarter?.type).toBe('project');

    const appRouter = AVAILABLE_EXAMPLES.find((e) => e.id === 'nextjs-app-router-openai');
    expect(appRouter).toBeDefined();
    expect(appRouter?.type).toBe('project');

    const localMeter = AVAILABLE_EXAMPLES.find((e) => e.id === '01-local-cost-meter');
    expect(localMeter).toBeDefined();
    expect(localMeter?.type).toBe('script');
  });

  it('verifies that all referenced template files exist on disk', () => {
    const examplesBase = findExamplesDir();
    expect(fs.existsSync(examplesBase)).toBe(true);

    for (const example of AVAILABLE_EXAMPLES) {
      const fullPath = path.join(examplesBase, example.path);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it('scaffolds a standalone script example into a destination folder', async () => {
    const dest = path.join(tempDir, 'scripts');
    const success = await scaffoldExample('01-local-cost-meter', dest);
    expect(success).toBe(true);

    const copiedFile = path.join(dest, '01-local-cost-meter.ts');
    expect(fs.existsSync(copiedFile)).toBe(true);
    const content = fs.readFileSync(copiedFile, 'utf8');
    expect(content).toContain('gpt-6-astra');
  });

  it('scaffolds a full Next.js project into a destination folder', async () => {
    const dest = path.join(tempDir, 'my-ai-app');
    const success = await scaffoldExample('nextjs-app-router-openai', dest);
    expect(success).toBe(true);

    const pkgJson = path.join(dest, 'package.json');
    expect(fs.existsSync(pkgJson)).toBe(true);
    const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
    expect(pkg.dependencies.vibezcheck).toBeDefined();

    const routeFile = path.join(dest, 'app/api/chat/route.ts');
    expect(fs.existsSync(routeFile)).toBe(true);
  });
});
