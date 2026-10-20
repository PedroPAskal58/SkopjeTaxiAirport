'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Pencil, X } from 'lucide-react'
import { useBookings, refreshBookings } from '@/lib/booking-memory'
import { updateBooking, cancelBooking } from '@/app/actions/bookings'
import { getPickupTimestamp, formatPickupDate } from '@/lib/booking-time'
import { validateBookingDetails, type BookingRecord } from '@/lib/booking-validation'
import { BookingCountdown } from '@/components/booking-countdown'
import { BookingPhoneField } from '@/components/booking-phone-field'
import { BookingScheduleFields } from '@/components/booking-schedule-fields'
import { Button } from '@/components/ui/button'
import { vehicles } from '@/lib/site'

const inputClass = 'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'

export function BookingDetails({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useBookings()
  const booking = data?.find(b => b.id === id)
  return <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
    <Link href="/bookings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> All bookings</Link>
    {isLoading ? <p className="mt-8" role="status">Loading your booking…</p> : error ? <div role="alert" className="mt-8"><p>We couldn&apos;t load your booking.</p><Button onClick={() => mutate()} variant="outline">Try again</Button></div> : booking ? <BookingRecordDetails key={`${booking.id}:${booking.revision}`} booking={booking} /> : <div className="mt-8"><h1 className="font-serif text-3xl">Booking not found</h1><p className="mt-3 text-muted-foreground">Open this page in the browser you used to make the booking. Bookings are private to that browser.</p></div>}
  </section>
}

function BookingRecordDetails({ booking }: { booking: BookingRecord }) {
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ ...booking })
  const closed = booking.status === 'cancelled' || booking.status === 'rejected'
  const upcoming = !closed && (getPickupTimestamp(booking.date, booking.time) ?? 0) > Date.now()
  const editable = upcoming && booking.status === 'requested'
  const statusLabel = booking.status === 'cancelled' ? 'Cancelled' : booking.status === 'rejected' ? 'Declined · not available' : !upcoming ? 'Past pickup date' : booking.status === 'approved' ? 'Confirmed' : 'Requested · awaiting confirmation'
  const change = (field: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [field]: value }))

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    try {
      validateBookingDetails(form)
      setBusy(true)
      const result = await updateBooking(booking.id, booking.revision, form)
      if (result.error) { setError(result.error); return }
      await refreshBookings()
      setEditing(false)
    } catch (err) { setError(err instanceof Error ? err.message : 'Changes could not be saved.') }
    finally { setBusy(false) }
  }

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

  return <div className="mt-6 flex flex-col gap-6">
    <div><p className="text-sm font-semibold text-booking">{statusLabel}</p><h1 className="mt-2 text-balance font-serif text-3xl font-semibold md:text-4xl">{booking.title}</h1><p className="mt-3 break-all text-sm text-muted-foreground">Booking reference: {booking.id}</p></div>
    {booking.status === 'cancelled' ? <div role="status" className="rounded-2xl border border-border bg-card p-5"><p className="flex items-center gap-2 font-semibold"><Check className="size-5 text-booking" aria-hidden="true" /> Your cancellation is recorded</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">This request is cancelled in our booking system. No WhatsApp message is needed to record the cancellation.</p></div> : booking.status === 'rejected' ? <div role="status" className="rounded-2xl border border-border bg-card p-5"><p className="flex items-center gap-2 font-semibold"><X className="size-5 text-destructive" aria-hidden="true" /> We can&apos;t take this booking</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sorry, we don&apos;t have availability for this request. Please choose another date or time and send a new booking.</p></div> : upcoming && <BookingCountdown date={booking.date} time={booking.time} />}
    {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-card p-4 text-sm text-foreground">{error}</p>}
    {editing ? <form onSubmit={save} className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-6">
      <h2 className="text-xl font-semibold sm:col-span-2">Change your booking</h2>
      <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Full name *</span><input required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={e => change('name', e.target.value)} className={inputClass} /></label>
      <BookingPhoneField value={form.phone} onChange={value => change('phone', value)} />
      <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Email address *</span><input required type="email" maxLength={254} autoComplete="email" inputMode="email" value={form.email} onChange={e => change('email', e.target.value)} className={inputClass} /></label>
      <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Pickup location *</span><input required minLength={3} maxLength={250} value={form.pickup} onChange={e => change('pickup', e.target.value)} className={inputClass} /></label>
      <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Drop-off / destination</span><input maxLength={250} value={form.dropoff} onChange={e => change('dropoff', e.target.value)} className={inputClass} /></label>
      <BookingScheduleFields date={form.date} time={form.time} passengers={form.passengers} onChange={change} />
      <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Flight number</span><input maxLength={30} value={form.flight} onChange={e => change('flight', e.target.value)} className={inputClass} /></label>
      <label className="flex flex-col gap-1.5 sm:col-span-2"><span className="text-sm font-semibold text-muted-foreground">Notes</span><textarea maxLength={2000} rows={3} value={form.notes} onChange={e => change('notes', e.target.value)} className={inputClass} /></label>
      <p className="text-sm text-muted-foreground sm:col-span-2">Changes remain subject to availability and driver confirmation.</p>
      <div className="flex flex-wrap gap-3 sm:col-span-2"><Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => { setEditing(false); setForm({ ...booking }); setError('') }}>Keep original details</Button></div>
    </form> : <div className="rounded-2xl border border-border bg-card p-5 sm:p-6"><h2 className="text-xl font-semibold">Booking details</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2">{[
      ['Passenger', booking.name], ['Phone / WhatsApp', booking.phone], ['Email', booking.email || 'Not supplied'], ['Pickup', booking.pickup], ['Drop-off / destination', booking.dropoff || 'As arranged'], ['Date & time', `${formatPickupDate(booking.date, booking.time)} · Skopje`], ['Passengers', booking.passengers], ['Vehicle', vehicles[booking.car as keyof typeof vehicles]?.name ?? booking.car], ['Flight number', booking.flight || 'Not supplied'], ['Notes', booking.notes || 'None'],
    ].map(([label, value]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-medium leading-relaxed">{value}</dd></div>)}</dl></div>}
    {upcoming && booking.status === 'approved' && <p className="text-sm leading-relaxed text-muted-foreground">Your ride is confirmed. To change or cancel it, please message us on WhatsApp.</p>}
    {editable && !editing && !confirmCancel && <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => setEditing(true)}><Pencil data-icon="inline-start" /> Change booking</Button><Button variant="destructive" onClick={() => setConfirmCancel(true)}><X data-icon="inline-start" /> Cancel booking</Button></div>}
    {confirmCancel && <section aria-labelledby="cancel-title" className="rounded-2xl border border-destructive/40 bg-card p-5"><h2 id="cancel-title" className="text-xl font-semibold">Cancel this booking?</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">This cannot be undone. The cancellation will be saved in our booking system and your request will move to Cancelled. To travel later, you will need a new booking.</p><div className="mt-5 flex flex-wrap gap-3"><Button variant="destructive" disabled={busy} onClick={cancel}>{busy ? 'Cancelling…' : 'Yes, cancel booking'}</Button><Button variant="outline" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep my booking</Button></div></section>}
    {!upcoming && <Button asChild variant="outline"><Link href="/book">Book another ride</Link></Button>}
  </div>
}
