import { AdminBar } from "@/components/AdminBar"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { LivePreviewListener } from "@/components/LivePreviewListener"
import { routing } from "@/i18n/routing"
import { Providers } from "@/providers"
import { InitTheme } from "@/providers/Theme/InitTheme"
import { LocaleType } from "@/types/locale"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import type { ReactNode } from 'react'

export default async function AppLayout({
    children,
    params,
}: {
    children: ReactNode
    params: Promise<{ locale: LocaleType }>
}) {
    const { locale } = await params   // ← works because [locale] is a child segment
    if (!routing.locales.includes(locale)) notFound()

    const messages = await getMessages()

    return (
        <NextIntlClientProvider messages={messages}>
            <Providers>
                <InitTheme />
                <AdminBar />
                <LivePreviewListener />
                <Header locale={locale} />
                <main>{children}</main>
                <Footer locale={locale} />
            </Providers>
        </NextIntlClientProvider>
    )
}