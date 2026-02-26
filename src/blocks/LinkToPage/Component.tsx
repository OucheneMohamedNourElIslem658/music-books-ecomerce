import type { Media, Page } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type CMSLink = {
    link: {
        type?: 'reference' | 'custom'
        newTab?: boolean
        reference?: { relationTo: 'pages'; value: Page | string }
        url?: string
        label: string
        appearance?: string
    }
    id?: string
}

export type LinkToPageBlockProps = {
    id?: DefaultDocumentIDType
    className?: string
    image: Media | string
    title: string
    description?: string
    links?: CMSLink[]
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
                        <p className="text-sm leading-relaxed text-white/60 line-clamp-3">{description}</p>
                    )}

                    {/* Links */}
                    {links && links.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {links.map(({ link, id }) => {
                                const href =
                                    link.type === 'reference'
                                        ? `/${(link.reference?.value as Page)?.slug ?? ''}`
                                        : (link.url ?? '#')

                                return (
                                    <Link
                                        key={id}
                                        href={href}
                                        target={link.newTab ? '_blank' : undefined}
                                        rel={link.newTab ? 'noopener noreferrer' : undefined}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-all duration-200 hover:border-primary/50 hover:text-white hover:bg-primary/10"
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}