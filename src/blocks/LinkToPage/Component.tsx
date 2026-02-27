import { CMSLink, CMSLinkType } from '@/components/Link'
import type { Media } from '@/payload-types'
import Image from 'next/image'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type LinkItem = {
    link: CMSLinkType
    id?: string
}

export type LinkToPageBlockProps = {
    id?: DefaultDocumentIDType
    className?: string
    image: Media | string
    title: string
    description?: string
    links?: LinkItem[]
}

export const LinkToPageBlock: React.FC<LinkToPageBlockProps> = ({
    image,
    title,
    description,
    links,
}) => {
    const imageUrl = typeof image === 'string' ? image : (image?.url ?? '')
    const imageAlt = typeof image === 'string' ? title : (image?.alt ?? title)

    return (
        <div className='container'>
            <div className="group flex items-center gap-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">

                {/* Portrait */}
                <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-300 group-hover:bg-primary/40" />
                    <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-white/10 transition-all duration-300 group-hover:ring-primary/50">
                        <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 min-w-0">
                    <h3 className="text-xl font-bold text-white">{title}</h3>

                    {description && (
                        <p className="text-sm leading-relaxed text-white/60 line-clamp-3">
                            {description}
                        </p>
                    )}

                    {/* Links */}
                    {links && links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            {links.map(({ link, id }, i) => (
                                <CMSLink
                                    key={id ?? i}
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
        </div>
    )
}