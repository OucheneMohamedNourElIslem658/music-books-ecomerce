'use client'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type LinkItem = {
    link: any
    id?: string
}

export type LinkToPageBlockProps = {
    id?: DefaultDocumentIDType
    className?: string
    image: any
    title: string
    description?: string
    links?: LinkItem[]
}

export const LinkToPageBlock: React.FC<LinkToPageBlockProps> = ({
    image,
    title,
    description,
    links,
    className,
}) => {
    return (
        <div className={cn('container', className)}>
            <section className="relative bg-card/50 border border-border rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-sm backdrop-blur-md transition-all duration-300">
                {/* Background Texture Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(var(--foreground-rgb),0.02)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none opacity-20" />

                <div className="relative z-10 flex flex-col gap-10 sm:flex-row sm:items-center">

                    {/* Portrait Image with Gold Glow */}
                    <div className="relative size-48 shrink-0 mx-auto sm:mx-0">
                        <div className="absolute -inset-2 bg-accent-gold rounded-full blur opacity-20" />
                        <div className="relative size-full overflow-hidden rounded-full border-4 border-border/10 shadow-2xl bg-muted">
                            {image && (
                                <Media
                                    resource={image}
                                    fill
                                    imgClassName="object-cover object-center transition-transform duration-700 hover:scale-105"
                                />
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col gap-4 text-center sm:text-left flex-1">
                        <h2 className="text-foreground text-3xl font-bold tracking-tight">
                            {title}
                        </h2>

                        {description && (
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                                {description}
                            </p>
                        )}

                        {/* Achievement Links / Action Buttons */}
                        {links && links.length > 0 && (
                            <div className="flex flex-wrap gap-4 justify-center sm:justify-start mt-2">
                                {links.map(({ link }, i) => (
                                    <CMSLink
                                        key={i}
                                        {...link}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
