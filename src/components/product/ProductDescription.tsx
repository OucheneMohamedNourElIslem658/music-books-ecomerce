'use client'
import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { StockIndicator } from '@/components/product/StockIndicator'
import { VariantSelector } from '@/components/product/VariantSelector'
import { CreateReviewModal } from '@/components/reviews/CreateReviewModel'
import StarRating from '@/components/reviews/StarRating'
import { useAuth } from '@/providers/Auth'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useTranslations } from 'next-intl'

export function ProductDescription({ product }: { product: Product }) {
  const t = useTranslations('product.description')
  const { currency } = useCurrency()
  const { user } = useAuth()
  const searchParams = useSearchParams()

  const priceField = `priceIn${currency.code}` as keyof Product
  const variantPriceField = `priceIn${currency.code}` as keyof Variant
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  const selectedVariantId = searchParams.get('variant')
  const selectedVariant = selectedVariantId
    ? (product.variants?.docs?.find(
      (v) => typeof v === 'object' && String(v.id) === selectedVariantId,
    ) as Variant | undefined)
    : undefined

  let priceProps: React.ComponentProps<typeof Price>

  if (selectedVariant && typeof selectedVariant[variantPriceField] === 'number') {
    priceProps = { amount: selectedVariant[variantPriceField] as number }
  } else if (hasVariants) {
    const prices = (product.variants?.docs ?? [])
      .filter((v): v is Variant => typeof v === 'object' && typeof v[variantPriceField] === 'number')
      .map((v) => v[variantPriceField] as number)
      .sort((a, b) => a - b)

    priceProps = prices.length > 0
      ? { lowestAmount: prices[0]!, highestAmount: prices[prices.length - 1]! }
      : { amount: (product[priceField] as number) ?? 0 }
  } else {
    priceProps = { amount: (product[priceField] as number) ?? 0 }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Title + tagline */}
      <div>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-2">{product.title}</h1>
        {product.meta?.description && (
          <p className="text-xl text-muted-foreground italic">{product.meta.description}</p>
        )}
      </div>

      {/* Rating */}
      {(product.averageRating || product.reviewCount) ? (
        <div className="flex items-center gap-2">
          {product.averageRating ? <StarRating rating={product.averageRating} /> : null}
          {product.reviewCount ? (
            <span className="text-sm font-medium">
              {t('rating', { count: product.reviewCount })}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Description */}
      {product.description ? (
        <div className="text-lg leading-relaxed text-muted-foreground">
          <RichText data={product.description} enableGutter={false} />
        </div>
      ) : null}

      {/* Price */}
      <div className="text-4xl font-bold text-primary">
        <Price {...priceProps} />
      </div>

      {/* Variant selector */}
      {hasVariants && (
        <Suspense fallback={null}>
          <VariantSelector product={product} />
        </Suspense>
      )}

      {/* Add to cart + review trigger */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Suspense fallback={null}>
            <AddToCart product={product} />
          </Suspense>
        </div>

        {/* Heart button opens the review modal when logged in, otherwise just decorative */}
        {user && (
          <CreateReviewModal
            productID={product.id}
            buttonText={t('leaveReview')}
            modalTitle={t('reviewProduct', { title: product.title })}
            trigger={
              <button className="w-16 h-16 flex items-center justify-center rounded-full border border-border hover:bg-accent-gold/10 hover:border-accent-gold/50 transition-all hover:scale-105 active:scale-95 group">
                <span className="material-symbols-outlined">history_edu</span>
              </button>
            }
          />
        )}
      </div>

      {/* Stock */}
      <Suspense fallback={null}>
        <StockIndicator product={product} />
      </Suspense>

    </div>
  )
}