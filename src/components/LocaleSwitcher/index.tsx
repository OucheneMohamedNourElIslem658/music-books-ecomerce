'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Languages } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (next: (typeof routing.locales)[number]) => {
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <Select
      value={locale}
      onValueChange={(value) => switchLocale(value as (typeof routing.locales)[number])}
      disabled={isPending}
    >
      <SelectTrigger aria-label="Change language" className="w-auto bg-primary/5 hover:bg-primary/10 transition-colors gap-2 px-4 h-8 rounded-full border-none text-muted-foreground hover:text-primary">
        <Languages className="size-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-md border-border rounded-xl">
        {routing.locales.map((loc) => (
          <SelectItem
            key={loc}
            value={loc}
            className="font-bold text-xs uppercase tracking-widest cursor-pointer focus:bg-primary focus:text-primary-foreground"
          >
            {loc}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
