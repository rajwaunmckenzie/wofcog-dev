import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://wordoffaithcog.com',
  // about.html instead of about/index.html, so /about is served without a redirect.
  build: { format: 'file' },
  // Load the next page when a visitor hovers or taps a link, so page changes feel instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
