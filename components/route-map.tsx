'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Polyline, CircleMarker, Marker, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { Minus, Navigation, Plus } from 'lucide-react'
import type { LatLng, RouteStop } from '@/lib/route-places'
import { mapCities } from '@/lib/map-cities'
import { VectorBaseLayer } from '@/components/vector-base-layer'

export type RouteMapMode = 'drive' | 'overview'

type RouteMapProps = {
  stops: RouteStop[]
  path: LatLng[]
  isExact: boolean
  mode: RouteMapMode
  replayKey: number
}

const FLY_DURATION = 0.9
const ROUTE_COLOR = '#f5c542'
const FIT_OPTIONS = { padding: [56, 56] as [number, number], maxZoom: 12 }

function FitToRoute({ path }: { path: LatLng[] }) {
  const map = useMap()
  useEffect(() => {
    map.flyToBounds(path, { ...FIT_OPTIONS, duration: FLY_DURATION })
  }, [map, path])
  return null
}

function MapControls({ path }: { path: LatLng[] }) {
  const map = useMap()
  const controlRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!controlRef.current) return
    L.DomEvent.disableClickPropagation(controlRef.current)
    L.DomEvent.disableScrollPropagation(controlRef.current)
  }, [])

  const buttonClass =
    'grid size-9 place-items-center text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f5c542]'

  return (
    <div className="leaflet-top leaflet-right">
      <div ref={controlRef} className="leaflet-control route-controls">
        <button type="button" aria-label="Zoom in" className={buttonClass} onClick={() => map.zoomIn()}>
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Zoom out" className={buttonClass} onClick={() => map.zoomOut()}>
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Recenter on route"
          className={buttonClass}
          onClick={() => map.flyToBounds(path, { ...FIT_OPTIONS, duration: 0.6 })}
        >
          <Navigation className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

const cityIcons = new Map(
  mapCities.map((city) => [
    city.name,
    L.divIcon({
      className: 'route-city',
      iconSize: [0, 0],
      html: `<span class="route-city-label">${escapeHtml(city.name)}</span>`,
    }),
  ]),
)

const STOP_OVERLAP_DEGREES = 0.08

function CityLabels({ stops }: { stops: RouteStop[] }) {
  const map = useMap()
  const [zoom, setZoom] = useState(() => map.getZoom())
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) })

  const visibleCities = mapCities.filter(
    (city) =>
      zoom >= city.minZoom &&
      !stops.some(
        (stop) =>
          Math.abs(stop.position[0] - city.position[0]) < STOP_OVERLAP_DEGREES &&
          Math.abs(stop.position[1] - city.position[1]) < STOP_OVERLAP_DEGREES,
      ),
  )

  return (
    <>
      {visibleCities.map((city) => (
        <Marker
          key={city.name}
          position={city.position}
          icon={cityIcons.get(city.name)!}
          interactive={false}
          keyboard={false}
          zIndexOffset={-1000}
        />
      ))}
    </>
  )
}

const planeGlyph = `<path transform="translate(6.5 4.2) scale(0.46)" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" fill="#14171f" stroke="#14171f" stroke-width="1.2" stroke-linejoin="round"/>`
const dotGlyph = `<circle cx="12" cy="9.6" r="3.2" fill="#14171f"/>`

function pinIcon(name: string, isAirport: boolean) {
  return L.divIcon({
    className: 'route-pin',
    iconSize: [30, 38],
    iconAnchor: [15, 36],
    html: `<span class="route-pin-glow" aria-hidden="true"></span><svg class="route-pin-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 1.6c-4.5 0-8.1 3.5-8.1 8 0 5.6 7.1 12 7.4 12.3a1 1 0 0 0 1.4 0c.3-.3 7.4-6.7 7.4-12.3 0-4.5-3.6-8-8.1-8z" fill="${ROUTE_COLOR}"/>${isAirport ? planeGlyph : dotGlyph}</svg><span class="route-pin-label">${escapeHtml(name)}</span>`,
  })
}

function OverviewRoute({ path, isExact }: { path: LatLng[]; isExact: boolean }) {
  const lineRef = useRef<L.Polyline>(null)

  useEffect(() => {
    const element = lineRef.current?.getElement()
    if (!element) return
    element.setAttribute('pathLength', '1')
    element.classList.remove('route-draw')
    void element.getBoundingClientRect()
    element.classList.add('route-draw')
  }, [path])

  return (
    <Polyline
      ref={lineRef}
      positions={path}
      pathOptions={{ color: ROUTE_COLOR, weight: 3.5, opacity: isExact ? 1 : 0.6, lineCap: 'round', lineJoin: 'round' }}
    />
  )
}

const carIcon = L.divIcon({
  className: 'route-car',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  html: `<span class="route-car-badge"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></span>`,
})

function DriveRoute({ path }: { path: LatLng[] }) {
  const trailRef = useRef<L.Polyline>(null)
  const carRef = useRef<L.Marker>(null)

  useEffect(() => {
    const trail = trailRef.current
    const car = carRef.current
    if (!trail || !car || path.length < 2) return

    const cumulative = [0]
    for (let i = 1; i < path.length; i++) {
      const [lat1, lng1] = path[i - 1]
      const [lat2, lng2] = path[i]
      cumulative.push(cumulative[i - 1] + Math.hypot(lat2 - lat1, lng2 - lng1))
    }
    const total = cumulative[cumulative.length - 1]

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      trail.setLatLngs(path)
      car.setLatLng(path[path.length - 1])
      return
    }

    trail.setLatLngs([path[0]])
    car.setLatLng(path[0])

    const duration = Math.min(6000, Math.max(3200, path.length * 4))
    let frame = 0
    let start = 0
    let index = 1

    const step = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const target = eased * total

      while (index < path.length - 1 && cumulative[index] < target) index++
      const segment = cumulative[index] - cumulative[index - 1] || 1
      const ratio = Math.min(1, Math.max(0, (target - cumulative[index - 1]) / segment))
      const [aLat, aLng] = path[index - 1]
      const [bLat, bLng] = path[index]
      const point: LatLng = [aLat + (bLat - aLat) * ratio, aLng + (bLng - aLng) * ratio]

      trail.setLatLngs([...path.slice(0, index), point])
      car.setLatLng(point)

      if (t < 1) frame = requestAnimationFrame(step)
    }

    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(step)
    }, FLY_DURATION * 1000 + 150)

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [path])

  return (
    <>
      <Polyline
        positions={path}
        pathOptions={{ color: ROUTE_COLOR, weight: 2.5, opacity: 0.3, dashArray: '2 7', lineCap: 'round' }}
      />
      <Polyline
        ref={trailRef}
        positions={[path[0]]}
        pathOptions={{ color: ROUTE_COLOR, weight: 3.5, opacity: 1, lineCap: 'round', lineJoin: 'round' }}
      />
      <Marker ref={carRef} position={path[0]} icon={carIcon} zIndexOffset={1000} keyboard={false} interactive={false} />
    </>
  )
}

export default function RouteMap({ stops, path, isExact, mode, replayKey }: RouteMapProps) {
  const routeKey = `${stops.map((stop) => stop.name).join('-')}-${isExact}-${mode}-${replayKey}`

  return (
    <MapContainer
      center={stops[0].position}
      zoom={8}
      scrollWheelZoom={false}
      zoomControl={false}
      className="route-map size-full"
      attributionControl={false}
    >
      <VectorBaseLayer />
      <CityLabels stops={stops} />
      <Polyline
        positions={path}
        pathOptions={{ color: ROUTE_COLOR, weight: 12, opacity: 0.12, lineCap: 'round', lineJoin: 'round' }}
        interactive={false}
      />
      {mode === 'drive' ? (
        <DriveRoute key={routeKey} path={path} />
      ) : (
        <OverviewRoute key={routeKey} path={path} isExact={isExact} />
      )}
      {stops.map((stop, index) => {
        const isEndpoint = index === 0 || index === stops.length - 1
        if (isEndpoint) {
          return (
            <Marker
              key={stop.name}
              position={stop.position}
              icon={pinIcon(stop.name, /airport/i.test(stop.name))}
              title={stop.name}
              keyboard={false}
              zIndexOffset={500}
            />
          )
        }
        return (
          <CircleMarker
            key={stop.name}
            center={stop.position}
            radius={5}
            pathOptions={{ color: '#14171f', weight: 2, fillColor: ROUTE_COLOR, fillOpacity: 1 }}
          >
            <Tooltip direction="right" offset={[8, 0]} className="route-tooltip">
              {stop.name}
            </Tooltip>
          </CircleMarker>
        )
      })}
      <MapControls path={path} />
      <FitToRoute path={path} />
    </MapContainer>
  )
}
