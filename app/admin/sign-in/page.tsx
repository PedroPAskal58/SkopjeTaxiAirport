'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

const NOT_ADMIN_MESSAGE = 'That account is not the administrator. Sign in with the admin email instead.'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState(searchParams.get('error') === 'not-admin' ? NOT_ADMIN_MESSAGE : '')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    await signOut().catch(() => {})
    const result = await signIn.email({ email: String(form.get('email')).trim(), password: String(form.get('password')) })
    if (result.error) {
      setError(result.error.code === 'INVALID_EMAIL_OR_PASSWORD' ? 'Wrong email or password. Please try again.' : `Sign-in failed: ${result.error.message ?? 'please try again.'}`)
      setBusy(false)
      return
    }
    router.replace('/admin/bookings')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Email
        <input name="email" type="email" required autoComplete="email" className="rounded-xl border border-border bg-background px-3.5 py-2.5 font-normal outline-none focus:border-gold" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="rounded-xl border border-border bg-background px-3.5 py-2.5 font-normal outline-none focus:border-gold" />
      </label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
      <a href="/admin/sign-up" className="text-center text-sm text-muted-foreground underline">Create an administrator account</a>
    </form>
  )
}

export default function AdminSignInPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold text-booking">Admin access</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold">Approve bookings</h1>
      <p className="mt-3 text-sm text-muted-foreground">Sign in with an approved administrator email.</p>
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  )
}
