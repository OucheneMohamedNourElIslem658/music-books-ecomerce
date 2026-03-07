'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import type { Header } from 'src/payload-types'
import { Logo } from '../Logo/Logo'
import { MobileMenu } from './MobileMenu'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-6 py-4 lg:px-20">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo & Title */}
          <Link href="/" className="group">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menu.map((item) => {
              const href = item.link.type === 'reference'
                ? (typeof item.link.reference?.value === 'object' ? `/${item.link.reference.value.slug}` : '#')
                : (item.link.url ?? '#')

              const isActive = href !== '/' ? pathname.includes(href) : pathname === '/'

              return (
                <Link
                  key={item.id}
                  href={href}
                  className={cn(
                    "text-sm font-bold transition-all hover:text-primary relative py-1 group/link",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.link.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                    isActive ? "w-full" : "w-0 group-hover/link:w-full"
                  )} />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>

            <Link
              href="/account"
              className="p-2 hover:bg-primary/10 rounded-full transition-colors text-muted-foreground hover:text-primary active:scale-95"
            >
              <User className="size-6" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="block lg:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  )
}
