
<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';
  let isAdmin = false;
  let orders:any[] = [];
  let user:any = null;

  onMount(async ()=>{
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
    if (!user) return;
    const { data: roles } = await supabase.from('user_roles').select('*').eq('user_id', user.id);
    isAdmin = !!roles?.find(r=>r.role==='admin');

    if (isAdmin) {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      orders = data ?? [];
    }
  });
</script>

<h2>Admin Orders</h2>
{#if !user}
  <p>Please sign in.</p>
{:else if !isAdmin}
  <p>Not authorized.</p>
{:else}
  <table>
    <tr><th>Date</th><th>Status</th><th>Amount</th><th>Currency</th><th>Intent</th></tr>
    {#each orders as o}
      <tr>
        <td>{new Date(o.created_at).toLocaleString()}</td>
        <td>{o.status}</td>
        <td>{(o.amount_total/100).toFixed(2)}</td>
        <td>{o.currency?.toUpperCase()}</td>
        <td>{o.stripe_payment_intent}</td>
      </tr>
    {/each}
  </table>
{/if}
