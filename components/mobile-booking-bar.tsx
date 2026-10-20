'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type MobileBookingBarProps = {
  href: string
  label: string
  priceLabel: string
}

export function MobileBookingBar({ href, label, priceLabel }: MobileBookingBarProps) {
  const [showBar, setShowBar] = useState(true)

  useEffect(() => {
    const bookingCard = document.getElementById('detail-booking-card')
    if (!bookingCard) return

    const observer = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { threshold: 0.15 },
    )

    observer.observe(bookingCard)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:hidden ${
        showBar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      } pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-all duration-200`}
      aria-hidden={!showBar}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{priceLabel}</span>
        <Link
          href={href}
          tabIndex={showBar ? 0 : -1}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-gold-foreground shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
