import type { ReactNode } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { formatPickupDate } from '@/lib/booking-time'
import { cn } from '@/lib/utils'
import type { bookings } from '@/lib/db/schema'

type BookingRow = typeof bookings.$inferSelect

const STATUS: Record<string, { label: string; className: string }> = {
  requested: { label: 'Requested', className: 'border-booking/40 text-booking' },
  approved: { label: 'Confirmed', className: 'border-booking bg-booking text-background' },
  rejected: { label: 'Declined', className: 'border-destructive/50 text-destructive' },
  cancelled: { label: 'Cancelled by customer', className: 'border-border text-muted-foreground' },
  expired: { label: 'Expired · no reply', className: 'border-border text-muted-foreground' },
}

function guestEmailLink(row: BookingRow) {
  if (!row.email || (row.status !== 'approved' && row.status !== 'rejected')) return null
  const when = formatPickupDate(row.date, row.time)
  const confirmed = row.status === 'approved'
  const subject = confirmed ? `Your booking is confirmed: ${row.title}` : `About your booking request: ${row.title}`
  const body = confirmed
    ? `Hello ${row.name},\n\nGood news! Your booking is confirmed.\n\nService: ${row.title}\nDate & time: ${when} (Skopje time)\nPickup: ${row.pickup}${row.dropoff ? `\nDrop-off: ${row.dropoff}` : ''}\nPassengers: ${row.passengers}${row.flight ? `\nFlight: ${row.flight}` : ''}\n\nYour driver will be waiting for you. If anything changes, just reply to this email or message us on WhatsApp.\n\nBooking reference: ${row.id}\n\nSee you soon!`
    : `Hello ${row.name},\n\nThank you for your booking request for ${row.title} on ${when}.\n\nUnfortunately we don't have availability for that date and time. Please feel free to send a new request for another date or time.\n\nBooking reference: ${row.id}\n\nKind regards`
  return {
    label: confirmed ? 'Email confirmation to guest' : 'Email guest about decline',
    href: `mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  }
}

const reviewedFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export function AdminBookingCard({ row, children }: { row: BookingRow; children?: ReactNode }) {
  const status = STATUS[row.status] ?? { label: row.status, className: 'border-border text-muted-foreground' }
  const emailLink = guestEmailLink(row)
  const verb = row.status === 'approved' ? 'Confirmed' : row.status === 'rejected' ? 'Declined' : row.status === 'cancelled' ? 'Cancelled' : null

  return (
    <article className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs text-muted-foreground">
            Ref <span className="font-mono font-semibold uppercase tracking-wider text-foreground">#{row.id.slice(0, 8)}</span>
          </p>
          <h2 className="break-words text-xl font-semibold">{row.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatPickupDate(row.date, row.time)} · {row.name} · {row.passengers} passenger(s)
          </p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {row.channel === 'whatsapp' && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#25D366]">
                <MessageCircle className="size-3.5" aria-hidden="true" /> via WhatsApp
              </span>
            )}
            <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', status.className)}>{status.label}</span>
          </div>
          {verb && <span className="text-xs text-muted-foreground">{verb} {reviewedFormat.format(row.updatedAt)}</span>}
        </div>
      </div>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="text-muted-foreground">Phone</dt><dd className="mt-1 font-medium">{row.phone}</dd></div>
        <div><dt className="text-muted-foreground">Email</dt><dd className="mt-1 break-all font-medium">{row.email ? <a href={`mailto:${row.email}`} className="underline underline-offset-4 hover:text-booking">{row.email}</a> : 'Not supplied'}</dd></div>
        <div><dt className="text-muted-foreground">Pickup</dt><dd className="mt-1 font-medium">{row.pickup}</dd></div>
        <div><dt className="text-muted-foreground">Drop-off</dt><dd className="mt-1 font-medium">{row.dropoff || 'As arranged'}</dd></div>
        <div><dt className="text-muted-foreground">Flight</dt><dd className="mt-1 font-medium">{row.flight || 'Not supplied'}</dd></div>
      </dl>
      {row.notes && <p className="mt-4 text-sm leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">Notes: </span>{row.notes}</p>}
      {emailLink && (
        <a href={emailLink.href} className="mt-5 inline-flex items-center gap-2 rounded-full border border-booking px-4 py-2 text-sm font-semibold text-booking transition-colors hover:bg-booking hover:text-background">
          <Mail className="size-4" aria-hidden="true" />
          {emailLink.label}
        </a>
      )}
      {children}
    </article>
  )
}
