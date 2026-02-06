// Curated notable restaurants across Scotland
// Focused on areas: Glencoe, Oban, Skye, Orkney, Cairngorms, Staffa/Mull
const NOTABLE_FOOD = [
  // === OBAN - Seafood Capital ===
  {
    name: "Ee-Usk",
    type: "seafood",
    location: "Oban",
    lat: 56.4153,
    lng: -5.4747,
    description: "Award-winning seafood on North Pier with bay views",
    source: "VisitScotland"
  },
  {
    name: "The Green Shack",
    type: "seafood",
    location: "Oban",
    lat: 56.4127,
    lng: -5.4725,
    description: "Famous alfresco seafood shack on CalMac Pier - lobster, scallops, crab sandwiches",
    source: "Local favorite"
  },
  {
    name: "Coast Restaurant",
    type: "fine dining",
    location: "Oban",
    lat: 56.4148,
    lng: -5.4729,
    description: "Modern Scottish - best from land and sea since 2004",
    source: "VisitScotland"
  },
  {
    name: "Cuan Mor",
    type: "pub",
    location: "Oban",
    lat: 56.4158,
    lng: -5.4713,
    description: "Relaxed gastropub - Isle of Mull scallops, local langoustine",
    source: "VisitScotland"
  },

  // === GLENCOE & FORT WILLIAM ===
  {
    name: "Clachaig Inn",
    type: "pub",
    location: "Glencoe",
    lat: 56.6825,
    lng: -5.0542,
    description: "Historic Highland inn - hearty food, 300+ whiskies, real ales",
    source: "Local institution"
  },
  {
    name: "Loch Leven Seafood Café",
    type: "seafood",
    location: "Kinlochleven",
    lat: 56.6874,
    lng: -5.1189,
    description: "Fresh local shellfish in simple setting overlooking loch",
    source: "Scotsman"
  },
  {
    name: "The Crannog",
    type: "seafood",
    location: "Fort William",
    lat: 56.8198,
    lng: -5.1052,
    description: "West coast seafood - Mallaig langoustines, grand seafood platter",
    source: "Scotsman"
  },
  {
    name: "Lime Tree Restaurant",
    type: "fine dining",
    location: "Fort William",
    lat: 56.8192,
    lng: -5.1068,
    description: "Seasonal Scottish with French influence - local langoustines, duck",
    source: "Scotsman"
  },

  // === ISLE OF SKYE ===
  {
    name: "Scorrybreac",
    type: "fine dining",
    location: "Portree, Skye",
    lat: 57.4128,
    lng: -6.1962,
    description: "Tasting menu showcasing Skye produce - book ahead essential",
    source: "VisitScotland"
  },
  {
    name: "Sea Breezes",
    type: "seafood",
    location: "Portree, Skye",
    lat: 57.4108,
    lng: -6.1889,
    description: "Fresh seafood on the pier - langoustines, mussels, scallops",
    source: "Local favorite"
  },
  {
    name: "Dulse & Brose",
    type: "restaurant",
    location: "Portree, Skye",
    lat: 57.4122,
    lng: -6.1947,
    description: "Stylish Scottish comfort food with local ingredients",
    source: "ExperienceSkye"
  },
  {
    name: "The Three Chimneys",
    type: "fine dining",
    location: "Colbost, Skye",
    lat: 57.4389,
    lng: -6.6478,
    description: "Legendary restaurant - Scottish cuisine in remote croft setting",
    source: "Michelin Guide"
  },

  // === ORKNEY ===
  {
    name: "The Foveran",
    type: "fine dining",
    location: "Kirkwall, Orkney",
    lat: 58.9653,
    lng: -2.9850,
    description: "Restaurant with rooms - Scapa Flow views, Orkney lobster thermidor",
    source: "Orkney.com"
  },
  {
    name: "The Shore",
    type: "restaurant",
    location: "Kirkwall, Orkney",
    lat: 58.9814,
    lng: -2.9598,
    description: "Modern Scottish on harbourfront - creative seafood dishes",
    source: "Orkney.com"
  },
  {
    name: "Harbour Fry",
    type: "fish & chips",
    location: "Kirkwall, Orkney",
    lat: 58.9820,
    lng: -2.9605,
    description: "Local favorite chippy - fresh Orkney haddock",
    source: "Local favorite"
  },

  // === CAIRNGORMS ===
  {
    name: "The Fife Arms",
    type: "fine dining",
    location: "Braemar",
    lat: 57.0063,
    lng: -3.3983,
    description: "Seasonal Scottish - fresh game, seafood, local fare in grand hotel",
    source: "VisitCairngorms"
  },
  {
    name: "The Old Bridge Inn",
    type: "pub",
    location: "Aviemore",
    lat: 57.1978,
    lng: -3.8283,
    description: "Log fires, excellent food, cask ales and malt whiskies",
    source: "VisitCairngorms"
  },
  {
    name: "Anderson's Restaurant",
    type: "restaurant",
    location: "Boat of Garten",
    lat: 57.2633,
    lng: -3.9728,
    description: "Peaceful village spot - fresh Scottish produce, family-friendly",
    source: "VisitCairngorms"
  },

  // === MULL (for Staffa trips) ===
  {
    name: "Café Fish",
    type: "seafood",
    location: "Tobermory, Mull",
    lat: 56.6228,
    lng: -6.0642,
    description: "Pier-side seafood - catch landed daily, spectacular views",
    source: "VisitScotland"
  },
  {
    name: "The Mishnish",
    type: "pub",
    location: "Tobermory, Mull",
    lat: 56.6227,
    lng: -6.0657,
    description: "Historic pub on colorful waterfront - good pub grub, live music",
    source: "Local institution"
  },

  // === AWARD-WINNING FISH & CHIPS ===
  {
    name: "Anstruther Fish Bar",
    type: "fish & chips",
    location: "Anstruther, Fife",
    lat: 56.2230,
    lng: -2.6991,
    description: "Multi-award winning - possibly Scotland's best fish & chips",
    source: "National Fish & Chip Awards"
  },
  {
    name: "Frankie's Fish & Chips",
    type: "fish & chips",
    location: "Brae, Shetland",
    lat: 60.3955,
    lng: -1.3520,
    description: "UK's most northerly chippy - Best in UK 2015, sustainable Shetland seafood",
    source: "National Fish & Chip Awards"
  },
  {
    name: "The Bay Fish & Chips",
    type: "fish & chips",
    location: "Stonehaven",
    lat: 56.9640,
    lng: -2.2100,
    description: "Award-winning sustainable fish & chips on the harbor",
    source: "National Fish & Chip Awards"
  },
  {
    name: "Cromars",
    type: "fish & chips",
    location: "St Andrews",
    lat: 56.3400,
    lng: -2.7956,
    description: "Best fish & chips in St Andrews - local favorite",
    source: "Local favorite"
  },

  // === MICHELIN STARRED (worth a detour) ===
  {
    name: "Restaurant Andrew Fairlie",
    type: "michelin",
    location: "Gleneagles, Auchterarder",
    lat: 56.2882,
    lng: -3.7233,
    description: "Two Michelin stars - Scotland's most celebrated restaurant",
    source: "Michelin Guide"
  },
  {
    name: "The Glenturret Lalique",
    type: "michelin",
    location: "Crieff",
    lat: 56.3908,
    lng: -3.8667,
    description: "Two Michelin stars - fine dining at Scotland's oldest distillery",
    source: "Michelin Guide"
  },
  {
    name: "Cail Bruich",
    type: "michelin",
    location: "Glasgow",
    lat: 55.8745,
    lng: -4.2894,
    description: "One Michelin star - Glasgow's first star in 14 years, Scottish tasting menu",
    source: "Michelin Guide"
  },
  {
    name: "The Kitchin",
    type: "michelin",
    location: "Leith, Edinburgh",
    lat: 55.9760,
    lng: -3.1697,
    description: "One Michelin star - 'From nature to plate' Scottish seasonal cuisine",
    source: "Michelin Guide"
  },
]

export default NOTABLE_FOOD
