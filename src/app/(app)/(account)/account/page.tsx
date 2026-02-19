import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { AccountForm } from '@/components/forms/AccountForm'
import { Order } from '@/payload-types'
import { OrderItem } from '@/components/OrderItem'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { SettingsIcon, PackageIcon } from 'lucide-react'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
    )
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 5,
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
    <div className="w-full mx-auto px-4 pb-10 flex flex-col gap-6">

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <SettingsIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Account Settings</CardTitle>
              <CardDescription>Manage your profile and preferences</CardDescription>
            </div>
          </div>
          <Separator className="mt-4" />
        </CardHeader>
        <CardContent>
          <AccountForm />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <PackageIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
              <CardDescription>
                Your most recent orders. As you place more, they will appear here.
              </CardDescription>
            </div>
          </div>
          <Separator className="mt-4" />
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {(!orders || !Array.isArray(orders) || orders.length === 0) ? (
            <p className="text-sm text-muted-foreground">You have no orders.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {orders.map((order) => (
                <li key={order.id}>
                  <OrderItem order={order} />
                </li>
              ))}
            </ul>
          )}

          <Button asChild variant="outline" className="self-start rounded-full">
            <Link href="/orders">View all orders</Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}