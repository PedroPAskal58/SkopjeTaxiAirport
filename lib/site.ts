export const site = {
  name: 'Skopje Airport Taxi',
  // Your live domain. Google uses this for the sitemap and search listings.
  url: 'https://skopjeairport.mk',
  email: 'skopjetaxiairport@gmail.com',
  phoneDisplay: '+389 78 968 744',
  phoneHref: 'tel:+38978968744',
  whatsapp: 'https://wa.me/38978968744',
  viber: 'viber://chat?number=%2B38978968744',
  rating: '4.9',
  reviewCount: 67,
  // Google review link. Replace PLACE_ID with your Google Business Profile place ID
  // so this opens the "write a review" dialog directly on your listing.
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=PLACE_ID',
}

export const nav = [
  { label: 'Tours', href: '/tours' },
  { label: 'Transfers', href: '/transfers' },
  { label: 'Routes', href: '/routes' },
  { label: 'Fleet', href: '/fleet' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
  { label: 'My bookings', href: '/bookings' },
]

export const footerNav = nav

export type VehicleSlug = 'mondeo' | 'kia' | 'van'

export const vehicles: Record<
  VehicleSlug,
  { slug: VehicleSlug; name: string; type: string; seats: string; luggage: string }
> = {
  mondeo: {
    slug: 'mondeo',
    name: 'Ford Mondeo 2018',
    type: 'Executive Comfort Sedan',
    seats: 'Up to 4 passengers',
    luggage: '3 large bags',
  },
  kia: {
    slug: 'kia',
    name: 'Kia Sportage 2017',
    type: 'Comfort SUV',
    seats: 'Up to 4 passengers',
    luggage: '3 large bags',
  },
  van: {
    slug: 'van',
    name: 'Premium Passenger Van',
    type: 'Group & Family Van',
    seats: 'Up to 4 passengers',
    luggage: '6 bags',
  },
}

export type TourSlug =
  | 'matka'
  | 'stobi'
  | 'kokino'
  | 'ohrid'
  | 'matka-village-panteleimon'
  | 'matka-self-guided'
  | 'kosovo-pristina-prizren'
  | 'bigorski-mavrovo-naum'
  | 'tetovo-ohrid-bitola'
  | 'tetovo-ohrid-naum'
  | 'autumn-mavrovo'
  | 'autumn-kratovo-kuklica'

export const autumnTourSlugs: ReadonlySet<TourSlug> = new Set(['autumn-mavrovo', 'autumn-kratovo-kuklica'])

export type ItineraryStop = {
  title: string
  text: string
}

export type Tour = {
  slug: TourSlug
  tag: string
  title: string
  description: string
  price: number
  duration: string
  pax: string
  image: string
  alt: string
  about: string
  highlights: string[]
  itinerary: ItineraryStop[]
  important: string
}

export const tours: Record<TourSlug, Tour> = {
  matka: {
    slug: 'matka',
    tag: 'Day Tour',
    title: 'Vodno, Millennium Cross, Panteleimon & Matka Canyon',
    description:
      'Cable car to the Millennium Cross, the 12th-century Byzantine Church of St. Panteleimon, then free time at the stunning Matka Canyon.',
    price: 110,
    duration: '~7 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-matka.png',
    alt: 'Emerald green Matka Canyon with a boat on the water near Skopje',
    about:
      'Just outside Skopje, Matka is one of the oldest canyons in the region and home to Vrelo Cave — one of the deepest underwater caves in Europe. You ride the cable car up Mount Vodno to the towering Millennium Cross, stop at the medieval Church of St. Panteleimon, then descend to the emerald waters of the canyon for a relaxed walk, optional boat ride and lunch by the lake.',
    highlights: [
      'Cable car up Mount Vodno to the Millennium Cross',
      '12th-century Byzantine Church of St. Panteleimon',
      'Free time at Matka Canyon — optional boat ride to Vrelo Cave',
      'Lakeside restaurants for a relaxed lunch',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Comfortable start from ~9:00 AM' },
      { title: 'Cable car to the Millennium Cross', text: 'Sweeping views over Skopje from Mount Vodno' },
      { title: 'Church of St. Panteleimon', text: '12th-century Byzantine frescoes' },
      { title: 'Matka Canyon & free time', text: 'Lakeside walk and optional boat ride to Vrelo Cave' },
      { title: 'Lakeside lunch', text: 'Restaurants right on the canyon (own arrangement)' },
      { title: 'Drop-off — Return to Skopje', text: 'Arrives back in the late afternoon' },
    ],
    important:
      'A ~7-hour trip with short drives between stops. No tour guide — private driver transportation only.',
  },
  stobi: {
    slug: 'stobi',
    tag: 'History Tour',
    title: 'Ancient Macedonia — Stobi & Heraclea Lyncestis',
    description:
      "Discover remarkable Roman and Macedonian heritage at two of the country's most impressive archaeological sites.",
    price: 230,
    duration: '6–7 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-stobi.png',
    alt: 'Ancient Roman ruins and columns at the Stobi archaeological site',
    about:
      'A full day through ancient Macedonia. Stobi was a thriving Roman city where you walk among mosaic floors, a preserved amphitheatre and early Christian basilicas. Then on to Heraclea Lyncestis near Bitola, founded by Philip II of Macedon, famous for its stunning floor mosaics and Roman theatre. A relaxed, story-rich day for anyone who loves history.',
    highlights: [
      'Roman city of Stobi — mosaics, basilicas and amphitheatre',
      'Heraclea Lyncestis, founded by Philip II of Macedon',
      'Some of the finest early Christian floor mosaics in the Balkans',
      'Comfortable stops and lunch along the way',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Early start from ~8:30 AM' },
      { title: 'Drive through the Vardar valley', text: 'About 1 hour south to Stobi' },
      { title: 'Stobi Archaeological Site', text: 'Mosaics, basilicas and the Roman amphitheatre' },
      { title: 'Scenic drive & lunch', text: 'Wine country stop on the way (own arrangement)' },
      { title: 'Heraclea Lyncestis', text: 'Roman theatre and famous floor mosaics near Bitola' },
      { title: 'Drop-off — Return to Skopje', text: 'Arrives back in the early evening' },
    ],
    important:
      'A 6–7 hour trip — wear comfortable shoes for the open sites. No tour guide — private driver transportation only.',
  },
  kokino: {
    slug: 'kokino',
    tag: 'Heritage Tour',
    title: 'Kokino Megalithic Observatory — Bronze Age Astronomy',
    description:
      "Visit one of the world's oldest astronomical observatories, ranked 4th by NASA — a breathtaking Bronze Age site 90 km from Skopje.",
    price: 120,
    duration: '4–5 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-kokino.png',
    alt: 'Kokino megalithic observatory rock formations on a mountain plateau',
    about:
      'Kokino is a 3,800-year-old megalithic observatory that NASA ranked among the oldest in the world. Set on a volcanic hilltop about 90 km from Skopje, its carved stone markers were used by Bronze Age people to track the sun and moon. The views over the surrounding valleys are unforgettable — a short, scenic drive with a genuine sense of discovery.',
    highlights: [
      'One of the world\u2019s oldest observatories (ranked 4th by NASA)',
      'Bronze Age stone thrones and celestial markers',
      'Panoramic views over the northern Macedonian countryside',
      'A relaxed half-day, great alongside another trip',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Comfortable start from ~9:00 AM' },
      { title: 'Scenic drive to Kokino', text: 'About 90 km north through the Kumanovo region' },
      { title: 'Short hike to the summit', text: 'Gentle ~20 min uphill walk' },
      { title: 'The megalithic observatory', text: '3,800-year-old stone thrones and celestial markers' },
      { title: 'Panoramic viewpoint', text: 'Views over the northern Macedonian countryside' },
      { title: 'Drop-off — Return to Skopje', text: 'Arrives back in the early afternoon' },
    ],
    important:
      'A 4–5 hour half-day trip — bring a light jacket for the exposed plateau. No tour guide — private driver transportation only.',
  },
  ohrid: {
    slug: 'ohrid',
    tag: 'Transfer',
    title: 'Skopje to Ohrid — Private Transfer & Day Trip',
    description:
      "Discover Ohrid's UNESCO heritage, Byzantine churches and one of Europe's oldest lakes on a fully private day trip with a professional driver.",
    price: 200,
    duration: '10–12 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-ohrid.png',
    alt: 'Lake Ohrid with the Church of St. John at Kaneo',
    about:
      'Ohrid is the jewel of Macedonia — a UNESCO World Heritage town on the shore of one of the oldest and deepest lakes in Europe, over three million years old. Wander the cobbled old town, visit the iconic Church of St. John at Kaneo perched above the water, explore the hilltop Samuel\u2019s Fortress and the ancient theatre, and enjoy free time by the lake. Your private driver handles the scenic ~170 km journey each way so you can simply relax and take it in.',
    highlights: [
      'UNESCO-listed old town and lakefront',
      'Church of St. John at Kaneo — the postcard view of Ohrid',
      'Samuel\u2019s Fortress and the ancient Roman theatre',
      'Free time to swim, stroll or enjoy a lakeside lunch',
      'Comfortable private transfer both ways — no crowds, your schedule',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Comfortable start from ~8:00 AM' },
      { title: 'Scenic drive to Ohrid', text: 'Relaxed ~2h45 drive across North Macedonia' },
      { title: 'Ohrid Old Town & Bazaar', text: 'Cobbled streets, cafés and the lakeside promenade' },
      { title: 'Church of St. John at Kaneo', text: 'The iconic cliffside church above the lake' },
      { title: "Samuel's Fortress & Ancient Theatre", text: 'Panoramic views over Lake Ohrid' },
      { title: 'Free time by the lake', text: 'Optional boat ride and lunch (own arrangement)' },
      { title: 'Drop-off — Return to Skopje', text: 'Arrives back in the evening' },
    ],
    important:
      'A full-day trip (~10–12 hours), about 2h45 drive each way. No tour guide — private driver transportation only.',
  },
  'matka-village-panteleimon': {
    slug: 'matka-village-panteleimon',
    tag: 'Day Tour',
    title: 'Matka Canyon & Macedonian Village, Saint Panteleimon',
    description:
      'The 12th-century Church of St. Panteleimon, an authentic Macedonian village, and free time at the stunning Matka Canyon.',
    price: 80,
    duration: '~5 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-matka-village.png',
    alt: 'Stone houses of a traditional Macedonian village below a hillside church',
    about:
      'A slower, more local take on the Matka area. Start high above Skopje at the Church of St. Panteleimon, whose 1164 frescoes are among the most important in Byzantine art, then wind down to the village of Gorno Nerezi — stone houses, quiet lanes and a village café for Turkish coffee. Finish at Matka Canyon with free time for a walk along the water or a boat ride.',
    highlights: [
      'St. Panteleimon frescoes — a milestone of Byzantine painting',
      'Stroll through the authentic village of Gorno Nerezi',
      'Coffee or homemade lunch at a village café',
      'Free time at Matka Canyon, optional boat ride',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Start any time from ~9:00 AM' },
      { title: 'Church of St. Panteleimon', text: '12th-century church with views over the city' },
      { title: 'Gorno Nerezi village', text: 'Old stone houses and a slow village stroll' },
      { title: 'Matka Canyon', text: 'Free time by the emerald lake' },
      { title: 'Drop-off — Return to Skopje', text: 'Back in the early afternoon' },
    ],
    important:
      'A relaxed ~5-hour trip. Church entrance and boat ride are paid on site. No tour guide — private driver transportation only.',
  },
  'matka-self-guided': {
    slug: 'matka-self-guided',
    tag: 'Nature Tour',
    title: 'Matka Canyon Day Trip from Skopje (Self-Guided)',
    description:
      'A short drive to Matka Canyon for a scenic boat ride to Vrelo Cave and relaxed time by the lake.',
    price: 60,
    duration: '~3 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-matka-boat.png',
    alt: 'Boat approaching a cave entrance on emerald water in Matka Canyon',
    about:
      'The quickest way to see Matka. Your driver takes you the 25-minute drive from Skopje, waits while you explore at your own pace, then brings you straight back. Take the boat to Vrelo Cave with its stalactite halls, walk the cliffside trail to St. Andrew\u2019s Monastery, or simply sit with a drink on the water.',
    highlights: [
      'Only 25 minutes from Skopje',
      'Boat ride into Vrelo Cave',
      'Cliffside walk to St. Andrew\u2019s Monastery (1389)',
      'Driver waits — explore at your own pace',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Any time that suits you' },
      { title: 'Arrive at Matka Canyon', text: 'Short scenic drive west of the city' },
      { title: 'Boat ride to Vrelo Cave', text: 'Around 40 minutes return (paid on site)' },
      { title: 'Free time by the lake', text: 'Walk, kayak or relax at the café' },
      { title: 'Drop-off — Return to Skopje', text: 'About 3 hours after pickup' },
    ],
    important:
      'Perfect for a short layover or a half-free day. Boat and kayak are paid on site. No tour guide — private driver transportation only.',
  },
  'kosovo-pristina-prizren': {
    slug: 'kosovo-pristina-prizren',
    tag: 'Balkan Tour',
    title: 'Kosovo Day Trip from Skopje: Pristina & Prizren',
    description:
      'A full private day trip to Kosovo — free time to explore the capital Pristina and the beautiful Ottoman old town of Prizren.',
    price: 180,
    duration: '8–10 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-prizren.png',
    alt: 'Prizren old town with an Ottoman stone bridge and mosque minaret',
    about:
      'Two cities in another country, in one day. Cross into Kosovo to Pristina — see the Newborn monument, the National Library\u2019s striking domes and the lively Mother Teresa boulevard. Then continue to Prizren, the country\u2019s cultural capital, with its Ottoman stone bridge, Sinan Pasha Mosque and a climb to the fortress for views over the red roofs.',
    highlights: [
      'Two Kosovo highlights in one day',
      'Newborn monument and the National Library in Pristina',
      'Ottoman old town and stone bridge in Prizren',
      'Fortress viewpoint over the red roofs',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Early start from ~8:00 AM' },
      { title: 'Border crossing', text: 'Blace / Hani i Elezit, usually quick' },
      { title: 'Pristina', text: 'Free time in the city centre' },
      { title: 'Prizren', text: 'Old town, bridge, mosque and fortress' },
      { title: 'Drop-off — Return to Skopje', text: 'Back in the evening' },
    ],
    important:
      'Bring your passport or ID card — you cross an international border. Check that your nationality can enter Kosovo. No tour guide — private driver transportation only.',
  },
  'bigorski-mavrovo-naum': {
    slug: 'bigorski-mavrovo-naum',
    tag: 'Day Tour',
    title: 'Bigorski Monastery, Mavrovo – St. Nicholas & Ohrid St. Naum',
    description:
      'A full private day west: Mavrovo Lake and its submerged church, the stunning Bigorski Monastery, and St. Naum on Lake Ohrid.',
    price: 240,
    duration: '~12 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-mavrovo.png',
    alt: 'Half-submerged church of St. Nicholas in Mavrovo Lake',
    about:
      'The great western loop through Mavrovo National Park. Stop at the half-flooded Church of St. Nicholas rising from Mavrovo Lake, continue down the Radika gorge to Bigorski Monastery and its legendary carved iconostasis, then drive on to the southern tip of Lake Ohrid for the springs and peacocks of St. Naum.',
    highlights: [
      'Submerged Church of St. Nicholas on Mavrovo Lake',
      'Bigorski Monastery and its carved walnut iconostasis',
      'Scenic Radika river gorge',
      'St. Naum Monastery and the Black Drin springs',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Early start from ~7:30 AM' },
      { title: 'Mavrovo Lake', text: 'Church of St. Nicholas and the lakeshore' },
      { title: 'Bigorski Monastery', text: '11th-century monastery in the Radika gorge' },
      { title: 'St. Naum, Lake Ohrid', text: 'Monastery, springs and optional boat ride' },
      { title: 'Drop-off — Return to Skopje', text: 'Back late in the evening' },
    ],
    important:
      'A long ~12-hour day with mountain roads — bring a jacket for Mavrovo. Modest dress at the monasteries. No tour guide — private driver transportation only.',
  },
  'tetovo-ohrid-bitola': {
    slug: 'tetovo-ohrid-bitola',
    tag: 'Full-Day Tour',
    title: 'Skopje to Tetovo, Ohrid & Bitola | Full-Day Tour',
    description:
      "The famous Painted Mosque of Tetovo, free time in UNESCO Ohrid, and an evening stroll down Bitola's Shirok Sokak.",
    price: 240,
    duration: '~12 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-tetovo.png',
    alt: 'Colourful painted walls of the Painted Mosque in Tetovo',
    about:
      'Three cities, three characters. Begin in Tetovo at the Šarena Džamija — the Painted Mosque covered in floral panels. Spend the middle of the day in Ohrid\u2019s old town and on the lake, then finish in Bitola, the "city of consuls", walking the café-lined Shirok Sokak as the evening comes alive.',
    highlights: [
      'Painted Mosque of Tetovo (Šarena Džamija)',
      'Free time in UNESCO-listed Ohrid',
      "Evening on Bitola's Shirok Sokak promenade",
      'Private ride for up to 4 passengers',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Early start from ~7:30 AM' },
      { title: 'Tetovo', text: 'Painted Mosque and the old Ottoman quarter' },
      { title: 'Ohrid', text: 'Old town, St. John at Kaneo and the lakefront' },
      { title: 'Bitola', text: 'Shirok Sokak, clock tower and old bazaar' },
      { title: 'Drop-off — Return to Skopje', text: 'Back late in the evening' },
    ],
    important:
      'A long ~12-hour day. Modest dress for the mosque. Maximum 4 passengers per booking. No tour guide — private driver transportation only.',
  },
  'tetovo-ohrid-naum': {
    slug: 'tetovo-ohrid-naum',
    tag: 'Full-Day Tour',
    title: 'Skopje to Tetovo, Ohrid & Saint Naum | Full-Day Tour',
    description:
      'The Painted Mosque of Tetovo, UNESCO Ohrid old town, and the crystal springs of Saint Naum Monastery.',
    price: 240,
    duration: '~12 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-naum.png',
    alt: 'Saint Naum Monastery beside turquoise spring water on Lake Ohrid',
    about:
      'The lake lover\u2019s version of the western day. After the Painted Mosque in Tetovo, enjoy Ohrid\u2019s old town, then follow the shoreline south to St. Naum — a 10th-century monastery where peacocks roam and a rowboat glides you through the clear springs that feed the lake.',
    highlights: [
      'Painted Mosque of Tetovo',
      'Ohrid old town and the lakeside promenade',
      'St. Naum Monastery and its peacock gardens',
      'Rowboat ride on the crystal Black Drin springs',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Early start from ~7:30 AM' },
      { title: 'Tetovo', text: 'Painted Mosque stop' },
      { title: 'Ohrid', text: 'Free time in the old town' },
      { title: 'St. Naum', text: 'Monastery, springs and optional rowboat' },
      { title: 'Drop-off — Return to Skopje', text: 'Back late in the evening' },
    ],
    important:
      'A long ~12-hour day. Rowboat at St. Naum is paid on site. Maximum 4 passengers per booking. No tour guide — private driver transportation only.',
  },
  'autumn-mavrovo': {
    slug: 'autumn-mavrovo',
    tag: 'Autumn Tour',
    title: 'Autumn Colours — Mavrovo National Park & Galičnik',
    description:
      'A seasonal day trip through golden beech forests, Mavrovo Lake and the mountain village of Galičnik when the park is at its most colourful.',
    price: 150,
    duration: '~8 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-autumn.png',
    alt: 'Golden and red autumn forests around Mavrovo Lake in North Macedonia',
    about:
      'From October to early November, Mavrovo National Park turns gold, orange and red. Drive through the Radika valley with stops at scenic viewpoints, walk the shore of Mavrovo Lake to the half-submerged Church of St. Nicholas, and climb to Galičnik, a stone village high in the mountains known for its traditional architecture. Finish with a warm lunch of local cheese, lamb and mountain tea before the drive back to Skopje.',
    highlights: [
      'Peak autumn foliage in Mavrovo National Park',
      'Half-submerged Church of St. Nicholas on Mavrovo Lake',
      'Traditional stone village of Galičnik on the mountain',
      'Photo stops along the Radika river gorge',
      'Warm mountain lunch with local specialities',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Comfortable start from ~8:30 AM' },
      { title: 'Scenic drive west', text: 'About 1h30 through the Polog valley into the park' },
      { title: 'Mavrovo Lake & St. Nicholas', text: 'Lakeside walk among the autumn colours' },
      { title: 'Radika gorge viewpoints', text: 'Photo stops along the river' },
      { title: 'Galičnik village', text: 'Stone houses and mountain views' },
      { title: 'Mountain lunch', text: 'Local cheese, lamb and mountain tea (own arrangement)' },
      { title: 'Drop-off — Return to Skopje', text: 'Arrives back in the late afternoon' },
    ],
    important:
      'Seasonal tour, best from October to early November. It can be cold in the mountains, so bring warm layers and comfortable shoes. No tour guide — private driver transportation only.',
  },
  'autumn-kratovo-kuklica': {
    slug: 'autumn-kratovo-kuklica',
    tag: 'Autumn Tour',
    title: 'Autumn in Kratovo & the Stone Dolls of Kuklica',
    description:
      'A relaxed private day to the old crater-town of Kratovo and the surreal Kuklica stone dolls, framed by golden autumn hills. No hiking, everything is reached by car.',
    price: 220,
    duration: '6–8 hours',
    pax: 'Up to 4 passengers',
    image: '/images/tour-kratovo-kuklica.png',
    alt: 'Kuklica stone doll rock formations surrounded by golden autumn trees near Kratovo',
    about:
      'Kratovo sits inside the crater of an extinct volcano, with medieval stone bridges over its river and old Ottoman defence towers rising between the houses. In autumn the hills around the town turn amber and rust, which makes it a calm, cosy place to wander and stop for a Turkish coffee. Nearby, the Kuklica valley holds more than a hundred natural rock pillars. Local legend says they are a wedding party turned to stone. In the low autumn light the formations glow warm and brown, perfect for photos. It is an easy day: no hiking, short walks only, and everything is reached by car.',
    highlights: [
      'Kratovo, an old town built inside a volcanic crater',
      'Medieval stone bridges and Ottoman defence towers',
      'Kuklica, over 100 natural "stone doll" rock pillars',
      'The local legend of the petrified wedding party',
      'Golden autumn hills and soft light for photos',
      'Easy day, no hiking, everything reached by car',
    ],
    itinerary: [
      { title: 'Pickup — Your location in Skopje', text: 'Departure around 8:30 AM' },
      { title: 'Autumn drive northeast', text: 'About 110 km, ~1h45 through the colouring hills' },
      { title: 'Kratovo old town', text: 'Stone bridges, Ottoman towers and a coffee break' },
      { title: 'Kuklica — the Stone Dolls', text: 'Short walk among the rock formations and the local legend' },
      { title: 'Drop-off — Return to Skopje', text: 'Back between 2:00 and 4:00 PM' },
    ],
    important:
      'Price is per car for up to 4 people. Best from October to early November, bring a warm layer and comfortable shoes. Kuklica entrance fee, if any, is paid on site. No tour guide — private driver transportation only.',
  },
}

export const tourList = Object.values(tours).sort(
  (a, b) => Number(autumnTourSlugs.has(b.slug)) - Number(autumnTourSlugs.has(a.slug)),
)

export { transfers, getTransfer, type Transfer } from './transfers'
