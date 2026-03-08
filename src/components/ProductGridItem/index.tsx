'use client'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Link } from '@/i18n/navigation'
import type { Category, Media as MediaType, Product } from '@/payload-types'
import { Headphones, ShoppingCart } from 'lucide-react'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title, categories, song, meta } = product

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
      {/* Book Visual Card */}
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-muted shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/5">
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
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <Link
              href={`/products/${product.slug}`}
              className="w-full bg-primary text-primary-foreground py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            >
              <ShoppingCart className="size-4" /> Quick View
            </Link>
          </div>
        </div>

        {/* Badges */}
        {song && (
          <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-white flex items-center gap-1 shadow-lg">
            <Headphones className="size-3" /> Audio Included
          </div>
        )}
      </div>

      {/* Info Section - Based on parchment aesthetic */}
      <div className="relative p-6 rounded-3xl border-b-4 border-primary/20 shadow-sm bg-card/50 backdrop-blur-md transition-colors group-hover:bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(var(--foreground-rgb),0.02)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-1">
          {category && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">
              {category.title}
            </p>
          )}
          <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center justify-between mt-4">
            {typeof price === 'number' && (
              <Price
                className="text-2xl font-black text-foreground"
                amount={price}
              />
            )}
            <Link href={`/products/${product.slug}`}>
              <button
                className="size-10 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm">
                <ShoppingCart className="size-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
