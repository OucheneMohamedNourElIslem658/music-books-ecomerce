import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { OrderItem } from '@/components/OrderItem'
import { PaginationController } from '@/components/Pagination/PaginationController'
import { redirect } from '@/i18n/navigation'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { History } from 'lucide-react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

const LIMIT = 10

interface Props {
  searchParams: Promise<{ page?: string }>
  params: Promise<{ locale: string }>
}

export default async function Orders(
  { searchParams, params }: Props
) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  let orders: Order[] | null = null

  const { locale } = await params

  if (!user) {
    redirect({
      href: `/login?warning=${encodeURIComponent('Please login to access your orders.')}`,
      locale,
    })
  }

  let totalPages = 1

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: LIMIT,
      page,
      pagination: true,
      user,
      overrideAccess: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
    totalPages = ordersResult?.totalPages
  } catch (error) { }

  return (
    <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 md:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <History className="text-accent-gold" size={24} />
          Active Acquisitions
        </h2>
        {orders && orders.length > 0 && (
          <span className="text-[10px] text-muted-foreground bg-secondary px-4 py-1.5 rounded-full uppercase tracking-widest font-black border border-border">
            {orders.length} {orders.length === 1 ? 'Pending' : 'Pending'}
          </span>
        )}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {(!orders || !Array.isArray(orders) || orders.length === 0) ? (
          <div className="bg-card/30 p-12 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center gap-4">
            <div className="p-4 bg-secondary rounded-full">
              <History size={48} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest">No orders found in the archives.</p>
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
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <PaginationController page={page} totalPages={totalPages} />
        </div>
      )}
    </main>
  )
}

export const metadata: Metadata = {
  description: 'Your orders.',
  openGraph: mergeOpenGraph({
    title: 'Orders',
    url: '/orders',
  }),
  title: 'Orders',
}
