// ═══════════════════════════════════════════
// Stateful Mock Database for Demo / Testing
// ═══════════════════════════════════════════

const DEFAULT_RELEASES = [
  {
    id: "rel_neon_dreams",
    title: "Neon Dreams",
    type: "EP",
    label: "Future Wave Records",
    status: "live",
    upc: "190234567891",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
    releaseDate: "2026-03-15",
    primaryGenre: "Electronic",
    secondaryGenre: "Synthwave",
    language: "en",
    participants: [
      { name: "Antigravity", role: ["primary"], artistId: "art_1" },
      { name: "Retro Knight", role: ["featured"], artistId: "art_2" }
    ],
    tracks: [
      { id: "trk_neon_1", title: "Sunset Cruise", isrc: "US1232600001", duration: 245, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", status: "completed" },
      { id: "trk_neon_2", title: "Grid Runners", isrc: "US1232600002", duration: 198, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", status: "completed" },
      { id: "trk_neon_3", title: "After Hours (feat. Retro Knight)", isrc: "US1232600003", duration: 222, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", status: "completed" }
    ],
    stores: ["spotify", "apple_music", "amazon", "youtube_music", "deezer", "tidal"]
  },
  {
    id: "rel_acoustic_soul",
    title: "Acoustic Soul",
    type: "Single",
    label: "Indie Lounge",
    status: "live",
    upc: "190234567892",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop",
    releaseDate: "2026-04-20",
    primaryGenre: "Singer-Songwriter",
    secondaryGenre: "Acoustic",
    language: "en",
    participants: [
      { name: "Antigravity", role: ["primary"], artistId: "art_1" }
    ],
    tracks: [
      { id: "trk_acoustic_1", title: "Acoustic Soul", isrc: "US1232600004", duration: 184, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", status: "completed" }
    ],
    stores: ["spotify", "apple_music", "youtube_music", "deezer"]
  },
  {
    id: "rel_hyperdrive",
    title: "Hyperdrive",
    type: "Single",
    label: "Future Wave Records",
    status: "in_review",
    upc: "190234567893",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300&auto=format&fit=crop",
    releaseDate: "2026-06-25",
    primaryGenre: "Electronic",
    secondaryGenre: "Dance",
    language: "en",
    participants: [
      { name: "Antigravity", role: ["primary"], artistId: "art_1" }
    ],
    tracks: [
      { id: "trk_hyper_1", title: "Hyperdrive", isrc: "US1232600005", duration: 210, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", status: "completed" }
    ],
    stores: ["spotify", "apple_music", "amazon", "youtube_music", "deezer", "tidal", "tiktok"]
  },
  {
    id: "rel_midnight_melancholy",
    title: "Midnight Melancholy",
    type: "Album",
    label: "",
    status: "draft",
    upc: "",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop",
    releaseDate: "",
    primaryGenre: "Ambient",
    secondaryGenre: "Lo-Fi",
    language: "en",
    participants: [
      { name: "Antigravity", role: ["primary"], artistId: "art_1" }
    ],
    tracks: [],
    stores: []
  }
];

const DEFAULT_ANALYTICS = {
  overview: {
    totalStreams: 184520,
    streamGrowth: 18.4,
    monthlyListeners: 24890,
    listenerGrowth: 12.1,
    shazams: 3450,
    shazamGrowth: 24.3,
    smartlinkClicks: 5210,
    platforms: [
      { name: "Spotify", streams: 98450, percentage: 53.4, color: "#1db954" },
      { name: "Apple Music", streams: 51200, percentage: 27.7, color: "#fc3c44" },
      { name: "YouTube Music", streams: 22300, percentage: 12.1, color: "#ff0000" },
      { name: "Amazon Music", streams: 7850, percentage: 4.3, color: "#00a8e1" },
      { name: "Others", streams: 4720, percentage: 2.5, color: "#64748b" }
    ],
    topTracks: [
      { id: "trk_neon_1", title: "Sunset Cruise", streams: 95400, change: 12.4 },
      { id: "trk_neon_3", title: "After Hours", streams: 54120, change: 25.8 },
      { id: "trk_acoustic_1", title: "Acoustic Soul", streams: 28400, change: -2.3 },
      { id: "trk_neon_2", title: "Grid Runners", streams: 6600, change: 8.9 }
    ]
  },
  platforms: [
    { id: "spotify", name: "Spotify", streams: 98450, growth: 14.2, listeners: 14200, playlistAdds: 3200 },
    { id: "apple_music", name: "Apple Music", streams: 51200, growth: 22.8, listeners: 8100, playlistAdds: 1150 },
    { id: "youtube", name: "YouTube Music", streams: 22300, growth: 9.5, listeners: 3800, playlistAdds: 0 },
    { id: "amazon", name: "Amazon Music", streams: 7850, growth: 5.1, listeners: 1200, playlistAdds: 180 }
  ],
  usageDiscovery: {
    videosCount: 12400,
    videoViews: 4580000,
    likesCount: 382000,
    sharesCount: 14200,
    topSongs: [
      { id: "trk_neon_3", title: "After Hours", videos: 8200, views: 3200000 },
      { id: "trk_neon_1", title: "Sunset Cruise", videos: 3100, views: 1100000 },
      { id: "trk_acoustic_1", title: "Acoustic Soul", videos: 1100, views: 280000 }
    ],
    matches: [
      { trackTitle: "After Hours", platform: "TikTok", creator: "@dancequeen_99", views: 245000, date: "2026-06-04" },
      { trackTitle: "Sunset Cruise", platform: "Instagram Reels", creator: "@travel_junkie", views: 182000, date: "2026-06-03" },
      { trackTitle: "After Hours", platform: "TikTok", creator: "@chillbeats_only", views: 98000, date: "2026-06-02" },
      { trackTitle: "Acoustic Soul", platform: "YouTube Shorts", creator: "@guitar_covers", views: 45000, date: "2026-06-01" }
    ]
  },
  topReleaseLinks: [
    { title: "Neon Dreams", type: "EP", url: "https://smartlink.toolost.com/neondreams", visits: 3450, clicks: 2100, ctr: 60.8 },
    { title: "Acoustic Soul", type: "Single", url: "https://smartlink.toolost.com/acousticsoul", visits: 1760, clicks: 980, ctr: 55.7 }
  ]
};

const DEFAULT_SALES = {
  overview: {
    balance: 1424.50,
    totalEarnings: 8452.12,
    withdrawn: 7027.62,
    pending: 315.80,
    monthlyEarnings: [
      { month: "Dec 2025", earnings: 420.50, streams: 110000 },
      { month: "Jan 2026", earnings: 510.20, streams: 132000 },
      { month: "Feb 2026", earnings: 490.80, streams: 128000 },
      { month: "Mar 2026", earnings: 680.40, streams: 178000 },
      { month: "Apr 2026", earnings: 742.10, streams: 195000 },
      { month: "May 2026", earnings: 812.50, streams: 212000 }
    ],
    topChannels: [
      { name: "Spotify", revenue: 588.20, streams: 142000, share: 61.2 },
      { name: "Apple Music", revenue: 298.50, streams: 58000, share: 31.0 },
      { name: "YouTube Music", revenue: 45.30, streams: 24000, share: 4.7 },
      { name: "Amazon Music", revenue: 22.10, streams: 6800, share: 2.3 },
      { name: "Others", revenue: 8.20, streams: 2200, share: 0.8 }
    ],
    topTerritories: [
      { countryCode: "US", country: "United States", revenue: 512.40, streams: 110000, share: 53.2 },
      { countryCode: "GB", country: "United Kingdom", revenue: 124.80, streams: 28000, share: 13.0 },
      { countryCode: "DE", country: "Germany", revenue: 84.50, streams: 19000, share: 8.8 },
      { countryCode: "CA", country: "Canada", revenue: 76.20, streams: 17000, share: 7.9 },
      { countryCode: "AU", country: "Australia", revenue: 58.10, streams: 12000, share: 6.0 },
      { countryCode: "FR", country: "France", revenue: 38.60, streams: 8800, share: 4.0 },
      { countryCode: "JP", country: "Japan", revenue: 24.30, streams: 5200, share: 2.5 },
      { countryCode: "Others", country: "Rest of World", revenue: 43.40, streams: 9200, share: 4.6 }
    ]
  },
  tracks: [
    { id: "trk_neon_1", title: "Sunset Cruise", releaseTitle: "Neon Dreams", streams: 125000, revenue: 525.00 },
    { id: "trk_neon_3", title: "After Hours", releaseTitle: "Neon Dreams", streams: 78000, revenue: 327.60 },
    { id: "trk_acoustic_1", title: "Acoustic Soul", releaseTitle: "Acoustic Soul", streams: 24000, revenue: 100.80 },
    { id: "trk_neon_2", title: "Grid Runners", releaseTitle: "Neon Dreams", streams: 5200, revenue: 21.84 }
  ],
  releases: [
    { id: "rel_neon_dreams", title: "Neon Dreams", type: "EP", streams: 208200, revenue: 874.44 },
    { id: "rel_acoustic_soul", title: "Acoustic Soul", type: "Single", streams: 24000, revenue: 100.80 }
  ],
  artists: [
    { id: "art_1", name: "Antigravity", streams: 232200, revenue: 975.24 }
  ],
  channels: [
    { id: "spotify", name: "Spotify", streams: 142000, revenue: 588.20, rate: 0.0041 },
    { id: "apple_music", name: "Apple Music", streams: 58000, revenue: 298.50, rate: 0.0051 },
    { id: "youtube", name: "YouTube Music", streams: 24000, revenue: 45.30, rate: 0.0019 },
    { id: "amazon", name: "Amazon Music", streams: 6800, revenue: 22.10, rate: 0.0033 }
  ],
  streamRates: [
    { channel: "Apple Music", territory: "United States", type: "Paid/Premium", rate: 0.0075 },
    { channel: "Spotify", territory: "United States", type: "Paid/Premium", rate: 0.0049 },
    { channel: "Spotify", territory: "United Kingdom", type: "Paid/Premium", rate: 0.0044 },
    { channel: "Apple Music", territory: "United Kingdom", type: "Paid/Premium", rate: 0.0068 },
    { channel: "Spotify", territory: "United States", type: "Free/Ad-Supported", rate: 0.0012 },
    { channel: "YouTube Music", territory: "United States", type: "Paid/Premium", rate: 0.0031 }
  ]
};

const DEFAULT_PREFERENCES = {
  artists: [
    { id: "pref_art_1", name: "Antigravity", spotifyId: "123456", appleMusicId: "789012", youtubeId: "UC123456" }
  ],
  label: {
    name: "Future Wave Records",
    country: "US",
    phone: "+1 555-0199",
    address: "100 Wave Blvd, Cyber City, CA 90210"
  }
};

const REFERENCE_DATA = {
  genres: ["Electronic", "Synthwave", "Ambient", "Lo-Fi", "Pop", "Hip Hop", "Rock", "Singer-Songwriter", "Classical", "Jazz", "R&B", "Dance"],
  languages: [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "Germany" },
    { code: "ja", name: "Japanese" }
  ],
  countries: [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" }
  ],
  platforms: [
    { id: "spotify", name: "Spotify" },
    { id: "apple_music", name: "Apple Music" },
    { id: "youtube_music", name: "YouTube Music" },
    { id: "amazon", name: "Amazon Music" },
    { id: "deezer", name: "Deezer" },
    { id: "tidal", name: "Tidal" },
    { id: "tiktok", name: "TikTok" }
  ]
};

class MockDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("mock_initialized")) {
      localStorage.setItem("mock_releases", JSON.stringify(DEFAULT_RELEASES));
      localStorage.setItem("mock_analytics", JSON.stringify(DEFAULT_ANALYTICS));
      localStorage.setItem("mock_sales", JSON.stringify(DEFAULT_SALES));
      localStorage.setItem("mock_preferences", JSON.stringify(DEFAULT_PREFERENCES));
      localStorage.setItem("mock_initialized", "true");
    }
  }

  getReleases() {
    return JSON.parse(localStorage.getItem("mock_releases"));
  }

  saveReleases(releases) {
    localStorage.setItem("mock_releases", JSON.stringify(releases));
  }

  getPreferences() {
    return JSON.parse(localStorage.getItem("mock_preferences"));
  }

  savePreferences(prefs) {
    localStorage.setItem("mock_preferences", JSON.stringify(prefs));
  }

  // API Route Simulators
  handleRequest(method, endpoint, body = null, params = {}) {
    const releases = this.getReleases();
    const preferences = this.getPreferences();

    // GET /me
    if (endpoint === "/me") {
      return {
        data: {
          id: "usr_antigravity",
          first_name: "Antigravity",
          last_name: "Creative",
          email: "artist@antigravity.io",
          role: "artist",
          created_at: "2026-01-01T00:00:00Z"
        }
      };
    }

    // GET /releases
    if (endpoint === "/releases" && method === "GET") {
      let filtered = [...releases];

      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          r => r.title.toLowerCase().includes(query) ||
          r.label?.toLowerCase().includes(query) ||
          r.participants.some(p => p.name.toLowerCase().includes(query))
        );
      }
      if (params.status) {
        filtered = filtered.filter(r => r.status === params.status);
      }
      if (params.type) {
        filtered = filtered.filter(r => r.type === params.type);
      }

      // Pagination
      const page = parseInt(params.page, 10) || 1;
      const perPage = parseInt(params.perPage, 10) || 10;
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const data = filtered.slice((page - 1) * perPage, page * perPage);

      return {
        data,
        page,
        perPage,
        totalItems,
        totalPages
      };
    }

    // GET /releases/:id
    const releaseMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)$/);
    if (releaseMatch && method === "GET") {
      const id = releaseMatch[1];
      const rel = releases.find(r => r.id === id);
      if (!rel) throw { status: 404, message: "Release not found" };
      return { data: rel };
    }

    // POST /releases
    if (endpoint === "/releases" && method === "POST") {
      const newId = "rel_" + Math.random().toString(36).substr(2, 9);
      const newRelease = {
        id: newId,
        title: body.title,
        type: body.type,
        label: body.label || "",
        status: "draft",
        upc: "",
        coverUrl: "",
        releaseDate: "",
        primaryGenre: body.primaryGenre || "",
        secondaryGenre: body.secondaryGenre || "",
        language: body.language || "en",
        participants: body.participants || [],
        tracks: [],
        stores: []
      };
      releases.unshift(newRelease);
      this.saveReleases(releases);
      return { data: newRelease };
    }

    // PATCH /releases/:id/metadata
    const metaMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)\/metadata$/);
    if (metaMatch && method === "PATCH") {
      const id = metaMatch[1];
      const idx = releases.findIndex(r => r.id === id);
      if (idx === -1) throw { status: 404, message: "Release not found" };
      releases[idx] = { ...releases[idx], ...body };
      this.saveReleases(releases);
      return { data: releases[idx] };
    }

    // PATCH /releases/:id/delivery
    const deliveryMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)\/delivery$/);
    if (deliveryMatch && method === "PATCH") {
      const id = deliveryMatch[1];
      const idx = releases.findIndex(r => r.id === id);
      if (idx === -1) throw { status: 404, message: "Release not found" };
      releases[idx].stores = body.platforms || [];
      this.saveReleases(releases);
      return { data: releases[idx] };
    }

    // POST /releases/:id/submit
    const submitMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)\/submit$/);
    if (submitMatch && method === "POST") {
      const id = submitMatch[1];
      const idx = releases.findIndex(r => r.id === id);
      if (idx === -1) throw { status: 404, message: "Release not found" };
      
      // Perform validation checks
      if (!releases[idx].coverUrl) {
        throw { status: 400, message: "Artwork cover image is required before submitting." };
      }
      if (releases[idx].tracks.length === 0) {
        throw { status: 400, message: "Please upload at least one track before submitting." };
      }

      releases[idx].status = "in_review";
      releases[idx].upc = releases[idx].upc || "190" + Math.floor(Math.random() * 900000000 + 100000000);
      this.saveReleases(releases);
      return { data: releases[idx] };
    }

    // DELETE /releases/:id
    const deleteMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)$/);
    if (deleteMatch && method === "DELETE") {
      const id = deleteMatch[1];
      const idx = releases.findIndex(r => r.id === id);
      if (idx === -1) throw { status: 404, message: "Release not found" };
      releases.splice(idx, 1);
      this.saveReleases(releases);
      return { success: true };
    }

    // GET /releases/:id/tracks
    const tracksMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)\/tracks$/);
    if (tracksMatch && method === "GET") {
      const id = tracksMatch[1];
      const rel = releases.find(r => r.id === id);
      if (!rel) throw { status: 404, message: "Release not found" };
      return { data: rel.tracks || [] };
    }

    // POST /releases/:id/tracks/upload-url
    const uploadUrlMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)\/tracks\/upload-url$/);
    if (uploadUrlMatch && method === "POST") {
      return {
        data: {
          uploadUrl: "https://mock-upload.toolost.com/file-upload-dest",
          fileKey: "audio_" + Math.random().toString(36).substr(2, 9) + ".wav"
        }
      };
    }

    // PUT /releases/:id/tracks
    const updateTracksMatch = endpoint.match(/^\/releases\/([a-zA-Z0-9_\-]+)\/tracks$/);
    if (updateTracksMatch && method === "PUT") {
      const id = updateTracksMatch[1];
      const idx = releases.findIndex(r => r.id === id);
      if (idx === -1) throw { status: 404, message: "Release not found" };
      
      const incomingTracks = body.tracks || [];
      const updatedTracks = incomingTracks.map((t, index) => {
        return {
          id: t.id || "trk_" + Math.random().toString(36).substr(2, 9),
          title: t.title || `Track ${index + 1}`,
          isrc: t.isrc || "US12326" + Math.floor(10000 + Math.random() * 90000),
          duration: t.duration || 180,
          audioUrl: t.audioUrl || `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 8) + 1}.mp3`,
          status: "completed"
        };
      });

      releases[idx].tracks = updatedTracks;
      this.saveReleases(releases);
      return { data: updatedTracks };
    }

    // GET /analytics/overview
    if (endpoint === "/analytics/overview") {
      return { data: DEFAULT_ANALYTICS.overview };
    }

    // GET /analytics/tracks
    if (endpoint === "/analytics/tracks") {
      return { data: DEFAULT_ANALYTICS.overview.topTracks };
    }

    // GET /analytics/platforms
    if (endpoint === "/analytics/platforms") {
      return { data: DEFAULT_ANALYTICS.platforms };
    }

    // GET /analytics/usage-discovery
    if (endpoint === "/analytics/usage-discovery") {
      return {
        data: {
          ...DEFAULT_ANALYTICS.usageDiscovery,
          streamsCount: DEFAULT_ANALYTICS.overview.totalStreams
        }
      };
    }

    // GET /analytics/top-release-links
    if (endpoint === "/analytics/top-release-links") {
      return { data: DEFAULT_ANALYTICS.topReleaseLinks };
    }

    // GET /sales/overview
    if (endpoint === "/sales/overview") {
      return { data: DEFAULT_SALES.overview };
    }

    // GET /sales/tracks
    if (endpoint === "/sales/tracks") {
      return { data: DEFAULT_SALES.tracks };
    }

    // GET /sales/releases
    if (endpoint === "/sales/releases") {
      return { data: DEFAULT_SALES.releases };
    }

    // GET /sales/artists
    if (endpoint === "/sales/artists") {
      return { data: DEFAULT_SALES.artists };
    }

    // GET /sales/channels
    if (endpoint === "/sales/channels") {
      return { data: DEFAULT_SALES.channels };
    }

    // GET /sales/territories
    if (endpoint === "/sales/territories") {
      return { data: DEFAULT_SALES.overview.topTerritories };
    }

    // GET /sales/stream-rates
    if (endpoint === "/sales/stream-rates") {
      return { data: DEFAULT_SALES.streamRates };
    }

    // Preferences routes
    if (endpoint === "/preferences/artists") {
      return { data: preferences.artists };
    }
    if (endpoint === "/preferences/artist") {
      return { data: preferences.artists[0] || {} };
    }
    if (endpoint === "/preferences/label") {
      return { data: preferences.label };
    }
    if (endpoint === "/preferences/artist" && method === "POST") {
      preferences.artists[0] = { ...preferences.artists[0], ...body };
      this.savePreferences(preferences);
      return { data: preferences.artists[0] };
    }
    if (endpoint === "/preferences/label" && method === "POST") {
      preferences.label = { ...preferences.label, ...body };
      this.savePreferences(preferences);
      return { data: preferences.label };
    }

    // Reference data
    if (endpoint === "/genres") {
      return { data: REFERENCE_DATA.genres };
    }
    if (endpoint === "/languages") {
      return { data: REFERENCE_DATA.languages };
    }
    if (endpoint === "/countries") {
      return { data: REFERENCE_DATA.countries };
    }
    if (endpoint === "/platforms") {
      return { data: REFERENCE_DATA.platforms };
    }

    throw { status: 404, message: `Mock API: Route ${method} ${endpoint} not found` };
  }
}

export const mockDb = new MockDatabase();
