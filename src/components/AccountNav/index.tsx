'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { Castle, Compass, BookOpen, Sparkles, LogOutIcon } from 'lucide-react'

type Props = {
  className?: string
}

const navItems = [
  { href: '/account', label: 'Home Portal', icon: Castle },
  { href: '/account/addresses', label: 'Coordinates', icon: Compass },
  { href: '/orders', label: 'Acquisitions', icon: BookOpen },
  { href: '/account/reviews', label: 'Whispers', icon: Sparkles },
]

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      <ul className="flex flex-col gap-2 w-full">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/account' && pathname.startsWith(href))

          return (
            <li key={href} className="w-full">
              <Link 
                href={href}
                className={cn(
                  'flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 glowing-primary active:scale-[0.98]' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-[0.98]'
                )}
              >
                <Icon className={cn(
                  'size-5 transition-transform duration-300 group-hover:scale-110',
                  isActive ? 'text-primary-foreground' : 'text-primary/70 dark:text-primary/60'
                )} />
                <span className="font-bold text-sm uppercase tracking-widest">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="my-4 border-t border-border/50" />

      <Link 
        href="/logout"
        className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group active:scale-[0.98]"
      >
        <LogOutIcon className="size-5 text-muted-foreground/70 group-hover:text-destructive transition-colors" />
        <span className="font-bold text-sm uppercase tracking-widest text-inherit">Banish Session</span>
      </Link>
    </div>
  )
}
