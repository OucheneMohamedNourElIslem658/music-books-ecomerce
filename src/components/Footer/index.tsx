import type { Footer } from '@/payload-types'

import { FooterMenu } from '@/components/Footer/menu'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { LogoIcon } from '@/components/icons/logo'
import { Separator } from '@/components/ui/separator'

const { COMPANY_NAME, SITE_NAME } = process.env

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '')
  const copyrightName = COMPANY_NAME || SITE_NAME || ''

  return (
    <footer className="text-sm text-muted-foreground">
      <Separator />

      <div className="container py-12">
        <div className="flex w-full flex-col gap-6 text-sm md:flex-row md:gap-12">

          {/* Logo */}
          <div>
            <Link
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors md:pt-1"
              href="/"
            >
              <LogoIcon className="w-6" />
              <span className="sr-only">{SITE_NAME}</span>
            </Link>
          </div>

          {/* Nav */}
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full h-6 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>

          {/* Theme selector */}
          <div className="md:ml-auto flex flex-col gap-4 items-end">
            <ThemeSelector />
          </div>

        </div>
      </div>

      <Separator />

      {/* Bottom bar */}
      <div className="py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:gap-0">
          <p className="text-muted-foreground">
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>

          <Separator orientation="vertical" className="mx-4 hidden h-4 md:inline-block" />

          <p className="text-muted-foreground">Designed in Michigan</p>

          <p className="md:ml-auto">
            <a
              className="text-muted-foreground hover:text-primary transition-colors"
              href="https://payloadcms.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Crafted by Payload
            </a>
          </p>
        </div>
      </div>
    </footer>

  )
}