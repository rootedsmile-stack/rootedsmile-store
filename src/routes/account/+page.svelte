
<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';
  let user:any = null;
  let orders:any[] = [];

  async function signInEmail() {
    const email = prompt('Enter email to receive magic link:');
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert('Magic link sent! Check your inbox.');
  }
  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/account' }});
  }
  async function signOut() { await supabase.auth.signOut(); location.reload(); }

  onMount(async ()=>{
    const res = await supabase.auth.getUser();
    user = res.data.user;
    if (user) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      orders = data ?? [];
    }
  });
</script>

<h2>Account</h2>
{#if !user}
  <div class="card" style="display:flex;gap:12px;">
    <button on:click={signInGoogle}>Sign in with Google</button>
    <button on:click={signInEmail}>Email magic link</button>
  </div>
{:else}
  <p>Signed in as <strong>{user.email}</strong></p>
  <button on:click={signOut}>Sign out</button>

  <h3>Your Orders</h3>
  {#if orders.length === 0}
    <p>No orders yet.</p>
  {:else}
  <table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Status</th>
      <th>Amount</th>
      <th>Currency</th>
    </tr>
  </thead>
  <tbody>
    {#each orders as o}
      <tr>
        <td>{new Date(o.created_at).toLocaleString()}</td>
        <td>{o.status}</td>
        <td>{(o.amount_total/100).toFixed(2)}</td>
        <td>{o.currency?.toUpperCase()}</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
{/if}
