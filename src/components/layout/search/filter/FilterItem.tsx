'use client'

import { Link, usePathname } from '@/i18n/navigation'
import type { SortFilterItem as SortFilterItemType } from '@/lib/constants'
import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { useSearchParams } from 'next/navigation'
import type { ListItem, PathFilterItem as PathFilterItemType } from '.'

function PathFilterItem({ item }: { item: PathFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = pathname === item.path
  const newParams = new URLSearchParams(searchParams.toString())
  newParams.delete('q')

  return (
    <li className="flex w-full" key={item.title}>
      <Link
        className={cn(
          'w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-primary text-primary-foreground font-bold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        href={createUrl(item.path, newParams)}
      >
        {item.title}
      </Link>
    </li>
  )
}

function SortFilterItem({ item }: { item: SortFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('sort') === item.slug
  const q = searchParams.get('q')
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    }),
  )

  return (
    <li className="flex w-full" key={item.title}>
      <Link
        className={cn(
          'w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-primary text-primary-foreground font-bold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        href={href}
        prefetch={!active ? false : undefined}
      >
        {item.title}
      </Link>
    </li>
  )
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />
}
