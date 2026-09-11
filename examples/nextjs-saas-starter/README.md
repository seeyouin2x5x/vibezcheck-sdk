# VibezCheck AI SaaS Starter

Full-featured B2B SaaS starter built on Next.js 15, Vercel AI SDK, Stripe, and `vibezcheck@0.5.4`.

## Features
- 💳 **Customer Credit Wallets**: Pre-funded user balances with instant top-up simulation
- 🧾 **Live <VibezReceipt />**: Drop-in micro-badge displaying execution cost, token breakdown, and cache savings
- 🧠 **2026 Model Support**: GPT-4o, GPT-6 Astra, Magistral Reasoning, DeepSeek v4.1 Flash
- 🏢 **Multi-Tenant B2B Metadata**: Track spending per organization, team, user, and subscription tier
- 🛡️ **Runaway Loop Protection**: Sub-millisecond circuit breaker preventing expensive looping bugs

## Quickstart

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```
Provide `OPENAI_API_KEY` and optionally `STRIPE_SECRET_KEY`.

### 3. Run Development Server
```bash
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000).
