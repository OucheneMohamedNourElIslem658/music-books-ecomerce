import { NewsletterForm } from '@/components/forms/NewsletterForm'
import type { Page } from '@/payload-types'
import { Puzzle } from 'lucide-react'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type CMSLink = {
    type?: 'reference' | 'custom'
    newTab?: boolean
    reference?: { relationTo: 'pages'; value: Page | string }
    url?: string
    label: string
    appearance?: string
}

export type LinkToContactBlockProps = {
    id?: DefaultDocumentIDType
    className?: string
    title: string
    description?: string
    inputPlaceholder?: string
    link: CMSLink
}

export const LinkToContactBlock: React.FC<LinkToContactBlockProps> = ({
    title,
    description,
    inputPlaceholder,
    link,
}) => {
    const href =
        link?.type === 'reference'
            ? `/${(link.reference?.value as Page)?.slug ?? ''}`
            : (link?.url ?? '#')

    return (
        <section className="relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-[#0d1a3a] px-8 py-12 text-center">

            {/* Decorative background icon */}
            <div className="pointer-events-none absolute right-6 top-4 opacity-10">
                <Puzzle className="h-24 w-24 text-white" strokeWidth={1} />
            </div>

            <h2 className="text-2xl font-extrabold text-white md:text-3xl">{title}</h2>

            {description && (
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55">
                    {description}
                </p>
            )}

            <NewsletterForm
                buttonLabel={link?.label}
                buttonHref={href}
                newTab={link?.newTab}
                appearance={link?.appearance}
                inputPlaceholder={inputPlaceholder ?? 'Enter your email address...'}
            />
        </section>
    )
}