import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { CategoryItem } from './Categories.client'

async function CategoryList() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
  })

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
      <CategoryItem category={{ id: 0, title: 'All Realms' } as any} />
      {categories.docs.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}

export function Categories() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-full bg-muted animate-pulse shrink-0"
            />
          ))}
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  )
}
