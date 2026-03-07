'use client'
import React, { useCallback, useMemo } from 'react'
import { Category } from '@/payload-types'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { Sparkles, Music, Map, History } from 'lucide-react'

type Props = {
  category: Category
}

const iconMap: Record<string, any> = {
  'All Realms': Sparkles,
  'Musical Novels': Music,
  'Treasure Maps': Map,
  'Signed Tomes': History,
}

export const CategoryItem: React.FC<Props> = ({ category }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isAll = category.title === 'All Realms'
  const isActive = useMemo(() => {
    const currentCat = searchParams.get('category')
    return isAll ? !currentCat : currentCat === String(category.id)
  }, [category.id, isAll, searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isAll) {
      params.delete('category')
    } else {
      params.set('category', String(category.id))
    }

    const newParams = params.toString()
    router.push(pathname + (newParams ? '?' + newParams : ''))
  }, [category.id, isAll, pathname, router, searchParams])

  const Icon = iconMap[category.title] || Sparkles

  return (
    <button
      onClick={() => setQuery()}
      className={cn(
        "flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold border transition-all duration-300 active:scale-95",
        isActive 
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
          : "bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground border-border"
      )}
    >
      <Icon className="size-4" />
      {category.title}
    </button>
  )
}
