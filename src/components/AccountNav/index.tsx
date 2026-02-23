'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utilities/cn'
import { LogOutIcon, MapPinIcon, PackageIcon, SettingsIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

const navItems = [
  { href: '/account', label: 'Account Settings', icon: SettingsIcon },
  { href: '/account/addresses', label: 'Addresses', icon: MapPinIcon },
  { href: '/orders', label: 'Orders', icon: PackageIcon },
  { href: '/account/reviews', label: 'Reviews', icon: StarIcon },
]

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <ul className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/orders'
              ? pathname.includes('/orders')
              : pathname === href

          return (
            <li key={href}>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors',
                  isActive && 'text-primary bg-primary/10 font-medium hover:text-primary',
                )}
              >
                <Link href={href}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              </Button>
            </li>
          )
        })}
      </ul>

      <Separator />

      <Button
        asChild
        variant="ghost"
        className={cn(
          'w-full justify-start gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors',
          pathname === '/logout' && 'text-primary bg-primary/10',
        )}
      >
        <Link href="/logout">
          <LogOutIcon className="size-4" />
          Log out
        </Link>
      </Button>
    </div>
  )
}