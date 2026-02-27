import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { Page } from '@/payload-types'
import React from 'react'

type Props = Page['hero']

export const LowImpactHero: React.FC<Props> = ({ richText, links, media }) => {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl min-h-[420px] flex items-center justify-center">
            {/* Background image */}
            {media && typeof media === 'object' && (
                <div className="absolute inset-0 z-0">
                    <Media
                        resource={media}
                        fill
                        imgClassName="object-cover object-center"
                        priority
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 max-w-3xl mx-auto gap-6">
                {richText && (
                    <RichText
                        data={richText}
                        enableGutter={false}
                        className="[&_h1]:text-5xl [&_h1]:md:text-7xl [&_h1]:font-black [&_h1]:text-white [&_h1]:leading-tight [&_h1]:tracking-tight [&_p]:text-white/70 [&_p]:text-lg [&_p]:leading-relaxed"
                    />
                )}

                {links && links.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                        {links.map(({ link }, i) => (
                            <CMSLink
                                key={i}
                                {...link}
                                className={
                                    i === 0
                                        ? 'inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition-all hover:bg-primary/80'
                                        : 'inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20'
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}