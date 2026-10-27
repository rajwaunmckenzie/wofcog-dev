// Sitemap of the public pages. Search engines find it through robots.txt.
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { pages } from '../lib/seo';

export const GET: APIRoute = () => {
  const urls = pages.map((path) => `  <url><loc>${new URL(path, site.url).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
