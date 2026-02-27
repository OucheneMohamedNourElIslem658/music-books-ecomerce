import type { Page } from '@/payload-types'
import React from 'react'

import { AuthorOverviewBlock } from '@/blocks/AuthorOverviewBlock/Component'
import { HighImpactHero } from './HighImpact'
import { LowImpactHero } from './LowImpact'

type HeroProps = Page['hero']

export const RenderHero: React.FC<HeroProps> = (props) => {
    const { type } = props || {}

    if (!type || type === 'none') return null

    if (type === 'authorHeader') {
        const { eyebrow, title, quote, media, links } = props
        if (!title || !media) return null

        return (
            <AuthorOverviewBlock
                eyebrow={eyebrow ?? undefined}
                title={title}
                quote={quote ?? undefined}
                image={typeof media === 'number' ? media.toString() : media}
                links={links ?? undefined}
            />
        )
    }

    if (type === 'highImpact') return <HighImpactHero {...props} />
    if (type === 'lowImpact') return <LowImpactHero {...props} />

    return null
}