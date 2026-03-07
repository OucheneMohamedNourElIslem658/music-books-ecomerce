import { Grid } from '@/components/Grid'
import { PaginationController } from '@/components/Pagination/PaginationController'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Search } from 'lucide-react'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined, page?: string }

type Props = {
  searchParams: Promise<SearchParams>
}

const LIMIT = 12

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category, page: pageParam } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  const products = await payload.find({
    collection: 'products',
    limit: LIMIT,
    page,
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
      meta: true,
      song: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    ...(searchValue || category
      ? {
        where: {
          and: [
            { _status: { equals: 'published' } },
            ...(searchValue
              ? [{ or: [{ title: { like: searchValue } }, { description: { like: searchValue } }] }]
              : []),
            ...(category ? [{ categories: { contains: category } }] : []),
          ],
        },
      }
      : {}),
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'
  const hasProducts = products.docs.length > 0
  const totalPages = products.totalPages

  return (
    <div className="flex flex-col gap-10">

      {/* Search feedback */}
      {searchValue && (
        <div className="px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl inline-flex self-start items-center gap-2">
          <Search className="size-4 text-primary" />
          <p className="text-sm font-medium">
            {products.docs.length === 0 ? (
              <>No magical tomes match <span className="font-bold text-primary">&quot;{searchValue}&quot;</span></>
            ) : (
              <>
                Revealing{' '}
                <span className="font-bold text-primary">
                  {products.docs.length} {resultsText}
                </span>{' '}
                for <span className="font-bold text-primary">&quot;{searchValue}&quot;</span>
              </>
            )}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!searchValue && !hasProducts && (
        <div className="flex flex-col items-center justify-center py-32 gap-6 text-center bg-card/20 rounded-[2.5rem] border border-dashed border-border">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Search className="size-10" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-black text-foreground">No Enchantments Found</p>
            <p className="text-muted-foreground max-w-xs mx-auto italic">The archives are silent. Please try adjusting your search or filters.</p>
          </div>
        </div>
      )}

      {/* Product grid */}
      {hasProducts && (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.docs.map((product) => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <div className="pt-12 border-t border-border mt-12">
          <PaginationController page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
