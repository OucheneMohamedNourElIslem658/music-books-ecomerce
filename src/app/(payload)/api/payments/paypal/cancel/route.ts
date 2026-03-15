// src/app/(payload)/api/payments/paypal/cancel/route.ts
//
// PayPal redirects here if the user clicks "Cancel" on paypal.com.
// No payment was taken — just send them back to checkout.

import { routing } from '@/i18n/routing'
import { LocaleType } from '@/types/locale'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`

    const locale = req.nextUrl.searchParams.get('locale') as LocaleType
    const safeLocale = routing.locales.includes(locale) ? locale : routing.defaultLocale

    return NextResponse.redirect(`${appUrl}/${safeLocale}/checkout?cancelled=paypal`)
}