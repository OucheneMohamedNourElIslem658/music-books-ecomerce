import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderParams } from '@/components/RenderParams'
import { AccountNav } from '@/components/AccountNav'
import { BookOpen } from 'lucide-react'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex h-auto min-h-screen overflow-hidden obsidian-texture">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900/50 dark:bg-background/50 border-r border-slate-200 dark:border-primary/10 hidden lg:flex flex-col p-8 gap-10 sticky top-0 h-screen">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">The Chronicler</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Master of the Ledger</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {user && <AccountNav className="grow flex-col items-start gap-4" />}
        </nav>

        <div className="mt-auto">
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Mystical Capacity</p>
            <div className="w-full bg-secondary rounded-full h-2 mb-4">
              <div className="bg-primary h-2 rounded-full shadow-[0_0_8px_rgba(43,108,238,0.5)]" style={{ width: '65%' }}></div>
            </div>
            <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
              View Sanctum
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8 px-4 md:px-8">
          <RenderParams className="mb-8" />
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
