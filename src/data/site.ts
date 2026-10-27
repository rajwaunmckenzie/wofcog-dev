export interface Gathering {
  label: string;
  schedule: string;
  mode: string;
  /** Used to place the gathering on the Events calendar while the Google feed isn't live. */
  repeat?: { weekly?: number; yearly?: { month: number; nth: number; weekday: number }; time?: string; minutes?: number };
  note?: string;
}

export const site = {
  name: 'Word of Faith Church of God',
  shortName: 'WOF',
  address: '108 Fortunato Pl., Neptune, NJ 07753',
  // Same address split up for search engines (structured data). Keep in sync with `address`.
  postalAddress: { street: '108 Fortunato Pl.', city: 'Neptune', region: 'NJ', postalCode: '07753', country: 'US' },
  phone: '(732) 922-0245',
  email: 'wordoffaithcog@gmail.com',
  service: 'Sundays • 11:30 AM',
  url: 'https://wordoffaithcog.com',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=108+Fortunato+Pl,+Neptune,+NJ+07753',
  // Google's keyless embed: shows a pinned map without a Maps API key.
  mapEmbed: 'https://maps.google.com/maps?q=108+Fortunato+Pl,+Neptune,+NJ+07753&z=15&output=embed',
  youtube: 'https://www.youtube.com/@wordoffaithcog',
  // Public channel ID for @wordoffaithcog; its uploads playlist is the same ID with UU in place of UC.
  youtubeChannelId: 'UCcD9kABCVnuhhPoIM6dNmlA',
  facebook: 'https://www.facebook.com/WOFCOG/',
  giving: {
    // Paste the church's Tithe.ly giving link here once the account is set up. While it's empty,
    // the Give page leaves the Online option out entirely.
    tithely: '',
    zelle: { name: 'Word of Faith', phone: '(732) 489-4489' },
  },
  // WOF is a congregation of the Church of God (Cleveland, Tennessee).
  denomination: { name: 'Church of God', url: 'https://churchofgod.org', declarationOfFaith: 'https://churchofgod.org/beliefs/declaration-of-faith/' },
  description: 'Word of Faith Church of God (WOF) is a Pentecostal church in Neptune, NJ. Join us for Sunday Worship at 11:30 AM at 108 Fortunato Pl.',
  mission: 'Word of Faith is a Pentecostal-based church that glorifies the Lord Jesus, equips the saints, and evangelizes sinners.',
  nav: [
    ['Home','/'],['About','/about'],['Ministries','/ministries'],['Events','/events'],['Media','/media'],['Give','/give']
  ],
  // Public Google Calendar that feeds the Events page (read at build time, no API key).
  // The ID is the owning Gmail address, or "...@group.calendar.google.com" for a secondary calendar.
  calendar: {
    id: '078c2db4212fedab1a91bc6fbcd6cbdf48cba4bb210264b08189a13ce0ec092d@group.calendar.google.com',
    timeZone: 'America/New_York',
  },
  // weekday: 0 = Sunday … 6 = Saturday. Youth Night has no `repeat` because its starting Friday isn't confirmed.
  gatherings: [
    { label: 'Sunday Worship', schedule: 'Sundays • 11:30 AM', mode: 'In person', repeat: { weekly: 0, time: '11:30' } },
    { label: 'Virtual Bible Study', schedule: 'Thursdays • 6:00 PM', mode: 'Zoom', repeat: { weekly: 4, time: '18:00' }, note: 'Contact the church for the Zoom link.' },
    { label: 'Youth Night', schedule: 'Every other Friday • 7:00 PM', mode: 'In person' },
    { label: 'Community Outreach', schedule: 'Second Saturday in August', mode: 'Annual', repeat: { yearly: { month: 8, nth: 2, weekday: 6 } } },
  ] as Gathering[]
};
