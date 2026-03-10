import type { ReactNode } from 'react'

import { AccountNav } from '@/components/AccountNav'
import { RenderParams } from '@/components/RenderParams'
import configPromise from '@payload-config'
import { Compass } from 'lucide-react'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="container py-10 pb-20">
      <RenderParams className="mb-6" />

      <div className="flex gap-8 items-start">
        {/* Sidebar */}
        {user && (
          <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-6 sticky top-24">
            {/* User card */}
            <div className="flex flex-col gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Compass size={56} />
              </div>
              <div className="flex gap-3 items-center">
                <div className="size-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Compass size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-foreground truncate">{user?.name || 'Wayfinder'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <AccountNav className="w-full" />
          </aside>
        )}

        {/* Page content */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  )
}