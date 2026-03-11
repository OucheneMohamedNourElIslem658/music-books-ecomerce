import type { Metadata } from 'next'

import { AccountForm } from '@/components/forms/AccountForm'
import { OrderItem } from '@/components/OrderItem'
import { Link, redirect } from '@/i18n/navigation'
import { Order } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { Edit3, Package } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import { getTranslations } from 'next-intl/server'

interface AccountPageProps {
  params: Promise<{ locale: string }>
}

export default async function AccountPage({ params }: AccountPageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  const { locale } = await params
  const t = await getTranslations('account')

  if (!user) {
    redirect({
      href: `/login?warning=${encodeURIComponent(t('auth.loginWarning'))}`,
      locale,
    })
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 3,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {}

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-lg font-medium">{t('description')}</p>
      </div>

      {/* Personal Mandates (Form Fields) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <Edit3 className="text-primary" size={24} />
          <h2 className="text-2xl font-black uppercase tracking-widest">{t('personalMandates')}</h2>
        </div>
        <div className="bg-card/30 p-8 rounded-2xl border border-border shadow-sm">
          <AccountForm />
        </div>
      </section>

      {/* Recent Orders Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <Package className="text-primary" size={24} />
          <h2 className="text-2xl font-black uppercase tracking-widest">
            {t('recentAcquisitions')}
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          {!orders || orders.length === 0 ? (
            <div className="bg-card/20 p-12 rounded-2xl border border-dashed border-border text-center">
              <p className="text-muted-foreground font-bold uppercase tracking-widest">
                {t('noOrders')}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {orders.map((order) => (
                <li key={order.id}>
                  <OrderItem order={order} />
                </li>
              ))}
            </ul>
          )}
          {orders && orders.length > 0 && (
            <Link
              href="/orders"
              className="self-start px-8 py-3 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest transition-all border border-border shadow-sm"
            >
              {t('examineAll')}
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('account')

  return {
    description: t('metadata.description'),
    openGraph: mergeOpenGraph({
      title: t('metadata.title'),
      url: '/account',
    }),
    title: t('metadata.title'),
  }
}
