import { pgTable, uuid, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey(),
  userId: text('userId').notNull(),
  key: text('booking_key').notNull(),
  title: text('title').notNull(),
  car: text('car').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull().default(''),
  pickup: text('pickup').notNull(),
  dropoff: text('dropoff').notNull().default(''),
  date: text('date').notNull(),
  time: text('time').notNull(),
  pickupAt: timestamp('pickup_at', { withTimezone: true }).notNull(),
  passengers: integer('passengers').notNull(),
  flight: text('flight').notNull().default(''),
  notes: text('notes').notNull().default(''),
  status: text('status').notNull().default('requested'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  notificationPending: boolean('notification_pending').notNull().default(true),
  revision: integer('revision').notNull().default(1),
  channel: text('channel').notNull().default('web'),
  whatsappSentAt: timestamp('whatsapp_sent_at', { withTimezone: true }),
})

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  topic: text('topic').notNull(),
  message: text('message').notNull(),
  senderHash: text('sender_hash').notNull(),
  handled: boolean('handled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
