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
import { Music, Music2, Music3, Music4 } from 'lucide-react'
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
  const { slug = 'home', locale } = await params

  let page = await queryPageBySlug({ slug, locale })

  if (!page && slug === 'home') {
    page = homeStaticData() as Page
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <article className="relative pt-16 pb-24 min-h-screen overflow-x-hidden">
      {/* Floating Background Music Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-20 select-none">
        <Music className="absolute text-primary size-24 top-20 left-[5%] rotate-12" />
        <Music2 className="absolute text-primary size-16 top-1/2 left-[2%] -rotate-12" />
        <Music3 className="absolute text-primary size-20 top-1/3 right-[5%] rotate-6" />
        <Music4 className="absolute text-primary size-32 bottom-1/4 right-[2%] -rotate-6" />
        <Music2 className="absolute text-primary size-12 top-1/4 left-1/2 rotate-45" />
        <Music className="absolute text-primary size-16 bottom-10 left-1/3 -rotate-12" />
      </div>

      <div className="relative z-10">
        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = 'home', locale } = await params
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
