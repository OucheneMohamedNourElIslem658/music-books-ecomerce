'use client'

import type { Header as HeaderType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { MenuIcon, BookOpenText, LogOut, LayoutDashboard, User } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'

interface Props {
  menu: HeaderType['navItems']
}

export function MobileMenu({ menu }: Props) {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-primary/10 rounded-full transition-colors text-muted-foreground hover:text-primary active:scale-95">
          <MenuIcon className="size-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="px-6 border-l border-border bg-background/95 backdrop-blur-xl">
        <SheetHeader className="px-0 pt-4 pb-6 border-b border-border mb-6">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <BookOpenText className="size-8" />
            </div>
            <SheetTitle className="text-lg font-black tracking-tight uppercase">The Enchanted Bookshop</SheetTitle>
          </div>
          <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Archives</p>
            <ul className="flex flex-col gap-2">
              {menu?.map((item) => {
                const href = item.link.type === 'reference' 
                  ? (typeof item.link.reference?.value === 'object' ? `/${item.link.reference.value.slug}` : '#')
                  : (item.link.url ?? '#')
                
                const isActive = href !== '/' ? pathname.includes(href) : pathname === '/'

                return (
                  <li key={item.id}>
                    <Link
                      href={href}
                      className={cn(
                        "text-lg font-bold transition-colors block py-2",
                        isActive ? "text-primary pl-4 border-l-2 border-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Account</p>
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/account" 
                    className="flex items-center gap-3 text-lg font-bold text-muted-foreground hover:text-foreground py-2"
                  >
                    <User className="size-5" />
                    Manage Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    className="flex items-center gap-3 text-lg font-bold text-muted-foreground hover:text-foreground py-2"
                  >
                    <LayoutDashboard className="size-5" />
                    Order History
                  </Link>
                </div>
                <Button asChild variant="outline" className="rounded-full font-bold w-full justify-start py-6 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20 mt-4">
                  <Link href="/logout" className="flex items-center gap-3">
                    <LogOut className="size-5" />
                    Leave the Fellowship
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button asChild className="rounded-full font-bold py-6 text-base shadow-lg shadow-primary/20 bg-primary">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full font-bold py-6 text-base border-border bg-card/50">
                  <Link href="/create-account">Join Fellowship</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
