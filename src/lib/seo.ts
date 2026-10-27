// Search and social metadata shared by every page.
import { site } from '../data/site';

/**
 * Only the real launch build may be indexed, so the dev site and deploy
 * previews never compete with the current wordoffaithcog.com in Google.
 * On Netlify, `URL` is the site's primary domain: once that is
 * wordoffaithcog.com, production builds become indexable on their own.
 * Elsewhere (e.g. Cloudflare), set INDEXABLE=true on the production build.
 */
export const indexable =
  process.env.INDEXABLE === 'true' ||
  (process.env.CONTEXT === 'production' && process.env.URL?.replace(/\/$/, '') === site.url);

/**
 * Where this build is served, for absolute asset URLs such as the share image.
 * Before launch the canonical domain still hosts the old site, so previews
 * point at their own Netlify address.
 */
export const origin = (
  (process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL) || site.url
).replace(/\/$/, '');

/** Public pages, for the sitemap. */
export const pages = ['/', '/visit', '/about', '/ministries', '/events', '/media', '/give'];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const address = {
  '@type': 'PostalAddress',
  streetAddress: site.postalAddress.street,
  addressLocality: site.postalAddress.city,
  addressRegion: site.postalAddress.region,
  postalCode: site.postalAddress.postalCode,
  addressCountry: site.postalAddress.country,
};

/** The regular gatherings from site.ts as schema.org events with a repeating schedule. */
function gatheringEvents() {
  return site.gatherings.filter((g) => g.repeat).map((g) => {
    const r = g.repeat!;
    const online = g.mode === 'Zoom';
    const schedule: Record<string, unknown> = {
      '@type': 'Schedule',
      scheduleTimezone: site.calendar.timeZone,
      ...(r.time && { startTime: `${r.time}:00` }),
      ...(r.weekly !== undefined
        ? { repeatFrequency: 'P1W', byDay: `https://schema.org/${DAYS[r.weekly]}` }
        : { repeatFrequency: 'P1Y', byMonth: r.yearly!.month, byMonthWeek: r.yearly!.nth, byDay: `https://schema.org/${DAYS[r.yearly!.weekday]}` }),
    };
    return {
      '@type': 'Event',
      name: g.label,
      eventSchedule: schedule,
      eventAttendanceMode: `https://schema.org/${online ? 'Online' : 'Offline'}EventAttendanceMode`,
      location: online
        ? { '@type': 'VirtualLocation', url: `${site.url}/events` }
        : { '@type': 'Place', name: site.name, address },
      organizer: { '@id': `${site.url}/#church` },
      isAccessibleForFree: true,
    };
  });
}

/** JSON-LD describing the church: who, where, how to reach it, and when it meets. */
export function churchJsonLd(image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Church', 'Organization'],
    '@id': `${site.url}/#church`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    slogan: site.mission,
    image,
    telephone: `+1-${site.phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`,
    email: site.email,
    address,
    hasMap: site.directions,
    sameAs: [site.facebook, site.youtube],
    memberOf: { '@type': 'Organization', name: site.denomination.name, url: site.denomination.url },
    event: gatheringEvents(),
  };
}
