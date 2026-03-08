import { CreateReviewModal } from '@/components/reviews/CreateReviewModel'
import { Link } from '@/i18n/navigation'
import type { Category, Media as MediaType } from '@/payload-types'
import configPromise from '@payload-config'
import { ArrowLeft, Star } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

type Props = {
    params: Promise<{ slug: string }>
    children: React.ReactNode
}

export default async function ReviewsLayout({ params, children }: Props) {
    const { slug } = await params
    const payload = await getPayload({ config: configPromise })

    const { docs } = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
        // Virtual fields are computed on read — just selecting them is enough
        select: {
            title: true,
            slug: true,
            gallery: true,
            meta: true,
            categories: true,
            priceInUSD: true,
            reviewCount: true,
            averageRating: true,
            ratingDistribution: true,
        },
    })

    const product = docs[0] as (typeof docs[0] & {
        reviewCount?: number
        averageRating?: number | null
        ratingDistribution?: Record<string, number> | null
    })
    if (!product) notFound()

    const image = (product.gallery?.[0]?.image ?? product.meta?.image) as MediaType | undefined
    const category = product.categories?.[0] as Category | undefined

    const totalReviews = product.reviewCount ?? 0
    const avgRating = product.averageRating ?? 0
    const distribution = product.ratingDistribution ?? {}

    // Normalise to [{ star, count }] ordered 5 → 1
    const starCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: distribution[star] ?? 0,
    }))

    return (
        <div className="container py-12 lg:py-20 min-h-screen">
            {/* Back link */}
            <Link
                href={`/products/${slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-accent-gold transition-colors mb-12 group"
            >
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                Return to Bookshelf
            </Link>

            {/* Hero & Summary Section */}
            <section className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
                <div className="max-w-xl">
                    {category && (
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold mb-4 block">
                            {category.title}
                        </span>
                    )}
                    <h1 className="text-foreground text-5xl md:text-7xl font-black italic leading-none mb-6">
                        Reader&apos;s Testimonies
                    </h1>
                    <p className="text-muted-foreground text-xl font-medium leading-relaxed italic mb-8">
                        &quot;A collection of magical whispers for{' '}
                        <span className="text-foreground font-bold">{product.title}</span>,
                        echoing through the halls of time. Every note a story, every story a legacy.&quot;
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <CreateReviewModal productID={product.id} />
                    </div>
                </div>

                {/* Rating summary card */}
                <div className="bg-card border-2 border-accent-gold/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center min-w-[320px] w-full lg:w-auto">
                    <div className="absolute -top-4 -right-4 text-accent-gold/10 select-none">
                        <Star className="size-32 fill-current" />
                    </div>

                    <p className="text-foreground text-7xl font-black mb-2">
                        {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                    </p>

                    <div className="flex gap-1 mb-4 text-accent-gold">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`size-6 ${s <= Math.round(avgRating) ? 'fill-current' : 'text-border'}`}
                            />
                        ))}
                    </div>

                    <p className="text-muted-foreground font-black mb-8 uppercase tracking-tighter text-sm">
                        {totalReviews} Enraptured {totalReviews === 1 ? 'Soul' : 'Souls'}
                    </p>

                    <div className="w-full space-y-4">
                        {starCounts.map(({ star, count }) => {
                            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                            return (
                                <div key={star} className="grid grid-cols-[20px_1fr_40px] items-center gap-4">
                                    <span className="text-xs font-bold text-muted-foreground">{star}</span>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="bg-accent-gold h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground text-right">
                                        {Math.round(pct)}%
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {children}
        </div>
    )
}