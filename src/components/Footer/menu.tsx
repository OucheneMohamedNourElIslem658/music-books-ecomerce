import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import React from 'react'

interface Props {
  menu: Footer['navItems']
}

export function FooterMenu({ menu }: Props) {
  if (!menu?.length) return null

  return (
    <nav>
      <ul className="flex flex-col gap-2">
        {menu.map((item) => (
          <li key={item.id}>
            <CMSLink
              appearance="link"
              {...item.link}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm p-0"
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}