// Simple 24px line icons (stroke="currentColor"), drawn for this site so menus load no icon font.
export const icons = {
  home: 'M3 10.5 12 3l9 7.5M5 9v12h5v-6h4v6h5V9',
  about: 'M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M16 3.5a4 4 0 0 1 0 7M19 14.5a5 5 0 0 1 3 4.5v1',
  events: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
  watch: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M10 8.5v7l6-3.5z',
  prayer: 'M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4C20 15.4 12 20 12 20z',
  give: 'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8C9 8 7 7 7 5.5S8.5 3 10 4s2 4 2 4zM12 8c3 0 5-1 5-2.5S15.5 3 14 4s-2 4-2 4z',
  visit: 'M12 21s-7-6.1-7-12a7 7 0 0 1 14 0c0 5.9-7 12-7 12zM9.5 9a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  clock: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 2',
} as const;

/** Which icon each menu link shows, by path. */
export const navIcons: Record<string, string> = {
  '/': icons.home, '/about': icons.about, '/events': icons.events, '/media': icons.watch, '/prayer': icons.prayer, '/give': icons.give,
};
