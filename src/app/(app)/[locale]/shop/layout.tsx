import { Categories } from '@/components/layout/search/Categories'
import { FilterList } from '@/components/layout/search/filter'
import { ShopSearch } from '@/components/ShopSearch'
import { sorting } from '@/lib/constants'
import { LocaleType } from '@/types/locale'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'

interface ShopLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: LocaleType }>
}

export default async function ShopLayout({ children, params }: ShopLayoutProps) {
  const { locale } = await params
  const t = await getTranslations('shop.layout')
  return (
    <div className="container py-6 md:py-16">

      {/* Filter Control Bar */}
      <section className="mb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-8">

          <div className="w-full lg:w-auto">
            <Categories locale={locale} />
          </div>

          <div className="flex items-center gap-5 shrink-0 w-full lg:w-auto justify-between lg:justify-end pt-6 lg:pt-0">
            <ShopSearch />
            <div className="flex gap-3 items-center">
              <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                {t('sortBy')}
              </span>
              <FilterList list={sorting} />
            </div>
          </div>

        </div>
      </section>
      ...
      {/* Main Content */}
      <Suspense fallback={null}>
        <div className="min-h-screen">
          {children}
        </div>
      </Suspense>
    </div>
  )
}