export type RouteStep = {
  title: string
  text: string
}

export type Transfer = {
  slug: string
  route: string
  from: string
  to: string
  price: number
  distance: string
  duration: string
  tag: string
  image: string
  alt: string
  description: string
  about: string[]
  highlights: string[]
  journey: RouteStep[]
  important: string
  goodToKnow: string[]
}

export const transfers: Transfer[] = [
  {
    slug: 'skopje-airport-city',
    route: 'Skopje Airport – Skopje City',
    from: 'Skopje Airport',
    to: 'Skopje City',
    price: 30,
    distance: '21 km',
    duration: '20–30 min',
    tag: 'Meet & greet',
    image: '/images/transfer-airport.png',
    alt: 'Black Ford Mondeo waiting outside the departures entrance of Skopje International Airport at dusk',
    description:
      'Land, walk out and find your driver holding a sign with your name. We watch your flight, so an early or late landing never costs you extra.',
    about: [
      'The first half hour after a flight should be the easiest part of your trip. Instead of queueing for a taxi or bargaining over the fare, you walk into the arrivals hall and your driver is already there, sign in hand, ready to help with your bags.',
      'Skopje International Airport sits about 21 km east of the centre. The ride takes most of our guests 20 to 30 minutes along the highway, straight to the door of your hotel, apartment or any address in the city. Heading back to fly out? We pick you up at your door and time it around your departure.',
    ],
    highlights: [
      'Personal name-sign greeting inside the arrivals hall',
      'Your flight is tracked live, so we adjust to delays automatically',
      '60 minutes of free waiting after you land',
      'One fixed price per car, agreed before you travel',
      'Available day and night, every day of the year',
    ],
    journey: [
      { title: 'You land at Skopje Airport', text: 'We track your flight, early or delayed' },
      { title: 'Meet your driver at arrivals', text: 'Name sign just past the exit doors' },
      { title: 'Drive into the city', text: 'Calm 20–30 min highway ride' },
      { title: 'Drop-off — Your address in Skopje', text: 'Right outside your accommodation' },
    ],
    important: 'Send your flight number when booking. 60 minutes of free waiting after landing is included.',
    goodToKnow: [
      'Send us your flight number when booking so we can track it.',
      'Child seats are free, just mention the age of the child.',
      'For early morning departures, book at least a few hours in advance.',
    ],
  },
  {
    slug: 'skopje-pristina',
    route: 'Skopje – Pristina',
    from: 'Skopje',
    to: 'Pristina',
    price: 100,
    distance: '~90 km',
    duration: '~1h 30m',
    tag: 'Border crossing',
    image: '/images/transfer-pristina.png',
    alt: 'Mother Teresa Boulevard in central Pristina at golden hour',
    description:
      'A short, easy hop across the border to Kosovo. Door to door in about an hour and a half, with a driver who does this crossing all the time.',
    about: [
      'Pristina is closer than most people expect. Going by bus usually means a trip to the station, a fixed timetable and a walk at the other end. With a private car, you leave when it suits you and arrive right where you need to be, whether that is a hotel, an office or Pristina Airport.',
      'The route heads north through Blace, the main crossing between North Macedonia and Kosovo. Our drivers know the checkpoint well and will tell you exactly what to have ready, so the stop is quick and stress-free.',
    ],
    highlights: [
      'Pickup from any address in Skopje or Skopje Airport',
      'Drop-off anywhere in Pristina, including Pristina Airport',
      'Experienced drivers who cross this border regularly',
      'No timetables. Choose your own departure time',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'At the time you choose' },
      { title: 'Blace border crossing', text: 'About 30 min north — passport or ID ready' },
      { title: 'Drive through Kosovo', text: 'Smooth highway toward the capital' },
      { title: 'Drop-off — Your address in Pristina', text: 'About 1h 30m after departure' },
    ],
    important: 'Bring a valid passport or national ID accepted by Kosovo. Border waits can vary on holidays and weekends.',
    goodToKnow: [
      'Bring a valid passport or national ID card accepted by Kosovo.',
      'Waiting times at the border can vary during holidays and weekends.',
      'Return trips can be booked for the same day or any later date.',
    ],
  },
  {
    slug: 'skopje-bitola',
    route: 'Skopje – Bitola',
    from: 'Skopje',
    to: 'Bitola',
    price: 130,
    distance: '~170 km',
    duration: '~2h',
    tag: 'Domestic',
    image: '/images/transfer-bitola.png',
    alt: 'Colourful old facades along Shirok Sokak street in Bitola',
    description:
      'Head south to Bitola, the city of consuls, cafes and old-world charm. A comfortable two-hour ride with no changes and no waiting at stations.',
    about: [
      'Bitola has a relaxed, elegant feel all of its own. Its main street, Shirok Sokak, is lined with pastel-coloured buildings from the days when foreign consulates filled the city, and just outside town lie the ruins of Heraclea Lyncestis.',
      'The drive from Skopje follows the highway south and then climbs gently through green hills and farmland. It is a pleasant, easy journey, and your driver is happy to make a coffee stop or a short detour on the way if you ask.',
    ],
    highlights: [
      'Direct ride with no bus changes or connections',
      'Scenic route through central Macedonia',
      'Optional stop at Heraclea Lyncestis on arrival',
      'Great starting point for Pelister National Park',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Door or airport pickup, heading south' },
      { title: 'Coffee break on request', text: 'Halfway stop at a roadside café' },
      { title: 'Into the Pelagonia valley', text: 'Mount Pelister rising behind the city' },
      { title: 'Drop-off — Your address in Bitola', text: 'About 2 hours after departure' },
    ],
    important: 'No border crossing — your usual ID is all you need.',
    goodToKnow: [
      'No border crossing, so no documents are needed beyond your usual ID.',
      'You can combine this ride with a visit to Heraclea for a small extra fee.',
      'Ideal if you are continuing on to Prespa Lake or Greece.',
    ],
  },
  {
    slug: 'skopje-ohrid',
    route: 'Skopje – Ohrid',
    from: 'Skopje',
    to: 'Ohrid',
    price: 140,
    distance: '~170 km',
    duration: '~2h 30m',
    tag: 'Most popular',
    image: '/images/tour-ohrid.png',
    alt: 'Church of St. John at Kaneo above the blue water of Lake Ohrid',
    description:
      'Our guests book this ride more than any other. Leave Skopje behind and be sitting by the clear water of Lake Ohrid in about two and a half hours.',
    about: [
      'Ohrid is the place almost every visitor to Macedonia wants to see. Its old town climbs a hillside above a vast, crystal-clear lake, with Byzantine churches, cobbled lanes and waterfront cafes at every turn.',
      'The drive winds west through mountains and forests, passing the towns of Tetovo, Gostivar and Kichevo. It is one of the prettiest roads in the country, and a private car means you can stop for photos whenever the view catches your eye.',
    ],
    highlights: [
      'The most scenic road trip in the country',
      'Hotel-to-hotel with no bus station in between',
      'Photo stops along the mountain pass on request',
      'Can be turned into a full day trip with a return the same evening',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Door or airport pickup, heading west' },
      { title: 'Past Tetovo and Gostivar', text: 'Along the Polog valley and the Shar mountains' },
      { title: 'Over the mountains', text: 'Winding forest road — great for a photo stop' },
      { title: 'Drop-off — Your hotel in Ohrid', text: 'About 2h 30m after departure' },
    ],
    important: 'Summer is busy — book early for July and August.',
    goodToKnow: [
      'Summer is busy, so book early in July and August.',
      'Want to see Ohrid in a single day? Check our Ohrid day trip.',
      'We can also take you on to Struga or St. Naum.',
    ],
  },
  {
    slug: 'skopje-sofia',
    route: 'Skopje – Sofia',
    from: 'Skopje',
    to: 'Sofia',
    price: 180,
    distance: '~240 km',
    duration: '~3h 30m',
    tag: 'Border crossing',
    image: '/images/transfer-sofia.png',
    alt: 'Golden domes of Alexander Nevsky Cathedral in Sofia with Vitosha behind',
    description:
      'Reach the Bulgarian capital without juggling bus times or connections. We take you from your door in Skopje to your hotel or flight in Sofia.',
    about: [
      'Sofia is only a few hours east, but public transport between the two capitals is limited and often slow. Travelling by private car is the easy answer, especially if you have a flight to catch from Sofia Airport.',
      'The road passes through Kumanovo and Kriva Palanka before crossing into Bulgaria at Deve Bair, then drops down through the hills of Kyustendil toward the capital. It is a green, peaceful route, and we are happy to stop wherever you like along the way.',
    ],
    highlights: [
      'Direct drop-off at Sofia Airport or any address in the city',
      'Relaxed departure times to match your flight',
      'Drivers familiar with the Deve Bair border crossing',
      'Rest stops whenever you need them',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'At the agreed time, heading northeast' },
      { title: 'Through Kriva Palanka', text: 'Mountain stretch near Osogovo Monastery' },
      { title: 'Deve Bair border crossing', text: 'Passport or ID ready for both sides' },
      { title: 'Drop-off — Your address in Sofia', text: 'Hotel, apartment or airport terminal' },
    ],
    important: 'Bulgaria is in the EU — check your entry rules. Allow extra time if you are catching a flight.',
    goodToKnow: [
      'Bulgaria is in the EU, so check your entry rules before travelling.',
      'For flights, allow enough time for the border and city traffic.',
      'Pickups from Sofia back to Skopje are also available.',
    ],
  },
  {
    slug: 'skopje-thessaloniki',
    route: 'Skopje – Thessaloniki',
    from: 'Skopje',
    to: 'Thessaloniki',
    price: 185,
    distance: '~230 km',
    duration: '~3h',
    tag: 'Border crossing',
    image: '/images/transfer-thessaloniki.png',
    alt: 'White Tower on the seafront promenade of Thessaloniki at sunset',
    description:
      'From the mountains to the Aegean in about three hours. Perfect for catching a flight from Thessaloniki or starting a summer beach holiday.',
    about: [
      'Thessaloniki is the gateway to northern Greece, with a lively seafront, great food and an international airport with plenty of low-cost flights. Many of our guests use this ride to fly out of Greece, or to head on to the beaches of Halkidiki.',
      'The route follows the Vardar river south through Veles and Gevgelija, crossing into Greece at Bogorodica. From there, it is a short and straightforward run down the highway to the coast.',
    ],
    highlights: [
      'Drop-off at Thessaloniki Airport or anywhere in the city',
      'Easy onward rides to Halkidiki on request',
      'Straight highway route with a quick border stop',
      'Timed around your flight so you never feel rushed',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Door pickup, heading south' },
      { title: 'Along the Vardar valley', text: 'Past Veles and the Demir Kapija vineyards' },
      { title: 'Bogorodica border crossing', text: 'Passport or ID ready for Greece' },
      { title: 'Drop-off — Your address in Thessaloniki', text: 'Hotel, port or airport, about 3h after departure' },
    ],
    important: 'Summer weekends can bring longer border queues — leave extra time for flights.',
    goodToKnow: [
      'Summer weekends can bring longer queues at the border.',
      'Leave plenty of extra time if you are catching a flight.',
      'Ask us about prices for Halkidiki and other Greek destinations.',
    ],
  },
  {
    slug: 'skopje-tirana',
    route: 'Skopje – Tirana',
    from: 'Skopje',
    to: 'Tirana',
    price: 250,
    distance: '~290 km',
    duration: '~3h 30m',
    tag: 'Border crossing',
    image: '/images/transfer-tirana.png',
    alt: 'Skanderbeg Square in central Tirana with mountains in the distance',
    description:
      'A beautiful mountain journey to the heart of Albania. Sit back and enjoy the views while we handle the road, the border and the city traffic.',
    about: [
      'Tirana is a bright, energetic capital full of colourful buildings, busy cafes and a growing food scene. Getting there by public transport can take a long time, so a private car is by far the most comfortable way to go.',
      'The road passes Tetovo and Gostivar, then crosses into Albania near Lake Ohrid before winding down through the mountains to the capital. It is one of the most dramatic drives in the Balkans, and there are plenty of great spots for a break on the way.',
    ],
    highlights: [
      'Door-to-door to any address in Tirana or Tirana Airport',
      'Spectacular mountain scenery for much of the route',
      'Optional stop by Lake Ohrid or in Elbasan',
      'Drivers who know the roads and the border well',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Door or airport pickup, heading west' },
      { title: 'Toward Lake Ohrid', text: 'Scenic western Macedonia, coffee stop if you like' },
      { title: 'Albanian border', text: 'Short passport check' },
      { title: 'Drop-off — Your address in Tirana', text: 'About 3h 30m after departure' },
    ],
    important: 'Bring a passport or ID accepted by Albania. Mountain roads are winding — tell us if you get car sick.',
    goodToKnow: [
      'Bring a valid passport or an ID card accepted by Albania.',
      'The mountain roads are winding, so let us know if you get car sick.',
      'We can also go to Durres or the Albanian coast on request.',
    ],
  },
  {
    slug: 'skopje-belgrade',
    route: 'Skopje – Belgrade',
    from: 'Skopje',
    to: 'Belgrade',
    price: 300,
    distance: '~430 km',
    duration: '~5h',
    tag: 'Border crossing',
    image: '/images/transfer-belgrade.png',
    alt: 'Kalemegdan fortress above the meeting of the Sava and Danube rivers in Belgrade',
    description:
      'Our longest regular route, made easy. A private car all the way to Belgrade, with breaks whenever you want them and one clear price up front.',
    about: [
      'Belgrade is a big, buzzing city on the meeting point of two great rivers, famous for its nightlife, its fortress and its food. It is a long way from Skopje, which is exactly why the journey is worth doing in comfort.',
      'Almost the whole route is motorway, running north through Kumanovo, over the border at Tabanovce and up through the length of southern and central Serbia. We plan in regular breaks, and you are free to ask for more at any time.',
    ],
    highlights: [
      'Motorway almost the whole way for a smooth ride',
      'Rest and meal stops built into the journey',
      'Drop-off anywhere in Belgrade or at the airport',
      'Wi-Fi and water on board for the long stretch',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Heading north out of the city' },
      { title: 'Tabanovce border crossing', text: 'About 40 min in — passport or ID ready' },
      { title: 'North through Serbia', text: 'Motorway past Niš with a lunch or coffee break' },
      { title: 'Drop-off — Your address in Belgrade', text: 'Hotel, address or airport, about 5h after departure' },
    ],
    important: 'A long ~5-hour ride with regular breaks. Motorway tolls are included in the price.',
    goodToKnow: [
      'Motorway tolls are already included in the price.',
      'Let us know if you want to stop in Niš for a proper meal.',
      'Return trips from Belgrade to Skopje can be booked the same way.',
    ],
  },
  {
    slug: 'skopje-airport-matka',
    route: 'Skopje Airport – Matka',
    from: 'Skopje Airport',
    to: 'Matka Canyon',
    price: 55,
    distance: '~40 km',
    duration: '~45 min',
    tag: 'Meet & greet',
    image: '/images/tour-matka.png',
    alt: 'Emerald water of Matka Canyon between steep limestone cliffs',
    description:
      'Go straight from your flight to the emerald water of Matka Canyon. Your driver meets you at arrivals and takes you right to the lake.',
    about: [
      'Matka Canyon is one of the most loved natural spots near Skopje, with steep cliffs, a calm green lake, medieval monasteries and boat trips to the Vrelo cave. Many guests stay at the hotel by the dam or simply want to start their trip with nature.',
      'From the airport the drive skirts around Skopje and heads southwest into the canyon. It takes about 45 minutes, and your driver will drop you as close to the lake as the road allows.',
    ],
    highlights: [
      'Personal name-sign greeting inside the arrivals hall',
      'Your flight is tracked live, so delays are no problem',
      'Drop-off by the lake, the dam or your accommodation',
      'Return pickups from Matka can be booked too',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'You land at Skopje Airport', text: 'We track your flight, early or delayed' },
      { title: 'Meet your driver at arrivals', text: 'Name sign just past the exit doors' },
      { title: 'Around Skopje', text: 'Ring road toward the southwest' },
      { title: 'Drop-off — Matka Canyon', text: 'About 45 min after you leave the airport' },
    ],
    important: 'Send your flight number when booking. 60 minutes of free waiting after landing is included.',
    goodToKnow: [
      'Boat rides and kayaks can be hired at the lake.',
      'Bring comfortable shoes for the canyon paths.',
      'Want a guided visit instead? Check our Matka day trip.',
    ],
  },
  {
    slug: 'ohrid-skopje',
    route: 'Ohrid – Skopje',
    from: 'Ohrid',
    to: 'Skopje',
    price: 140,
    distance: '~170 km',
    duration: '~2h 30m',
    tag: 'Domestic',
    image: '/images/transfer-skopje.png',
    alt: 'Stone Bridge over the Vardar river in Skopje with the fortress behind',
    description:
      'Heading back from the lake? We pick you up at your hotel in Ohrid and take you to any address in Skopje or straight to Skopje Airport.',
    about: [
      'After a few days by Lake Ohrid, the last thing you want is a long bus journey with a heavy suitcase. We collect you from your door in Ohrid, Struga or St. Naum and drive you back east in comfort.',
      'The road winds through Kichevo, Gostivar and Tetovo before joining the highway into Skopje. If you have a flight, we time the pickup so you reach Skopje Airport with plenty of time to spare.',
    ],
    highlights: [
      'Pickup from any hotel in Ohrid, Struga or St. Naum',
      'Direct drop-off at Skopje Airport for your flight',
      'Photo stops along the mountain road on request',
      'No bus station, no luggage hassle',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your hotel in Ohrid', text: 'At the time that suits you or your flight' },
      { title: 'Over the mountains', text: 'Forest road past Kichevo' },
      { title: 'Past Gostivar and Tetovo', text: 'Onto the highway toward the capital' },
      { title: 'Drop-off — Skopje or Skopje Airport', text: 'About 2h 30m after departure' },
    ],
    important: 'Catching a flight? Tell us the departure time and we will plan the pickup around it.',
    goodToKnow: [
      'No border crossing, so your usual ID is enough.',
      'For early flights, book the evening before at the latest.',
      'Child seats are free, just mention the age of the child.',
    ],
  },
  {
    slug: 'skopje-ferizaj',
    route: 'Skopje – Ferizaj',
    from: 'Skopje',
    to: 'Ferizaj',
    price: 80,
    distance: '~60 km',
    duration: '~1h',
    tag: 'Border crossing',
    image: '/images/transfer-ferizaj.png',
    alt: 'Mosque and Orthodox church side by side in the centre of Ferizaj',
    description:
      'The quickest crossing into Kosovo. About an hour from Skopje to Ferizaj, door to door, with a driver who knows the border well.',
    about: [
      'Ferizaj is the first larger town after the border, known for its mosque and church standing side by side in the centre. It is a common destination for family visits and business trips.',
      'The route goes north through the Blace crossing and straight up the highway. With a private car you skip the bus timetables and arrive right at your address.',
    ],
    highlights: [
      'Pickup from any address in Skopje or Skopje Airport',
      'Drop-off anywhere in Ferizaj',
      'Experienced drivers who cross this border regularly',
      'Choose your own departure time',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'At the time you choose' },
      { title: 'Blace border crossing', text: 'About 30 min north — passport or ID ready' },
      { title: 'Into Kosovo', text: 'Short highway stretch' },
      { title: 'Drop-off — Your address in Ferizaj', text: 'About 1 hour after departure' },
    ],
    important: 'Bring a valid passport or national ID accepted by Kosovo.',
    goodToKnow: [
      'Border waits can be longer during summer and holidays.',
      'We can continue on to Prizren or Pristina on request.',
      'Return trips can be booked for any date.',
    ],
  },
  {
    slug: 'skopje-nis',
    route: 'Skopje – Niš',
    from: 'Skopje',
  to: 'Niš',
  price: 160,
    distance: '~200 km',
    duration: '~2h 30m',
    tag: 'Border crossing',
    image: '/images/transfer-nis.png',
    alt: 'Stone gate of Niš Fortress beside the Nišava river',
    description:
      'A smooth motorway ride north to Niš, ideal for catching a low-cost flight from Niš Airport or exploring southern Serbia.',
    about: [
      'Niš is Serbia\u2019s third city, with an Ottoman fortress, lively cafes and an airport served by many budget airlines. Plenty of our guests use this ride to fly out cheaply.',
      'The route is motorway almost all the way, crossing at Tabanovce and running north through Vranje and Leskovac.',
    ],
    highlights: [
      'Drop-off at Niš Airport or anywhere in the city',
      'Motorway almost the whole way',
      'Timed around your flight',
      'Motorway tolls included',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Heading north out of the city' },
      { title: 'Tabanovce border crossing', text: 'Passport or ID ready' },
      { title: 'Past Vranje and Leskovac', text: 'Motorway through southern Serbia' },
      { title: 'Drop-off — Niš or Niš Airport', text: 'About 2h 30m after departure' },
    ],
    important: 'Allow extra time at the border if you have a flight to catch.',
    goodToKnow: [
      'Bring a valid passport or ID accepted by Serbia.',
      'Motorway tolls are already included in the price.',
      'Pickups from Niš back to Skopje are also available.',
    ],
  },
  {
    slug: 'skopje-athens',
    route: 'Skopje – Athens',
    from: 'Skopje',
    to: 'Athens',
    price: 450,
    distance: '~730 km',
    duration: '~7h 30m',
    tag: 'Border crossing',
    image: '/images/transfer-athens.png',
    alt: 'The Acropolis above Athens at sunset',
    description:
      'All the way to the Greek capital in one private car. Long distance, made comfortable, with breaks whenever you need them.',
    about: [
      'Athens is a long journey from Skopje, but in a private car it becomes a relaxed road trip instead of a string of buses and connections. We take you to any hotel in Athens, the port of Piraeus or Athens Airport.',
      'The route runs south through Gevgelija into Greece, past Thessaloniki and along the coast near Mount Olympus before crossing central Greece to the capital.',
    ],
    highlights: [
      'Drop-off at Athens Airport, Piraeus port or any address',
      'Coast views near Mount Olympus',
      'Regular rest and meal stops',
      'Wi-Fi and water on board',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Early start, heading south' },
      { title: 'Bogorodica border crossing', text: 'Passport or ID ready for Greece' },
      { title: 'Past Thessaloniki and Olympus', text: 'Lunch break along the coast' },
      { title: 'Drop-off — Your address in Athens', text: 'About 7h 30m after departure' },
    ],
    important: 'A full-day journey. Greek motorway tolls are included in the price.',
    goodToKnow: [
      'Book a few days in advance for this long route.',
      'Greek motorway tolls are already included.',
      'Tell us about ferry times if you are continuing to the islands.',
    ],
  },
  {
    slug: 'skopje-podgorica',
    route: 'Skopje – Podgorica',
    from: 'Skopje',
    to: 'Podgorica',
    price: 330,
    distance: '~380 km',
    duration: '~6h',
    tag: 'Border crossing',
    image: '/images/transfer-podgorica.png',
    alt: 'Millennium Bridge over the Morača river in Podgorica',
    description:
      'A scenic mountain journey to the capital of Montenegro, with no connections and a driver who handles every border along the way.',
    about: [
      'There is no simple direct public transport from Skopje to Podgorica, which makes a private car the easiest way to go. We take you to any address in the city or to Podgorica Airport.',
      'The route crosses Kosovo and then climbs through the mountains into Montenegro, one of the most beautiful drives in the region.',
    ],
    highlights: [
      'Drop-off anywhere in Podgorica or at the airport',
      'Dramatic mountain scenery',
      'Rest stops whenever you need them',
      'Drivers experienced with all crossings on the route',
      'Fixed price for the whole car, not per person',
    ],
    journey: [
      { title: 'Pickup — Your location in Skopje', text: 'Heading north toward Kosovo' },
      { title: 'Through Kosovo', text: 'Blace crossing and a coffee break' },
      { title: 'Into Montenegro', text: 'Mountain road with stunning views' },
      { title: 'Drop-off — Your address in Podgorica', text: 'About 6 hours after departure' },
    ],
    important: 'The route crosses two borders — bring a valid passport.',
    goodToKnow: [
      'A passport is recommended for this route.',
      'Mountain roads are winding, so let us know if you get car sick.',
      'We can continue to Budva or the coast on request.',
    ],
  },
]

export type PickupPoint = 'airport' | 'city'

export const SKOPJE_AIRPORT_PICKUP = 'Skopje Airport (SKP)'

export const pickupPointLabels: Record<PickupPoint, string> = {
  airport: 'Skopje Airport',
  city: 'Skopje City',
}

export function hasPickupPointChoice(transfer?: Pick<Transfer, 'from'>) {
  return transfer?.from === 'Skopje'
}

export function hasLockedAirportPickup(transfer?: Pick<Transfer, 'from'>) {
  return transfer?.from === 'Skopje Airport'
}

export function getTransfer(slug: string) {
  return transfers.find((transfer) => transfer.slug === slug)
}
