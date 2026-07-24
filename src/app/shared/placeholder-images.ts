/**
 * TEMPORARY stand-in imagery, served from free public placeholder hosts.
 *
 * Every entry here is a placeholder awaiting real CES photography. Replace the
 * URL with a local path under `public/assets/images/…` and nothing else needs to
 * change — the components read from this file only.
 *
 * See PLACEHOLDER-IMAGES.md at the repo root for the full inventory and the
 * recommended dimensions for each slot.
 */

/** Deterministic scene photos — same seed always returns the same picture. */
const scene = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Deterministic portrait avatars. */
const portrait = (id: number) => `https://i.pravatar.cc/300?img=${id}`;

export const PLACEHOLDER = {
  heroCampus: scene('ces-campus', 1600, 900),

  /** One per home-hero slide; replace each with a real campus photograph. */
  heroSlides: [
    scene('ces-campus', 1600, 900),
    scene('ces-campus-life', 1600, 900),
    scene('ces-campus-sports', 1600, 900),
  ],

  institutes: {
    schools: scene('ces-schools', 600, 400),
    colleges: scene('ces-colleges', 600, 400),
    professional: scene('ces-professional', 600, 400),
    hostels: scene('ces-hostels', 600, 400),
    others: scene('ces-others', 600, 400),
  },

  chairman: portrait(68),

  successStories: [
    scene('ces-story-1', 400, 300),
    scene('ces-story-2', 400, 300),
    scene('ces-story-3', 400, 300),
    scene('ces-story-4', 400, 300),
  ],

  alumni: [portrait(12), portrait(45), portrait(33), portrait(47)],

  /** Campus building illustration on the 404 / 500 pages. */
  errorBuilding: scene('ces-campus-building', 900, 700),

  newsItems: [
    scene('ces-news-a', 600, 420), scene('ces-news-b', 600, 420), scene('ces-news-c', 600, 420),
    scene('ces-news-d', 600, 420), scene('ces-news-e', 600, 420), scene('ces-news-f', 600, 420),
  ],

  campuses: {
    anand: [
      scene('ces-anand-1', 800, 560), scene('ces-anand-2', 400, 300),
      scene('ces-anand-3', 400, 300), scene('ces-anand-4', 400, 300),
      scene('ces-anand-5', 400, 300),
    ],
    khetiwadi: [
      scene('ces-khet-1', 800, 560), scene('ces-khet-2', 400, 300),
      scene('ces-khet-3', 400, 300), scene('ces-khet-4', 400, 300),
      scene('ces-khet-5', 400, 300),
    ],
    mogri: [
      scene('ces-mogri-1', 800, 560), scene('ces-mogri-2', 400, 300),
      scene('ces-mogri-3', 400, 300), scene('ces-mogri-4', 400, 300),
      scene('ces-mogri-5', 400, 300),
    ],
  },

  counselling: {
    hero: scene('ces-counselling-hero', 900, 560),
    counsellor: portrait(47),
  },

  blog: {
    banner: scene('ces-blog-banner', 1400, 500),
    featured: scene('ces-blog-featured', 900, 520),
    posts: [
      scene('ces-blog-1', 600, 420), scene('ces-blog-2', 600, 420), scene('ces-blog-3', 600, 420),
      scene('ces-blog-4', 600, 420), scene('ces-blog-5', 600, 420), scene('ces-blog-6', 600, 420),
    ],
  },

  magazines: [
    scene('ces-mag-1', 400, 540), scene('ces-mag-2', 400, 540), scene('ces-mag-3', 400, 540),
    scene('ces-mag-4', 400, 540), scene('ces-mag-5', 400, 540), scene('ces-mag-6', 400, 540),
    scene('ces-mag-7', 400, 540), scene('ces-mag-8', 400, 540), scene('ces-mag-9', 400, 540),
    scene('ces-mag-10', 400, 540), scene('ces-mag-11', 400, 540),
  ],

  media: {
    galleryBanner: scene('ces-gallery-banner', 1400, 500),
    /** Masonry grid on the Gallery page. */
    photos: [
      scene('ces-g-01', 600, 450), scene('ces-g-02', 600, 380), scene('ces-g-03', 600, 430),
      scene('ces-g-04', 600, 400), scene('ces-g-05', 600, 460), scene('ces-g-06', 600, 390),
      scene('ces-g-07', 600, 440), scene('ces-g-08', 600, 410), scene('ces-g-09', 600, 370),
      scene('ces-g-10', 600, 450), scene('ces-g-11', 600, 400), scene('ces-g-12', 600, 430),
    ],
    navratriBanner: scene('ces-navratri-banner', 1200, 700),
    navratri: [
      scene('ces-nav-1', 500, 380), scene('ces-nav-2', 500, 380),
      scene('ces-nav-3', 500, 380), scene('ces-nav-4', 500, 380),
      scene('ces-nav-5', 500, 380), scene('ces-nav-6', 500, 380),
      scene('ces-nav-7', 500, 380), scene('ces-nav-8', 500, 380),
    ],
    podcastBanner: scene('ces-podcast-banner', 1200, 600),
    episodes: [scene('ces-ep-1', 800, 500), scene('ces-ep-2', 800, 500)],
  },

  academic: {
    schoolsBanner: scene('ces-schools-banner', 1200, 700),
    collegesBanner: scene('ces-colleges-banner', 1200, 700),
    hostelsBanner: scene('ces-hostels-banner', 1200, 700),
    othersBanner: scene('ces-others-banner', 1200, 700),
    /** Institute card photos, reused across the four academic pages. */
    cards: [
      scene('ces-inst-1', 600, 420), scene('ces-inst-2', 600, 420),
      scene('ces-inst-3', 600, 420), scene('ces-inst-4', 600, 420),
      scene('ces-inst-5', 600, 420), scene('ces-inst-6', 600, 420),
      scene('ces-inst-7', 600, 420), scene('ces-inst-8', 600, 420),
      scene('ces-inst-9', 600, 420), scene('ces-inst-10', 600, 420),
      scene('ces-inst-11', 600, 420), scene('ces-inst-12', 600, 420),
      scene('ces-inst-13', 600, 420), scene('ces-inst-14', 600, 420),
      scene('ces-inst-15', 600, 420),
    ],
  },

  projects: {
    /** Angled panels across the hero. */
    heroPanels: [
      scene('ces-proj-solar', 600, 700),
      scene('ces-proj-campus', 600, 700),
      scene('ces-proj-class', 600, 700),
      scene('ces-proj-tech', 600, 700),
    ],
    /** One per project card, in declaration order. */
    cards: [
      scene('ces-proj-aditya', 600, 420),
      scene('ces-proj-eklavya', 600, 420),
      scene('ces-proj-egyan', 600, 420),
      scene('ces-proj-setu', 600, 420),
      scene('ces-proj-sangam', 600, 420),
      scene('ces-proj-arjun', 600, 420),
      scene('ces-proj-anandam', 600, 420),
      scene('ces-proj-shivani', 600, 420),
    ],
  },

  social: {
    /** Tilted collage beside the hero headline. */
    heroCollage: [
      scene('ces-social-h1', 500, 380),
      scene('ces-social-h2', 500, 380),
      scene('ces-social-h3', 500, 380),
      scene('ces-social-h4', 500, 380),
    ],
    /** One per activity card, in the order they are declared. */
    activities: [
      scene('ces-act-arts', 600, 420),
      scene('ces-act-sports', 600, 420),
      scene('ces-act-food-festival', 600, 420),
      scene('ces-act-food-share', 600, 420),
      scene('ces-act-health-camp', 600, 420),
      scene('ces-act-red-cross', 600, 420),
      scene('ces-act-anandam', 600, 420),
      scene('ces-act-shivani', 600, 420),
    ],
    moments: [
      scene('ces-moment-1', 500, 380),
      scene('ces-moment-2', 500, 380),
      scene('ces-moment-3', 500, 380),
      scene('ces-moment-4', 500, 380),
      scene('ces-moment-5', 500, 380),
    ],
  },

  celebration: {
    /** Polaroid-style shots pinned beside the hero headline. */
    heroPolaroids: [
      scene('ces-cent-p1', 400, 300),
      scene('ces-cent-p2', 400, 300),
      scene('ces-cent-p3', 400, 300),
      scene('ces-cent-p4', 400, 300),
    ],
    /** Mosaic: index 0 is the tall feature tile, the rest are the small grid. */
    gallery: [
      scene('ces-cent-g1', 700, 900),
      scene('ces-cent-g2', 500, 380),
      scene('ces-cent-g3', 500, 380),
      scene('ces-cent-g4', 500, 380),
      scene('ces-cent-g5', 500, 380),
      scene('ces-cent-g6', 500, 380),
      scene('ces-cent-g7', 500, 380),
    ],
    certificate: scene('ces-guinness-certificate', 600, 700),
    voices: [portrait(45), portrait(44), portrait(60), portrait(52)],
  },

  about: {
    hero: scene('ces-about-hero', 1600, 900),
    whoWeAre: scene('ces-who-we-are', 900, 620),
    secretary: portrait(60),
    freedomFight: scene('ces-freedom-fight', 700, 900),
    gallery: [
      scene('ces-gallery-1', 500, 380),
      scene('ces-gallery-2', 500, 380),
      scene('ces-gallery-3', 500, 380),
      scene('ces-gallery-4', 500, 380),
      scene('ces-gallery-5', 500, 380),
    ],
  },

  news: {
    classes: scene('ces-news-classes', 800, 500),
    examTips: scene('ces-news-exams', 800, 500),
    annualDay: scene('ces-news-annual-day', 300, 220),
    research: scene('ces-news-research', 300, 220),
    achievements: scene('ces-news-achievements', 300, 220),
  },
} as const;
