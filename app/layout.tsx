import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Fraunces } from 'next/font/google'
import { PriceNoticeDialog } from '@/components/price-notice-dialog'
import { ScrollReveal } from '@/components/scroll-reveal'
import { LeafCelebration } from '@/components/leaf-celebration'
import { site } from '@/lib/site'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'Skopje Airport Taxi & Private Transfers | Book Online 24/7',
  description:
    'Reliable private Skopje Airport taxi and transfers to the city and destinations across Macedonia & beyond. Fixed prices, professional English-speaking drivers, free flight tracking, 24/7 service.',
  keywords: [
    'Skopje airport taxi',
    'Skopje airport transfer',
    'Macedonia airport transfer',
    'Skopje to Ohrid transfer',
    'private transfer Skopje',
    'SKP taxi',
  ],
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1b2a4a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`light bg-background ${manrope.variable} ${fraunces.variable}`}>
      <body className="antialiased font-sans">
        {children}
        <PriceNoticeDialog />
        <ScrollReveal />
        <LeafCelebration />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
