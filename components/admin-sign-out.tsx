'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function AdminSignOut() { const router = useRouter(); return <Button variant="outline" onClick={async () => { await signOut(); router.push('/admin/sign-in'); router.refresh() }}>Sign out</Button> }
