'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import type { Header } from 'src/payload-types'
import { Logo } from '../Logo/Logo'
import { Button } from '../ui/button'
import { MobileMenu } from './MobileMenu'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const t = useTranslations('header')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-6 py-4 lg:px-20">
      <div className="max-w-350 mx-auto flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-12">
          <Link href="/" className="group">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menu.map((item) => {
              const href =
                item.link.type === 'reference'
                  ? typeof item.link.reference?.value === 'object'
                    ? `/${item.link.reference.value.slug}`
                    : '#'
                  : item.link.url ?? '#'

              const isActive =
                href !== '/' ? pathname.includes(href) : pathname === '/'

              return (
                <Link
                  key={item.id}
                  href={href}
                  className={cn(
                    'text-sm font-bold transition-all hover:text-primary relative py-1 group/link',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.link.label}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover/link:w-full'
                    )}
                  />
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>

          {/* Auth / Loading */}
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
              <div className="h-9 w-20 rounded-full bg-muted animate-pulse hidden sm:block" />
            </div>
          ) : user ? (
            <>
              <Link
                href="/account"
                aria-label={t('account')}
                className="p-2 hover:bg-primary/10 rounded-full transition-colors text-muted-foreground hover:text-primary active:scale-95"
              >
                <User className="size-6" />
              </Link>

              <div className="block lg:hidden">
                <Suspense fallback={null}>
                  <MobileMenu menu={menu} />
                </Suspense>
              </div>
            </>
          ) : (
            <>
              <Button className="rounded-full" variant="outline">
                <Link href="/create-account" className="text-sm font-bold px-2">
                  {t('register')}
                </Link>
              </Button>
              <Button className="rounded-full">
                <Link href="/login" className="text-sm font-bold px-2">
                  {t('login')}
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}