import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { Link } from '@/i18n/navigation'
import { LocaleType } from '@/types/locale'
import configPromise from '@payload-config'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

type Args = {
  params: Promise<{ slug: string; locale: LocaleType }>
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale = 'en' } = await params
  const product = await queryProductBySlug({ slug, locale })
  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') ?? []
  const metaImage = typeof product.meta?.image === 'object' ? product.meta.image : undefined
  const seoImage = metaImage ?? (gallery.length ? (gallery[0]?.image as Media) : undefined)
  const canIndex = product._status === 'published'

  return {
    title: product.meta?.title || product.title,
    description: product.meta?.description || '',
    robots: {
      index: canIndex,
      follow: canIndex,
      googleBot: { index: canIndex, follow: canIndex },
    },
    openGraph: seoImage?.url
      ? {
        images: [{
          url: seoImage.url,
          alt: seoImage.alt,
          width: seoImage.width!,
          height: seoImage.height!,
        }],
      }
      : undefined,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Args) {
  const { slug, locale } = await params
  const product = await queryProductBySlug({ slug, locale })
  if (!product) return notFound()

  const t = await getTranslations('product')

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({ ...item, image: item.image as Media })) ?? []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta.image : undefined

  const hasStock = product.enableVariants
    ? product.variants?.docs?.some((v) => typeof v === 'object' && v.inventory && v.inventory > 0)
    : (product.inventory ?? 0) > 0

  const relatedProducts = (
    product.relatedProducts?.filter((p) => typeof p === 'object') ?? []
  ) as Product[]

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: product.priceInUSD,
      priceCurrency: 'USD',
    },
  }

  return (
    <React.Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="container py-8 flex flex-col gap-8">

        <Link
          href="/shop"
          className="hover:text-primary/80 transition-colors flex items-center gap-2 text-sm text-muted-foreground w-fit"
        >
          <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
          {t('backToProducts')}
        </Link>

        {/* Hero — gallery + description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="w-full lg:sticky lg:top-28">
            <Suspense fallback={
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-muted animate-pulse" />
            }>
              {gallery.length > 0 && (
                <Gallery
                  gallery={gallery}
                  song={product.songGroup}
                />
              )}
            </Suspense>
          </div>

          <div className="w-full">
            <ProductDescription product={product} />
          </div>
        </div>

        {/* Content blocks */}
        {product.layout?.length ? (
          <RenderBlocks blocks={product.layout} product={product} />
        ) : null}

        {/* Related products */}
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}

      </div>
    </React.Fragment>
  )
}

// ─── Related Products ─────────────────────────────────────────────────────────

async function RelatedProducts({ products }: { products: Product[] }) {
  const t = await getTranslations('product')
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold">{t('relatedEnchantments')}</h2>
        <div className="h-1 w-24 bg-primary rounded-full" />
      </div>
      <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductGridItem key={product.id} product={product} />
        ))}
      </Grid>
    </div>
  )
}

// ─── Query ────────────────────────────────────────────────────────────────────

const queryProductBySlug = async ({
  slug,
  locale,
}: {
  slug: string
  locale: LocaleType
}) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    overrideAccess: draft,
    pagination: false,
    locale,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] ?? null
}