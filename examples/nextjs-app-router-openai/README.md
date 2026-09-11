# VibezCheck Next.js App Router Starter

A minimal, production-ready Next.js 15 App Router starter with **1-Line Token Metering** using `vibezcheck@0.5.4` and `@ai-sdk/openai`.

## Features
- ⚡ **1-Line Wrapper**: Wrap any AI SDK model with `vibezcheck(openai('gpt-4o'))`
- 🛡️ **Safety Circuit Breaker**: Auto-cutoff at $0.50 to prevent infinite agent runaway loops
- 💰 **Configurable Markup**: Add profit margins (e.g. `margin: 1.30` for +30% margin)
- 📊 **Zero-Latency Telemetry**: Tokens and dollar costs captured without slowing down the stream

## Quickstart

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your `OPENAI_API_KEY`.

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000).
