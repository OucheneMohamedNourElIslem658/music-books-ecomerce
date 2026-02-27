import type { Media, Page } from '@/payload-types'
import { FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type CMSLink = {
    link: {
        type?: 'reference' | 'custom' | null
        newTab?: boolean | null
        reference?: { relationTo: 'pages'; value: Page | number } | null
        url?: string | null
        label: string
        appearance?: string | null
    }
    id?: string | null
}

export type AuthorOverviewBlockProps = {
    id?: DefaultDocumentIDType
    className?: string
    eyebrow?: string
    title: string
    quote?: string
    image: Media | string
    links?: CMSLink[]
}

export const AuthorOverviewBlock: React.FC<AuthorOverviewBlockProps> = ({
    eyebrow,
    title,
    quote,
    image,
    links,
}) => {
    const imageUrl = typeof image === 'string' ? image : (image?.url ?? '')
    const imageAlt = typeof image === 'string' ? title : (image?.alt ?? title)

    return (
        <div className='container'>
            <section className="w-full rounded-2xl border border-white/10 bg-[#0f1623] p-6 md:p-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">

                    {/* Image */}
                    <div className="relative shrink-0 md:w-[42%]">
                        <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-2xl" />
                        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl ring-2 ring-primary/30">
                            <Image
                                src={imageUrl}
                                alt={imageAlt}
                                fill
                                className="object-cover object-top"
                                priority
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-5 md:w-[58%]">

                        {/* Eyebrow */}
                        {eyebrow && (
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                    {eyebrow}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
                            {title}
                        </h2>

                        {/* Quote */}
                        {quote && (
                            <blockquote className="border-l-4 border-primary pl-4 text-lg italic leading-relaxed text-white/60">
                                {quote}
                            </blockquote>
                        )}

                        {/* Links */}
                        {links && links.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-2">
                                {links.map(({ link, id }, i) => {
                                    const href =
                                        link.type === 'reference'
                                            ? `/${(link.reference?.value as Page)?.slug ?? ''}`
                                            : (link.url ?? '#')

                                    const isPrimary = link.appearance === 'default' || i === 0

                                    return (
                                        <Link
                                            key={id ?? i}
                                            href={href}
                                            target={link.newTab ? '_blank' : undefined}
                                            rel={link.newTab ? 'noopener noreferrer' : undefined}
                                            className={
                                                isPrimary
                                                    ? 'inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-primary/80'
                                                    : 'inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white/10'
                                            }
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}