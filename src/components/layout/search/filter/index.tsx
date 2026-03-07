import type { SortFilterItem } from '@/lib/constants'
import { Suspense } from 'react'
import { FilterItemDropdown } from './FilterItemDropdown'
export type ListItem = PathFilterItem | SortFilterItem
export type PathFilterItem = { path: string; title: string }

export function FilterList({ list }: { list: ListItem[]; title?: string }) {
  return (
    <nav className="min-w-0 shrink">
      <Suspense fallback={<div className="h-10 w-32 rounded-full bg-muted animate-pulse" />}>
        <FilterItemDropdown list={list} />
      </Suspense>
    </nav>
  )
}