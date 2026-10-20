'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { Car, Map, RotateCcw } from 'lucide-react'
import type { LatLng, RouteStop } from '@/lib/route-places'
import type { RouteMapMode } from '@/components/route-map'
import { cn } from '@/lib/utils'

const RouteMap = dynamic(() => import('@/components/route-map'), {
  ssr: false,
  loading: () => (
    <div className="grid size-full place-items-center bg-[#111318] text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
})

type OsrmResponse = {
  routes?: { geometry: { coordinates: [number, number][] } }[]
}

const fetchRoadPath = async (url: string): Promise<LatLng[]> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Route lookup failed')
  const data: OsrmResponse = await response.json()
  const coordinates = data.routes?.[0]?.geometry.coordinates
  if (!coordinates?.length) throw new Error('No route found')
  return coordinates.map(([lng, lat]) => [lat, lng])
}

const modes: { value: RouteMapMode; label: string; icon: typeof Car }[] = [
  { value: 'drive', label: 'Drive', icon: Car },
  { value: 'overview', label: 'Overview', icon: Map },
]

export function JourneyMap({ stops, className }: { stops: RouteStop[]; className?: string }) {
  const [mode, setMode] = useState<RouteMapMode>('drive')
  const [replayKey, setReplayKey] = useState(0)

  const coordinates = stops.map(({ position: [lat, lng] }) => `${lng},${lat}`).join(';')
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
  const { data: roadPath, isLoading } = useSWR(stops.length > 1 ? osrmUrl : null, fetchRoadPath, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const straightPath = useMemo<LatLng[]>(() => stops.map((stop) => stop.position), [stops])
  const path = roadPath ?? straightPath

  return (
    <div className={cn('relative isolate h-[340px] md:h-[440px]', className)}>
      <RouteMap stops={stops} path={path} isExact={Boolean(roadPath)} mode={mode} replayKey={replayKey} />

      <div className="absolute left-3 top-3 z-[500] flex items-center gap-2">
        <div
          role="group"
          aria-label="Map style"
          className="flex rounded-full border border-border bg-background/85 p-1 shadow-sm backdrop-blur-sm"
        >
          {modes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value)
                setReplayKey((key) => key + 1)
              }}
              aria-pressed={mode === value}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                mode === value ? 'bg-gold text-gold-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        {mode === 'drive' && (
          <button
            type="button"
            onClick={() => setReplayKey((key) => key + 1)}
            aria-label="Replay drive"
            className="grid size-9 place-items-center rounded-full border border-border bg-background/85 text-foreground shadow-sm backdrop-blur-sm transition hover:text-gold"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {isLoading && (
        <span className="absolute left-3 top-16 z-[500] rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          Finding the road…
        </span>
      )}
    </div>
  )
}
