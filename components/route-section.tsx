import { ArrowRight } from 'lucide-react'
import { JourneyMap } from '@/components/journey-map'
import { toStops } from '@/lib/route-places'

export function RouteSection({ title = 'Your route', stopNames }: { title?: string; stopNames: string[] }) {
  const stops = toStops(stopNames)
  if (stops.length < 2) return null

  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-semibold text-foreground">{title}</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <JourneyMap stops={stops} className="h-[300px] md:h-[380px]" />
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-border px-4 py-3 text-sm font-medium text-foreground">
          {stops.map((stop, index) => (
            <li key={stop.name} className="inline-flex items-center gap-2">
              {index > 0 && <ArrowRight className="size-3.5 text-gold" aria-hidden="true" />}
              {stop.name}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
