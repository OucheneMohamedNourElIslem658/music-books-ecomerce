import type { Product, Review, ReviewsBlock as ReviewsBlockProps } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import React from 'react'
import { ReviewsBlockClient } from './Component.client'

export const ReviewsBlock: React.FC<
  ReviewsBlockProps & {
    id?: DefaultDocumentIDType
    product: Product
  }
> = (props) => {
  const { heading, product } = props


  const reviews = (product.popularReviews ?? []).filter(
    (r): r is Review => typeof r === 'object' && r !== null,
  )

  if (!reviews.length) return null

  return (
    <div className="w-full pb-6 pt-1">
      <ReviewsBlockClient
        heading={heading}
        reviews={reviews}
        slug={product.slug}
      />
    </div>
  )
}