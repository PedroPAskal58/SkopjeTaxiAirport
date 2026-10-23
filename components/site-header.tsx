'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, PlaneTakeoff, ChevronDown, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { nav, tourList, transfers } from '@/lib/site'
import { PlaneIntro } from '@/components/plane-intro'
import { BookingBanner } from '@/components/booking-banner'
import { RejectedToast } from '@/components/rejected-toast'

const PLAY_INTRO_KEY = 'play-plane-intro'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [toursOpen, setToursOpen] = useState(false)
  const [transfersOpen, setTransfersOpen] = useState(false)
  const [introRun, setIntroRun] = useState(0)
  const endIntro = useCallback(() => setIntroRun(0), [])

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PLAY_INTRO_KEY)) {
        sessionStorage.removeItem(PLAY_INTRO_KEY)
        setIntroRun((n) => n + 1)
      }
    } catch {}
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {introRun > 0 && <PlaneIntro key={introRun} onDone={endIntro} />}
      {/* Main nav */}
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link
            href="/"
            onClick={(event) => {
              setOpen(false)
              if (pathname !== '/') {
                try {
                  sessionStorage.setItem(PLAY_INTRO_KEY, '1')
                } catch {}
                return
              }
              event.preventDefault()
              window.history.replaceState(null, '', '/')
              window.scrollTo({ top: 0, behavior: 'instant' })
              setIntroRun((n) => n + 1)
            }}
            className="flex items-center gap-2.5"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-gold text-gold-foreground shadow-sm">
              <PlaneTakeoff className="size-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-lg font-semibold leading-tight text-foreground">
              Skopje Airport <span className="text-gold">Taxi</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {nav.map((item) =>
              item.label === 'Transfers' ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setTransfersOpen(true)}
                  onMouseLeave={() => setTransfersOpen(false)}
                  onFocusCapture={() => setTransfersOpen(true)}
                  onBlurCapture={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setTransfersOpen(false)
                  }}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-sm font-medium transition hover:text-foreground ${
                      transfersOpen ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                    aria-expanded={transfersOpen}
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-4 transition-transform ${transfersOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </Link>

                  {/* Hover dropdown with all transfer routes */}
                  <div
                    className={`absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3 transition duration-200 ${
                      transfersOpen
                        ? 'visible opacity-100'
                        : 'invisible translate-y-1 opacity-0'
                    }`}
                  >
                    <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-xl">
                      {transfers.map((transfer) => (
                        <Link
                          key={transfer.slug}
                          href={`/transfers/${transfer.slug}`}
                          className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-secondary"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
                            <ArrowLeftRight className="size-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {transfer.route}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {transfer.duration} · from €{transfer.price}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.label === 'Tours' ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setToursOpen(true)}
                  onMouseLeave={() => setToursOpen(false)}
                  onFocusCapture={() => setToursOpen(true)}
                  onBlurCapture={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setToursOpen(false)
                  }}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-sm font-medium transition hover:text-foreground ${
                      toursOpen ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                    aria-expanded={toursOpen}
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-4 transition-transform ${toursOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </Link>

                  {/* Hover dropdown with all tours */}
                  <div
                    className={`absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3 transition duration-200 ${
                      toursOpen
                        ? 'visible opacity-100'
                        : 'invisible translate-y-1 opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
                      {tourList.map((tour) => (
                        <Link
                          key={tour.slug}
                          href={`/tours/${tour.slug}`}
                          className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-secondary"
                        >
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={tour.image || '/placeholder.svg'}
                              alt={tour.alt}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {tour.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {tour.duration} · from €{tour.price}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden md:block">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link href="/build-trip">Build your trip</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 cursor-pointer place-items-center rounded-md border border-border md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link href="/build-trip" onClick={() => setOpen(false)}>
                    Build your trip
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
      <BookingBanner />
      <RejectedToast />
    </header>
  )
}
