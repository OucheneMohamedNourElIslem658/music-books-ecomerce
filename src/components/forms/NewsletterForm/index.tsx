'use client'

import { CMSLink, CMSLinkType } from '@/components/Link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
  link: CMSLinkType
  inputPlaceholder: string
}

export const NewsletterForm: React.FC<Props> = ({
  link,
  inputPlaceholder
}) => {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`${link.url}?email=${encodeURIComponent(email)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={inputPlaceholder}
        className="w-full rounded-full border border-border bg-background/50 px-6 py-4 text-md text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:flex-1"
      />
      <button type="submit" className="relative">
        <CMSLink {...link} className="pointer-events-none" />
      </button>
    </form>
  )
}