# Next.js + AI SDK + VibezCheck WebApp

An AI Copilot web application featuring a bottom-docked sticky chat interface (modeled after modern fintech AI assistants), powered by **Next.js App Router**, **Vercel AI SDK**, and **VibezCheck v0.5.3**.

---

## Features

- **Sticky Router Chat Bar**: Docked at the bottom with quick actions (`Account`, `Transfer`, `Buy Credits`, `Notifications`, `Balance 147`, `Voice`).
- **Real-Time Token Telemetry**: 1-line zero-latency token metering via `vibezcheck`.
- **Per-Message Cost Receipts**: `<VibezReceipt />` micro-badges rendered under assistant responses.
- **Financial HUD**: `<VibezCheck />` floating bottom-left pill providing live wholesale cost, developer profit margin, and customer bill calculations.
- **Zero-Setup Fallback**: Automatically provides streaming simulations with real token deltas when `OPENAI_API_KEY` is not present, allowing instant testing.

---

## Quick Start

```bash
# 1. Install dependencies
pnpm install # or npm install

# 2. (Optional) Provide your OpenAI API key
cp .env.example .env.local

# 3. Start development server
pnpm dev # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to chat with the router.
