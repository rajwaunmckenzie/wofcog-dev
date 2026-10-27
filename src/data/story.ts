// Church history and leadership biographies for the About page.
// Source: documents supplied by church leadership on 2026-10-27 (church history, Bishop McKenzie's
// biography, Rev. Jossett McKenzie's program biography). Rewritten for the web; no facts added.
// Trimmed (per Rajwaun, 2026-10-27) to what helps a newcomer decide to visit.

export interface Milestone {
  when: string;
  title: string;
  text: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  tagline: string;
  paragraphs: string[];
  quote?: string;
  scripture: { text: string; ref: string };
}

export const history = {
  intro:
    'Word of Faith began the way many works of God do: with a small group of believers and an open home. Today we are a growing church family in Neptune, preaching the Word, building faith, and serving our community.',
  milestones: [
    {
      when: 'The beginning',
      title: 'A living room full of faith',
      text: 'Our church, first known as Refuge Temple Church of God, began as a small gathering of believers in the living room of Sis. Elma McKnight. It grew quickly, and pastors were appointed to shepherd the young congregation.',
    },
    {
      when: '1990',
      title: 'Word of Faith is named',
      text: 'The church was renamed Word of Faith Church of God, marking a new season of vision and identity.',
    },
    {
      when: '2006',
      title: 'Bishop McKenzie appointed',
      text: 'Bishop Alexander A. McKenzie was appointed Lead Pastor while the church met in New Brunswick, New Jersey.',
    },
    {
      when: '2009 – 2012',
      title: 'A new home in Neptune',
      text: 'In December 2009 the ministry moved to Neptune with a committed membership of eight. It kept growing, and in January 2012 the church moved to its present home at 108 Fortunato Place.',
    },
  ] as Milestone[],
  today:
    'From a living room to a church home, every chapter of our story points to the faithfulness of God. There is still room in this story, and we would love for you to be part of the next chapter.',
};

export const leaders: Leader[] = [
  {
    id: 'bishop',
    name: 'Bishop Alexander A. McKenzie',
    role: 'Lead Pastor',
    tagline: 'A life of faith, service, and leadership',
    paragraphs: [
      'Bishop Alexander A. McKenzie grew up in Spanish Town, St. Catherine, Jamaica, where his mother taught him that God is the author of his life. Before coming to the United States, he served with honor in the Jamaica Constabulary Force, and that heart to protect and serve others became part of his calling.',
      'He answered the call to ministry in 2004 and has served as Lead Pastor of Word of Faith since 2006. Across the Church of God he has led in evangelism, men’s ministry, youth, prison ministry, and Bible teaching.',
      'Known for his warmth, humor, and humility, Bishop believes that all are equal in the eyes of God. He is a husband, father, and grandfather, and his mission is to prepare God’s people to one day hear, “Well done, thou good and faithful servant.”',
    ],
    quote: 'A cop for Christ, committed to reaching the lost, serving God’s people, and bringing souls before the righteous Judge, Jesus Christ.',
    scripture: {
      text: 'Therefore, my beloved brethren, be steadfast, immovable, always abounding in the work of the Lord, knowing that your labor is not in vain in the Lord.',
      ref: '1 Corinthians 15:58',
    },
  },
  {
    id: 'co-pastor',
    name: 'Rev. Jossett O. McKenzie',
    role: 'Co-Pastor & First Lady',
    tagline: 'A woman of faith, hospitality, and many gifts',
    paragraphs: [
      'Reverend Jossett O. McKenzie was raised in Middlesex, St. Catherine, Jamaica, in a home rooted in faith, resilience, and community. For over 25 years she has been united in marriage and ministry with Bishop McKenzie, and as Co-Pastor she walks boldly in her own calling.',
      'She serves in Sunday School, Youth Ministry, Ladies Ministry, Prison Ministry, and Community Outreach, and she is a Bible teacher known for sharing the Word with wisdom, compassion, and authenticity. Her heart for people led her to earn a Master’s degree in Social Work, equipping her to care for lives in the church and across the wider community.',
      'A mother and grandmother with a natural gift of hospitality, Rev. McKenzie loves creating warm, welcoming spaces, and she lives each day anchored in trust in God.',
    ],
    scripture: {
      text: 'The Lord is my light and my salvation; whom shall I fear? The Lord is the strength of my life; of whom shall I be afraid?',
      ref: 'Psalm 27:1',
    },
  },
];
