'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
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
      <SelectTrigger className="w-auto bg-transparent gap-2 md:pl-3 border-none">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem
            key={loc}
            value={loc}
            onSelect={() => switchLocale(loc)}
            disabled={isPending}
          >
            {loc.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}