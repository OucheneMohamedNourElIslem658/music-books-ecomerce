import type { Review } from '@/payload-types'
import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import StarRating from '@/components/reviews/StarRating'
import { PaginationController } from '@/components/Pagination/PaginationController'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  approved: 'default',
  pending: 'secondary',
  rejected: 'destructive',
}

const LIMIT = 3

type Args = {
  searchParams: Promise<{ page?: string }>
}

export default async function ReviewsPage({ searchParams }: Args) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent('Please login to access your reviews.')}`)
  }

  let reviews: Review[] = []
  let totalPages = 1

  try {
    const result = await payload.find({
      collection: 'reviews',
      limit: LIMIT,
      page,
      pagination: true,
      user,
      overrideAccess: false,
      depth: 1,
      where: {
        author: {
          equals: user.id,
        },
      },
    })

    reviews = result.docs
    totalPages = result.totalPages
  } catch (error) {}

  return (
    <div className="w-full mx-auto px-4 pb-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Reviews</CardTitle>
          <Separator />
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-sm">You have no reviews.</p>
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {reviews.map((review) => {
                  const product =
                    typeof review.product === 'object' && review.product !== null
                      ? review.product
                      : null

                  const formattedDate = review.createdAt
                    ? new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(new Date(review.createdAt))
                    : null

                  return (
                    <li key={review.id} className="flex flex-col gap-2 rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          {product && (
                            <span className="text-sm font-semibold">{(product as any).title}</span>
                          )}
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            {formattedDate && (
                              <span className="text-xs text-muted-foreground">{formattedDate}</span>
                            )}
                          </div>
                        </div>
                        <Badge variant={statusVariant[review.status ?? 'pending']}>
                          {review.status ?? 'pending'}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    </li>
                  )
                })}
              </ul>

              {totalPages > 1 && (
                <PaginationController page={page} totalPages={totalPages}/>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Your reviews.',
  openGraph: mergeOpenGraph({
    title: 'Reviews',
    url: '/account/reviews',
  }),
  title: 'Reviews',
}