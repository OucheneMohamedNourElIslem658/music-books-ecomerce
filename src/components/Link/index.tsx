import type { Page, Product } from '@/payload-types'

import { Button, type ButtonProps } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import React from 'react'

export type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Product | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${reference.value.slug
      }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? undefined : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button
      asChild
      className={cn(
        appearance === 'default' &&
        'rounded-full font-bold px-6 py-4 text-base shadow-lg shadow-primary/20 h-auto',
        appearance === 'outline' &&
        'rounded-full font-bold px-6 py-4 text-base border-border bg-card/50 backdrop-blur-sm h-auto hover:bg-card/80 text-secondary-foreground',
        appearance === 'link' && 'text-sm text-muted-foreground hover:text-foreground transition-colors p-0 font-medium',
        className,
      )}
      size={size}
      variant={appearance}
    >
      <Link className={className} href={href} {...newTabProps}>
        {children && children}
        {label && label}
      </Link>
    </Button>
  )
}
