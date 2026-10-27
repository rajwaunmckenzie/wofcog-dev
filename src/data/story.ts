// Church history and leadership biographies for the About page.
// Source: documents supplied by church leadership on 2026-10-27 (church history, Bishop McKenzie's
// biography, Rev. Jossett McKenzie's program biography). Rewritten for the web; no facts added.
// Items still awaiting confirmation are listed in UNRESOLVED.md.

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
    'Word of Faith began the way many great works of God do: with a small group of believers, an open home, and a willingness to say yes. Today we are a growing church family in Neptune, preaching the Word, building faith, and serving our community.',
  milestones: [
    {
      when: 'The beginning',
      title: 'A living room full of faith',
      text: 'Our church, first known as Refuge Temple Church of God, was born in the living room of Sis. Elma McKnight, a former member of the New Brunswick Church of God (Promise Church of God). The small gathering grew quickly, and the believers needed a shepherd. Rev. Howe was appointed as the first pastor and laid a strong spiritual foundation.',
    },
    {
      when: '1990',
      title: 'A new name, a new era',
      text: 'Bishop Glen Colley was assigned as our second pastor. Under his leadership the church was renamed Word of Faith Church of God, marking a new season of vision and identity.',
    },
    {
      when: 'Twelve faithful years',
      title: 'Pastor Peter Campbell',
      text: 'Pastor Peter Campbell then served the congregation faithfully for twelve years before relocating out of state.',
    },
    {
      when: 'September 13, 2006',
      title: 'Bishop Alexander A. McKenzie appointed',
      text: 'Bishop McKenzie was appointed Lead Pastor while the church met on George Street in New Brunswick, New Jersey.',
    },
    {
      when: 'December 2009',
      title: 'A step of faith to Neptune',
      text: 'The ministry relocated to Columbus Avenue in Neptune, New Jersey, with a committed membership of eight.',
    },
    {
      when: 'January 2012',
      title: 'Home at Fortunato Place',
      text: 'As the ministry kept growing, the church moved to its present home at 108 Fortunato Place in Neptune, where we gather today.',
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
      'Bishop Alexander A. McKenzie is a native of Spanish Town, St. Catherine, Jamaica. From an early age, his mother nurtured in him a deep and unwavering faith, teaching him that God is the author of his life and that without Him, he is nothing.',
      'Before coming to the United States, he served his country with honor in the Jamaica Constabulary Force, where he showed discipline, integrity, courage, and a sincere heart for service. That same commitment to protecting and serving others became a powerful part of his calling.',
      'In 2004, Bishop McKenzie answered the call to ministry under the leadership of the late Bishop Francis. Within the Church of God he has served as District Evangelism Director, a member of the Pastors’ Council, a State Youth Board Committee member, Director of Men’s Ministry, Prison Ministry leader, and Bible Study teacher. Since September 2006 he has served as Lead Pastor of Word of Faith.',
      'Known for his warmth, humor, humility, and genuine love for people, Bishop believes that all are equal in the eyes of God. You may hear him called Bishop Z, Zanda, Dez, Sensa, or Pops, and each name carries the love and respect of someone whose life he has touched.',
      'Bishop McKenzie and his wife, Rev. Jossett McKenzie, have shared 25 years of marriage, family, and ministry. He is the proud father of seven children and a loving grandfather to nine. His mission is to prepare God’s people to one day hear the words, “Well done, thou good and faithful servant.”',
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
      'Reverend Jossett O. McKenzie was born and raised in the rural hills of Middlesex, St. Catherine, Jamaica, where her life was rooted in a strong foundation of faith, resilience, and community.',
      'For over 25 years she has been united in marriage and ministry with Bishop Alexander McKenzie. As Co-Pastor of Word of Faith, she faithfully supports the vision of the ministry while walking boldly and purposefully in her own divine calling.',
      'Rev. McKenzie serves across Sunday School, Youth Ministry, Prison Ministry, Ladies Ministry, and Community Outreach. She is a dedicated Bible teacher, known for sharing the Word of God with wisdom, compassion, and authenticity, and for nurturing spiritual growth in everyone she meets.',
      'She believes in growing both spiritually and naturally. Her passion for service and her gift of hospitality inspired her pursuit of a Master’s degree in Social Work, equipping her to impact lives in the church and throughout the wider community.',
      'Above all, she treasures her role as a mother and matriarch: the proud mother of seven and loving grandmother of nine. In her personal time she enjoys the outdoors, crafting, and creating warm, welcoming spaces through decorating. She lives each day anchored in trust in God, striving to reflect His light in every part of her life.',
    ],
    scripture: {
      text: 'The Lord is my light and my salvation; whom shall I fear? The Lord is the strength of my life; of whom shall I be afraid?',
      ref: 'Psalm 27:1',
    },
  },
];
