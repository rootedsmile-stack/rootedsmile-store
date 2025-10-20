
import Stripe from 'stripe';
import type { RequestHandler } from '@sveltejs/kit';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export const POST: RequestHandler = async ({ request, url }) => {
  const { priceId, userId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: new URL('/success', url).toString(),
    cancel_url: new URL('/cancel', url).toString(),
    client_reference_id: userId ?? undefined,
    allow_promotion_codes: true
  });

  return new Response(JSON.stringify({ url: session.url }), { headers: {'content-type':'application/json'}});
};
