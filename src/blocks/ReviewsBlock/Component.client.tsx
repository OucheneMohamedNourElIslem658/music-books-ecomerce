'use client'

import StarRating from '@/components/reviews/StarRating'
import { Link } from '@/i18n/navigation'
import type { Review, User } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { ArrowRight } from 'lucide-react'
import React from 'react'

type Props = {
  heading?: string | null
  displayMode?: 'grid' | 'list' | 'carousel' | null
  reviews: Review[]
  slug: string
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const author =
    typeof review.author === 'object' && review.author !== null ? (review.author as User) : null

  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2']
  const rotation = rotations[index % rotations.length]

  return (
    <div className={cn(
      "p-8 rounded-xl shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative flex flex-col h-full",
      // Light: warm parchment. Dark: deep warm dark that keeps the "scroll" feel
      "scroll-texture dark:[background:linear-gradient(135deg,oklch(18%_0.03_80deg)_0%,oklch(15%_0.04_80deg)_100%)]",
      "text-slate-800 dark:text-slate-100",
      rotation
    )}>

      {/* Decorative badge — parchment in light, dark warm in dark */}
      <div className="absolute -top-3 -left-3 size-10 bg-parchment-to dark:bg-[oklch(22%_0.04_80deg)] rounded-full flex items-center justify-center border-4 border-accent-gold shadow-md">
        <svg className="size-4 text-slate-600 dark:text-accent-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 4C14 6 12 12 10 18C8 22 4 20 4 20" />
          <path d="M4 20L9 15" />
          <path d="M15 4C15 4 18 7 16 11" />
        </svg>
      </div>

      {/* Stars */}
      <div className="mb-4 mt-2">
        <StarRating rating={review.rating} />
      </div>

      {/* Comment */}
      <div className="flex-1">
        <p className="text-lg font-medium italic mb-8 leading-relaxed">
          &quot;{review.comment}&quot;
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 border-t border-slate-900/10 dark:border-white/10 pt-6 mt-auto">
        <div className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-500 flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-xs shrink-0">
          {author?.name?.charAt(0) || 'A'}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{author?.name || 'Anonymous Seeker'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
            Verified Reader
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const ReviewsBlockClient: React.FC<Props> = ({
  heading = 'Echoes from the Kingdom',
  reviews,
  slug,
}) => {
  if (!reviews?.length) return null

  return (
    <section className="container py-12 md:py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <h2 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
          {heading}
        </h2>
        <Link
          href={`/products/${slug}/reviews`}
          className="text-primary font-bold flex items-center gap-2 hover:underline transition-all group"
        >
          Read all reviews
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Extra py/px so rotated cards don't clip at edges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6 px-2">
        {reviews.map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </div>
    </section>
  )
}