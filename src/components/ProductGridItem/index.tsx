'use client'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Link } from '@/i18n/navigation'
import type { Category, Media as MediaType, Product } from '@/payload-types'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title, categories, meta } = product

  let price = priceInUSD
  const variants = product.variants?.docs
  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (variant && typeof variant === 'object' && typeof variant?.priceInUSD === 'number') {
      price = variant.priceInUSD
    }
  }

  const category = categories?.[0] as Category
  const image = gallery?.[0]?.image as MediaType || meta?.image as MediaType

  return (
    <div className="flex flex-col gap-5 group">

      {/* Book Visual */}
      <div className="relative aspect-3/4 rounded-4xl overflow-hidden bg-muted shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/5">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0">
          {image ? (
            <Media
              fill
              imgClassName="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              resource={image}
            />
          ) : (
            <div className="size-full flex items-center justify-center bg-primary/5">
              <span className="text-4xl opacity-20">📦</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Hover actions */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <Link
              href={`/products/${product.slug}`}
              className="w-full bg-primary text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            >
              <ShoppingCart className="size-4" /> Quick View
            </Link>
          </div>
        </div>
      </div>

      {/* Info — parchment card, always light */}
      <div
        className="p-6 rounded-xl border-b-4 border-primary/20 shadow-inner"
        style={{ background: 'linear-gradient(135deg, #fdfcf0 0%, #e2d1a6 100%)' }}
      >
        {category && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
            {category.title}
          </p>
        )}
        <h3 className="text-xl font-bold text-[#2d2820] line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-4">
          {typeof price === 'number' && (
            <Price
              className="text-2xl font-black text-[#2d2820]"
              amount={price}
            />
          )}
          <Link href={`/products/${product.slug}`}>
            <button className="size-10 bg-[#2d2820] text-[#f4e4bc] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <ShoppingCart className="size-5" />
            </button>
          </Link>
        </div>
      </div>

    </div>
  )
}