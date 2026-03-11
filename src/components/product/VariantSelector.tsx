'use client'

import type { Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function VariantSelector({ product }: { product: Product }) {
  const t = useTranslations('product.variants')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const variants = product.variants?.docs
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants?.length && variantTypes?.length)

  if (!hasVariants) return null

  return (
    <div className="flex flex-col gap-6">
      {variantTypes?.map((type) => {
        if (!type || typeof type !== 'object') return null

        const options = type.options?.docs
        if (!options || !Array.isArray(options) || !options.length) return null

        return (
          <div key={type.id}>
            {/* Label */}
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
              {type.label}
            </p>

            {/* Options */}
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                if (!option || typeof option !== 'object') return null

                const optionSearchParams = new URLSearchParams(searchParams.toString())
                optionSearchParams.delete('variant')
                optionSearchParams.delete('image')
                optionSearchParams.set(type.name, String(option.id))

                const currentOptions = Array.from(optionSearchParams.values())

                let isAvailableForSale = true
                if (variants) {
                  const matchingVariant = variants
                    .filter((v) => typeof v === 'object')
                    .find((v) => {
                      if (!v.options || !Array.isArray(v.options)) return false
                      return v.options.every((vo) =>
                        typeof vo !== 'object'
                          ? currentOptions.includes(String(vo))
                          : currentOptions.includes(String(vo.id)),
                      )
                    })

                  if (matchingVariant) {
                    optionSearchParams.set('variant', String(matchingVariant.id))
                    isAvailableForSale = Boolean(matchingVariant.inventory && matchingVariant.inventory > 0)
                  }
                }

                const isActive =
                  isAvailableForSale &&
                  searchParams.get(type.name) === String(option.id)

                const optionUrl = createUrl(pathname, optionSearchParams)

                return (
                  <button
                    key={option.id}
                    disabled={!isAvailableForSale}
                    onClick={() => router.replace(optionUrl, { scroll: false })}
                    title={`${option.label}${!isAvailableForSale ? ` (${t('outOfStock')})` : ''}`}
                    className={cn(
                      // Base
                      'relative px-5 py-2 rounded-full text-sm font-bold border transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold',
                      // Inactive
                      'border-border text-muted-foreground hover:border-accent-gold/50 hover:text-foreground',
                      // Active
                      isActive && [
                        'border-accent-gold bg-accent-gold/10 text-foreground',
                        'shadow-[0_0_12px_oklch(var(--accent-gold)/0.2)]',
                      ],
                      // Out of stock
                      !isAvailableForSale && [
                        'opacity-40 cursor-not-allowed line-through',
                        'hover:border-border hover:text-muted-foreground',
                      ],
                    )}
                  >
                    {option.label}
                    {/* Active dot indicator */}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 size-2 rounded-full bg-accent-gold" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}