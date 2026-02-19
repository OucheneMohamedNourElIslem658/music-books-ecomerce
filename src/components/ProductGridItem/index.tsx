import type { Product } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title } = product

  let price = priceInUSD

  const variants = product.variants?.docs
  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (variant && typeof variant === 'object' && typeof variant?.priceInUSD === 'number') {
      price = variant.priceInUSD
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  return (
    <Link
      className="relative inline-block h-full w-full group"
      href={`/products/${product.slug}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card group-hover:border-primary/50 transition-colors">
        {image ? (
          <Media
            className="aspect-square"
            imgClassName="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
            resource={image}
            height={400}
            width={400}
          />
        ) : (
          <div className="aspect-square flex items-center justify-center bg-primary/5">
            <span className="text-4xl text-muted-foreground/30">📦</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex justify-between items-center mt-3 px-1 gap-4">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {title}
        </p>

        {typeof price === 'number' && (
          <Price
            className="text-sm font-semibold text-muted-foreground shrink-0"
            amount={price}
          />
        )}
      </div>
    </Link>
  )
}