// Heritage audio recordings from Tobar an Dualchais and YouTube
// Browse: https://www.tobarandualchais.co.uk/
const HERITAGE_AUDIO = [
  {
    title: "Glencoe Recording",
    location: "Glencoe",
    lat: 56.6833,
    lng: -5.1,
    url: "https://www.tobarandualchais.co.uk/track/66384",
    source: "Tobar an Dualchais"
  },
  {
    title: "Unst Boat Song (Norn)",
    location: "Unst, Shetland",
    lat: 60.7494,
    lng: -0.8856,
    youtubeId: "NrDGHCC67Hg",
    source: "Kitty Anderson (1952)"
  },
  {
    title: "King Orfeo (Norn refrain)",
    location: "Lerwick, Shetland",
    lat: 60.1551,
    lng: -1.1449,
    youtubeId: "peTItKBUfic",
    source: "Kitty Anderson"
  },
  {
    title: "Killin Recording",
    location: "Killin",
    lat: 56.4682,
    lng: -4.3192,
    url: "https://www.tobarandualchais.co.uk/track/17917",
    source: "Tobar an Dualchais"
  },
  {
    title: "Glen Dochart Recording",
    location: "Glen Dochart",
    lat: 56.4189,
    lng: -4.5581,
    url: "https://www.tobarandualchais.co.uk/track/18201",
    source: "Tobar an Dualchais"
  },
  {
    title: "Aberdeenshire Recording",
    location: "Strathdon",
    lat: 57.662849,
    lng: -2.513359,
    url: "https://www.tobarandualchais.co.uk/track/9817",
    source: "Tobar an Dualchais"
  },
  {
    title: "Glasgow Recording",
    location: "Glasgow",
    lat: 55.8642,
    lng: -4.2518,
    url: "https://www.tobarandualchais.co.uk/track/23471",
    source: "Tobar an Dualchais"
  },
  {
    title: "Loch nan Uamh Recording",
    location: "Loch nan Uamh",
    lat: 56.8761,
    lng: -5.8347,
    url: "https://www.tobarandualchais.co.uk/track/2460",
    source: "Tobar an Dualchais"
  },
  {
    title: "Meggernie Castle Recording",
    location: "Meggernie Castle, Glen Lyon",
    lat: 56.5983,
    lng: -4.4036,
    url: "https://www.tobarandualchais.co.uk/track/24886",
    source: "Tobar an Dualchais"
  },
  {
    title: "Kindrochit Castle Recording",
    location: "Kindrochit Castle, Braemar",
    lat: 57.0065,
    lng: -3.3987,
    url: "https://www.tobarandualchais.co.uk/track/37090",
    source: "Tobar an Dualchais"
  },
  {
    title: "Norwick Recording",
    location: "Norwick, Unst, Shetland",
    lat: 60.8136,
    lng: -0.8708,
    url: "https://www.tobarandualchais.co.uk/track/82500",
    source: "Tobar an Dualchais"
  },
  {
    title: "Edinburgh Recording",
    location: "Edinburgh",
    lat: 55.932940,
    lng: -3.367387,
    url: "https://www.tobarandualchais.co.uk/track/91084",
    source: "Tobar an Dualchais"
  },
  {
    title: "Carn Dearg Recording",
    location: "Carn Dearg",
    lat: 56.7889,
    lng: -5.0036,
    url: "https://www.tobarandualchais.co.uk/track/17968",
    source: "Tobar an Dualchais"
  },
  {
    title: "Tigharry Recording",
    location: "Tigharry, North Uist",
    lat: 57.6056,
    lng: -7.4933,
    url: "https://www.tobarandualchais.co.uk/track/38526",
    source: "Tobar an Dualchais"
  },
  {
    title: "Fetterangus Recording",
    location: "Fetterangus, Aberdeenshire",
    lat: 57.5436,
    lng: -2.0253,
    url: "https://www.tobarandualchais.co.uk/track/22147",
    source: "Tobar an Dualchais"
  },
  {
    title: "Edinburgh Recording 2",
    location: "Edinburgh",
    lat: 55.9533,
    lng: -3.1883,
    url: "https://www.tobarandualchais.co.uk/track/85576",
    source: "Tobar an Dualchais"
  },
  {
    title: "Dunrossness Recording",
    location: "Dunrossness, Shetland",
    lat: 59.8833,
    lng: -1.2833,
    url: "https://www.tobarandualchais.co.uk/track/27427",
    source: "Tobar an Dualchais"
  },
  {
    title: "Dull Parish Recording",
    location: "Dull, Perthshire",
    lat: 56.6017,
    lng: -4.0514,
    url: "https://www.tobarandualchais.co.uk/track/17929",
    source: "Tobar an Dualchais"
  },
  {
    title: "Yell Parish Recording",
    location: "Yell, Shetland",
    lat: 60.6019,
    lng: -1.0728,
    url: "https://www.tobarandualchais.co.uk/track/81380",
    source: "Tobar an Dualchais"
  },
  {
    title: "Harris Parish Recording",
    location: "Harris, Outer Hebrides",
    lat: 57.9000,
    lng: -6.8000,
    url: "https://www.tobarandualchais.co.uk/track/58910",
    source: "Tobar an Dualchais"
  },
  {
    title: "Loch Gruinart Recording",
    location: "Loch Gruinart, Islay",
    lat: 55.8500,
    lng: -6.3500,
    url: "https://www.tobarandualchais.co.uk/track/60196",
    source: "Tobar an Dualchais"
  },
  {
    title: "Gifford Recording",
    location: "Gifford, East Lothian",
    lat: 55.9042,
    lng: -2.7500,
    url: "https://www.tobarandualchais.co.uk/track/30699",
    source: "Tobar an Dualchais"
  },
  {
    title: "Fetlar Recording",
    location: "Fetlar, Shetland",
    lat: 60.6100,
    lng: -0.8700,
    url: "https://www.tobarandualchais.co.uk/track/89944",
    source: "Tobar an Dualchais"
  },
  {
    title: "Oban Recording",
    location: "Oban, Argyll",
    lat: 56.4150,
    lng: -5.4700,
    url: "https://www.tobarandualchais.co.uk/track/89364",
    source: "Tobar an Dualchais"
  },
  {
    title: "Kerrera Recording",
    location: "Kerrera, Argyll",
    lat: 56.3900,
    lng: -5.5300,
    url: "https://www.tobarandualchais.co.uk/track/51438",
    source: "Tobar an Dualchais"
  },
  {
    title: "Smoo Cave Recording",
    location: "Smoo Cave, Durness",
    lat: 58.5630,
    lng: -4.7230,
    url: "https://www.tobarandualchais.co.uk/track/9924",
    source: "Tobar an Dualchais"
  },
]

export default HERITAGE_AUDIO
