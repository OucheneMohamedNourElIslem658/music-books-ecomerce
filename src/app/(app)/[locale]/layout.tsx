import { AdminBar } from "@/components/AdminBar"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { LivePreviewListener } from "@/components/LivePreviewListener"
import { routing } from "@/i18n/routing"
import { Providers } from "@/providers"
import { InitTheme } from "@/providers/Theme/InitTheme"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import type { ReactNode } from 'react'

export default async function AppLayout({
    children,
    params,
}: {
    children: ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params   // ← works because [locale] is a child segment
    if (!routing.locales.includes(locale as any)) notFound()

    const messages = await getMessages()

    return (
        <NextIntlClientProvider messages={messages}>
            <Providers>
                <InitTheme />
                <AdminBar />
                <LivePreviewListener />
                <Header />
                <main>{children}</main>
                <Footer />
            </Providers>
        </NextIntlClientProvider>
    )
}