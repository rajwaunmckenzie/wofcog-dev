// One downloadable .ics file per calendar event (and per recurring gathering).
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCalendar, gatheringEvents, toIcs, type CalEvent } from '../../lib/calendar';

export const getStaticPaths = (async () => {
  const { events } = await getCalendar();
  const byId = new Map<string, CalEvent>();
  for (const event of [...gatheringEvents(), ...events]) if (!byId.has(event.id)) byId.set(event.id, event);
  return [...byId.values()].map((event) => ({ params: { id: event.id }, props: { event } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(toIcs(props.event as CalEvent), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
