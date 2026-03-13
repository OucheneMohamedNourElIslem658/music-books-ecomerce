import { ChroniclesSidebar } from '@/components/Chronicals/SideBar'
import { Search } from '@/components/Search'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'

interface ChroniclesLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: 'en' | 'ar' | 'pt' }>
}

export default async function ChroniclesLayout({ children, params }: ChroniclesLayoutProps) {
    const { locale } = await params
    const t = await getTranslations('shop.layout')

    return (
        <div className="container py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-12">

                {/* Left Content: Chronicles Feed */}
                <div className="flex-1 space-y-8">
                    <Suspense fallback={null}>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
                            <div className="w-full md:w-auto flex-1">
                                <Search className="w-full" />
                            </div>
                        </div>
                        <div className="min-h-screen">
                            {children}
                        </div>
                    </Suspense>
                </div>

                {/* Right Sidebar */}
                <aside className="w-full lg:w-80 space-y-8 shrink-0">
                    <Suspense fallback={<div className="h-96 w-full bg-muted animate-pulse rounded-xl" />}>
                        <ChroniclesSidebar locale={locale} />
                    </Suspense>
                </aside>

            </div>
        </div>
    )
}