# VibezCheck Next.js App Router Starter

A minimal, production-ready Next.js 15 App Router starter with **Zero-Prop Token Metering & Real-Time Billing** using `vibezcheck@0.5.6`, `@ai-sdk/openai`, and `@ai-sdk/react`.

## Features
- ⚡ **1-Line Wrapper**: Wrap any AI SDK model with `vibezcheck(openai('gpt-4o-mini'))`
- 📡 **Universal Stream Telemetry**: `vibezcheck.toResponse(result)` injects verified tokens & costs with 0ms added latency
- 🪄 **Zero-Prop Client UI**: `<VibezReceipt />` per message and `<VibezCheck />` financial HUD auto-detect active model, tokens, micro-cost, and profit margin
- 🛡️ **Safety Circuit Breaker**: Auto-cutoff at $0.50 to prevent infinite agent runaway loops
- 💰 **Configurable Markup**: Add profit margins (e.g. `margin: 1.30` for +30% profit)
- 🧹 **Clean Context Window**: Telemetry travels out-of-band and is never echoed back to future LLM prompt contexts

## Quickstart

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your `OPENAI_API_KEY`.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).
