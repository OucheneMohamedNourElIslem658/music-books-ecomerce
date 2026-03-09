'use client'

import { useEffect, useRef, useState } from 'react'

export function CategoryScroller({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(true)

    const update = () => {
        const el = ref.current
        if (!el) return
        setAtStart(el.scrollLeft <= 2)
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
    }

    useEffect(() => {
        const el = ref.current
        if (!el) return
        update()
        el.addEventListener('scroll', update, { passive: true })
        const ro = new ResizeObserver(update)
        ro.observe(el)
        return () => {
            el.removeEventListener('scroll', update)
            ro.disconnect()
        }
    }, [])

    return (
        <div
            ref={ref}
            className="flex items-center gap-4 overflow-x-auto no-scrollbar"
            style={{
                WebkitMaskImage: `linear-gradient(to right, ${atStart ? 'black' : 'transparent'} 0%, black 8%, black 92%, ${atEnd ? 'black' : 'transparent'} 100%)`,
                maskImage: `linear-gradient(to right, ${atStart ? 'black' : 'transparent'} 0%, black 8%, black 92%, ${atEnd ? 'black' : 'transparent'} 100%)`,
            }}
        >
            {children}
        </div>
    )
}