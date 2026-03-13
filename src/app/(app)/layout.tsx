import { GlobalAudioPlayer } from "@/components/GlobalAudioPlayer"
import { AudioProvider } from "@/providers/AudioProvider"
import { isRTL, LocaleType } from "@/types/locale"
import { Newsreader, Spline_Sans } from "next/font/google"
import { headers } from "next/headers"
import type { ReactNode } from 'react'
import './globals.css'

const splineSans = Spline_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spline-sans',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

export default async function AppLayout({
  children,
}: {
  children: ReactNode
  params: Promise<{ locale: LocaleType }>
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const locale = pathname.split('/')[1] as LocaleType

  console.log(locale);


  return (
    <html
      lang={locale ?? 'en'}
      className={`${splineSans.variable} ${newsreader.variable} font-sans`}
      suppressHydrationWarning
      dir={isRTL(locale) ? 'rtl' : 'ltr'}
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AudioProvider>
          {children}
          <GlobalAudioPlayer />
        </AudioProvider>
      </body>
    </html>
  )
}