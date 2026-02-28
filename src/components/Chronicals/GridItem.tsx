import type { Media, Page } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    post: Partial<Page> & { id: string | number }
}

const categoryStyles: Record<string, { label: string; className: string }> = {
    'new-release': { label: 'New Release', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    'royal-tour': { label: 'Royal Tour', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'signing': { label: 'Signing', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
}

export const ChronicleGridItem: React.FC<Props> = ({ post }) => {
    const { title, slug, meta, publishedOn } = post

    const image = meta?.image as Media | undefined
    const imageUrl = image?.url ?? null
    const description = meta?.description ?? ''

    const timeAgo = publishedOn
        ? formatDistanceToNow(new Date(publishedOn), { addSuffix: true })
        : null

    return (
        <Link href={`/${slug}`} className="group block">
            <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">

                {/* Thumbnail */}
                {imageUrl && (
                    <div className="relative shrink-0 w-full sm:w-48 h-36 rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={imageUrl}
                            alt={title ?? ''}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex flex-col justify-between gap-2 flex-1 min-w-0">
                    <div className="flex flex-col gap-1.5">

                        {/* Badge + time */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {timeAgo && (
                                <span className="text-xs text-muted-foreground">· {timeAgo}</span>
                            )}
                        </div>

                        {/* Title */}
                        <h2 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {title}
                        </h2>

                        {/* Description */}
                        {description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            Read Proclamation →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}