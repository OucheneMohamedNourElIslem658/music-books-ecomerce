'use client'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link } from '@/i18n/navigation'
import { Product } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { BookOpen, ShoppingBag, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setIsOpen(false) }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart?.items?.length) return undefined
    return cart.items.reduce((qty, item) => (item.quantity || 0) + qty, 0)
  }, [cart])

  const hasItems = cart?.items && cart.items.length > 0

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0 w-full sm:max-w-md border-l border-border bg-background">
        <SheetTitle className='hidden' />
        {/* Header */}
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-widest text-foreground">
              The Satchel
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {totalQuantity
                ? `${totalQuantity} Artifact${totalQuantity > 1 ? 's' : ''} Found`
                : 'Empty Satchel'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {hasItems && (
          <div className="h-[2px] w-full bg-border">
            <div className="h-full bg-primary transition-all duration-700" style={{ width: '33%' }} />
          </div>
        )}

        <Separator />

        {/* Empty state */}
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center gap-6 flex-1 py-20 px-8 text-center">
            <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen className="size-10" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-black text-lg text-foreground uppercase tracking-widest">
                Satchel Empty
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">
                No artifacts found. Visit the archive to begin your collection.
              </p>
            </div>
            <Button asChild className="rounded-full px-8" onClick={() => setIsOpen(false)}>
              <Link href="/shop">Explore the Archive</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">

            {/* Items */}
            <ul className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              {cart?.items?.map((item, i) => {
                const product = item.product
                const variant = item.variant

                if (typeof product !== 'object' || !product?.slug) return null

                const metaImage =
                  product.meta?.image && typeof product.meta?.image === 'object'
                    ? product.meta.image : undefined

                const firstGalleryImage =
                  typeof product.gallery?.[0]?.image === 'object'
                    ? product.gallery?.[0]?.image : undefined

                let image = firstGalleryImage || metaImage
                let price = product.priceInUSD
                const isVariant = Boolean(variant) && typeof variant === 'object'

                if (isVariant) {
                  price = variant?.priceInUSD
                  const imageVariant = product.gallery?.find((g: any) => {
                    if (!g.variantOption) return false
                    const variantOptionID =
                      typeof g.variantOption === 'object' ? g.variantOption.id : g.variantOption
                    return variant?.options?.some((option: any) =>
                      typeof option === 'object' ? option.id === variantOptionID : option === variantOptionID,
                    )
                  })
                  if (imageVariant && typeof imageVariant.image === 'object') image = imageVariant.image
                }

                return (
                  <li
                    key={i}
                    className="group bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex gap-4 items-start">

                      {/* Image */}
                      <div className="relative shrink-0">
                        <div className="size-20 rounded-xl overflow-hidden border border-border bg-muted">
                          {image?.url && (
                            <Image
                              alt={image?.alt || product?.title || ''}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              height={96}
                              src={image.url}
                              width={96}
                            />
                          )}
                        </div>
                        {/* Delete — fades in on hover */}
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteItemButton item={item} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-2 min-w-0">
                        <Link href={`/products/${(item.product as Product)?.slug}`}>
                          <p className="text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug line-clamp-2">
                            {product?.title}
                          </p>
                        </Link>

                        {isVariant && variant && (
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                            {variant.options
                              ?.map((option: any) => typeof option === 'object' ? option.label : null)
                              .join(', ')}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-1">
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1 border border-border">
                            <EditItemQuantityButton item={item} type="minus" />
                            <span className="text-xs font-black w-5 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>

                          {typeof price === 'number' && (
                            <Price amount={price} className="text-base font-black text-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}

              {/* Add more */}
              <li>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/40 transition-all text-sm font-bold"
                >
                  <Sparkles className="size-4" />
                  Add another Artifact
                </Link>
              </li>
            </ul>

            <Separator />

            {/* Footer */}
            <div className="px-6 py-5 flex flex-col gap-5 bg-card/30">
              {typeof cart?.subtotal === 'number' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Artifact Subtotal</span>
                    <Price amount={cart.subtotal} className="font-semibold text-foreground" />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="font-black uppercase tracking-widest text-sm text-foreground">
                      Total Tribute
                    </span>
                    <Price amount={cart.subtotal} className="text-xl font-black text-primary" />
                  </div>
                </div>
              )}

              <Button
                asChild
                className="w-full rounded-full h-12 font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Link href="/checkout">Embark on Checkout</Link>
              </Button>

              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                Secured with 256-bit magic encryption
              </p>
            </div>

          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}