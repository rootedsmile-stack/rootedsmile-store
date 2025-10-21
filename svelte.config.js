import adapter from '@sveltejs/adapter-cloudflare';

const config = {
  kit: {
    adapter: adapter(),
    csrf: { trustedOrigins: ['*'] }
  }
};
export default config;
