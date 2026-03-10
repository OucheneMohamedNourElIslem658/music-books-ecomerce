import { CMSLink } from '@/components/Link'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Link } from '@/i18n/navigation'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import {
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  Twitter,
  Youtube
} from 'lucide-react'

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  discord: Music2,
  pinterest: Music2,
  linkedin: Linkedin,
  tiktok: Music2,
}

export async function Footer() {
  const footer = await getCachedGlobal('footer', 4)()
  const { tagline, groups, socials, copyright } = footer
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-card/40 mt-auto">
      {/* Main grid */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2 w-fit group">
              <span className="text-accent-gold text-xl">✦</span>
              <span className="font-black text-base text-foreground uppercase tracking-widest">
                Melody & Myth
              </span>
            </Link>

            {tagline && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tagline}
              </p>
            )}

            {/* Socials */}
            {socials?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {socials.map((social: any, i: number) => {
                  const Icon = SOCIAL_ICONS[social.platform] ?? Music2
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="size-9 rounded-xl border border-border bg-background/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <Icon className="size-4" />
                    </a>
                  )
                })}
              </div>
            )}

            {/* Theme + locale */}
            <div className="flex items-center gap-3 mt-auto pt-2">
              <LocaleSwitcher />
              <ThemeSelector />
            </div>
          </div>

          {/* Dynamic link groups */}
          {groups?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {groups.map((group: any, i: number) => (
                <div key={i} className="flex flex-col gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground border-b border-border pb-2">
                    {group.label}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {group.links?.map((item: any, j: number) => (
                      <li key={j}>
                        <CMSLink
                          {...item.link}
                          appearance="link"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors p-0 font-medium"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {copyright ?? `© ${currentYear} Melody & Myth. All rights reserved.`}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-accent-gold text-xs">✦</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Crafted with magic
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}