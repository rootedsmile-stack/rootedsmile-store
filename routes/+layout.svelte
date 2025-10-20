
<script lang="ts">
  export let data;
</script>
<link rel="stylesheet" href="/style.css">
<header class="container">
  <div style="display:flex;align-items:center;gap:12px;">
    <img src="/logo.jpg" alt="RootedSmile logo">
    <strong>RootedSmile - A wellness brand</strong>
  </div>
  <nav style="display:flex;gap:1rem;">
    <a href="/">Home</a>
    <a href="/account">Account</a>
    <a href="/admin">Admin</a>
  </nav>
</header>
<main class="container">
  <slot/>
</main>
<footer class="container" style="opacity:.7;font-size:.9rem;">
  © <script>document.write(new Date().getFullYear())</script> RootedSmile
</footer>
