'use client'

import { useState } from 'react'
import { Clock, X } from 'lucide-react'
import { BookingCountdown } from '@/components/booking-countdown'
import { makeCountdownPreview } from '@/lib/booking-time'

export function BookingCountdownPreview() {
  const [preview, setPreview] = useState<ReturnType<typeof makeCountdownPreview> | null>(null)

  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={preview !== null}
        aria-controls="countdown-preview"
        onClick={() => setPreview(preview ? null : makeCountdownPreview())}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-card-foreground transition hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {preview ? <X className="size-4" aria-hidden="true" /> : <Clock className="size-4" aria-hidden="true" />}
        {preview ? 'Close preview' : 'Preview booking countdown'}
      </button>
      {preview && (
        <div id="countdown-preview" className="mt-4 max-w-xl">
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground"><strong className="text-gold">Demo preview</strong> · Example pickup in just over 2 days. No booking is created or changed.</p>
          <BookingCountdown date={preview.date} time={preview.time} />
        </div>
      )}
    </div>
  )
}
