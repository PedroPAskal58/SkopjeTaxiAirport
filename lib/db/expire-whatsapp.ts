import 'server-only'
import { and, eq, isNull, lt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'

export const WHATSAPP_REPLY_WINDOW_MS = 24 * 60 * 60 * 1000

// Expiry is applied lazily on read, so no cron job is needed: a WhatsApp booking the
// customer never marked as sent is closed 24h after it was created.
export async function expireStaleWhatsAppBookings(userId?: string) {
  const cutoff = new Date(Date.now() - WHATSAPP_REPLY_WINDOW_MS)
  await db
    .update(bookings)
    .set({ status: 'expired', updatedAt: new Date(), revision: sql`${bookings.revision} + 1`, notificationPending: true })
    .where(
      and(
        eq(bookings.status, 'requested'),
        eq(bookings.channel, 'whatsapp'),
        isNull(bookings.whatsappSentAt),
        lt(bookings.createdAt, cutoff),
        userId ? eq(bookings.userId, userId) : undefined,
      ),
    )
}
