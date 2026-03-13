import { ChronicleGridItem } from '@/components/Chronicals/GridItem'
import { Grid } from '@/components/Grid'
import { PaginationController } from '@/components/Pagination/PaginationController'
import { Link } from '@/i18n/navigation'
import type { Media } from '@/payload-types'
import { LocaleType } from '@/types/locale'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'

export async function generateMetadata() {
    const t = await getTranslations('chronicles.metadata')
    return {
        description: t('description'),
        title: t('title'),
    }
}

type SearchParams = { [key: string]: string | string[] | undefined; page?: string }
type Props = {
    searchParams: Promise<SearchParams>
    params: Promise<{ locale: LocaleType }>
}

const LIMIT = 9

export default async function ChroniclesPage({ searchParams, params }: Props) {
    const { q: searchValue, sort, page: pageParam } = await searchParams
    const payload = await getPayload({ config: configPromise })
    const page = Math.max(1, parseInt(pageParam ?? '1', 10))

    const t = await getTranslations('chronicles')

    const { locale } = await params

    const posts = await payload.find({
        collection: 'pages',
        limit: LIMIT,
        page,
        draft: false,
        overrideAccess: false,
        locale,
        select: {
            title: true,
            slug: true,
            meta: true,
            publishedOn: true,
            isBlog: true,
            hero: true,
        },
        where: {
            and: [
                { _status: { equals: 'published' } },
                { isBlog: { equals: true } },
                ...(searchValue
                    ? [{
                        or: [
                            { title: { like: searchValue } },
                            { 'meta.title': { like: searchValue } },
                            { 'meta.description': { like: searchValue } },
                            { 'hero.richText': { like: searchValue } },
                        ],
                    }]
                    : []),
            ],
        },
        ...(sort ? { sort } : { sort: '-publishedOn' }),
    })

    const hasPosts = posts.docs.length > 0
    const totalPages = posts.totalPages

    // Hero post: the first post on the first page when not searching
    const heroPost = !searchValue && page === 1 && posts.docs.length > 0 ? posts.docs[0] : null
    const regularPosts = heroPost ? posts.docs.slice(1) : posts.docs

    return (
        <div className="flex flex-col gap-12">

            {/* Hero Section */}
            {heroPost && (
                <div className="relative rounded-2xl overflow-hidden min-h-[400px] group shadow-2xl">
                    <Link href={`/${heroPost.slug}`} className="absolute inset-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                            style={{
                                backgroundImage: `linear-gradient(0deg, rgba(16, 22, 34, 0.9) 0%, rgba(16, 22, 34, 0.2) 60%), url("${(heroPost.hero?.media as Media)?.url || (heroPost.meta?.image as Media)?.url || ''}")`
                            }}
                        />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                            <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-4 inline-block uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                                {t('latestNews')}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-3xl drop-shadow-sm">
                                {heroPost.hero?.title || heroPost.title}
                            </h1>
                            <p className="text-slate-300 text-lg max-w-2xl line-clamp-2 italic font-medium">
                                {heroPost.meta?.description}
                            </p>
                        </div>
                    </Link>
                </div>
            )}

            <div className="space-y-8">
                {/* Section header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-2xl font-black tracking-tight uppercase italic">{t('sectionTitle')}</h2>
                </div>

                {/* Search feedback */}
                {searchValue && (
                    <p className="text-sm text-muted-foreground bg-primary/5 px-4 py-2 rounded-lg border border-primary/10 inline-block">
                        {posts.docs.length === 0 ? (
                            <>{t('noResults')} <span className="font-bold text-foreground">&quot;{searchValue}&quot;</span></>
                        ) : (
                            <>
                                {t('showing')} <span className="font-bold text-foreground">{posts.docs.length}</span> {t('resultsFor')} <span className="font-bold text-foreground">&quot;{searchValue}&quot;</span>
                            </>
                        )}
                    </p>
                )}

                {/* Empty state */}
                {!hasPosts && (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center bg-card/20 rounded-[2.5rem] border border-dashed border-border">
                        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined text-4xl">history_edu</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl font-black text-foreground uppercase tracking-tight">{t('emptyTitle')}</p>
                            <p className="text-muted-foreground italic">{t('emptyDescription')}</p>
                        </div>
                    </div>
                )}

                {/* List */}
                {hasPosts && (
                    <Grid className="grid grid-cols-1 gap-8">
                        {regularPosts.map((post) => (
                            <ChronicleGridItem key={post.id} post={post} locale={locale} />
                        ))}
                    </Grid>
                )}

                {totalPages > 1 && (
                    <div className="pt-12 border-t border-border mt-8">
                        <PaginationController page={page} totalPages={totalPages} />
                    </div>
                )}
            </div>
        </div>
    )
}