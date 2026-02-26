import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { OrderItem } from '@/components/OrderItem'
import { PaginationController } from '@/components/Pagination/PaginationController'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

const LIMIT = 10

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function Orders(
  { searchParams }: Props
) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  let orders: Order[] | null = null

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent('Please login to access your orders.')}`)
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
    <div className="w-full mx-auto px-4 pb-10 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Orders</CardTitle>
          <Separator />
        </CardHeader>

        <CardContent>
          {(!orders || !Array.isArray(orders) || orders.length === 0) ? (
            <p className="text-muted-foreground text-sm">You have no orders.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {orders.map((order) => (
                <li key={order.id}>
                  <OrderItem order={order} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {totalPages == 1 && (<PaginationController page={page} totalPages={totalPages} />)}
    </div>
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