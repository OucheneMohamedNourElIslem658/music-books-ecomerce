import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import type { Page } from '@/payload-types'
import { Music } from 'lucide-react'
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
            <section className="w-full rounded-2xl bg-[#0f1623] overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-stretch min-h-[580px]">

                    {/* ── Left: Image ───────────────────────────────────────────── */}
                    {media && typeof media === 'object' && (
                        <div className="relative md:w-[45%] shrink-0">
                            {/* NEW RELEASE badge */}
                            <div className="absolute bottom-4 left-4 z-10">
                                <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-black">
                                    New Release
                                </span>
                            </div>
                            <Media
                                resource={media}
                                fill
                                imgClassName="object-cover object-center"
                                priority
                            />
                        </div>
                    )}

                    {/* ── Right: Content ────────────────────────────────────────── */}
                    <div className="flex flex-col justify-center gap-6 p-8 md:p-12 md:w-[55%]">

                        {richText && (
                            <RichText
                                data={richText}
                                enableGutter={false}
                                className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-black [&_h1]:text-white [&_h1]:leading-tight [&_p]:text-white/60 [&_p]:text-base [&_p]:leading-relaxed"
                            />
                        )}

                        {/* CTA buttons */}
                        {links && links.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {links.map(({ link }, i) => (
                                    <CMSLink
                                        key={i}
                                        {...link}
                                        className={
                                            i === 0
                                                ? 'inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/80'
                                                : 'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10'
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* Song preview card */}
                        {hasSong && songGroup?.song && typeof songGroup.song === 'object' && (
                            <div className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-4 mt-2">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                    <Music className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    {songGroup.title && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                            Now Previewing
                                        </span>
                                    )}
                                    <span className="truncate text-sm font-semibold text-white">
                                        {songGroup.title ?? (songGroup.song as { filename?: string }).filename ?? 'Track'}
                                    </span>
                                </div>
                                {/* Decorative waveform bars */}
                                <div className="ml-auto flex items-end gap-[3px] h-5 shrink-0">
                                    {[3, 5, 4, 5, 3, 4, 2].map((h, i) => (
                                        <span
                                            key={i}
                                            className="w-[3px] rounded-full bg-primary/60"
                                            style={{ height: `${h * 4}px` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}