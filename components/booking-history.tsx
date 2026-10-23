'use client'

import Link from 'next/link'
import { CalendarCheck, ArrowRight, Plus } from 'lucide-react'
import { useBookings } from '@/lib/booking-memory'
import { getPickupTimestamp, formatPickupDate } from '@/lib/booking-time'
import { BookingCountdown } from '@/components/booking-countdown'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BookingHistory({ view }: { view: 'upcoming' | 'past' | 'cancelled' }) {
  const { data, error, isLoading, mutate } = useBookings()
  const now = Date.now()
  const closed = (b: { status: string }) => b.status === 'cancelled' || b.status === 'rejected' || b.status === 'expired'
  const groups = {
    upcoming: (data ?? []).filter(b => !closed(b) && (getPickupTimestamp(b.date, b.time) ?? 0) > now),
    past: (data ?? []).filter(b => !closed(b) && (getPickupTimestamp(b.date, b.time) ?? 0) <= now).reverse(),
    cancelled: (data ?? []).filter(closed).reverse(),
  }
  const label = (b: { status: string; channel?: string }) => b.status === 'rejected' ? 'Declined · not available' : b.status === 'expired' ? 'Expired · no WhatsApp message received' : view === 'cancelled' ? 'Cancelled' : view === 'past' ? 'Past pickup date' : b.status === 'approved' ? 'Confirmed' : b.channel === 'whatsapp' ? 'Booked on WhatsApp · awaiting reply' : 'Requested · awaiting confirmation'
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-widest text-booking">Your journeys</p><h1 className="mt-2 text-balance font-serif text-3xl font-semibold md:text-4xl">My bookings</h1></div>
        <Button asChild variant="outline"><Link href="/book"><Plus data-icon="inline-start" /> Book a ride</Link></Button>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">Your requests are saved securely in our booking system. This browser has access to your history; keep its cookies to return to your bookings. A request is not a confirmed ride until we confirm availability.</p>
      <nav aria-label="Booking history filters" className="mt-8 flex flex-wrap gap-2">
        {(['upcoming', 'past', 'cancelled'] as const).map(tab => <Link key={tab} href={`/bookings?view=${tab}`} aria-current={tab === view ? 'page' : undefined} className={cn('rounded-full border px-4 py-2 text-sm font-semibold', tab === view ? 'border-booking/40 bg-booking-surface text-booking' : 'border-border bg-card text-muted-foreground hover:text-foreground')}>{tab[0].toUpperCase() + tab.slice(1)} {data ? `(${groups[tab].length})` : ''}</Link>)}
      </nav>
      <div className="mt-6 flex flex-col gap-4">
        {isLoading && <p role="status" className="py-8 text-muted-foreground">Loading your bookings…</p>}
        {error && <div role="alert" className="rounded-2xl border border-border bg-card p-6"><p>We couldn&apos;t load your bookings.</p><Button variant="outline" onClick={() => mutate()} className="mt-3">Try again</Button></div>}
        {!isLoading && !error && !groups[view].length && <div className="rounded-2xl border border-border bg-card p-8 text-center"><CalendarCheck className="mx-auto size-8 text-muted-foreground" aria-hidden="true" /><h2 className="mt-4 text-xl font-semibold">No {view} bookings</h2><p className="mt-2 text-sm text-muted-foreground">{view === 'upcoming' ? 'Your next journey starts with a booking request.' : 'Bookings will appear here as their status changes.'}</p><Link href="/book" className="mt-5 inline-flex text-sm font-semibold text-gold hover:underline">Book a ride <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link></div>}
        {!error && groups[view].map(booking => <Link key={booking.id} href={`/bookings/${booking.id}`} className={cn('flex flex-col rounded-2xl border p-5 transition hover:border-booking/60 sm:p-6', view === 'upcoming' ? 'border-booking/30 bg-booking-surface/30 text-foreground' : 'border-border bg-card text-card-foreground')}>
          <div className="flex items-center justify-between gap-3"><span className={cn('text-sm font-semibold', view === 'upcoming' ? 'text-booking' : 'text-muted-foreground')}>{label(booking)}</span><ArrowRight className="size-5 shrink-0" aria-hidden="true" /></div>
          <h2 className="mt-3 font-serif text-xl font-semibold">{booking.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{formatPickupDate(booking.date, booking.time)} · Skopje time</p>
          <p className="mt-1 text-sm text-muted-foreground">{booking.passengers} passenger{booking.passengers === '1' ? '' : 's'} · {booking.pickup}</p>
          {view === 'upcoming' && <div className="mt-4"><BookingCountdown date={booking.date} time={booking.time} compact /></div>}
        </Link>)}
      </div>
    </section>
  )
}
