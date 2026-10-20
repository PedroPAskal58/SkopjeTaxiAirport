'use client'

import { useEffect } from 'react'
import { Plane } from 'lucide-react'

const INTRO_DURATION_MS = 3000

export function PlaneIntro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, INTRO_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className="plane-intro pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      aria-hidden="true"
    >
      {/* The curtain's bottom edge rides with the plane, so the page is revealed right behind it */}
      <div className="plane-sweep absolute inset-x-0 top-full h-0">
        <div className="absolute inset-x-0 bottom-0 h-[calc(100vh+20rem)] bg-background">
          <div className="absolute inset-0 hero-vignette opacity-60" />
          <div className="plane-edge absolute inset-x-0 bottom-0 h-px" />
        </div>
        <div className="absolute left-[46%] top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <Plane
            strokeWidth={1.25}
            className="size-40 -rotate-45 fill-gold text-gold drop-shadow-[0_20px_40px_rgb(0_0_0/0.6)] md:size-64"
          />
          <div className="-mt-10 flex gap-10 md:-mt-16 md:gap-16">
            <span className="plane-trail block h-[45vh] w-1 md:w-1.5" />
            <span className="plane-trail block h-[45vh] w-1 md:w-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
