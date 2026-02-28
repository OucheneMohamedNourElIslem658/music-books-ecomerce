import { ChroniclesSidebar } from '@/components/Chronicals/SideBar'
import { Categories } from '@/components/layout/search/Categories'
import { FilterList } from '@/components/layout/search/filter'
import { Search } from '@/components/Search'
import { sorting } from '@/lib/constants'
import React, { Suspense } from 'react'

export default function ChroniclesLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <div className="container flex flex-col gap-8 my-16 pb-4">
                <Search className="mb-4" />

                <div className="flex flex-col lg:flex-row items-start gap-8">

                    {/* Left — filters */}
                    <div className="w-full flex-none flex flex-col gap-6 lg:w-48">
                        <Categories />
                        <FilterList list={sorting} title="Sort by" />
                    </div>

                    {/* Center — posts */}
                    <div className="min-h-screen w-full flex-1">{children}</div>

                    {/* Right — sidebar */}
                    <div className="w-full flex-none lg:w-72">
                        <ChroniclesSidebar />
                    </div>

                </div>
            </div>
        </Suspense>
    )
}