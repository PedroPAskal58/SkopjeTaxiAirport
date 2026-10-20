'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { and, count, eq, gt } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactMessages } from '@/lib/db/schema'
import { ensureSchema } from '@/lib/db/ensure-schema'
import { requireAdmin } from '@/lib/admin'
import { CONTACT_TOPICS } from '@/lib/contact'

const MAX_PER_HOUR = 5
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function field(data: FormData, key: string) {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export type ContactState = { status: 'idle' | 'sent' | 'error'; error?: string }

export async function sendContactMessage(_prev: ContactState, data: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (field(data, 'website')) return { status: 'sent' }

  const name = field(data, 'name')
  const contact = field(data, 'contact')
  const topic = field(data, 'topic')
  const message = field(data, 'message')

  if (name.length < 2 || name.length > 80) return { status: 'error', error: 'Please enter your name.' }
  if (contact.length < 5 || contact.length > 120) return { status: 'error', error: 'Please add an email or phone number so we can reply.' }
  if (!CONTACT_TOPICS.some(t => t.value === topic)) return { status: 'error', error: 'Please choose what your message is about.' }
  if (message.length < 10) return { status: 'error', error: 'Please write a little more so we can help.' }
  if (message.length > 2000) return { status: 'error', error: 'Please keep your message under 2000 characters.' }

  try {
    await ensureSchema()
    const h = await headers()
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
    const senderHash = createHash('sha256').update(`contact:${ip}`).digest('hex')

    const [{ recent }] = await db
      .select({ recent: count() })
      .from(contactMessages)
      .where(and(eq(contactMessages.senderHash, senderHash), gt(contactMessages.createdAt, new Date(Date.now() - 60 * 60 * 1000))))
    if (recent >= MAX_PER_HOUR) return { status: 'error', error: 'You have sent several messages already. Please reach us on WhatsApp for a faster reply.' }

    await db.insert(contactMessages).values({ name, contact, topic, message, senderHash })
    return { status: 'sent' }
  } catch {
    return { status: 'error', error: 'Your message could not be sent. Please try again or message us on WhatsApp.' }
  }
}

export async function setMessageHandled(id: string, handled: boolean) {
  await requireAdmin()
  if (!UUID.test(id)) return
  await db.update(contactMessages).set({ handled }).where(eq(contactMessages.id, id))
  revalidatePath('/admin/messages')
}
