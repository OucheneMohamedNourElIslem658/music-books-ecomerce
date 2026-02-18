// src/app/(payload)/api/payments/paypal/cancel/route.ts
//
// PayPal redirects here if the user clicks "Cancel" on paypal.com.
// No payment was taken — just send them back to checkout.

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`

    return NextResponse.redirect(`${appUrl}/checkout?cancelled=paypal`)
}