'use client'

import { cn } from '@/utilities/cn'
import { SearchIcon, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useTransition } from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  className?: string
}

export const Search: React.FC<Props> = ({ className }) => {
  const t = useTranslations('search')
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const currentQuery = searchParams.get('q') ?? ''

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    // Reset to page 1 on new search
    params.delete('page')
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = ''
    handleSearch('')
    inputRef.current?.focus()
  }

  return (
    <form 
      className={cn('relative w-full max-w-2xl group', className)} 
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch(inputRef.current?.value ?? '')
      }}
    >
      <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full scale-90 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative flex items-center">
        <SearchIcon 
          className={cn(
            "absolute left-5 size-5 transition-colors duration-300 pointer-events-none",
            isPending ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within:text-primary"
          )} 
          aria-hidden
        />
        
        <input
          ref={inputRef}
          autoComplete="off"
          className={cn(
            'w-full rounded-full border-2 border-border bg-card text-foreground',
            'pl-14 pr-12 py-4 text-base font-medium',
            'placeholder:text-muted-foreground/60 placeholder:italic',
            'focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
            'transition-all duration-300 shadow-sm hover:border-border/80 hover:shadow-md',
          )}
          defaultValue={currentQuery}
          name="search"
          placeholder={t('placeholder')}
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="absolute right-4 flex items-center gap-2">
          {currentQuery && (
            <button
              type="button"
              onClick={clear}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90"
              aria-label={t('clear')}
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="submit"
            className="hidden sm:flex items-center justify-center p-2 rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
            aria-label={t('submit')}
          >
            <SearchIcon className="size-4" />
          </button>
        </div>
      </div>
    </form>
  )
}