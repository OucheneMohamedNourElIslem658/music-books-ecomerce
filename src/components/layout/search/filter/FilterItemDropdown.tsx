'use client'

import { cn } from '@/utilities/cn'
import { ChevronDownIcon } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { ListItem } from '.'
import { FilterItem } from './FilterItem'

export function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    let found = false
    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
      ) {
        setActive(listItem.title)
        found = true
      }
    })
    if (!found && list.length > 0) setActive(list[0].title)
  }, [pathname, list, searchParams])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenSelect(!openSelect)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-4 rounded-full border border-border bg-card/50 px-6 text-sm font-bold transition-all hover:bg-card active:scale-95",
          openSelect && "border-primary ring-1 ring-primary"
        )}
      >
        <span className="truncate">{active}</span>
        <ChevronDownIcon className={cn("size-4 transition-transform duration-300", openSelect && "rotate-180")} />
      </button>
      {openSelect && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-full min-w-[200px] overflow-hidden rounded-2xl border border-border bg-background/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
          onClick={() => setOpenSelect(false)}
        >
          {list.map((item: ListItem, i) => (
            <FilterItem item={item} key={i} />
          ))}
        </div>
      )}
    </div>
  )
}
