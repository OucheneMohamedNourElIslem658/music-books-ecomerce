'use client'

import StarRating from '@/components/reviews/StarRating'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import type { Review } from '@/payload-types'
import { Star } from 'lucide-react'
import React from 'react'

type Props = {
  heading?: string | null
  displayMode?: 'grid' | 'list' | 'carousel' | null
  reviews: Review[]
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const author =
    typeof review.author === 'object' && review.author !== null ? review.author : null

  const formattedDate = review.createdAt
    ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
      new Date(review.createdAt),
    )
    : null

  return (
    <Card className="h-full">
      <CardHeader>
        <div className='flex items-start justify-between'>
          <CardTitle>
            {author ? author.name : 'Anonymous'}
          </CardTitle>
          <CardAction>
            <StarRating rating={review.rating} />
          </CardAction>
        </div>
        <CardDescription>
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="text-sm leading-relaxed italic text-muted-foreground">&quot;{review.comment}&quot;</p>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const ReviewsBlockClient: React.FC<Props> = ({
  heading = 'Customer Reviews',
  displayMode = 'grid',
  reviews,
}) => {
  return (
    <section className="w-full">
      {heading && (
          <h2 className="text-2xl font-bold justify-self-center mb-10">{heading}</h2>
      )}

      {displayMode === 'carousel' ? (
        <Carousel opts={{ align: 'start' }} className="w-full">
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div
          className={
            displayMode === 'list'
              ? 'flex flex-col gap-4'
              : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
          }
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  )
}