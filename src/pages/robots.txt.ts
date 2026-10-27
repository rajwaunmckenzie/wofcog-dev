// Crawling is always allowed so search engines can read each page's robots
// meta tag; before launch that tag says noindex (see `indexable`).
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { indexable } from '../lib/seo';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n${indexable ? `\nSitemap: ${site.url}/sitemap.xml\n` : ''}`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
