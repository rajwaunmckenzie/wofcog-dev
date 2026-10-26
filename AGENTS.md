# AGENTS.md — WOF website

Context for any coding agent (Claude Code, Codex, etc.) working in this repo. Read this and `specs/` before changing the site.

## What this is

The dev site for **Word of Faith Church of God** (public name: **WOF**), a Pentecostal church in Neptune, NJ, affiliated with the Church of God. Built by AVENIR (Rajwaun's web design practice). This repo is the client-facing dev site shown to church leadership.

- Content provider/approver: Nichola Reid with church leadership. Pastor and First Lady are stakeholders.
- Target launch: **October 31, 2026**.
- Existing site: https://wordoffaithcog.com (Wix). This build replaces it.
- Requirements source: the September 29, 2026 Jotform intake, summarized in `specs/wofcog-website-project.json`. The generic AVENIR process is in `specs/avenir-website-builder.json`.

## Confirmed facts (single source: `src/data/site.ts`)

- Address: 108 Fortunato Pl., Neptune, NJ 07753. Phone (732) 922-0245. Email wordoffaithcog@gmail.com.
- Leadership: Bishop Alexander McKenzie and First Lady Jossett O. McKenzie.
- Mission: "Word of Faith is a Pentecostal-based church that glorifies the Lord Jesus, equips the saints, and evangelizes sinners."
- Sunday Worship, Sundays 11:30 AM, in person.
- Virtual Bible Study, Thursdays 6:00 PM, Zoom.
- Youth Night, every other Friday 7:00 PM, in person.
- Community Outreach, annually on the second Saturday in August.
- Channels: Facebook (livestream), YouTube @wordoffaithcog.

Change facts in `src/data/site.ts`, never hard-code them in pages.

## Goals

- Primary audience: **new visitors**. Primary action: **visit in person**. Every page should lead toward Plan Your Visit.
- The site is the source of truth for services, events, livestream, giving and contact.
- Visitor journey: discover WOF → what we believe → what attending feels like → find a service/event → watch → engage → visit.
- Brand words: Welcoming, Community-focused, Innovative, Inspirational, Authoritative. Intergenerational: modern for younger visitors, readable for older members.

## Design direction

- Colors: wine `#701D2E`, wine-dark `#46121D`, gold `#C5A253`, sand `#E8DCC7`, cream `#F8F3E9` (Tailwind tokens in `tailwind.config.mjs`).
- Type: Georgia display, Inter body.
- Inspiration: https://igotthevictory.org/ but at about **6/10 energy**: CSS-led reveals, hover crop/scale, nav feedback, subtle decorative movement. No constant flying or bouncing. Always respect `prefers-reduced-motion`.
- "Static infrastructure, dynamic experience."

## Architecture

- Astro 7 + TypeScript + Tailwind 3 (via PostCSS). Node >= 22.23.4 (`.nvmrc`).
- Static-first. Use plain CSS/TS for light interactions. Add a React island only for genuinely stateful UI (e.g. interactive calendar, media filtering), never just to use React.
- Photos live in `src/assets/` and render through `astro:assets` `<Image>` so they're optimized. Don't put photos in `public/`.
- Specialized services own specialized jobs: giving provider for payments, Google Calendar or a light CMS for events, Facebook/YouTube for livestream, a mailbox/form service for contact and prayer. The site never processes payments itself.
- Planned hosting: Cloudflare.

## Rules

- **Never fabricate.** No invented events, dates, bios, history, doctrine or testimonials. Use clearly marked placeholders until leadership supplies content. Reference the Church of God's official Declaration of Faith rather than paraphrasing doctrine.
- **Never fake integrations.** If an account/URL isn't confirmed (see `UNRESOLVED.md`), show a working fallback (phone, email, directions link) instead of a dead form.
- **Security.** Never commit API keys or secrets, and never ask Rajwaun to paste keys into chat. `.env*` is git-ignored; only `.env.example` with placeholders may be committed. Run `npm audit` after dependency changes and fix findings before pushing. Strip photo metadata before adding images. Don't publish personal contact details (e.g. Nichola's email) on the site.
- Keep `UNRESOLVED.md` current when an open item is resolved or a new one appears.
- Run `npm run build` before pushing; it must pass.
