// Curated YouTube travel videos across Scotland
// Videos are geotagged to their primary filming locations
// All video IDs verified via YouTube Data API
const YOUTUBE_VIDEOS = [
  // === FULL EPISODES (25 min each) ===
  {
    title: "Rick Steves: Edinburgh (Full Episode)",
    location: "Edinburgh",
    lat: 55.9533,
    lng: -3.1883,
    youtubeId: "Qk6B4YyQSbo",
    source: "Rick Steves"
  },
  {
    title: "Rick Steves: Glasgow & Scottish Passions (Full Episode)",
    location: "Glasgow",
    lat: 55.8642,
    lng: -4.2518,
    youtubeId: "8PtXOw7mnjQ",
    source: "Rick Steves"
  },
  {
    title: "Rick Steves: Scotland's Highlands (Full Episode)",
    location: "Inverness",
    lat: 57.4778,
    lng: -4.2247,
    youtubeId: "DDiq5C34KL4",
    source: "Rick Steves"
  },
  {
    title: "Rick Steves: Scotland's Islands (Full Episode)",
    location: "Isle of Skye",
    lat: 57.5350,
    lng: -6.2260,
    youtubeId: "CsR2Xy-HGPk",
    source: "Rick Steves"
  },

  // === EDINBURGH ===
  {
    title: "Edinburgh: Royal Mile",
    location: "Royal Mile, Edinburgh",
    lat: 55.9503,
    lng: -3.1883,
    youtubeId: "r4tYOugo-R8",
    source: "Rick Steves"
  },
  {
    title: "Edinburgh: Iconic Castle",
    location: "Edinburgh Castle",
    lat: 55.9486,
    lng: -3.1999,
    youtubeId: "qjFzLVKeRV4",
    source: "Rick Steves"
  },
  {
    title: "Edinburgh: Georgian New Town",
    location: "New Town, Edinburgh",
    lat: 55.9550,
    lng: -3.2000,
    youtubeId: "G9jN12Bk92M",
    source: "Rick Steves"
  },
  {
    title: "Edinburgh: Pubs and Writers",
    location: "Old Town, Edinburgh",
    lat: 55.9475,
    lng: -3.1900,
    youtubeId: "lp_A51ceFag",
    source: "Rick Steves"
  },
  {
    title: "Edinburgh: The Scottish Spirit",
    location: "Edinburgh",
    lat: 55.9533,
    lng: -3.1883,
    youtubeId: "A-1GgSN_EtI",
    source: "Rick Steves"
  },
  {
    title: "Contemporary Scottish Cuisine",
    location: "Edinburgh",
    lat: 55.9519,
    lng: -3.1950,
    youtubeId: "1QvKfqMh73o",
    source: "Rick Steves"
  },

  // === GLASGOW ===
  {
    title: "Glasgow: Buchanan Street",
    location: "Buchanan Street, Glasgow",
    lat: 55.8609,
    lng: -4.2514,
    youtubeId: "OWpQ9Pa-4QU",
    source: "Rick Steves"
  },
  {
    title: "Glasgow: Kelvingrove Museum",
    location: "Kelvingrove, Glasgow",
    lat: 55.8687,
    lng: -4.2900,
    youtubeId: "r3bWOwY46lw",
    source: "Rick Steves"
  },
  {
    title: "Glasgow: Graffiti Street Art",
    location: "Glasgow City Centre",
    lat: 55.8580,
    lng: -4.2590,
    youtubeId: "mQrP_-tKRqE",
    source: "Rick Steves"
  },
  {
    title: "Glasgow: Restoration",
    location: "Glasgow",
    lat: 55.8642,
    lng: -4.2518,
    youtubeId: "oruEeTBA9g4",
    source: "Rick Steves"
  },
  {
    title: "Glasgow: Traditional Session",
    location: "Glasgow",
    lat: 55.8560,
    lng: -4.2550,
    youtubeId: "sw4vwRuDP0A",
    source: "Rick Steves"
  },
  {
    title: "Glaswegian Accent",
    location: "Glasgow",
    lat: 55.8700,
    lng: -4.2600,
    youtubeId: "VL1_d3Phr4E",
    source: "Rick Steves"
  },

  // === HIGHLANDS ===
  {
    title: "Highlands: Glencoe",
    location: "Glencoe",
    lat: 56.6833,
    lng: -5.1000,
    youtubeId: "bJqLeuCIGWc",
    source: "Rick Steves"
  },
  {
    title: "Highlands: Clan Heritage",
    location: "Scottish Highlands",
    lat: 57.0000,
    lng: -4.8000,
    youtubeId: "ROqElhex5MA",
    source: "Rick Steves"
  },
  {
    title: "Highlands: Crannogs and Cairns",
    location: "Loch Tay",
    lat: 56.5000,
    lng: -4.2000,
    youtubeId: "RtEObzvwo4Y",
    source: "Rick Steves"
  },
  {
    title: "Loch Ness: Scotland's Legendary Lake",
    location: "Loch Ness",
    lat: 57.3229,
    lng: -4.4244,
    youtubeId: "WUidfeCaXQw",
    source: "Rick Steves"
  },
  {
    title: "Highlands: Inveraray Castle",
    location: "Inveraray Castle",
    lat: 56.2333,
    lng: -5.0750,
    youtubeId: "ckLoyLO-Hmg",
    source: "Rick Steves"
  },

  // === OBAN & ARGYLL ===
  {
    title: "Oban: Gateway to the Scottish Isles",
    location: "Oban",
    lat: 56.4150,
    lng: -5.4700,
    youtubeId: "5ZO_f2EPRoI",
    source: "Rick Steves"
  },

  // === STIRLING & CENTRAL ===
  {
    title: "Stirling Castle",
    location: "Stirling Castle",
    lat: 56.1238,
    lng: -3.9468,
    youtubeId: "EIUV8yZZJ6E",
    source: "Rick Steves"
  },
  {
    title: "Falkirk: Kelpies and Wheel",
    location: "Falkirk",
    lat: 56.0173,
    lng: -3.7500,
    youtubeId: "0PKdA8561SU",
    source: "Rick Steves"
  },

  // === SPEYSIDE ===
  {
    title: "Speyside: Whisky Country",
    location: "Speyside",
    lat: 57.4800,
    lng: -3.2000,
    youtubeId: "vFtOfCjInHc",
    source: "Rick Steves"
  },

  // === ISLE OF SKYE ===
  {
    title: "Skye: Trotternish Peninsula",
    location: "Trotternish, Skye",
    lat: 57.6500,
    lng: -6.2000,
    youtubeId: "0KyWWShKdUc",
    source: "Rick Steves"
  },
  {
    title: "Skye: Pretty Portree",
    location: "Portree, Skye",
    lat: 57.4125,
    lng: -6.1950,
    youtubeId: "DIdBshlDTZg",
    source: "Rick Steves"
  },
  {
    title: "Skye: Island Sights",
    location: "Isle of Skye",
    lat: 57.3000,
    lng: -6.3000,
    youtubeId: "-n3frOKrrxY",
    source: "Rick Steves"
  },
  {
    title: "Skye: Historic Peat Farming",
    location: "Isle of Skye",
    lat: 57.5000,
    lng: -6.4000,
    youtubeId: "o-rbA7xQBLE",
    source: "Rick Steves"
  },
  {
    title: "Danny MacAskill: Skye Ridge",
    location: "Cuillin Mountains, Skye",
    lat: 57.2200,
    lng: -6.2200,
    youtubeId: "xQ_IQS3VKjA",
    source: "Danny MacAskill"
  },

  // === INNER HEBRIDES ===
  {
    title: "Inner Hebrides: Mull, Iona, and Staffa",
    location: "Isle of Mull",
    lat: 56.4500,
    lng: -6.0000,
    youtubeId: "A-TRKhwLe4Q",
    source: "Rick Steves"
  },

  // === ORKNEY ===
  {
    title: "Kirkwall: Urban Orkney",
    location: "Kirkwall, Orkney",
    lat: 58.9809,
    lng: -2.9600,
    youtubeId: "3EU1_Am1bMw",
    source: "Rick Steves"
  },
  {
    title: "Orkney: Prehistoric Sites",
    location: "Ring of Brodgar, Orkney",
    lat: 59.0015,
    lng: -3.2295,
    youtubeId: "izDRg1-WnKE",
    source: "Rick Steves"
  },
  {
    title: "Orkney: Scapa Flow and WWII",
    location: "Scapa Flow, Orkney",
    lat: 58.8900,
    lng: -3.0500,
    youtubeId: "DHqJc059VBM",
    source: "Rick Steves"
  },

  // === SCENIC/GENERAL SCOTLAND ===
  {
    title: "Scotland - A Highland Tale (Timelapse)",
    location: "Scottish Highlands",
    lat: 56.8000,
    lng: -5.0000,
    youtubeId: "ILpygIbvDhA",
    source: "Marcel Gallaun"
  },
  {
    title: "Scotland: Lochs, Mountains & Light",
    location: "Scottish Highlands",
    lat: 57.1000,
    lng: -4.7000,
    youtubeId: "OxoQgeB4agc",
    source: "Adam Stocker"
  },
  {
    title: "Ancient Scotland",
    location: "Scotland",
    lat: 56.5000,
    lng: -4.5000,
    youtubeId: "cS31pJ0iAF0",
    source: "John Duncan"
  },
  {
    title: "Film Locations in Scotland",
    location: "Scotland",
    lat: 56.9000,
    lng: -4.3000,
    youtubeId: "fJla9-7MskE",
    source: "VisitScotland"
  },

  // === GLENFINNAN ===
  {
    title: "Glenfinnan Viaduct & Jacobite Steam Train",
    location: "Glenfinnan Viaduct",
    lat: 56.8760,
    lng: -5.4320,
    youtubeId: "Dc4hMQ7JRdA",
    source: "Drone 4K"
  },

  // === CULLODEN ===
  {
    title: "Culloden (1964) - Jacobite Rebellion Docu-Drama",
    location: "Culloden Battlefield",
    lat: 57.4772,
    lng: -4.0963,
    youtubeId: "-1TZq6DfKKA",
    source: "Peter Watkins"
  },
]

export default YOUTUBE_VIDEOS
