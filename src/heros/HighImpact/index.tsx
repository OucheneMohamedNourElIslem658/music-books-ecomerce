'use client'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { SongPreview } from '@/components/SongPreview'
import { Badge } from '@/components/ui/badge'
import type { Page } from '@/payload-types'
import React from 'react'

type Props = Page['hero']

export const HighImpactHero: React.FC<Props> = ({
    richText,
    links,
    media,
    hasSong,
    songGroup,
}) => {
    return (
        <div className="container">
            <section className="relative bg-card/50 border border-border rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-lg magical-gradient">
                {/* Background Texture Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />

                <div className="@container">
                    <div className="flex flex-col gap-10 px-8 py-12 lg:flex-row lg:items-center min-h-[600px]">

                        {/* Left side: Hero Image */}
                        <div className="w-full relative group lg:w-1/2 max-w-[500px] mx-auto lg:mx-0">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border-4 border-border/10 shadow-xl transform hover:scale-[1.01] transition-transform duration-500 bg-muted">
                                {media && typeof media === 'object' && (
                                    <Media
                                        resource={media}
                                        fill
                                        imgClassName="object-cover object-center"
                                        priority
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <Badge className="bg-accent-gold text-primary-foreground border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent-gold/90">
                                        New Release
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Right side: Content */}
                        <div className="flex flex-col gap-8 lg:w-1/2 lg:justify-center">
                            <div className="space-y-6">
                                {richText && (
                                    <RichText
                                        data={richText}
                                        enableGutter={false}
                                        className="[&_h1]:text-4xl [&_h1]:md:text-6xl [&_h1]:font-black [&_h1]:leading-tight [&_h1]:tracking-tighter [&_h1_em]:text-primary [&_h1_em]:italic [&_p]:text-lg [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:max-w-md"
                                    />
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
                                    thumbnail={media}
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
