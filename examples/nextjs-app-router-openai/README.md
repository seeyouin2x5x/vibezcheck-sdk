# AI SDK: Next.js App Router with OpenAI + VibezCheck

Based directly on the official [Vercel AI SDK Next.js App Router Tutorial](https://ai-sdk.dev/docs/getting-started/nextjs-app-router).

This example demonstrates how to build an interactive AI chat application using Next.js App Router, OpenAI GPT-4o, and add **1-Line Token Metering & Real-Time Financial Billing** with `vibezcheck`.

---

## ⚡ The 2-Line Difference

In the vanilla tutorial, you stream text with:
```typescript
// Vanilla AI SDK
const result = streamText({
  model: openai('gpt-4o'),
  messages,
});
```

With **VibezCheck**, wrap the model in 1 line on the server and add `<VibezCheck />` on the client:

### 1. Server (`app/api/chat/route.ts`)
```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // ⚡ 1 Line: Meter tokens, calculate dollar cost, set 30% profit margin, and add safety circuit breaker
    model: vibezcheck(openai('gpt-4o'), {
      customer: 'user_alex@example.com',
      pricing: { margin: 1.3 }, // +30% profit margin
      maxCostPerCallUSD: 0.50,  // Prevents runaway loops
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 2. Client (`app/page.tsx`)
```tsx
'use client';
import { useChat } from 'ai/react';
import { VibezCheck } from 'vibezcheck/ui';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {/* Messages & Chat Form */}

      {/* ✦ 1-Line Financial HUD: Works with ZERO database & ZERO Stripe in Dev Mode */}
      <VibezCheck messages={messages} model="gpt-4o" margin={1.3} />
    </div>
  );
}
```

---

## 🚀 Running the Example

### 1. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your `OPENAI_API_KEY`:
```env
OPENAI_API_KEY=sk-proj-...
```
*(Stripe keys are completely optional! In local dev mode, VibezCheck runs in **Zero-DB Free Vibe Mode**, calculating simulated bills and margins in memory).*

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Sane Defaults Active Out of the Box
- **0ms Added Latency**: Streams pass directly to the client with zero buffering.
- **$0.50 Circuit Breaker**: Hard safety ceiling per call to avoid runaway loops.
- **In-Flight Abort Trapper**: Catches and bills tokens even if user closes the tab mid-stream.
- **BigInt Nano-USD Precision**: Sub-cent financial calculation eliminating float drift.
- **Zero-DB Dev Mode**: Immediate visual feedback without database or Stripe setup.
