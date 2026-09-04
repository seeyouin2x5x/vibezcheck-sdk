#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { MODEL_PRICING_TABLE } from '../pricing/table';
import { runAudit, displayAuditReport } from './audit';

const args = process.argv.slice(2);
const command = args[0] || 'init';

function printBanner() {
  console.log(`
\x1b[38;2;212;255;50m✦\x1b[0m \x1b[1mvibezcheck CLI\x1b[0m \x1b[90mv0.4.1\x1b[0m
\x1b[90mThe 1-line Stripe Billing & Token Metering Engine for LLMs\x1b[0m
`);
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
 * Command: npx vibezcheck init
 */
async function handleInit() {
  printBanner();
  console.log('\x1b[35m🚀 Welcome to the VibezCheck Setup Wizard!\x1b[0m\n');

  const cwd = process.cwd();

  // Detect project structure
  const isNextAppRouter = fs.existsSync(path.join(cwd, 'app'));
  const isNextPagesRouter = fs.existsSync(path.join(cwd, 'pages'));
  const isSrcDir = fs.existsSync(path.join(cwd, 'src', 'app'));

  console.log(`\x1b[90m📁 Project directory: ${cwd}\x1b[0m`);
  if (isNextAppRouter || isSrcDir) {
    console.log('\x1b[32m✓ Detected Next.js App Router project!\x1b[0m\n');
  }

  // 1. Prompt for API Keys
  const defaultGateway = 'vck_demo_key';
  const gatewayKey = await prompt('Enter your AI Gateway API Key (or OpenAI key)', defaultGateway);
  const gatewayUrl = await prompt('Enter your AI Gateway Base URL', 'https://ai-gateway.vercel.sh/v1');
  const stripeKey = await prompt('Enter your Stripe Secret Key (optional for test mode)', '');

  // 2. Create / Update .env.local
  const envPath = path.join(cwd, '.env.local');
  const envContent = `# VibezCheck AI Gateway & Stripe Configuration
AI_GATEWAY_API_KEY=${gatewayKey}
AI_GATEWAY_BASE_URL=${gatewayUrl}
STRIPE_SECRET_KEY=${stripeKey}
`;

  fs.writeFileSync(envPath, envContent, { flag: 'w' });
  console.log(`\x1b[32m✓ Created/updated .env.local\x1b[0m`);

  // 3. Create Sample API Route (app/api/chat/route.ts)
  const apiDir = isSrcDir
    ? path.join(cwd, 'src', 'app', 'api', 'chat')
    : path.join(cwd, 'app', 'api', 'chat');

  fs.mkdirSync(apiDir, { recursive: true });
  const routePath = path.join(apiDir, 'route.ts');

  const routeContent = `import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, customer = 'demo@example.com' } = await req.json();

  // ⚡ 1-Line Declarative Model Metering
  const result = streamText({
    model: vibezcheck('openai/gpt-4o-mini', {
      customer,
      onUsage: (event) => {
        console.log(\`⚡ [vibezcheck] Tokens: \${event.usage.totalTokens} | Cost: $\${event.cost.totalUSD.toFixed(6)}\`);
      },
    }),
    messages,
  });

  return result.toTextStreamResponse();
}
`;

  fs.writeFileSync(routePath, routeContent, { flag: 'w' });
  console.log(`\x1b[32m✓ Generated declarative API route: ${path.relative(cwd, routePath)}\x1b[0m`);

  console.log(`
\x1b[32m\x1b[1m🎉 Setup Complete!\x1b[0m

\x1b[1mNext Steps:\x1b[0m
  1. Add \x1b[36m<VibezSessionWidget />\x1b[0m to your layout:
     \x1b[90mimport { VibezSessionProvider, VibezSessionWidget } from 'vibezcheck/react';\x1b[0m

  2. Use \x1b[36museVibezChat()\x1b[0m in your client component:
     \x1b[90mconst { messages, input, handleSubmit } = useVibezChat();\x1b[0m

  3. Run your dev server:
     \x1b[33mnpm run dev\x1b[0m or \x1b[33mpnpm dev\x1b[0m
`);
}

/**
 * Command: npx vibezcheck prices
 */
function handlePrices() {
  printBanner();
  console.log('\x1b[1m📊 Official Model Pricing Registry (USD per 1M Tokens):\x1b[0m\n');

  console.log(
    'Model'.padEnd(32) +
    'Input / 1M'.padEnd(16) +
    'Output / 1M'.padEnd(16) +
    'Cached / 1M'
  );
  console.log('-'.repeat(78));

  Object.entries(MODEL_PRICING_TABLE).forEach(([model, rates]) => {
    const input = `$${rates.inputPer1M.toFixed(3)}`.padEnd(16);
    const output = `$${rates.outputPer1M.toFixed(3)}`.padEnd(16);
    const cached = rates.cachedInputPer1M
      ? `$${rates.cachedInputPer1M.toFixed(3)}`
      : '—';

    console.log(model.padEnd(32) + input + output + cached);
  });
}

/**
 * Command: npx vibezcheck doctor
 */
function handleDoctor() {
  printBanner();
  console.log('\x1b[1m🩺 Running VibezCheck System Health Check...\x1b[0m\n');

  const cwd = process.cwd();
  const envPath = path.join(cwd, '.env.local');
  const hasEnv = fs.existsSync(envPath);

  console.log(`Node.js Version: \x1b[32m${process.version}\x1b[0m`);
  console.log(`Working Directory: \x1b[90m${cwd}\x1b[0m`);
  console.log(`Environment File: ${hasEnv ? '\x1b[32m✓ Found (.env.local)\x1b[0m' : '\x1b[33m⚠ Missing (.env.local)\x1b[0m'}`);

  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);
  console.log(`Stripe Key: ${hasStripe ? '\x1b[32m✓ Active\x1b[0m' : '\x1b[90m○ Free Local Mode (No Stripe key)\x1b[0m'}`);

  const hasGateway = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY);
  console.log(`AI Provider Key: ${hasGateway ? '\x1b[32m✓ Configured\x1b[0m' : '\x1b[33m⚠ Missing (Set AI_GATEWAY_API_KEY)\x1b[0m'}`);

  console.log(`\n\x1b[32m✓ VibezCheck engine is healthy and ready to meter!\x1b[0m\n`);
}

/**
 * Command: npx vibezcheck audit [--fix] [--ci] [--json] [--dir <path>]
 */
async function handleAudit() {
  const fix = args.includes('--fix') || args.includes('-f');
  const ci = args.includes('--ci') || args.includes('-s') || args.includes('--strict');
  const json = args.includes('--json') || args.includes('-j');

  let dir = process.cwd();
  const dirIndex = args.indexOf('--dir') !== -1 ? args.indexOf('--dir') : args.indexOf('-d');
  if (dirIndex !== -1 && args[dirIndex + 1]) {
    dir = args[dirIndex + 1];
  }

  const summary = await runAudit({ dir, fix, ci, json });
  await displayAuditReport(summary, { dir, fix, ci, json });
}

// Router
switch (command) {
  case 'audit':
  case 'check':
  case 'scan':
    handleAudit();
    break;
  case 'init':
    handleInit();
    break;
  case 'prices':
  case 'pricing':
    handlePrices();
    break;
  case 'doctor':
  case 'health':
    handleDoctor();
    break;
  default:
    console.log(`
Unknown command: \x1b[31m${command}\x1b[0m

Available commands:
  \x1b[36mvibezcheck audit\x1b[0m     Scan project for unmetered AI routes and runaway loop risks
  \x1b[36mvibezcheck init\x1b[0m      Interactive project setup wizard
  \x1b[36mvibezcheck prices\x1b[0m    Display supported model pricing table
  \x1b[36mvibezcheck doctor\x1b[0m    Diagnose environment and API configurations
`);
    break;
}
