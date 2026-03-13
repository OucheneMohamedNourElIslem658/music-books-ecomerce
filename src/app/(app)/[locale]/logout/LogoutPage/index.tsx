'use client'

import { Link } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { ArrowRight, Lock, ShieldCheck, Wand2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

export const LogoutPage: React.FC = () => {
  const t = useTranslations('auth.logout')
  const { logout } = useAuth()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess(true)
      } catch (_) {
        setSuccess(true) // Even if it fails, we show the success page as they might be already logged out
      }
    }

    void performLogout()
  }, [logout])

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-[80vh]">
      <div className="max-w-[800px] w-full flex flex-col items-center text-center">
        {/* Illustration Section */}
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-12 group shadow-2xl border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          <div
            className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnWalvKEHzaOxg1PCB5dnvt1C87T9iZf70d2yeMSEvcJaVurEuvWiuNWJ23kQHJG-6rv4cgctRc_TUjz4ZufMorYl6BFpPci2nitEBP3OuvV10b5Po76Plx4eiBTgLG9hnz7f8deOyVsKRN8pMx4ulgVSsk40pg3OXtDE0k6N4N9YwxRECTQ0ZfTKDSeG6Oq86-HzBiu5h2TuWWdndTTkofijS9oTxl2lqG1OPFca0gSfTKDDjLZ-7lAJIY_JUD4FJ2VKcafzfpxw7")' }}
          >
          </div>
          {/* Overlay Icon */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-background/60 backdrop-blur-md p-6 rounded-full border border-primary/30 shadow-[0_0_30px_rgba(43,108,238,0.3)]">
              <Lock size={48} className="text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <ShieldCheck size={14} /> {t('sessionEnded')}
          </div>
          <h1 className="text-foreground text-4xl md:text-5xl font-black tracking-tight uppercase italic">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed pt-2 font-medium">
            {t('subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/"
              className="flex min-w-60 items-center justify-center rounded-full h-16 px-10 bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95 group"
            >
              <span>{t('returnToKingdom')}</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="flex min-w-60 items-center justify-center rounded-full h-16 px-10 bg-secondary text-foreground text-sm font-black uppercase tracking-widest transition-all hover:bg-secondary/80 active:scale-95 border border-border shadow-sm"
            >
              <span>{t('exploreLore')}</span>
            </Link>
          </div>
        </div>

        {/* Decorative Footer Elements */}
        <div className="mt-20 flex items-center gap-6 text-muted-foreground/30">
          <div className="h-px w-16 bg-current"></div>
          <Wand2 size={24} />
          <div className="h-px w-16 bg-current"></div>
        </div>
      </div>
    </main>
  )
}
