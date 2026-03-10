import type { Media, Product, Review } from '@/payload-types'
import type { Metadata } from 'next'

import { PaginationController } from '@/components/Pagination/PaginationController'
import { Link, redirect } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { BookOpenText, History, Package, Plus, RefreshCcw, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'

const statusStyles: Record<string, string> = {
  approved: 'bg-primary/20 text-primary border-primary/30',
  pending: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
  rejected: 'bg-error/20 text-error border-error/30',
}

const statusIcons: Record<string, any> = {
  approved: RefreshCcw,
  pending: Sparkles,
  rejected: History,
}

const decorativeIcons = [Sparkles, ShieldCheck, Package]

const LIMIT = 3

type Args = {
  searchParams: Promise<{ page?: string }>
  params: Promise<{ locale: string }>
}

export default async function ReviewsPage({ searchParams, params }: Args) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { locale } = await params

  if (!user) {
    redirect({
      href: `/login?warning=${encodeURIComponent('Please login to access your reviews.')}`,
      locale,
    })
  }

  let reviews: Review[] = []
  let totalPages = 1
  let totalDocs = 0

  try {
    const result = await payload.find({
      collection: 'reviews',
      limit: LIMIT,
      page,
      pagination: true,
      user,
      overrideAccess: false,
      depth: 2,
      where: {
        author: {
          equals: user?.id,
        },
      },
    })

    reviews = result.docs
    totalPages = result.totalPages
    totalDocs = result.totalDocs
  } catch (error) { }

  return (
    <div className="w-full mx-auto px-4 pb-10 flex flex-col gap-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <BookOpenText className="text-primary size-8" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-display">My Testimonies</h1>
            <p className="text-muted-foreground text-sm italic">The chronicler&apos;s archive of acquisitions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase tracking-[0.2em] font-black border border-border">
            {totalDocs} Total
          </span>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform glow-primary"
          >
            <Plus className="size-3.5" />
            New Acquisition
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card/50 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground text-sm italic">You have not recorded any testimonies yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {reviews.map((review, index) => {
                const product =
                  typeof review.product === 'object' && review.product !== null
                    ? (review.product as Product)
                    : null

                const productImage = product?.meta?.image as Media | undefined

                const formattedDate = review.createdAt
                  ? new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(review.createdAt))
                  : null

                const DecoIcon = decorativeIcons[index % decorativeIcons.length]
                const StatusIcon = statusIcons[review.status ?? 'pending']

                return (
                  <div
                    key={review.id}
                    className="group flex flex-col md:flex-row gap-6 bg-card rounded-2xl p-6 border border-accent-gold/20 hover:border-primary/50 transition-all duration-300 relative overflow-hidden shadow-sm"
                  >
                    {/* Decorative Background Icon */}
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                      <DecoIcon className="size-24" />
                    </div>

                    {/* Product Image */}
                    <div className="w-full md:w-48 h-40 bg-muted rounded-xl overflow-hidden shrink-0 border border-border relative">
                      {productImage?.url ? (
                        <Image
                          src={productImage.url}
                          alt={productImage.alt || (product?.title ?? 'Product')}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                          <Package className="size-12" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5",
                            statusStyles[review.status ?? 'pending']
                          )}>
                            <StatusIcon className={cn("size-3", review.status === 'approved' && "animate-spin-slow")} />
                            {formattedDate}
                          </span>
                          <span className="text-muted-foreground text-[10px] font-bold italic uppercase tracking-widest opacity-60">
                            &quot;{review.comment.length > 40 ? `${review.comment.substring(0, 40)}...` : review.comment}&quot;
                          </span>
                        </div>
                        <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                          {product?.title || 'Unknown Artifact'}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed line-clamp-2">
                          {review.comment}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col items-end justify-center md:border-l border-border md:pl-8 min-w-[120px]">
                      <span className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1 opacity-60">
                        Rating
                      </span>
                      <div className="flex text-accent-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-5",
                              i < review.rating ? "fill-accent-gold" : "text-muted-foreground/20"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <PaginationController page={page} totalPages={totalPages} />
              </div>
            )}
          </>
        )}
      </div>
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