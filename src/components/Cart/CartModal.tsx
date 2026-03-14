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
import { useLocalizedCart } from '@/hooks/useLocalizedCart'
import { Link } from '@/i18n/navigation'
import type { Product } from '@/payload-types'
import type { LocaleType } from '@/types/locale'
import { AlertCircle, BookOpen, Loader2, ShoppingBag, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'

export function CartModal() {
  const locale = useLocale() as LocaleType
  const t = useTranslations('cart')

  const { cart, localizedItems, isLoading, isLocalizing, localizationError } =
    useLocalizedCart(locale)

  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setIsOpen(false) }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart?.items?.length) return undefined
    return cart.items.reduce((qty, item) => (item.quantity || 0) + qty, 0)
  }, [cart])

  const hasItems = cart?.items && cart.items.length > 0
  const isInitialLoading = isLoading && !cart?.items?.length

  const displayItems = localizedItems.length > 0
    ? localizedItems
    : (cart?.items ?? []).flatMap((item) => {
      if (typeof item.product !== 'object' || !item.product) return []
      return [{
        id: item.id,
        quantity: item.quantity,
        product: item.product as Product,
        variant: item.variant != null && typeof item.variant === 'object'
          ? item.variant
          : null,
      }]
    })

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0 w-full sm:max-w-md border-l border-border bg-background">
        <SheetTitle className="hidden" />

        {/* Header */}
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black uppercase tracking-widest text-foreground">
              {t('title')}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {totalQuantity
                ? t('artifactsFound', { count: totalQuantity })
                : t('emptySatchel')}
            </p>
          </div>

          {isLocalizing && (
            <Loader2 className="size-4 text-muted-foreground animate-spin shrink-0" />
          )}
        </div>

        {/* Localization error banner */}
        {localizationError && (
          <div className="mx-6 mb-2 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{t('translationError')}</span>
          </div>
        )}

        {/* Progress bar */}
        {hasItems && (
          <div className="h-0.5 w-full bg-border">
            <div className="h-full bg-primary transition-all duration-700" style={{ width: '33%' }} />
          </div>
        )}

        <Separator />

        {/* Initial loading skeleton */}
        {isInitialLoading ? (
          <div className="flex flex-col gap-4 px-6 py-5">
            {[1, 2].map((n) => (
              <div key={n} className="flex gap-4 items-start animate-pulse">
                <div className="size-20 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 flex flex-col gap-2 pt-1">
                  <div className="h-3 rounded bg-muted w-3/4" />
                  <div className="h-3 rounded bg-muted w-1/2" />
                  <div className="h-3 rounded bg-muted w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : !hasItems ? (
          <div className="flex flex-col items-center justify-center gap-6 flex-1 py-20 px-8 text-center">
            <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen className="size-10" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-black text-lg text-foreground uppercase tracking-widest">
                {t('emptySatchel')}
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">
                {t('emptyDescription')}
              </p>
            </div>
            <Button asChild className="rounded-full px-8" onClick={() => setIsOpen(false)}>
              <Link href="/shop">{t('exploreArchive')}</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <ul className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              {displayItems.map((item, i) => {
                const { product, variant } = item

                if (!product?.slug) return null

                const metaImage =
                  product.meta?.image && typeof product.meta.image === 'object'
                    ? product.meta.image : undefined

                const firstGalleryImage =
                  typeof product.gallery?.[0]?.image === 'object'
                    ? product.gallery[0].image : undefined

                let image = firstGalleryImage ?? metaImage
                let price = product.priceInUSD
                const isVariant = Boolean(variant)

                if (isVariant && variant) {
                  price = variant.priceInUSD
                  const imageVariant = product.gallery?.find((g) => {
                    if (!g.variantOption) return false
                    const variantOptionID =
                      typeof g.variantOption === 'object' ? g.variantOption.id : g.variantOption
                    return variant.options?.some((option) =>
                      typeof option === 'object' ? option.id === variantOptionID : option === variantOptionID,
                    )
                  })
                  if (imageVariant && typeof imageVariant.image === 'object') {
                    image = imageVariant.image
                  }
                }

                return (
                  <li
                    key={item.id ?? i}
                    className={[
                      'group bg-card border border-border rounded-2xl p-4 transition-all duration-300',
                      'hover:border-primary/40 hover:shadow-md hover:shadow-primary/5',
                      isLocalizing ? 'opacity-60' : 'opacity-100',
                    ].join(' ')}
                  >
                    <div className="flex gap-4 items-start">
                      <div className="relative shrink-0">
                        <div className="size-20 rounded-xl overflow-hidden border border-border bg-muted">
                          {image?.url && (
                            <Image
                              alt={image.alt || product.title || ''}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              height={96}
                              src={image.url}
                              width={96}
                            />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteItemButton item={item} />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-2 min-w-0">
                        <Link href={`/products/${product.slug}`}>
                          <p className="text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug line-clamp-2">
                            {product.title}
                          </p>
                        </Link>

                        {isVariant && variant && (
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                            {variant.options
                              ?.map((option) =>
                                typeof option === 'object' ? option.label : null,
                              )
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-1">
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

              <li>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/40 transition-all text-sm font-bold"
                >
                  <Sparkles className="size-4" />
                  {t('addAnother')}
                </Link>
              </li>
            </ul>

            <Separator />

            <div className="px-6 py-5 flex flex-col gap-5 bg-card/30">
              {typeof cart?.subtotal === 'number' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t('subtotal')}</span>
                    <Price amount={cart.subtotal} className="font-semibold text-foreground" />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="font-black uppercase tracking-widest text-sm text-foreground">
                      {t('totalTribute')}
                    </span>
                    <Price amount={cart.subtotal} className="text-xl font-black text-primary" />
                  </div>
                </div>
              )}

              <Button
                asChild
                disabled={isLocalizing}
                className="w-full rounded-full h-12 font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none"
              >
                <Link href="/checkout">{t('checkout')}</Link>
              </Button>

              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                {t('secureNote')}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}