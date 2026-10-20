import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, ArrowRight, MapPinPlus } from 'lucide-react'
import { autumnTourSlugs, tourList } from '@/lib/site'
import { BookedBadge } from '@/components/book-button'

export function Tours() {
  return (
    <section id="tours" className="border-y border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Day trips</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Most Popular Transfer Trips
          </h2>
          <p className="mt-3 text-muted-foreground">
            Private day tours from Skopje — professional driver, flexible schedule, no crowds.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tourList.map((tour) => {
            const autumn = autumnTourSlugs.has(tour.slug)
            return (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${autumn ? 'theme-autumn border-gold/40' : 'border-border'}`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={tour.image || '/placeholder.svg'}
                  alt={tour.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${autumn ? 'bg-gold text-gold-foreground' : 'bg-background/90 text-foreground'}`}>
                  {tour.tag}
                </span>
                <BookedBadge bookingKey={`tour:${tour.slug}`} />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">
                  {tour.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tour.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-gold" aria-hidden="true" /> {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5 text-gold" aria-hidden="true" /> {tour.pax}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="leading-tight">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      From
                    </span>
                    <span className="text-xl font-semibold text-foreground">€{tour.price}</span>
                  </div>
  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-sm transition group-hover:gap-2.5 group-hover:brightness-90">
                    View details <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
            )
          })}

          {/* Request a custom tour */}
          <Link
            href="/reserve?tour=custom"
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gold/40 bg-card/50 p-8 text-center transition hover:border-gold hover:bg-card"
          >
            <span className="grid size-14 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/20 transition group-hover:bg-gold/25">
              <MapPinPlus className="size-7" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Don&apos;t see your trip?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Tell us where you&apos;d like to go and we&apos;ll build a private tour just for you
                — anywhere in Macedonia or beyond.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-base font-semibold text-gold underline-offset-4 transition-all group-hover:gap-2.5 group-hover:underline">
              Request a tour <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
