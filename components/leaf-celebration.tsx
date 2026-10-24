'use client'

import { useEffect, useState } from 'react'
import { FallingLeaves } from '@/components/falling-leaves'

export const BOOKING_SENT_EVENT = 'sat-booking-sent'

export function celebrateBooking() {
  window.dispatchEvent(new Event(BOOKING_SENT_EVENT))
}

export function LeafCelebration() {
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    const onSent = () => setBurst(count => count + 1)
    window.addEventListener(BOOKING_SENT_EVENT, onSent)
    return () => window.removeEventListener(BOOKING_SENT_EVENT, onSent)
  }, [])

  return burst > 0 ? <FallingLeaves key={burst} /> : null
}
