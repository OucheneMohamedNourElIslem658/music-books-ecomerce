import { PaginationController } from '@/components/Pagination/PaginationController'
import { Link } from '@/i18n/navigation'
import type { User } from '@/payload-types'
import { LocaleType } from '@/types/locale'
import { cn } from '@/utilities/cn'
import configPromise from '@payload-config'
import { MessageSquare, Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

export async function generateMetadata() {
    const t = await getTranslations('productReviews')
    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
    }
}

const LIMIT = 6
const STARS = [0, 5, 4, 3, 2, 1]

// Fully theme-aware card styles — no hardcoded light colours
const CARD_STYLES = [
    'bg-card border border-accent-gold/20 shadow-md',
    'bg-muted border border-border shadow-sm',
    'bg-card border border-accent-gold/30 shadow-inner -rotate-1 hover:rotate-0 transition-transform',
    'bg-muted border-b-4 border-accent-gold/40 shadow-lg rotate-1 hover:rotate-0 transition-transform',
    'bg-card border-2 border-accent-gold/50 shadow-2xl',
    'bg-muted border border-border shadow-md',
]

type SearchParams = { [key: string]: string | string[] | undefined }
type Props = {
    params: Promise<{ slug: string, locale: LocaleType }>
    searchParams: Promise<SearchParams>
}

export default async function ReviewsPage({ params, searchParams }: Props) {
    const { slug, locale } = await params
    const { page: pageParam, stars: starsParam, sort: sortParam } = await searchParams

    const payload = await getPayload({ config: configPromise })
    const page = Math.max(1, parseInt((pageParam as string) ?? '1', 10))
    const starsFilter = parseInt((starsParam as string) ?? '0', 10)
    const currentSort = (sortParam as string) ?? 'newest'

    const t = await getTranslations('productReviews')

    const SORTS = [
        { label: t('filter.sort.newest'), value: 'newest' },
        { label: t('filter.sort.highest'), value: 'rating-desc' },
        { label: t('filter.sort.lowest'), value: 'rating-asc' },
    ]

    const SORT_MAP: Record<string, string> = {
        newest: '-createdAt',
        'rating-desc': '-rating',
        'rating-asc': 'rating',
    }

    const payloadSort = SORT_MAP[currentSort] ?? '-createdAt'

    const { docs: productDocs } = await payload.find({
        collection: 'products',
        locale,
        where: { slug: { equals: slug } },
        limit: 1,
    })
    const product = productDocs[0]
    if (!product) notFound()

    const reviews = await payload.find({
        collection: 'reviews',
        limit: LIMIT,
        page,
        depth: 1,
        sort: payloadSort,
        where: {
            and: [
                { product: { equals: product.id } },
                { status: { equals: 'approved' } },
                ...(starsFilter > 0 ? [{ rating: { equals: starsFilter } }] : []),
            ],
        },
    })

    const totalPages = reviews.totalPages
    const hasReviews = reviews.docs.length > 0

    function buildUrl(p: number, s: number, sort: string) {
        const params = new URLSearchParams()
        if (p > 1) params.set('page', String(p))
        if (s > 0) params.set('stars', String(s))
        if (sort !== 'newest') params.set('sort', sort)
        const qs = params.toString()
        return `/products/${slug}/reviews${qs ? `?${qs}` : ''}`
    }

    return (
        <div className="flex flex-col gap-12">

            {/* Filter bar */}
            <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-xl border border-border">

                {/* Star filter tabs */}
                <div className="flex flex-wrap gap-2 flex-1">
                    {STARS.map((s) => {
                        const isActive = starsFilter === s
                        return (
                            <Link
                                key={s}
                                href={buildUrl(1, s, currentSort)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all",
                                    isActive
                                        ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                                        : "border-border text-muted-foreground hover:border-accent-gold/50 hover:text-foreground"
                                )}
                            >
                                {s === 0 ? t('filter.all') : (
                                    <>
                                        {s}
                                        <Star className={cn(
                                            "size-3.5",
                                            isActive ? "fill-accent-gold text-accent-gold" : "text-muted-foreground"
                                        )} />
                                    </>
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Sort pills */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground hidden sm:block">
                        {t('filter.order')}
                    </span>
                    {SORTS.map(({ label, value }) => (
                        <Link
                            key={value}
                            href={buildUrl(1, starsFilter, value)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                currentSort === value
                                    ? "bg-accent-gold text-background shadow-md"
                                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Empty state */}
            {!hasReviews && (
                <div className="flex flex-col items-center justify-center py-32 gap-6 text-center bg-card/20 rounded-[2.5rem] border border-dashed border-accent-gold/30">
                    <div className="size-20 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold shadow-inner">
                        <MessageSquare className="size-10" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-2xl font-black text-foreground italic">{t('empty.title')}</p>
                        <p className="text-muted-foreground max-w-xs mx-auto italic">
                            {starsFilter > 0
                                ? t('empty.starFilter', { stars: starsFilter })
                                : t('empty.firstToRecord')}
                        </p>
                    </div>
                </div>
            )}

            {/* Review grid */}
            {hasReviews && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.docs.map((review, index) => {
                        const author =
                            typeof review.author === 'object' && review.author !== null
                                ? (review.author as User)
                                : null

                        return (
                            <article
                                key={review.id}
                                className={cn(
                                    "p-8 flex flex-col gap-4 rounded-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden",
                                    CARD_STYLES[index % CARD_STYLES.length]
                                )}
                            >
                                {/* Decorative background star */}
                                <Star className="absolute -bottom-4 -right-4 size-24 text-accent-gold/5 fill-current pointer-events-none" />

                                {/* Stars + date */}
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="flex gap-0.5 text-accent-gold">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={cn(
                                                    "size-4",
                                                    s <= review.rating ? "fill-current" : "text-border"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {review.createdAt && (
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    )}
                                </div>

                                {/* Comment */}
                                <p className="text-foreground text-base leading-relaxed italic flex-1 relative z-10 font-medium">
                                    &quot;{review.comment}&quot;
                                </p>

                                {/* Author */}
                                <div className="mt-2 pt-4 border-t border-border flex items-center gap-3 relative z-10">
                                    <div className="size-10 rounded-full bg-accent-gold/20 border border-accent-gold/40 flex items-center justify-center text-foreground font-black text-xs shrink-0">
                                        {author?.name?.charAt(0) ?? 'A'}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            {author?.name ?? t('anonymousReader')}
                                        </h4>
                                        <p className="text-[10px] font-medium text-muted-foreground italic uppercase tracking-widest">
                                            {t('voyager')}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <PaginationController page={page} totalPages={totalPages} />
                </div>
            )}
        </div>
    )
}