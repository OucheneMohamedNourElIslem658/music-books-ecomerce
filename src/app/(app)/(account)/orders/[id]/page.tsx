import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { ProductItem } from '@/components/ProductItem'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { OrderStatus } from '@/components/OrderStatus'
import { AddressItem } from '@/components/addresses/AddressItem'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string }>
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id } = await params
  const { email = '' } = await searchParams

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !Boolean(user),
      depth: 2,
      where: {
        and: [
          { id: { equals: id } },
          ...(user ? [{ customer: { equals: user.id } }] : []),
          ...(email ? [{ customerEmail: { equals: email } }] : []),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    })

    const canAccessAsGuest =
      !user && email && orderResult?.customerEmail === email
    const canAccessAsUser =
      user &&
      orderResult &&
      (typeof orderResult.customer === 'object'
        ? orderResult.customer?.id
        : orderResult.customer) === user.id

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
      order = orderResult
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) notFound()

  return (
    <div className="w-full mx-auto px-4 pb-10 flex flex-col gap-6">

      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        {user ? (
          <Button asChild variant="ghost" size="sm">
            <Link href="/orders">
              <ChevronLeft className="mr-1 h-4 w-4" />
              All Orders
            </Link>
          </Button>
        ) : (
          <div />
        )}

        <Badge variant="secondary" className="font-mono tracking-widest uppercase text-xs px-3 py-1">
          Order #{order.id}
        </Badge>
      </div>

      {/* Main card */}
      <Card>
        <CardHeader className="pb-0">
          {/* Meta row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Order Date
              </p>
              <p className="text-base font-medium">
                <time dateTime={order.createdAt}>
                  {formatDateTime({ date: order.createdAt, format: 'MMMM dd, yyyy' })}
                </time>
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Total
              </p>
              {order.amount && (
                <Price className="text-base font-medium" amount={order.amount} />
              )}
            </div>

            {order.status && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Status
                </p>
                <OrderStatus className="text-sm" status={order.status} />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-8 pt-8">

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Items
                </p>
                <Separator className="flex-1" />
              </div>
              <ul className="flex flex-col gap-6">
                {order.items.map((item, index) => {
                  if (typeof item.product === 'string') return null
                  if (!item.product || typeof item.product !== 'object') {
                    return (
                      <li key={index}>
                        <p className="text-sm text-muted-foreground">
                          This item is no longer available.
                        </p>
                      </li>
                    )
                  }

                  const variant =
                    item.variant && typeof item.variant === 'object'
                      ? item.variant
                      : undefined

                  return (
                    <li key={item.id}>
                      <ProductItem
                        product={item.product}
                        quantity={item.quantity}
                        variant={variant}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Shipping Address
                </p>
                <Separator className="flex-1" />
              </div>
              {/* @ts-expect-error - some kind of type hell */}
              <AddressItem address={order.shippingAddress} hideActions />
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({ title: `Order ${id}`, url: `/orders/${id}` }),
    title: `Order ${id}`,
  }
}