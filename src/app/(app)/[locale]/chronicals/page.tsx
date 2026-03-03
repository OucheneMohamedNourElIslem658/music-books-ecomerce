import { ChronicleGridItem } from '@/components/Chronicals/GridItem'
import { Grid } from '@/components/Grid'
import { PaginationController } from '@/components/Pagination/PaginationController'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata = {
    description: 'Browse the latest chronicles, tours, and signings.',
    title: 'Chronicles',
}

type SearchParams = { [key: string]: string | string[] | undefined; page?: string }
type Props = { searchParams: Promise<SearchParams> }

const LIMIT = 9

export default async function ChroniclesPage({ searchParams }: Props) {
    const { q: searchValue, sort, page: pageParam } = await searchParams
    const payload = await getPayload({ config: configPromise })
    const page = Math.max(1, parseInt(pageParam ?? '1', 10))

    const posts = await payload.find({
        collection: 'pages',
        limit: LIMIT,
        page,
        draft: false,
        overrideAccess: false,
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

    const resultsText = posts.docs.length > 1 ? 'results' : 'result'
    const hasPosts = posts.docs.length > 0
    const totalPages = posts.totalPages

    return (
        <div className="flex flex-col gap-6">

            {/* Section header */}
            <h2 className="text-xl font-extrabold text-foreground">Latest Chronicles</h2>

            {/* Search feedback */}
            {searchValue && (
                <p className="text-sm text-muted-foreground">
                    {posts.docs.length === 0 ? (
                        <>No chronicles match <span className="font-semibold text-foreground">&quot;{searchValue}&quot;</span></>
                    ) : (
                        <>
                            Showing{' '}
                            <span className="font-semibold text-foreground">
                                {posts.docs.length} {resultsText}
                            </span>{' '}
                            for <span className="font-semibold text-foreground">&quot;{searchValue}&quot;</span>
                        </>
                    )}
                </p>
            )}

            {/* Empty state */}
            {!hasPosts && (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                    <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">📜</span>
                    </div>
                    <p className="font-semibold text-foreground">No chronicles found</p>
                    <p className="text-sm text-muted-foreground">Please try different filters.</p>
                </div>
            )}

            {/* List */}
            {hasPosts && (
                <Grid className="grid grid-cols-1 gap-4">
                    {posts.docs.map((post) => (
                        <ChronicleGridItem key={post.id} post={post} />
                    ))}
                </Grid>
            )}

            {totalPages > 1 && (
                <PaginationController page={page} totalPages={totalPages} />
            )}
        </div>
    )
}