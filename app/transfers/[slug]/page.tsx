import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TransferDetail } from '@/components/transfer-detail'
import { getTransfer, transfers } from '@/lib/site'

export function generateStaticParams() {
  return transfers.map((transfer) => ({ slug: transfer.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const transfer = getTransfer(slug)
  if (!transfer) return {}
  return {
    title: `${transfer.from} to ${transfer.to} Private Transfer | Skopje Airport Taxi`,
    description: transfer.description,
  }
}

export default async function TransferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const transfer = getTransfer(slug)
  if (!transfer) notFound()

  return (
    <>
      <SiteHeader />
      <main>
        <TransferDetail transfer={transfer} />
      </main>
      <SiteFooter />
    </>
  )
}
