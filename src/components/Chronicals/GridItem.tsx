import type { Media, Page } from '@/payload-types'
import { extractHeroText } from '@/utilities/extractTextFromNode'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    post: Partial<Page> & { id: string | number }
}

export const ChronicleGridItem: React.FC<Props> = ({ post }) => {
    const { title, slug, meta, publishedOn, hero } = post

    // --- Image: hero media first, fallback to SEO image ---
    const heroMedia = hero?.media as Media | undefined
    const seoImage = meta?.image as Media | undefined
    const imageUrl = heroMedia?.url ?? seoImage?.url ?? null

    // --- Title: hero title (authorHeader type) > page title > SEO title ---
    const displayTitle = hero?.title || title || meta?.title || ''

    // --- Description: meta desc > hero rich text excerpt ---
    const metaDesc = meta?.description ?? ''
    const heroExcerpt = hero?.richText ? extractHeroText(hero.richText) : ''
    const description = metaDesc || heroExcerpt || hero?.quote

    const timeAgo = publishedOn
        ? formatDistanceToNow(new Date(publishedOn), { addSuffix: true })
        : null

    return (
        <Link href={`/${slug}`} className="group block">
            <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">

                {/* Thumbnail */}
                {imageUrl && (
                    <div className="relative shrink-0 w-full sm:w-44 h-32 rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={imageUrl}
                            alt={displayTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex flex-col justify-between gap-2 flex-1 min-w-0">
                    <div className="flex flex-col gap-1.5">

                        {/* Time */}
                        {timeAgo && (
                            <span className="text-xs text-muted-foreground">{timeAgo}</span>
                        )}

                        {/* Title */}
                        <h2 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {displayTitle}
                        </h2>

                        {/* Description — meta desc preferred, hero rich text as fallback */}
                        {description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {description}
                            </p>
                        )}

                        {/* If both exist, show hero excerpt as secondary line */}
                        {metaDesc && heroExcerpt && metaDesc !== heroExcerpt && (
                            <p className="text-xs text-muted-foreground/70 line-clamp-1 leading-relaxed italic">
                                {heroExcerpt}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                        {/* SEO title badge — shown only if different from display title */}
                        {meta?.title && meta.title !== displayTitle && (
                            <span className="text-[11px] text-muted-foreground/60 truncate">
                                {meta.title}
                            </span>
                        )}
                        <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-auto">
                            Read Proclamation →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}