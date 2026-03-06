// src/app/(payload)/api/payments/paypal/cancel/route.ts
//
// PayPal redirects here if the user clicks "Cancel" on paypal.com.
// No payment was taken — just send them back to checkout.

import { routing } from '@/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`

    const locale = req.nextUrl.searchParams.get('locale')
    const safeLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale

    return NextResponse.redirect(`${appUrl}/${safeLocale}/checkout?cancelled=paypal`)
}