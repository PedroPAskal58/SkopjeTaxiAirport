'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export default function AdminSignUpPage() {
  const router = useRouter(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const form = new FormData(event.currentTarget); const result = await signUp.email({ email: String(form.get('email')), password: String(form.get('password')), name: String(form.get('name')) }); if (result.error) setError('Account creation failed. Use the administrator email and a password of at least 8 characters.'); else { router.push('/admin/bookings'); router.refresh() } setBusy(false) }
  return <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16"><p className="text-sm font-semibold text-booking">Admin access</p><h1 className="mt-2 font-serif text-4xl font-semibold">Create admin account</h1><p className="mt-3 text-sm text-muted-foreground">Use an email listed in the project&apos;s administrator settings.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"><label className="flex flex-col gap-1.5 text-sm font-semibold">Name<input name="name" required minLength={2} autoComplete="name" className="rounded-xl border border-border bg-background px-3.5 py-2.5 font-normal outline-none focus:border-gold" /></label><label className="flex flex-col gap-1.5 text-sm font-semibold">Email<input name="email" type="email" required autoComplete="email" className="rounded-xl border border-border bg-background px-3.5 py-2.5 font-normal outline-none focus:border-gold" /></label><label className="flex flex-col gap-1.5 text-sm font-semibold">Password<input name="password" type="password" required minLength={8} autoComplete="new-password" className="rounded-xl border border-border bg-background px-3.5 py-2.5 font-normal outline-none focus:border-gold" /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</Button><Link href="/admin/sign-in" className="text-center text-sm text-muted-foreground underline">Already have an account? Sign in</Link></form></main>
}
