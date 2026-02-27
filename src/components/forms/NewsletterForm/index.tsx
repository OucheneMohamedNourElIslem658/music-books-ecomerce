'use client'

import { Mail } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

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
        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 sm:flex-row">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full rounded-full border border-primary/40 bg-[#0a1428] px-5 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:flex-1"
            />
            <Link
                href={href}
                target={newTab ? '_blank' : undefined}
                rel={newTab ? 'noopener noreferrer' : undefined}
                className={
                    appearance === 'outline'
                        ? 'inline-flex shrink-0 items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white'
                        : 'inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-primary/80'
                }
            >
                {buttonLabel}
                <Mail className="h-4 w-4" />
            </Link>
        </div>
    )
}