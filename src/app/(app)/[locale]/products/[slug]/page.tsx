import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { Link } from '@/i18n/navigation'
import configPromise from '@payload-config'
import { ChevronRightIcon } from 'lucide-react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

type Args = {
  params: Promise<{ slug: string, locale: 'en' | 'ar' | 'pt' }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale = 'en' } = await params
  const product = await queryProductBySlug({ slug, locale })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []
  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'
  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
        images: [
          {
            alt: seoImage?.alt,
            height: seoImage.height!,
            url: seoImage?.url,
            width: seoImage.width!,
          },
        ],
      }
      : null,
    robots: {
      follow: canIndex,
      googleBot: { follow: canIndex, index: canIndex },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug, locale } = await params
  const product = await queryProductBySlug({ slug, locale })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({ ...item, image: item.image as Media })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined

  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some(
      (variant) => typeof variant === 'object' && variant.inventory && variant.inventory > 0,
    )
    : product.inventory! > 0

  let price = product.priceInUSD

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object' && variant?.priceInUSD && acc && variant.priceInUSD > acc) {
        return variant.priceInUSD
      }
      return acc
    }, price)
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price,
      priceCurrency: 'usd',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((p) => typeof p === 'object') ?? []

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        type="application/ld+json"
      />

      <div className="container py-8 flex flex-col gap-8">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link className="hover:text-primary transition-colors" href="/">
            Home
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link className="hover:text-primary transition-colors" href="/shop">
            Musical Books
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* Product info section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="w-full">
            <Suspense
              fallback={
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-muted animate-pulse" />
              }
            >
              {Boolean(gallery?.length) && <Gallery gallery={gallery} song={product.song} />}
            </Suspense>
          </div>

          <div className="w-full">
            <ProductDescription product={product} />
          </div>
        </div>

        {/* Content blocks */}
        {product.layout?.length ? <RenderBlocks blocks={product.layout} product={product} /> : null}

        {/* Related products */}
        {relatedProducts.length ? (
          <RelatedProducts products={relatedProducts as Product[]} />
        ) : null}

      </div>
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="container flex flex-col gap-12 border-border">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold">Related Enchantments</h2>
        <div className="h-1 w-24 bg-primary rounded-full"></div>
      </div>

      <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductGridItem key={product.id} product={product} />
        ))}
      </Grid>
    </div>
  )
}

const queryProductBySlug = async ({ slug, locale }: { slug: string, locale: 'en' | 'ar' | 'pt' }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInUSD: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}