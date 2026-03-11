import { Link } from '@/i18n/navigation'
import type { Media, Page } from '@/payload-types'
import { extractHeroText } from '@/utilities/extractTextFromNode'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import React from 'react'
import { useTranslations } from 'next-intl'

type Props = {
    post: Partial<Page> & { id: string | number }
}

export const ChronicleGridItem: React.FC<Props> = ({ post }) => {
    const t = useTranslations('chronicles')
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
        <article className="parchment-glow bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 group hover:scale-[1.01]">
            {/* Thumbnail */}
            {imageUrl && (
                <div className="md:w-1/3 min-h-[240px] relative overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={displayTitle}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
            )}

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 border border-primary/20 rounded-full bg-primary/5">
                            {hero?.eyebrow || 'Chronicle'}
                        </span>
                        {timeAgo && (
                            <span className="text-muted-foreground text-xs font-medium italic">{timeAgo}</span>
                        )}
                    </div>
                    
                    <Link href={`/${slug}`}>
                        <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight italic">
                            {displayTitle}
                        </h3>
                    </Link>
                    
                    {description && (
                        <p className="text-muted-foreground text-base leading-relaxed mb-6 line-clamp-3 font-medium">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl">auto_stories</span>
                        </div>
                        <span className="text-sm font-bold text-foreground/80 tracking-tight">Archivist</span>
                    </div>
                    
                    <Link 
                        href={`/${slug}`} 
                        className="flex items-center gap-2 text-primary text-sm font-black uppercase tracking-widest group/link"
                    >
                        {t('readProclamation')}
                        <span className="material-symbols-outlined text-base group-hover/link:translate-x-1 transition-transform">arrow_right_alt</span>
                    </Link>
                </div>
            </div>
        </article>
    )
}