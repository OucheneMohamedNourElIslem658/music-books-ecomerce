import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { CategoryItem } from './Categories.client'
import { CategoryScroller } from './CategoriesScroller'

import { getTranslations } from 'next-intl/server'

async function CategoryList() {
  const payload = await getPayload({ config: configPromise })

  const t = await getTranslations('shop.layout')

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
  })

  return (
    <CategoryScroller>
      <CategoryItem category={{ id: 0, title: t('allRealms') } as any} />
      {categories.docs.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </CategoryScroller>
  )
}

export function Categories() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-muted animate-pulse shrink-0" />
          ))}
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  )
}