'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Users, X, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

export function FeaturedTour() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex w-full flex-col items-start gap-6 overflow-hidden rounded-3xl border border-gold/30 bg-secondary/60 p-6 text-left transition hover:border-gold/60 hover:bg-secondary/80 md:flex-row md:items-center md:p-8"
          aria-haspopup="dialog"
        >
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl md:aspect-[4/3] md:w-64">
            <Image
              src="/images/tour-ohrid.png"
              alt="Church of St. John at Kaneo above Lake Ohrid, a UNESCO World Heritage site"
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" /> Featured journey
            </span>
          </div>

          <div className="flex-1">
            <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
              Skopje to Ohrid
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              A private driver to Ohrid — a UNESCO World Heritage city on one of Europe&apos;s oldest
              lakes. Tap to see the full journey.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              View this journey
              <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="featured-tour-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close featured journey"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-gold/30 bg-card shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-foreground/50 text-background backdrop-blur transition hover:bg-foreground/70"
            >
              <X className="size-4" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image
                  src="/images/tour-ohrid.png"
                  alt="Church of St. John at Kaneo above Lake Ohrid, a UNESCO World Heritage site"
                  fill
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                  Private Transfer &amp; Day Trip
                </span>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-gold">
                  Featured journey
                </p>
                <h2
                  id="featured-tour-title"
                  className="mt-2 font-serif text-2xl font-semibold text-foreground md:text-3xl"
                >
                  Skopje to Ohrid
                </h2>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 text-gold" aria-hidden="true" /> ~170 km
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4 text-gold" aria-hidden="true" /> 10–12 hours
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4 text-gold" aria-hidden="true" /> Up to 4 passengers
                  </span>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Experience one of the Balkans&apos; most breathtaking journeys with a private driver
                  from Skopje to Ohrid — a UNESCO World Heritage city on the shores of one of
                  Europe&apos;s oldest lakes. Whether you&apos;re planning a relaxed day trip or a
                  one-way transfer, our professional drivers will get you there comfortably and on
                  time.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gold text-gold-foreground transition hover:brightness-75"
                  >
                    <Link href="/tours/ohrid">View tour details</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    from <span className="text-xl font-semibold text-foreground">€200</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
