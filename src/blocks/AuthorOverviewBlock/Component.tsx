'use client'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { SongPreview } from '@/components/SongPreview'
import type { Media as MediaType } from '@/payload-types'
import { Edit3 } from 'lucide-react'
import React from 'react'

export type AuthorOverviewBlockProps = {
  eyebrow?: string
  title: string
  quote?: string
  image: any
  hasSong?: boolean
  songGroup?: {
    title?: string | null
    song?: (number | null) | MediaType
  }
  links?: {
    link: any
  }[]
}

export const AuthorOverviewBlock: React.FC<AuthorOverviewBlockProps> = ({
  eyebrow,
  title,
  quote,
  image,
  hasSong,
  songGroup,
  links,
}) => {
  return (
    <div className="container">
      <section className="relative bg-card/50 border border-border rounded-[2.5rem] overflow-hidden mb-12 backdrop-blur-md shadow-sm">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(var(--foreground-rgb),0.02)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="@container">
          <div className="flex flex-col gap-10 px-8 py-12 lg:flex-row lg:items-center">
            
            {/* Left side: Author Image */}
            <div className="w-full relative group lg:w-1/2 max-w-[500px] mx-auto lg:mx-0">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border-4 border-border/10 shadow-md">
                {image && (
                  <Media
                    resource={image}
                    fill
                    imgClassName="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
            </div>

            {/* Right side: Content */}
            <div className="flex flex-col gap-8 lg:w-1/2 lg:justify-center">
              <div className="space-y-6">
                {/* Eyebrow Label */}
                {eyebrow && (
                  <div className="inline-flex items-center gap-2 text-primary">
                    <Edit3 className="size-4" />
                    <span className="uppercase tracking-[0.2em] text-[10px] font-black">{eyebrow}</span>
                  </div>
                )}

                {/* Main Title */}
                <h2 className="text-foreground text-4xl @[480px]:text-6xl font-black leading-tight tracking-tighter">
                  {title}
                </h2>

                {/* Blockquote/Text */}
                {quote && (
                  <div className="relative">
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed italic border-l-4 border-primary/50 pl-6 py-2 bg-primary/5 rounded-r-lg">
                      &quot;{quote}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {links?.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance={i === 0 ? 'default' : 'outline'}
                  />
                ))}
              </div>

              {/* Song Preview Widget */}
              {hasSong && (
                <SongPreview 
                  song={songGroup?.song} 
                  title={songGroup?.title} 
                  thumbnail={image}
                  className="max-w-sm"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
