import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { homeStaticData } from '@/endpoints/seed/home-static'
import { RenderHero } from '@/heros/RenderHeros'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import { routing } from '@/i18n/routing'
import type { Page } from '@/payload-types'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => doc.slug !== 'home')
    .flatMap(({ slug }) =>
      routing.locales.map((locale) => ({ locale, slug: slug }))
    )

  return params
}

type Args = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function Page({ params }: Args) {
  const { slug, locale } = await params

  let page = await queryPageBySlug({ slug, locale })

  if (!page && slug === 'home') {
    page = homeStaticData() as Page
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale } = await params
  const page = await queryPageBySlug({ slug, locale })

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug, locale }: { slug: string; locale: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale: locale as (typeof routing.locales)[number],
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}