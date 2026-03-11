'use client'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { SongPreview } from '@/components/SongPreview'
import { Badge } from '@/components/ui/badge'
import type { Page } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

type Props = Page['hero']

export const LowImpactHero: React.FC<Props> = ({
  richText,
  links,
  media,
  eyebrow,
  hasSong,
  songGroup
}) => {
  return (
    <div data-theme="dark" className="container py-8 md:py-12">
      <section className="relative w-full overflow-hidden rounded-[2.5rem] min-h-130 flex items-center justify-center shadow-sm border border-border bg-card transition-all duration-300">

        {/* Background Media with Theme-Aware Overlay */}
        {media && typeof media === 'object' && (
          <div className="absolute inset-0 z-0">
            <Media
              resource={media}
              fill
              imgClassName="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/60 to-background/95" />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 py-16 max-w-3xl mx-auto gap-8">

          {/* Eyebrow Badge */}
          {eyebrow && (
            <Badge className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/20 backdrop-blur-md hover:bg-primary/20">
              {eyebrow}
            </Badge>
          )}

          {/* Title and Description via RichText - Spacing minimized to gap-0 and zeroed margins */}
          {richText && (
            <RichText
              data={richText}
              enableGutter={false}
              className={cn(
                "flex flex-col items-center",
                "[&_h1]:text-foreground [&_h1]:text-5xl [&_h1]:md:text-7xl [&_h1]:font-black [&_h1]:leading-tight [&_h1]:tracking-tighter [&_h1]:m-0",
                "[&_h1_em]:text-primary [&_h1_em]:not-italic",
                "[&_p]:text-muted-foreground [&_p]:text-lg [&_p]:md:text-xl [&_p]:font-normal [&_p]:max-w-lg [&_p]:leading-relaxed [&_p]:m-0 [&_p]:mt-1"
              )}
            />
          )}

          {/* Action Buttons */}
          {links && links.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance={i === 0 ? 'default' : 'outline'}
                />
              ))}
            </div>
          )}

          {/* Song Preview Widget */}
          {hasSong && (
            <SongPreview
              song={songGroup?.song}
              title={songGroup?.title}
              thumbnail={media}
              className="max-w-sm"
            />
          )}
        </div>

        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(var(--foreground-rgb),0.02)_1px,transparent_0)] bg-size-[32px_32px] pointer-events-none opacity-20" />
      </section>
    </div>
  )
}
