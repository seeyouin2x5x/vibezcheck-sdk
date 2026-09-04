import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { customerEmail = 'alex@example.com', amountUSD = 10 } = await req.json();

    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      // Local demo mode simulation
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?checkout=success&simulated=true`,
        simulated: true,
      });
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2025-01-27.acacia' as any,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `⚡ VibezCheck Credit Pack ($${amountUSD})`,
              description: 'Prepaid LLM inference compute credits with 0ms added latency.',
            },
            unit_amount: Math.round(amountUSD * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${appUrl}?checkout=success`,
      cancel_url: `${appUrl}?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout creation failed' }, { status: 500 });
  }
}
