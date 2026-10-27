# WOF V3 — Production items still to confirm

- Obtain the official Church of God logo/brand asset and confirm permitted treatment.
- Confirm the livestream workflow: is Sunday streamed to Facebook only, or also YouTube? The Media page embeds the Facebook page timeline and the YouTube uploads playlist (facebook.com/WOFCOG, youtube.com/@wordoffaithcog).
- Confirm Zoom link publishing policy for Thursday Bible Study (public link vs request/join workflow).
- Select online giving provider and confirm whether Zelle remains publicly listed.
- Confirm prayer-request destination, privacy handling, and who receives submissions.
- Confirm contact-form mailbox.
- Events calendar: the Events page reads the public iCal feed of the Google Calendar set in `site.calendar.id` (a dedicated calendar Rajwaun shared on 2026-10-27). Until that calendar is public it shows the confirmed schedule from `site.ts`. To do: confirm it's set to "Make available to public" with "See all event details".
- The site is static, so new calendar events appear after the next build. `.github/workflows/rebuild-calendar.yml` triggers a Netlify rebuild daily once the `NETLIFY_BUILD_HOOK_URL` repository secret is set.
- Meeting links (Teams, Zoom, Meet) placed in a public calendar event are visible to anyone. Confirm leadership is fine with that, or keep links out of events and use "Request Zoom link".
- Confirm the usual length of Sunday Worship and Bible Study; the "Add to calendar" files use a 1-hour placeholder.
- Confirm Youth Night's starting Friday so it can appear on the calendar fallback.
- Confirm Google Maps implementation/API requirements; a normal directions link may avoid an API key.
- Leadership bios and church history (About page, `src/data/story.ts`) are drafted from the documents leadership supplied on 2026-10-27. Still to confirm: public title for Rev. Jossett McKenzie (Co-Pastor and/or First Lady); marriage length ("25 years" vs "over 25 years") or wedding year so it does not go stale; whether her Master of Social Work is completed or in progress; OK to publish family details, nicknames and police background; first name of Rev. Howe and the late Bishop Francis; founding year and the dates of each pastorate; any other leaders to list.
- Leadership to approve the published church history wording (drafted from their supplied history document).
- Confirm local statement-of-faith copy/link.
- Confirm who maintains the site after launch.
- Confirm photo permissions and which supplied leadership portraits are approved for publication.
- Get full-resolution originals of the leadership photos. The supplied files are only 400–600px wide, which looks soft in the full-width homepage hero and on large screens.
