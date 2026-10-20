'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Fuel, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'price-notice-dismissed'

export function PriceNoticeDialog() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show once per browsing session so it stays professional, not repetitive.
    if (typeof window === 'undefined') return
    try {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        const introSkipped = document.documentElement.classList.contains('intro-seen')
        const t = setTimeout(() => setOpen(true), introSkipped ? 800 : 3400)
        return () => clearTimeout(t)
      }
    } catch {
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function dismiss() {
    setOpen(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore storage errors (private mode)
    }
  }

  if (!open || pathname?.startsWith('/admin')) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-notice-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close notice"
        onClick={dismiss}
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border bg-primary px-6 py-4 text-primary-foreground">
          <span className="grid size-9 place-items-center rounded-lg bg-gold text-gold-foreground">
            <Fuel className="size-5" aria-hidden="true" />
          </span>
          <h2 id="price-notice-title" className="font-serif text-lg font-semibold">
            A quick note on pricing
          </h2>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="ml-auto grid size-8 place-items-center rounded-md text-primary-foreground/80 transition hover:bg-white/10 hover:text-primary-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            All prices shown are indicative starting rates. Due to ongoing fluctuations in fuel
            costs, final fares may vary slightly. Rest assured, we will always confirm your exact,
            fixed price in writing before your journey begins — with{' '}
            <span className="font-medium text-foreground">no hidden fees or surprises</span>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Thank you for your understanding. We remain committed to transparent, competitive pricing
            and premium service on every trip.
          </p>

          <div className="mt-6 flex justify-end">
            <Button onClick={dismiss} className="bg-gold text-gold-foreground hover:bg-gold/90">
              I understand
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
