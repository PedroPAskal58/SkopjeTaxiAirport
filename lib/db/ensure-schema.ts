import 'server-only'
import { pool } from '@/lib/db'

// Idempotent: every statement uses IF NOT EXISTS, so it is safe to run on every boot
// and lets a fresh Neon database (new account, new chat, new deploy) work with zero manual SQL.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "user" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" text PRIMARY KEY,
  "expiresAt" timestamptz NOT NULL,
  "token" text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" text PRIMARY KEY,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "bookings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" text NOT NULL,
  "booking_key" text NOT NULL,
  "title" text NOT NULL,
  "car" text NOT NULL,
  "name" text NOT NULL,
  "phone" text NOT NULL,
  "pickup" text NOT NULL,
  "dropoff" text NOT NULL DEFAULT '',
  "date" text NOT NULL,
  "time" text NOT NULL,
  "pickup_at" timestamptz NOT NULL,
  "passengers" integer NOT NULL,
  "flight" text NOT NULL DEFAULT '',
  "notes" text NOT NULL DEFAULT '',
  "status" text NOT NULL DEFAULT 'requested',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "cancelled_at" timestamptz,
  "notification_pending" boolean NOT NULL DEFAULT true,
  "revision" integer NOT NULL DEFAULT 1
);

ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "email" text NOT NULL DEFAULT '';
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "channel" text NOT NULL DEFAULT 'web';
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "whatsapp_sent_at" timestamptz;

CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings" ("status", "updated_at" DESC);
CREATE INDEX IF NOT EXISTS "bookings_user_idx" ON "bookings" ("userId");

CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "contact" text NOT NULL,
  "topic" text NOT NULL,
  "message" text NOT NULL,
  "sender_hash" text NOT NULL,
  "handled" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "contact_messages_created_idx" ON "contact_messages" ("handled", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "contact_messages_sender_idx" ON "contact_messages" ("sender_hash", "created_at" DESC);
`

const globalSchema = globalThis as unknown as { schemaReady?: Promise<void> }

export function ensureSchema() {
  if (!process.env.DATABASE_URL) return Promise.resolve()
  globalSchema.schemaReady ??= pool
    .query(SCHEMA_SQL)
    .then(() => undefined)
    .catch(error => {
      globalSchema.schemaReady = undefined
      console.error('Database schema setup failed:', error)
      throw error
    })
  return globalSchema.schemaReady
}
