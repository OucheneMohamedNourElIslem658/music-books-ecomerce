import type { Media, PopularProductsBlock as PopularProductsBlockProps, Product } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import Link from 'next/link'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type Props = { item: Product; priority?: boolean; size: 'full' | 'half' }

export const PopularProducts: React.FC<Props> = ({ item, size }) => {
  let price = item.priceInUSD

  if (item.enableVariants && item.variants?.docs?.length) {
    const variant = item.variants.docs[0]

    if (variant && typeof variant === 'object' && variant.priceInUSD) {
      price = variant.priceInUSD
    }
  }

  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={`/products/${item.slug}`}>
        <GridTileImage
          label={{
            amount: price!,
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title,
          }}
          media={item.meta?.image as Media}
        />
      </Link>
    </div>
  )
}

export const PopularProductsBlock: React.FC<
  PopularProductsBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = async ({ products }) => {
  if (!products || !products[0] || !products[1] || !products[2]) return null

  const [firstProduct, secondProduct, thirdProduct] = products

  return (
    <section className="container grid gap-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <PopularProducts item={firstProduct as Product} priority size="full" />
      <PopularProducts item={secondProduct as Product} priority size="half" />
      <PopularProducts item={thirdProduct as Product} size="half" />
    </section>
  )
}
