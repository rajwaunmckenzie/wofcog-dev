// Events calendar data. Reads the church's public Google Calendar iCal feed at
// build time; if the feed is unavailable it falls back to the confirmed
// recurring schedule in site.ts. No API key is involved: the feed is public.
import { createHash } from 'node:crypto';
import ICAL from 'ical.js';
import { site, type Gathering } from '../data/site';

export const TZ = site.calendar.timeZone;
const MONTHS_AHEAD = 6;
const MAX_OCCURRENCES = 500;

export interface JoinLink { url: string; provider: string; kind: 'meeting' | 'watch' }

export interface CalEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  allDay: boolean;
  /** Timed: ISO instant. All-day: YYYY-MM-DD. */
  start: string;
  /** Timed: ISO instant. All-day: YYYY-MM-DD, exclusive. */
  end: string;
  /** Calendar days (YYYY-MM-DD, church time zone) the event appears on. */
  days: string[];
  join?: JoinLink;
  /** Only set for events generated from the site.ts schedule. */
  rrule?: string;
  source: 'google' | 'schedule';
}

export interface Calendar { source: 'google' | 'schedule'; events: CalEvent[]; rangeStart: string; months: number }

// ---------- feed URLs ----------

const id = encodeURIComponent(site.calendar.id);
export const feedUrl = process.env.CALENDAR_ICS_URL || `https://calendar.google.com/calendar/ical/${id}/public/basic.ics`;
export const calendarLinks = {
  view: `https://calendar.google.com/calendar/embed?src=${id}&ctz=${encodeURIComponent(TZ)}`,
  google: `https://calendar.google.com/calendar/render?cid=${id}`,
  webcal: `webcal://calendar.google.com/calendar/ical/${id}/public/basic.ics`,
};

// ---------- time zone helpers ----------

const partsFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

function zonedParts(date: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(date).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, min: +p.minute, s: +p.second };
}

function offsetMinutes(date: Date) {
  const p = zonedParts(date);
  return Math.round((Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - date.getTime()) / 60000);
}

/** Wall-clock time in the church time zone → instant. */
export function zonedToDate(y: number, m: number, d: number, h = 0, min = 0) {
  const guess = Date.UTC(y, m - 1, d, h, min);
  let utc = guess - offsetMinutes(new Date(guess)) * 60000;
  const second = guess - offsetMinutes(new Date(utc)) * 60000;
  if (second !== utc) utc = second;
  return new Date(utc);
}

const pad = (n: number) => String(n).padStart(2, '0');
export const dayKey = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
export function dayKeyOf(date: Date) { const p = zonedParts(date); return dayKey(p.y, p.m, p.d); }
function parseKey(key: string) { const [y, m, d] = key.split('-').map(Number); return { y, m, d }; }
export function addDays(key: string, n: number) {
  const { y, m, d } = parseKey(key);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return dayKey(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}
/** Instant at which the event is over, for hiding past events. */
export function endInstant(ev: CalEvent) {
  if (!ev.allDay) return new Date(ev.end);
  const { y, m, d } = parseKey(ev.end);
  return zonedToDate(y, m, d);
}

function daysCovered(ev: Pick<CalEvent, 'allDay' | 'start' | 'end'>) {
  const first = ev.allDay ? ev.start : dayKeyOf(new Date(ev.start));
  // Timed events ending exactly at midnight don't spill into the next day.
  const last = ev.allDay ? addDays(ev.end, -1) : dayKeyOf(new Date(new Date(ev.end).getTime() - 1));
  const days = [first];
  while (days.length < 62 && days[days.length - 1] < last) days.push(addDays(days[days.length - 1], 1));
  return days;
}

// ---------- text + link helpers ----------

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}

/** Google stores descriptions as light HTML. Reduce to plain text (rendered escaped). */
export function htmlToText(html: string) {
  return decodeEntities(
    html.replace(/<a\s[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gis, (_, rawHref, text) => {
      const href = unwrapRedirect(decodeEntities(rawHref));
      return text.includes(href) || href.includes(text) ? href : `${text} ${href}`;
    })
      .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h\d)>/gi, '\n').replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, ''),
  ).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;

function unwrapRedirect(raw: string) {
  try {
    const u = new URL(raw);
    if (/(^|\.)google\.com$/.test(u.hostname) && u.pathname === '/url' && u.searchParams.get('q')) return u.searchParams.get('q')!;
  } catch { /* not a URL */ }
  return raw;
}

const PROVIDERS: { name: string; kind: JoinLink['kind']; host: RegExp }[] = [
  { name: 'Microsoft Teams', kind: 'meeting', host: /^teams\.(microsoft|live)\.com$/ },
  { name: 'Zoom', kind: 'meeting', host: /(^|\.)zoom\.us$/ },
  { name: 'Google Meet', kind: 'meeting', host: /^meet\.google\.com$/ },
  { name: 'Webex', kind: 'meeting', host: /(^|\.)webex\.com$/ },
  { name: 'Facebook', kind: 'watch', host: /(^|\.)facebook\.com$|^fb\.watch$/ },
  { name: 'YouTube', kind: 'watch', host: /(^|\.)youtube\.com$|^youtu\.be$/ },
];

/** First meeting link (Teams, Zoom, Meet, Webex), else a livestream link, found in the given text. */
export function findJoinLink(...texts: (string | undefined)[]): JoinLink | undefined {
  const found: JoinLink[] = [];
  for (const raw of texts.join('\n').match(URL_RE) ?? []) {
    try {
      const u = new URL(unwrapRedirect(raw.replace(/[.,;:]+$/, '')));
      if (u.protocol !== 'https:' || u.pathname.length < 2) continue;
      const p = PROVIDERS.find((x) => x.host.test(u.hostname.toLowerCase()));
      if (p) found.push({ url: u.href, provider: p.name, kind: p.kind });
    } catch { /* ignore malformed */ }
  }
  return found.find((f) => f.kind === 'meeting') ?? found[0];
}

export const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());
/** A location that names an online meeting rather than a place (e.g. Google's "Microsoft Teams Meeting"). */
export const isVirtualPlace = (s: string) => isUrl(s) || /\b(teams|zoom|google meet|webex|online|virtual)\b/i.test(s);

/** Drop the join link from the description text, since it gets its own button. */
function withoutLink(text: string, link?: JoinLink) {
  if (!link) return text;
  return text
    .replace(URL_RE, (raw) => { try { return new URL(unwrapRedirect(raw.replace(/[.,;:]+$/, ''))).href === link.url ? '' : raw; } catch { return raw; } })
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ---------- Google Calendar feed ----------

const hash = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 10);
const icalDayKey = (t: ICAL.Time) => dayKey(t.year, t.month, t.day);

function parseFeed(text: string, from: Date, to: Date): CalEvent[] {
  const root = new ICAL.Component(ICAL.parse(text));
  for (const tz of root.getAllSubcomponents('vtimezone')) ICAL.TimezoneService.register(tz);

  const byUid = new Map<string, ICAL.Component[]>();
  for (const c of root.getAllSubcomponents('vevent')) {
    const uid = String(c.getFirstPropertyValue('uid') ?? hash(c.toString()));
    byUid.set(uid, [...(byUid.get(uid) ?? []), c]);
  }

  const rangeStart = ICAL.Time.fromJSDate(from, true);
  const rangeEnd = ICAL.Time.fromJSDate(to, true);
  const out: CalEvent[] = [];

  for (const [uid, comps] of byUid) {
    const masterComp = comps.find((c) => !c.hasProperty('recurrence-id')) ?? comps[0];
    const exceptions = comps.filter((c) => c !== masterComp && c.hasProperty('recurrence-id')).map((c) => new ICAL.Event(c));
    const master = new ICAL.Event(masterComp, { exceptions });

    const push = (item: ICAL.Event, startT: ICAL.Time, endT: ICAL.Time) => {
      const comp = item.component;
      if (String(comp.getFirstPropertyValue('status') ?? '').toUpperCase() === 'CANCELLED') return;
      if (String(comp.getFirstPropertyValue('class') ?? '').toUpperCase() === 'PRIVATE') return;
      const allDay = startT.isDate;
      if (allDay && endT.compare(startT) <= 0) { endT = startT.clone(); endT.day += 1; }
      const ev = {
        allDay,
        start: allDay ? icalDayKey(startT) : startT.toJSDate().toISOString(),
        end: allDay ? icalDayKey(endT) : endT.toJSDate().toISOString(),
      };
      const rawDesc = String(item.description ?? '');
      const location = String(item.location ?? '').trim();
      const conference = String(comp.getFirstPropertyValue('x-google-conference') ?? '');
      const url = String(comp.getFirstPropertyValue('url') ?? '');
      const join = findJoinLink(conference, url, location, rawDesc.replace(/href="([^"]+)"/g, (_, h) => ` ${decodeEntities(h)} `));
      out.push({
        id: `${hash(uid)}-${(allDay ? ev.start : ev.start.slice(0, 16)).replace(/\D/g, '')}`,
        title: String(item.summary ?? '').trim() || 'Church event',
        description: withoutLink(htmlToText(rawDesc), join),
        location,
        ...ev,
        days: daysCovered(ev),
        join,
        source: 'google',
      });
    };

    if (master.isRecurring()) {
      const it = master.iterator();
      for (let next = it.next(), n = 0; next && n < MAX_OCCURRENCES; next = it.next(), n++) {
        if (next.compare(rangeEnd) >= 0) break;
        const d = master.getOccurrenceDetails(next);
        if (d.endDate.compare(rangeStart) > 0 && d.startDate.compare(rangeEnd) < 0) push(d.item, d.startDate, d.endDate);
      }
    } else if (master.startDate) {
      const endT = master.endDate ?? master.startDate;
      if (endT.compare(rangeStart) > 0 && master.startDate.compare(rangeEnd) < 0) push(master, master.startDate, endT);
    }
  }
  return out;
}

async function fetchFeed(): Promise<string | null> {
  if (process.env.CALENDAR_DISABLE_FETCH === '1') return null;
  try {
    const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) });
    const text = res.ok ? await res.text() : '';
    if (text.trimStart().startsWith('BEGIN:VCALENDAR')) return text;
    console.warn(`[calendar] Feed not available (HTTP ${res.status}). Is the Google Calendar public? Using site.ts schedule.`);
  } catch (err) {
    console.warn(`[calendar] Could not fetch feed (${(err as Error).message}). Using site.ts schedule.`);
  }
  return null;
}

// ---------- fallback: confirmed recurring schedule ----------

const BYDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export function gatheringRule(g: Gathering) {
  const r = g.repeat;
  if (!r) return undefined;
  return r.weekly !== undefined
    ? `FREQ=WEEKLY;BYDAY=${BYDAY[r.weekly]}`
    : `FREQ=YEARLY;BYMONTH=${r.yearly!.month};BYDAY=${r.yearly!.nth}${BYDAY[r.yearly!.weekday]}`;
}

function weekdayOf(key: string) { const { y, m, d } = parseKey(key); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); }

function scheduleEvents(fromKey: string, toKey: string): CalEvent[] {
  const out: CalEvent[] = [];
  for (const g of site.gatherings) {
    const r = g.repeat;
    if (!r) continue;
    const slug = g.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    for (let key = fromKey; key < toKey; key = addDays(key, 1)) {
      const { y, m, d } = parseKey(key);
      const wd = weekdayOf(key);
      const hit = r.weekly !== undefined
        ? wd === r.weekly
        : m === r.yearly!.month && wd === r.yearly!.weekday && Math.ceil(d / 7) === r.yearly!.nth;
      if (!hit) continue;
      let ev: Pick<CalEvent, 'allDay' | 'start' | 'end'>;
      if (r.time) {
        const [h, min] = r.time.split(':').map(Number);
        const start = zonedToDate(y, m, d, h, min);
        ev = { allDay: false, start: start.toISOString(), end: new Date(start.getTime() + (r.minutes ?? 60) * 60000).toISOString() };
      } else {
        ev = { allDay: true, start: key, end: addDays(key, 1) };
      }
      out.push({
        id: `schedule-${slug}`,
        title: g.label,
        description: g.note ?? '',
        location: g.mode === 'In person' || g.mode === 'Annual' ? site.address : g.mode,
        ...ev,
        days: daysCovered(ev),
        rrule: gatheringRule(g),
        source: 'schedule',
      });
    }
  }
  return out;
}

/** Next occurrence of each scheduled gathering, for its "Add to calendar" links. */
export function gatheringEvents(): CalEvent[] {
  const today = dayKeyOf(new Date());
  const all = scheduleEvents(today, addDays(today, 400));
  return site.gatherings.flatMap((g) => all.find((e) => e.title === g.label) ?? []);
}

// ---------- public API ----------

let cached: Promise<Calendar> | undefined;

export function getCalendar(): Promise<Calendar> {
  return (cached ??= (async () => {
    const now = zonedParts(new Date());
    const rangeStart = dayKey(now.y, now.m, 1);
    const end = new Date(Date.UTC(now.y, now.m - 1 + MONTHS_AHEAD, 1));
    const rangeEnd = dayKey(end.getUTCFullYear(), end.getUTCMonth() + 1, 1);
    const from = zonedToDate(now.y, now.m, 1);
    const to = zonedToDate(end.getUTCFullYear(), end.getUTCMonth() + 1, 1);

    const text = await fetchFeed();
    let events: CalEvent[] = [];
    let source: Calendar['source'] = 'schedule';
    if (text) {
      try {
        events = parseFeed(text, from, to);
        source = 'google';
      } catch (err) {
        console.warn(`[calendar] Could not parse feed (${(err as Error).message}). Using site.ts schedule.`);
      }
    }
    if (source === 'schedule') events = scheduleEvents(rangeStart, rangeEnd);
    events.sort((a, b) => a.days[0].localeCompare(b.days[0]) || Number(b.allDay) - Number(a.allDay) || a.start.localeCompare(b.start));
    return { source, events, rangeStart, months: MONTHS_AHEAD };
  })());
}

// ---------- formatting ----------

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...opts });
const timeFmt = fmt({ hour: 'numeric', minute: '2-digit' });
const dayFmtUTC = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts });

export function formatDay(key: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) {
  const { y, m, d } = parseKey(key);
  return dayFmtUTC(opts).format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatWhen(ev: CalEvent) {
  if (ev.allDay) {
    const last = addDays(ev.end, -1);
    return last === ev.start ? 'All day' : `All day, through ${formatDay(last, { month: 'short', day: 'numeric' })}`;
  }
  const s = new Date(ev.start), e = new Date(ev.end);
  if (ev.source === 'schedule') return timeFmt.format(s);
  const sameDay = dayKeyOf(s) === dayKeyOf(e);
  return sameDay ? timeFmt.formatRange(s, e) : `${timeFmt.format(s)} to ${fmt({ month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(e)}`;
}

// ---------- add to calendar ----------

const compactUtc = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
function compactLocal(iso: string) { const p = zonedParts(new Date(iso)); return `${p.y}${pad(p.m)}${pad(p.d)}T${pad(p.h)}${pad(p.min)}00`; }

function details(ev: CalEvent) {
  const parts = [ev.description];
  if (ev.join) parts.push(`${ev.join.kind === 'meeting' ? `Join on ${ev.join.provider}` : 'Watch'}: ${ev.join.url}`);
  parts.push(`${site.name} · ${site.url}/events`);
  return parts.filter(Boolean).join('\n\n');
}
const eventLocation = (ev: CalEvent) => (ev.location && !isVirtualPlace(ev.location) ? ev.location : ev.join?.url ?? ev.location);

export function googleAddLink(ev: CalEvent) {
  const q = new URLSearchParams({ action: 'TEMPLATE', text: ev.title });
  if (ev.allDay) q.set('dates', `${ev.start.replace(/-/g, '')}/${ev.end.replace(/-/g, '')}`);
  else if (ev.rrule) { q.set('dates', `${compactLocal(ev.start)}/${compactLocal(ev.end)}`); q.set('ctz', TZ); }
  else q.set('dates', `${compactUtc(ev.start)}/${compactUtc(ev.end)}`);
  if (ev.rrule) q.set('recur', `RRULE:${ev.rrule}`);
  q.set('details', details(ev).slice(0, 1500));
  const loc = eventLocation(ev);
  if (loc) q.set('location', loc);
  return `https://calendar.google.com/calendar/render?${q}`;
}

const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

function fold(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

const VTIMEZONE_NY = [
  'BEGIN:VTIMEZONE', 'TZID:America/New_York',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'DTSTART:19700308T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'DTSTART:19701101T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
  'END:VTIMEZONE',
];

export function toIcs(ev: CalEvent) {
  const localTz = ev.rrule && !ev.allDay && TZ === 'America/New_York';
  const dt = (name: string, v: string) =>
    ev.allDay ? `${name};VALUE=DATE:${v.replace(/-/g, '')}` : localTz ? `${name};TZID=${TZ}:${compactLocal(v)}` : `${name}:${compactUtc(v)}`;
  const loc = eventLocation(ev);
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Word of Faith Church of God//Website//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...(localTz ? VTIMEZONE_NY : []),
    'BEGIN:VEVENT',
    `UID:${ev.id}@wordoffaithcog.com`,
    `DTSTAMP:${compactUtc(new Date().toISOString())}`,
    dt('DTSTART', ev.start),
    dt('DTEND', ev.end),
    ...(ev.rrule ? [`RRULE:${ev.rrule}`] : []),
    `SUMMARY:${icsText(ev.title)}`,
    `DESCRIPTION:${icsText(details(ev))}`,
    ...(loc ? [`LOCATION:${icsText(loc)}`] : []),
    ...(ev.join ? [`URL:${ev.join.url}`] : []),
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export const icsFileName = (ev: CalEvent) => `${ev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event'}.ics`;
