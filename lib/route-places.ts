export type LatLng = [number, number]

export type RouteStop = { name: string; position: LatLng }

export const places: Record<string, LatLng> = {
  'Skopje Airport': [41.9616, 21.6214],
  'Skopje City': [41.9973, 21.428],
  Skopje: [41.9973, 21.428],
  Pristina: [42.6629, 21.1655],
  Bitola: [41.0297, 21.3292],
  Ohrid: [41.1231, 20.8016],
  Sofia: [42.6977, 23.3219],
  Thessaloniki: [40.6401, 22.9444],
  Tirana: [41.3275, 19.8187],
  Belgrade: [44.7866, 20.4489],
  Ferizaj: [42.3702, 21.1553],
  'Niš': [43.3209, 21.8958],
  Athens: [37.9838, 23.7275],
  Podgorica: [42.4304, 19.2594],
  'Millennium Cross': [41.9645, 21.394],
  'St. Panteleimon': [41.9789, 21.3905],
  'Matka Canyon': [41.953, 21.298],
  Stobi: [41.5526, 21.975],
  'Heraclea Lyncestis': [41.0108, 21.3427],
  Kokino: [42.2636, 21.9536],
}

export const tourStops: Record<string, string[]> = {
  matka: ['Skopje', 'Millennium Cross', 'St. Panteleimon', 'Matka Canyon'],
  stobi: ['Skopje', 'Stobi', 'Heraclea Lyncestis'],
  kokino: ['Skopje', 'Kokino'],
  ohrid: ['Skopje', 'Ohrid'],
}

export function toStops(names: string[]): RouteStop[] {
  return names.filter((name) => places[name]).map((name) => ({ name, position: places[name] }))
}
