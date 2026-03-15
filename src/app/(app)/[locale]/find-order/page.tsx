import type { Metadata } from 'next'

import { FindOrderForm } from '@/components/forms/FindOrderForm'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function FindOrderPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="container py-16">
      <FindOrderForm initialEmail={user?.email} />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'findOrder.metadata' })

  return {
    description: t('description'),
    openGraph: mergeOpenGraph({
      title: t('title'),
      url: '/find-order',
    }),
    title: t('title'),
  }
}
