import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { AddressItem } from '@/components/addresses/AddressItem'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/i18n/navigation'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { Castle, ChevronLeft, CreditCard, History, Map, Package, Printer } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string; locale: string }>
  searchParams: Promise<{ email?: string }>
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id, locale } = await params
  const { email = '' } = await searchParams
  const t = await getTranslations('orderDetail')

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

    const canAccessAsGuest = !user && email && orderResult?.customerEmail === email
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
    <main className="max-w-5xl mx-auto w-full px-4 md:px-6 flex flex-col gap-10">
      {/* Back Button & Breadcrumb */}
      {user && (
        <Link
          href="/orders"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-black uppercase tracking-widest group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('back')}
        </Link>
      )}

      {/* Order Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-6 md:p-8 bg-card/30 rounded-2xl border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <History size={120} />
        </div>
        <div className="flex flex-col gap-3 relative z-10">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            {t('confirmed')}
          </span>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
            #{order.id}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {t('scribed', { date: formatDateTime({ date: order.createdAt, locale }) })}
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-8 py-3 rounded-full relative z-10">
          <OrderStatus
            status={order.status as 'processing' | 'completed' | 'cancelled' | 'refunded'}
            className="font-black uppercase text-xs tracking-widest text-primary"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <h3 className="text-xl font-black uppercase tracking-widest px-2 flex items-center gap-3">
            <Package className="text-primary" size={24} />
            {t('manifest')}
          </h3>

          <div className="flex flex-col gap-4">
            {order.items?.map((item, index) => {
              if (typeof item.product !== 'object' || !item.product) return null
              const { product, quantity, variant } = item

              let image = product.gallery?.[0]?.image || product.meta?.image
              let price = product.priceInUSD

              const isVariant = Boolean(variant) && typeof variant === 'object'
              if (isVariant) {
                price = variant?.priceInUSD
                const imageVariant = product.gallery?.find((g: any) => {
                  if (!g.variantOption) return false
                  const optId =
                    typeof g.variantOption === 'object' ? g.variantOption.id : g.variantOption
                  return variant?.options?.some((o: any) =>
                    typeof o === 'object' ? o.id === optId : o === optId,
                  )
                })
                if (imageVariant && typeof imageVariant.image !== 'string') {
                  image = imageVariant.image
                }
              }

              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-stretch justify-between gap-6 rounded-2xl bg-card/30 p-6 border border-border hover:border-primary/50 transition-all shadow-sm"
                >
                  <div className="w-full sm:w-40 bg-secondary rounded-xl shrink-0 overflow-hidden border border-border relative h-48 sm:h-40">
                    {image && typeof image !== 'string' ? (
                      <Media fill imgClassName="object-cover" resource={image} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-grow py-1">
                    <div className="flex flex-col gap-2">
                      <p className="text-primary text-[10px] font-black uppercase tracking-widest">
                        {t('artifact')}
                      </p>
                      <h4 className="text-xl font-bold leading-tight">{product.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {isVariant
                          ? variant?.options
                            ?.map((o: any) => (typeof o === 'object' ? o.label : null))
                            .filter(Boolean)
                            .join(', ')
                          : t('standardEdition')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                          {t('quantity')}
                        </span>
                        <span className="font-bold">{t('scrolls', { count: quantity })}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                          {t('goldValue')}
                        </span>
                        {typeof price === 'number' && (
                          <Price
                            amount={price * (quantity || 1)}
                            className="text-primary font-black text-xl"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-card/30 rounded-2xl p-6 md:p-8 border border-border space-y-4">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span className="text-sm">{t('subtotal')}</span>
              <Price amount={order.amount || 0} className="text-foreground" />
            </div>
            <div className="flex justify-between text-muted-foreground font-medium">
              <span className="text-sm">{t('tax')}</span>
              <Price amount={0} className="text-foreground" />
            </div>
            <div className="flex justify-between text-muted-foreground font-medium">
              <span className="text-sm">{t('fee')}</span>
              <span className="text-success font-black uppercase text-xs tracking-widest">
                {t('gratis')}
              </span>
            </div>
            <Separator className="bg-border/50" />
            <div className="pt-2 flex justify-between items-center">
              <span className="text-base md:text-lg font-black uppercase tracking-widest">
                {t('total')}
              </span>
              <Price
                amount={order.amount || 0}
                className="text-primary text-2xl md:text-3xl font-black"
              />
            </div>
          </div>
        </div>

        {/* Sidebar: Shipping & Payment */}
        <div className="flex flex-col gap-8">
          <h3 className="text-xl font-black uppercase tracking-widest px-2 flex items-center gap-3">
            <Map size={24} className="text-primary" />
            {t('destination')}
          </h3>

          {/* Destination Card */}
          <div className="bg-card/30 rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="h-24 bg-primary/5 relative">
              <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                <Castle size={80} />
              </div>
            </div>
            <div className="p-8 -mt-12 relative flex flex-col gap-6">
              <div className="flex items-center justify-center rounded-2xl bg-primary shadow-lg shrink-0 size-16 ring-4 ring-background">
                <Castle size={32} className="text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-black uppercase tracking-widest text-xs text-muted-foreground">
                  {t('deliveryPoint')}
                </p>
                {order.shippingAddress && (
                  /* @ts-expect-error - type mismatch */
                  <AddressItem address={order.shippingAddress} hideActions />
                )}
              </div>
              <button className="w-full py-4 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-border">
                {t('viewCrystalBall')}
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card/30 rounded-2xl p-6 border border-border flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                {t('essenceSource')}
              </span>
              <span className="font-bold text-sm">{t('arcaneVault', { last4: '1337' })}</span>
            </div>
          </div>

          <button className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 group">
            <Printer size={20} className="group-hover:scale-110 transition-transform" />
            {t('print')}
          </button>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const t = await getTranslations('orderDetail')

  return {
    description: t('metadata.description', { id }),
    openGraph: mergeOpenGraph({ title: t('metadata.title', { id }), url: `/orders/${id}` }),
    title: t('metadata.title', { id }),
  }
}
