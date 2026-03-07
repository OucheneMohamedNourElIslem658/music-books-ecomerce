'use client'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import type { Page } from '@/payload-types'
import { SendHorizonal } from 'lucide-react'
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
    <div className="container">
      <section className="relative overflow-hidden bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8 md:p-16 text-center">
        {/* Decorative background icon */}
        <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
          <SendHorizonal className="size-32 md:size-48 text-primary" strokeWidth={1} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-foreground text-3xl md:text-4xl font-black mb-4 tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          <NewsletterForm
            buttonLabel={link?.label || 'Subscribe'}
            buttonHref={href}
            newTab={link?.newTab}
            appearance={link?.appearance}
            inputPlaceholder={inputPlaceholder ?? 'Enter your email address...'}
          />
        </div>
      </section>
    </div>
  )
}
