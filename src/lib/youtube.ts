// YouTube data for the Media page. Reads the channel's public RSS feed at build
// time (latest 15 uploads); if the feed is unavailable the page falls back to
// the uploads playlist player alone. No API key is involved: the feed is public.
import { site } from '../data/site';

export interface Video { id: string; title: string; published: string }

const channel = site.youtubeChannelId;
const playlist = (prefix: string) => prefix + channel.slice(2);
const nocookie = 'https://www.youtube-nocookie.com/embed';

export const feedUrl = process.env.YOUTUBE_FEED_URL || `https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`;

// YouTube's auto-generated channel playlists: UU = all uploads, UULV = past livestreams.
export const players = {
  latest: `${nocookie}/videoseries?list=${playlist('UU')}&rel=0`,
  livestreams: `${nocookie}/videoseries?list=${playlist('UULV')}&rel=0`,
  live: `https://www.youtube.com/embed/live_stream?channel=${channel}&rel=0`,
};

export const videoEmbed = (id: string) => `${nocookie}/${id}?autoplay=1&rel=0`;
export const thumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

const decode = (s: string) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

export function parseFeed(xml: string): Video[] {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const id = entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? '';
    return id && title ? [{ id, title: decode(title.trim()), published }] : [];
  });
}

export async function getVideos(): Promise<Video[]> {
  try {
    const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) });
    if (res.ok) return parseFeed(await res.text());
    console.warn(`[youtube] Feed not available (HTTP ${res.status}). Showing the playlist player only.`);
  } catch (err) {
    console.warn(`[youtube] Could not fetch feed (${(err as Error).message}). Showing the playlist player only.`);
  }
  return [];
}
