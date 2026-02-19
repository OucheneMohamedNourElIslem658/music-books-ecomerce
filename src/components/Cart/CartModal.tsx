'use client'

import { Price } from '@/components/Price'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'
import { Product } from '@/payload-types'

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart?.items?.length) return undefined
    return cart.items.reduce((qty, item) => (item.quantity || 0) + qty, 0)
  }, [cart])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0">

        {/* Header */}
        <SheetHeader className="px-6 py-5">
          <SheetTitle className="text-foreground text-lg font-semibold">My Cart</SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            Manage your cart here, add items to view the total.
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* Empty state */}
        {!cart || cart?.items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 flex-1 py-16 px-6 text-center">
            <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingCart className="size-7" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add some products to get started.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">

            {/* Items list */}
            <ul className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {cart?.items?.map((item, i) => {
                const product = item.product
                const variant = item.variant

                if (typeof product !== 'object' || !product?.slug) return null

                const metaImage =
                  product.meta?.image && typeof product.meta?.image === 'object'
                    ? product.meta.image
                    : undefined

                const firstGalleryImage =
                  typeof product.gallery?.[0]?.image === 'object'
                    ? product.gallery?.[0]?.image
                    : undefined

                let image = firstGalleryImage || metaImage
                let price = product.priceInUSD
                const isVariant = Boolean(variant) && typeof variant === 'object'

                if (isVariant) {
                  price = variant?.priceInUSD

                  const imageVariant = product.gallery?.find((item) => {
                    if (!item.variantOption) return false
                    const variantOptionID =
                      typeof item.variantOption === 'object'
                        ? item.variantOption.id
                        : item.variantOption

                    return variant?.options?.some((option) =>
                      typeof option === 'object'
                        ? option.id === variantOptionID
                        : option === variantOptionID,
                    )
                  })

                  if (imageVariant && typeof imageVariant.image === 'object') {
                    image = imageVariant.image
                  }
                }

                return (
                  <li
                    key={i}
                    className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-4 items-start">

                      {/* Image + delete */}
                      <div className="relative shrink-0">
                        <div className="size-16 rounded-lg overflow-hidden border border-border bg-muted">
                          {image?.url && (
                            <Image
                              alt={image?.alt || product?.title || ''}
                              className="h-full w-full object-cover"
                              height={94}
                              src={image.url}
                              width={94}
                            />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <DeleteItemButton item={item} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-2 min-w-0">
                        <Link href={`/products/${(item.product as Product)?.slug}`}>
                          <p className="text-sm font-medium leading-tight text-foreground hover:text-primary transition-colors truncate">
                            {product?.title}
                          </p>
                        </Link>

                        {isVariant && variant && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {variant.options
                              ?.map((option) =>
                                typeof option === 'object' ? option.label : null,
                              )
                              .join(', ')}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1">
                            <EditItemQuantityButton item={item} type="minus" />
                            <span className="text-xs font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>

                          {/* Price */}
                          {typeof price === 'number' && (
                            <Price
                              amount={price}
                              className="text-sm font-semibold text-foreground"
                            />
                          )}
                        </div>
                      </div>

                    </div>
                  </li>
                )
              })}
            </ul>

            <Separator />

            {/* Footer */}
            <div className="px-6 py-5 flex flex-col gap-4">
              {typeof cart?.subtotal === 'number' && (
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Total
                  </p>
                  <Price
                    amount={cart.subtotal}
                    className="text-base font-bold text-foreground"
                  />
                </div>
              )}

              <Button asChild className="w-full rounded-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>

          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}