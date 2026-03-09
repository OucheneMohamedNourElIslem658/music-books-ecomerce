'use client'

import { cn } from '@/utilities/cn';
import { useEffect, useRef, useState } from 'react';

export function ScrollableFade({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)

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
        return () => { el.removeEventListener('scroll', update); ro.disconnect() }
    }, [])

    const maskStart = atStart ? 'transparent' : 'black'
    const maskEnd = atEnd ? 'transparent' : 'black'

    return (
        <div
            ref={ref}
            className={cn('overflow-x-auto no-scrollbar', className)}
            style={{
                WebkitMaskImage: `linear-gradient(to right, ${maskStart} 0%, black 8%, black 92%, ${maskEnd} 100%)`,
                maskImage: `linear-gradient(to right, ${maskStart} 0%, black 8%, black 92%, ${maskEnd} 100%)`,
            }}
        >
            {children}
        </div>
    )
}