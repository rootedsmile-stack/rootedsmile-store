
<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  const priceId = import.meta.env.PRICE_ID!;
  async function buy() {
    const { data: { user } } = await supabase.auth.getUser();
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({ priceId, userId: user?.id ?? null })
    });
    const { url } = await res.json();
    location.href = url;
  }
</script>

<section class="card">
  <h1>Herbal Tooth Powder — 50g</h1>
  <p>Clean ingredients. Gentle polish. Bright smile.</p>
  <p><strong>$15.00</strong></p>
  <button on:click={buy}>Buy with Stripe</button>
</section>
