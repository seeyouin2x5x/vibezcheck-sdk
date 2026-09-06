import fs from 'fs';
import path from 'path';

describe('NPM Package Pre-Publish Readiness & Export Integrity', () => {
  const pkgRoot = path.resolve(__dirname, '..');
  const pkgJsonPath = path.join(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

  test('package.json metadata satisfies NPM standards', () => {
    expect(pkg.name).toBe('vibezcheck');
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(pkg.description).toBeDefined();
    expect(pkg.license).toBe('MIT');
    expect(pkg.main).toBe('./dist/index.js');
    expect(pkg.module).toBe('./dist/index.mjs');
    expect(pkg.types).toBe('./dist/index.d.ts');
    expect(pkg.bin?.vibezcheck).toBe('bin/vibezcheck.js');
    expect(pkg.files).toContain('dist');
    expect(pkg.files).toContain('bin');
    expect(pkg.files).toContain('README.md');
    expect(pkg.files).toContain('LICENSE');
  });

  test('runtime dependencies are strictly minimal (only stripe)', () => {
    const deps = Object.keys(pkg.dependencies || {});
    expect(deps).toEqual(['stripe']);
  });

  test('all exported subpaths in package.json exist on disk in dist/', () => {
    const exports = pkg.exports;
    expect(exports).toBeDefined();

    for (const [subpath, target] of Object.entries(exports as Record<string, any>)) {
      if (typeof target === 'object') {
        if (target.types) {
          const typesPath = path.join(pkgRoot, target.types);
          expect(fs.existsSync(typesPath)).toBe(true);
        }
        if (target.import) {
          const importPath = path.join(pkgRoot, target.import);
          expect(fs.existsSync(importPath)).toBe(true);
        }
        if (target.require) {
          const requirePath = path.join(pkgRoot, target.require);
          expect(fs.existsSync(requirePath)).toBe(true);
        }
      }
    }
  });

  test('CLI bin executable exists and has valid shebang', () => {
    const binPath = path.join(pkgRoot, 'bin', 'vibezcheck.js');
    expect(fs.existsSync(binPath)).toBe(true);
    const content = fs.readFileSync(binPath, 'utf8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  test('README.md and LICENSE files are present and non-empty', () => {
    const readmePath = path.join(pkgRoot, 'README.md');
    const licensePath = path.join(pkgRoot, 'LICENSE');

    expect(fs.existsSync(readmePath)).toBe(true);
    expect(fs.statSync(readmePath).size).toBeGreaterThan(500);

    expect(fs.existsSync(licensePath)).toBe(true);
    expect(fs.statSync(licensePath).size).toBeGreaterThan(100);
  });

  test('CommonJS bundle can be required and exports all primary API symbols', () => {
    const distCjs = require('../dist/index.js');
    expect(typeof distCjs.vibezcheck).toBe('function');
    expect(typeof distCjs.createVibezCheck).toBe('function');
    expect(typeof distCjs.withBilling).toBe('function');
    expect(typeof distCjs.calculateCost).toBe('function');
    expect(typeof distCjs.getModelPricing).toBe('function');
    expect(typeof distCjs.registerModelPricing).toBe('function');
    expect(typeof distCjs.CustomerManager).toBe('function');
    expect(typeof distCjs.ApiKeyAuth).toBe('function');
    expect(typeof distCjs.BillingHelper).toBe('function');
  });

  test('Subpath CommonJS bundles can be required independently', () => {
    const meter = require('../dist/meter/index.js');
    expect(typeof meter.createMeter).toBe('function');
    expect(typeof meter.VibezMeter).toBe('function');

    const pricing = require('../dist/pricing/index.js');
    expect(typeof pricing.calculateCost).toBe('function');
    expect(typeof pricing.calculateUsageCost).toBe('function');

    const aiSdk = require('../dist/ai-sdk/index.js');
    expect(typeof aiSdk.withBilling).toBe('function');
    expect(typeof aiSdk.createVibezModel).toBe('function');

    const customers = require('../dist/customers/index.js');
    expect(typeof customers.CustomerManager).toBe('function');
    expect(typeof customers.normalizeCustomer).toBe('function');

    const auth = require('../dist/auth/index.js');
    expect(typeof auth.ApiKeyAuth).toBe('function');

    const billing = require('../dist/billing/index.js');
    expect(typeof billing.BillingHelper).toBe('function');

    const react = require('../dist/react/index.js');
    expect(typeof react.VibezReceipt).toBe('function');
    expect(typeof react.VibezSessionWidget).toBe('function');
    expect(typeof react.useVibezChat).toBe('function');
  });
});
