import { CMSLink } from '@/components/Link'
import { Link } from '@/i18n/navigation'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { BookOpenText } from 'lucide-react'
import { LocaleSwitcher } from '../LocaleSwitcher'

export async function Footer() {
  const footer = await getCachedGlobal('footer', 1)()
  const currentYear = new Date().getFullYear()

  const links = footer.navItems || []

  // 4 links per column, spills into a second column beyond that
  const col1 = links.slice(0, 4)
  const col2 = links.slice(4)

  return (
    <footer className="bg-card border-t border-border py-16 px-6 lg:px-20 transition-colors">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

        {/* Brand */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-primary transition-transform group-hover:scale-110 duration-300">
              <BookOpenText className="size-8" />
            </div>
            <h2 className="text-lg font-black tracking-tight uppercase text-foreground">
              The Enchanted Bookshop
            </h2>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Creating immersive musical experiences that bring stories to life through the power of symphonic orchestration.
          </p>
        </div>

        {/* Nav links — single column when ≤4 items, splits into two columns beyond that */}
        {col2.length === 0 ? (
          // Single column
          <ul className="flex flex-col gap-4">
            {col1.map((item: any) => (
              <li key={item.id}>
                <CMSLink
                  {...item.link}
                  appearance="link"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium p-0"
                />
              </li>
            ))}
          </ul>
        ) : (
          // Two columns
          <>
            <ul className="flex flex-col gap-4">
              {col1.map((item: any) => (
                <li key={item.id}>
                  <CMSLink
                    {...item.link}
                    appearance="link"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium p-0"
                  />
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-4">
              {col2.map((item: any) => (
                <li key={item.id}>
                  <CMSLink
                    {...item.link}
                    appearance="link"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium p-0"
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Theme + locale — always last column */}
        <div className="flex gap-4 lg:col-start-4">
          <LocaleSwitcher />
          <ThemeSelector />
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
          © {currentYear} The Enchanted Bookshop. All Spells Reserved by the Guild of Musical Bards.
        </p>
      </div>
    </footer>
  )
}