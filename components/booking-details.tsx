'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getBookingImage } from '@/lib/booking-image'
import { ArrowLeft, MessageCircle, X } from 'lucide-react'
import { useBookings, refreshBookings } from '@/lib/booking-memory'
import { cancelBooking } from '@/app/actions/bookings'
import { getPickupTimestamp, formatPickupDate } from '@/lib/booking-time'
import type { BookingRecord } from '@/lib/booking-validation'
import { getBookingFieldRules } from '@/lib/booking-fields'
import { BookingCountdown } from '@/components/booking-countdown'
import { BookingWhatsAppCard } from '@/components/booking-whatsapp-card'
import { BookingCancelContactCard } from '@/components/booking-cancel-contact-card'
import { Button } from '@/components/ui/button'
import { vehicles } from '@/lib/site'

export function BookingDetails({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useBookings()
  const booking = data?.find(b => b.id === id)
  if (booking) return <BookingRecordDetails key={`${booking.id}:${booking.revision}`} booking={booking} />
  return <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-16">
    <Link href="/bookings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> All bookings</Link>
    {isLoading ? <p className="mt-8" role="status">Loading your booking…</p> : error ? <div role="alert" className="mt-8"><p>We couldn&apos;t load your booking.</p><Button onClick={() => mutate()} variant="outline">Try again</Button></div> : <div className="mt-8"><h1 className="font-serif text-3xl">Booking not found</h1><p className="mt-3 text-muted-foreground">Open this page in the browser you used to make the booking. Bookings are private to that browser.</p></div>}
  </section>
}

function BookingTitle({ title }: { title: string }) {
  const [from, ...rest] = title.split(' to ')
  if (!rest.length) return <>{title}</>
  return <>{from} <span className="text-gold">to</span> {rest.join(' to ')}</>
}

function BookingRecordDetails({ booking }: { booking: BookingRecord }) {
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const closed = booking.status === 'cancelled' || booking.status === 'rejected' || booking.status === 'expired'
  const upcoming = !closed && (getPickupTimestamp(booking.date, booking.time) ?? 0) > Date.now()
  const editable = upcoming && (booking.status === 'requested' || booking.status === 'approved')
  const rules = getBookingFieldRules(booking)
  const confirmed = booking.status === 'approved'
  const statusLabel = booking.status === 'cancelled' ? 'Cancelled' : booking.status === 'rejected' ? 'Declined · not available' : booking.status === 'expired' ? 'Expired · no WhatsApp message received' : !upcoming ? 'Past pickup date' : booking.status === 'approved' ? 'Confirmed' : booking.channel === 'whatsapp' ? 'Booked on WhatsApp · awaiting reply' : 'Requested · awaiting confirmation'

  async function cancel() {
    setBusy(true); setError('')
    try {
      const result = await cancelBooking(booking.id, booking.revision)
      if (result.error) { setError(result.error); return }
      await refreshBookings()
      setConfirmCancel(false)
    } catch { setError('Cancellation could not be completed. Please try again.') }
    finally { setBusy(false) }
  }

  const tone = booking.status === 'rejected' || booking.status === 'cancelled' || booking.status === 'expired' || !upcoming
    ? 'border-border bg-secondary text-muted-foreground'
    : confirmed ? 'border-whatsapp/40 bg-whatsapp/10 text-whatsapp' : 'border-gold/40 bg-gold/10 text-gold'

  const changeLink = editable ? <Button asChild variant="outline" size="sm" className="h-9 rounded-full px-3.5">
    <Link href={`/bookings/${booking.id}/change`}><MessageCircle data-icon="inline-start" /> Request a change</Link>
  </Button> : undefined

  return <article>
    <header className="relative isolate overflow-hidden">
      <Image src={getBookingImage(booking.key)} alt="" fill priority sizes="100vw" className={`-z-10 object-cover ${closed ? 'grayscale' : ''}`} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/20" aria-hidden="true" />
      <div className="mx-auto flex min-h-[380px] max-w-3xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 md:min-h-[460px]">
        <Link href="/bookings" className="mb-6 inline-flex items-center gap-1.5 self-start rounded-full bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur transition hover:bg-background">
          <ArrowLeft className="size-4" aria-hidden="true" /> All bookings
        </Link>
        <span className="w-fit rounded-full bg-background/80 backdrop-blur">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
            <span className={`size-1.5 rounded-full bg-current ${upcoming && booking.status === 'requested' ? 'animate-pulse' : ''}`} aria-hidden="true" />
            {statusLabel}
          </span>
        </span>
        <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl"><BookingTitle title={booking.title} /></h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">Reference <span className="font-mono font-semibold uppercase tracking-wider text-foreground">#{booking.id.slice(0, 8)}</span></p>
      </div>
    </header>
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-16 sm:gap-6 sm:px-6">
    {booking.status === 'cancelled' ? <BookingCancelContactCard booking={booking} /> : booking.status === 'rejected' ? <div role="status" className="rounded-2xl border border-border bg-card p-5"><p className="flex items-center gap-2 font-semibold"><X className="size-5 text-destructive" aria-hidden="true" /> We can&apos;t take this booking</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sorry, we don&apos;t have availability for this request. Please choose another date or time and send a new booking.</p></div> : upcoming && <BookingCountdown date={booking.date} time={booking.time} action={changeLink} />}
    {upcoming && (booking.status === 'requested' || confirmed) && <BookingWhatsAppCard booking={booking} />}
    {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-card p-4 text-sm text-foreground">{error}</p>}
    <section aria-labelledby="details-title" className="rounded-2xl border border-border bg-card">
      <h2 id="details-title" className="border-b border-border px-4 py-3.5 text-base font-semibold sm:px-6 sm:py-4 sm:text-lg">Booking details</h2>
      <dl className="divide-y divide-border">{([
        ['Passenger', booking.name], ['WhatsApp', booking.phone], ['Email', booking.email || 'Not supplied'], [rules.pickupLabel, booking.pickup], rules.showDropoff && [rules.dropoffLabel, booking.dropoff || 'As arranged'], ['When', `${formatPickupDate(booking.date, booking.time)}`], ['Passengers', booking.passengers], ['Vehicle', vehicles[booking.car as keyof typeof vehicles]?.name ?? booking.car], rules.showFlight && ['Flight', booking.flight || '—'], ['Notes', booking.notes || '—'],
      ].filter(Boolean) as [string, string][]).map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 px-4 py-3 sm:px-6"><dt className="shrink-0 text-sm text-muted-foreground">{label}</dt><dd className="min-w-0 break-words text-right text-sm font-medium leading-relaxed">{value}</dd></div>)}</dl>
    </section>
    {editable && <p className="text-sm leading-relaxed text-muted-foreground">Need to change something? Tap &ldquo;Request a change&rdquo;, choose what to change and send it to us on WhatsApp. We&apos;ll update your booking here once it&apos;s confirmed.</p>}
    {editable && !confirmCancel && <div className="flex"><Button variant="outline" className="h-11 w-full sm:w-auto border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmCancel(true)}><X data-icon="inline-start" /> Cancel</Button></div>}
    {confirmCancel && <section aria-labelledby="cancel-title" className="rounded-2xl border border-destructive/40 bg-card p-4 sm:p-5"><h2 id="cancel-title" className="text-lg font-semibold">Cancel this booking?</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This cannot be undone. To travel later, you will need a new booking. Next, you&apos;ll be able to let us know on WhatsApp or by email.</p><div className="mt-4 grid grid-cols-2 gap-3 sm:flex"><Button variant="destructive" className="h-11" disabled={busy} onClick={cancel}>{busy ? 'Cancelling…' : 'Yes, cancel'}</Button><Button variant="outline" className="h-11" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep it</Button></div></section>}
    {!upcoming && <Button asChild variant="outline" className="h-11"><Link href="/book">Book another ride</Link></Button>}
    </div>
  </article>
}
