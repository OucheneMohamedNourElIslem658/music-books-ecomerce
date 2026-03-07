'use client'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useRef, useTransition } from 'react'

export function ShopSearch() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
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
        <div className="relative w-full">
            <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                aria-hidden
            />
            <input
                ref={inputRef}
                type="search"
                defaultValue={currentQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search the enchanted archives…"
                className="w-full rounded-full border border-border bg-card pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {/* Clear button */}
            {currentQuery && (
                <button
                    onClick={clear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                >
                    <X className="size-4" />
                </button>
            )}
            {/* Pending indicator */}
            {isPending && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            )}
        </div>
    )
}