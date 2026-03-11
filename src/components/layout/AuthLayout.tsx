import { useTranslations } from 'next-intl'
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  sealText?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  sealText,
}) => {
  const t = useTranslations('auth')
  const displaySealText = sealText ?? t('defaultSeal')

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 pt-24 pb-12 floating-stars">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_#2b6cee]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-10 text-primary/30 rotate-12">
          <span className="material-symbols-outlined text-6xl">music_note</span>
        </div>
        <div className="absolute bottom-20 left-10 text-primary/20 -rotate-12">
          <span className="material-symbols-outlined text-8xl">auto_awesome</span>
        </div>
      </div>

      {/* The Floating Scroll Auth Form */}
      <div className="relative w-full max-w-130 z-10">
        {/* Scroll Top Header Decor */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[105%] h-12 bg-[#e8dec0] rounded-full border-4 border-[#c8b486] shadow-xl z-20 flex items-center justify-center">
          <div className="w-full h-1 bg-[#c8b486] mx-4 opacity-50"></div>
          <div className="px-4 text-[#8a7241] font-bold text-sm tracking-widest whitespace-nowrap uppercase font-display">
            {displaySealText}
          </div>
          <div className="w-full h-1 bg-[#c8b486] mx-4 opacity-50"></div>
        </div>

        {/* Parchment Scroll Body */}
        <div className="parchment-texture rounded-xl p-8 md:p-12 shadow-2xl border-x-[12px] border-[#d9cdab] flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="text-[#4a3728] text-4xl font-bold mb-3 tracking-tight font-display">
              {title}
            </h1>
            <div className="h-0.5 w-24 bg-[#4a3728]/20 mx-auto mb-4"></div>
            <p className="text-[#6d5b4b] text-base italic leading-relaxed font-display">
              {description}
            </p>
          </div>

          <div className="w-full">{children}</div>
        </div>

        {/* Scroll Bottom Footer Decor */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[105%] h-12 bg-[#e8dec0] rounded-full border-4 border-[#c8b486] shadow-xl z-20 flex items-center justify-center">
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-[#c8b486]"></div>
            <div className="w-2 h-2 rounded-full bg-[#c8b486]"></div>
            <div className="w-2 h-2 rounded-full bg-[#c8b486]"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
