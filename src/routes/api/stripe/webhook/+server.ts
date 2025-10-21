
import Stripe from 'stripe';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-09-30' });

export const POST: RequestHandler = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  const secret = import.meta.env.STRIPE_WEBHOOK_SECRET!;
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return new Response(`Signature verification failed: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL!,
      import.meta.env.SUPABASE_SERVICE_ROLE! // server-side
    );

    await supabase.from('orders').insert({
      user_id: (session.client_reference_id as string) ?? null,
      stripe_payment_intent: session.payment_intent as string,
      stripe_session_id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
      items: null
    });
  }

  return new Response('ok');
};
