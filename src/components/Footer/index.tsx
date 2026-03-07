import { CMSLink } from '@/components/Link'
import { Link } from '@/i18n/navigation'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { BookOpenText, Instagram, Music2, Twitter, Youtube } from 'lucide-react'

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
  twitter: Twitter,
}

export async function Footer() {
  const footer = await getCachedGlobal('footer', 1)()
  const currentYear = new Date().getFullYear()

  const links = footer.navItems || []

  return (
    <footer className="bg-card border-t border-border py-16 px-6 lg:px-20 transition-colors">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

        {/* Column 1: Brand */}
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

        <ul className="flex flex-col gap-4">
          {links.map((item: any) => (
            <li key={item.id}>
              <CMSLink
                {...item.link}
                appearance="link"
                className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium p-0"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto pt-8 border-t border-border text-center">
        <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
          © {currentYear} The Enchanted Bookshop. All Spells Reserved by the Guild of Musical Bards.
        </p>
      </div>
    </footer>
  )
}
