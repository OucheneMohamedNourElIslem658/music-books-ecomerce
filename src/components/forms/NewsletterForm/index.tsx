'use client'

import { Link } from '@/i18n/navigation'
import { Send } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '@/utilities/cn'

type Props = {
  buttonLabel: string
  buttonHref: string
  newTab?: boolean
  appearance?: string
  inputPlaceholder: string
}

export const NewsletterForm: React.FC<Props> = ({
  buttonLabel,
  buttonHref,
  newTab,
  appearance,
  inputPlaceholder,
}) => {
  const [email, setEmail] = useState('')

  const href = email ? `${buttonHref}?email=${encodeURIComponent(email)}` : buttonHref

  return (
    <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={inputPlaceholder}
        className="w-full rounded-full border border-border bg-background/50 px-6 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:flex-1"
      />
      <Link
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all duration-200 shadow-lg",
          appearance === 'outline'
            ? 'border border-border bg-card/50 text-foreground hover:bg-card/80'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
        )}
      >
        {buttonLabel}
        <Send className="h-4 w-4" />
      </Link>
    </div>
  )
}
