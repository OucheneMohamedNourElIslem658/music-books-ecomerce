'use client'
import { Media as MediaComponent } from '@/components/Media'
import { SongPreview } from '@/components/SongPreview'
import { Link } from '@/i18n/navigation'
import type { Category, Media, PopularProductsBlock as PopularProductsBlockProps, Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

export const PopularProductsBlock: React.FC<
  PopularProductsBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = ({ title, description, products, className }) => {
  const t = useTranslations('blocks.popularProducts')
  if (!products || products.length === 0) return null

  return (
    <div className={cn('container py-12 md:py-24', className)}>
      <section className="w-full">
        {/* Section Header - Exactly like design */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <h2 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
            {title || t('defaultTitle')}
          </h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item, index) => {
            const product = item as Product
            if (typeof product !== 'object') return null

            const category = product.categories?.[0] as Category
            const image = product.meta?.image as Media

            return (
              <div
                key={product.id || index}
                className="group relative flex flex-col gap-4"
              >
                {/* Book Card Visual */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-border/10 bg-card shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 group/card"
                >
                  {/* Background Image with Gradient Overlay */}
                  {image && (
                    <div className="absolute inset-0 z-0">
                      <MediaComponent
                        resource={image}
                        fill
                        imgClassName="object-cover object-center transition-transform duration-700 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity" />
                    </div>
                  )}

                  {/* Card Content (Bottom-aligned) */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    {category && (
                      <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 delay-75">
                        {category.title}
                      </span>
                    )}
                    <h3 className="text-white text-xl font-bold leading-tight">
                      {product.title}
                    </h3>
                    {product.meta?.description && (
                      <p className="text-white/60 text-sm mt-3 line-clamp-2 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 delay-150">
                        {product.meta.description}
                      </p>
                    )}

                    {/* Play Icon Decorative */}
                    <div className="mt-6 size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 transform translate-y-8 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-200">
                      <Play className="size-6 fill-current rtl:rotate-180" />
                    </div>
                  </div>
                </Link>

                {/* Optional Song Preview Widget below if product has song */}
                {product.songGroup && (
                  <div className="px-2">
                    <SongPreview
                      song={product.songGroup.song}
                      title={product.title}
                      thumbnail={image}
                      className="bg-card/20 border-border/5"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
