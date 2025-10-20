
# RootedSmile Store — SvelteKit + Supabase + Stripe (Cloudflare Pages)

**What you get**
- Google + Email login (Supabase Auth)
- Stripe Checkout
- Orders saved to Supabase
- Admin page (role-based)
- Cream theme + logo

## 1) Fill environment variables (Cloudflare Pages → Settings → Environment Variables)
- PUBLIC_SUPABASE_URL
- PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE  (secret)
- PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY      (secret)
- STRIPE_WEBHOOK_SECRET  (secret; add after webhook is created)
- PRICE_ID               (your Stripe price id)

## 2) Stripe
- Create a Product + Price -> copy Price ID
- Developers -> Webhooks -> Add endpoint:
  https://<your-pages>.pages.dev/api/stripe/webhook
  Events: checkout.session.completed
  Copy Signing secret -> STRIPE_WEBHOOK_SECRET

## 3) Supabase Tables & RLS
Run these SQL statements in Supabase:

```
create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.customers(id),
  stripe_payment_intent text,
  stripe_session_id text,
  amount_total integer,
  currency text,
  status text,
  items jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('admin','user')) default 'user'
);

alter table public.orders enable row level security;

create policy "orders_select_own"
on public.orders for select
to authenticated
using (user_id = auth.uid());

create policy "orders_select_admin"
on public.orders for select
to authenticated
using (
  exists (select 1 from public.user_roles ur
          where ur.user_id = auth.uid() and ur.role = 'admin')
);

create policy "orders_insert_service"
on public.orders for insert
to service_role
with check (true);
```

Set yourself admin:
```
insert into public.user_roles (user_id, role)
values ('<YOUR_AUTH_USER_UUID>', 'admin')
on conflict (user_id) do update set role='admin';
```

## 4) Deploy
- Push this repo to GitHub
- Cloudflare Pages -> Create project -> connect repo
- Build: `npm run build` (auto-detected SvelteKit)
- Visit `/account` to test login
- Visit `/` to test a checkout (Stripe test card 4242 4242 4242 4242)
