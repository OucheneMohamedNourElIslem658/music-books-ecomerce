import { Spline_Sans } from "next/font/google"
import type { ReactNode } from 'react'
import './globals.css'

const splineSans = Spline_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spline-sans',
  display: 'swap',
})

export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params   // ← works because [locale] is a child segment

  return (
    <html
      lang={locale ?? 'en'}
      className={`${splineSans.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}