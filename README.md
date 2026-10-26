# Word of Faith Church of God — Dev Site

Astro + TypeScript + Tailwind static-first church website prototype.

V3 incorporates the September 29, 2026 internal intake and the supplied leadership photography. The site is intentionally static-first but visually dynamic: editorial layouts, CSS motion, hover states, responsive presentation, and room for selective React islands when a stateful feature actually needs them.

## Project layout

- `src/data/site.ts` holds church facts: name, address, phone, email, service times and navigation. Change them here and every page updates.
- `src/pages/` has one file per page (Home, About, Ministries, Events, Media, Give, Visit).
- `src/components/` has the shared header (with phone menu) and footer.
- `public/images/` holds photos; `specs/` holds the original intake brief and homepage wireframe.
- `UNRESOLVED.md` lists items waiting on church leadership.

## Run locally

Requires Node.js 22.23.4 or newer (24 LTS recommended; see `.nvmrc`).

Tailwind runs through PostCSS (`postcss.config.mjs`), not the deprecated `@astrojs/tailwind` integration.


```bash
npm install
npm run dev
```

Then open the localhost URL printed by Astro.

## Production build

```bash
npm run build
```

## Important

External integrations such as giving, prayer submissions, Zoom, calendar, livestream, and maps remain intentionally unconnected until their production accounts/URLs and policies are confirmed. See `UNRESOLVED.md`.

## Security

- Never commit secrets. `.env` files are git-ignored; put placeholders in `.env.example` only.
- Run `npm audit` after changing dependencies and fix findings before pushing.
