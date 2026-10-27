# WOF V3 — Production items still to confirm

- Confirm the Church of God globe emblem may be used (now in the homepage hero as a faded cream SVG traced from the supplied image) and whether the denomination requires a specific color or treatment.
- Confirm the livestream workflow: is Sunday streamed to Facebook only, or also YouTube? The Media page embeds the Facebook page timeline and the YouTube uploads playlist (facebook.com/WOFCOG, youtube.com/@wordoffaithcog).
- Confirm Zoom link publishing policy for Thursday Bible Study (public link vs request/join workflow).
- Select online giving provider and confirm whether Zelle remains publicly listed.
- Prayer requests: the Visit page form uses Netlify Forms (name `prayer-request`). Notifications go to wordoffaithcog@gmail.com for now (Rajwaun, 2026-10-27; may change later). To do in the Netlify dashboard: enable form detection and add the email notification. Confirm who reads requests and who counts as the "prayer team". Submissions are also kept under Forms in Netlify; they are free on Netlify's credit-based plans.
- Confirm contact-form mailbox.
- Events calendar: the Events page reads the public iCal feed of the Google Calendar set in `site.calendar.id` (a dedicated calendar Rajwaun shared on 2026-10-27). Until that calendar is public it shows the confirmed schedule from `site.ts`. To do: confirm it's set to "Make available to public" with "See all event details".
- The site is static, so new calendar events appear after the next build. `.github/workflows/rebuild-calendar.yml` triggers a Netlify rebuild daily once the `NETLIFY_BUILD_HOOK_URL` repository secret is set.
- Netlify credits: on the Free credit plan (300 credits/month, hard limit; sites pause when it runs out) each production deploy costs 15 credits. A daily rebuild alone is about 450 credits/month, so on the Free plan run the calendar rebuild weekly or less, or move to a paid plan.
- Meeting links (Teams, Zoom, Meet) placed in a public calendar event are visible to anyone. Confirm leadership is fine with that, or keep links out of events and use "Request Zoom link".
- Confirm the usual length of Sunday Worship and Bible Study; the "Add to calendar" files use a 1-hour placeholder.
- Confirm Youth Night's starting Friday so it can appear on the calendar fallback.
- Confirm Google Maps implementation/API requirements; a normal directions link may avoid an API key.
- Leadership bios and church history (About page, `src/data/story.ts`) are drafted from the documents leadership supplied on 2026-10-27 and trimmed to what helps a newcomer decide to visit. Confirmed by Rajwaun: Rev. McKenzie's role is "Co-Pastor & First Lady"; her Master's in Social Work is completed. Still to confirm: the McKenzies' wedding year (site says "over 25 years" for now).
- Leadership to approve the published church history wording (drafted from their supplied history document).
- Confirm local statement-of-faith copy/link.
- Confirm who maintains the site after launch.
- Confirm photo permissions and which supplied leadership portraits are approved for publication.
- Get full-resolution originals of the leadership photos. The supplied files are only 400–600px wide, which looks soft in the full-width homepage hero and on large screens.

## Launch SEO checklist

- Search engines are told not to index the site (`noindex`) until it runs on wordoffaithcog.com, so the dev site never competes with the Wix site. On Netlify this switches on by itself once wordoffaithcog.com is the site's primary domain. On any other host, set `INDEXABLE=true` for the production build. See `src/lib/seo.ts`.
- Before switching the domain, list the old Wix page URLs and add 301 redirects to the matching new pages in `public/_redirects`, so existing Google results and bookmarks keep working.
- After launch: add the site to Google Search Console and Bing Webmaster Tools and submit `https://wordoffaithcog.com/sitemap.xml`.
- Claim or update the Google Business Profile (also Apple Business Connect and Bing Places) with exactly the same name, address and phone as the site, Sunday 11:30 AM, and the website link. This matters more for "church near me" searches than anything on the site.
- Check WOF's listing in the Church of God church locator (churchofgod.org/church-locator) and ask for it to link to the new site.
- First-time visitor questions to answer on the Visit page: how long Sunday service lasts, where to park, what people usually wear, whether there's anything for children during service, wheelchair access, and who greets newcomers.
- Share image: link previews (Facebook, texts) use a 600px photo of the pastors. Replace it with a 1200×630 image of the church or the new logo when one is available.
