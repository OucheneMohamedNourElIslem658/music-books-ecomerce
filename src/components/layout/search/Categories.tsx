import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cn } from '@/utilities/cn'
import React, { Suspense } from 'react'
import { CategoryItem } from './Categories.client'

async function CategoryList() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
  })

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
        Category
      </p>
      <ul className="flex flex-col gap-1">
        {categories.docs.map((category) => (
          <li key={category.id}>
            <CategoryItem category={category} />
          </li>
        ))}
      </ul>
    </div>
  )
}

const skeletonBase = 'h-4 rounded-lg animate-pulse'

export function Categories() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-3 w-full py-4">
          {/* Title skeleton */}
          <div className={cn(skeletonBase, 'w-1/3 bg-muted')} />
          {/* Item skeletons */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(skeletonBase, 'bg-muted', i === 0 ? 'w-4/6' : 'w-5/6')}
            />
          ))}
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  )
}