// src/app/(payload)/api/payments/paypal/return/route.ts
//
// PayPal redirects the user HERE after they approve on paypal.com.
// URL:  /api/payments/paypal/return?token=<ORDER_ID>&PayerID=<PAYER_ID>
//
// Responsibilities:
//   1. Read ?token (PayPal order ID) from query string
//   2. Look up the pending transaction to get transactionId + cartId
//   3. POST to the plugin's /api/payments/paypal/confirm-order endpoint
//      with all data confirmOrder() needs
//   4. Redirect to success or error page

import { Cart } from '@/payload-types'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    // PayPal appends ?token=ORDER_ID&PayerID=PAYER_ID to the return URL
    const paypalOrderId = searchParams.get('token')
    const payerId = searchParams.get('PayerID')

    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`

    if (!paypalOrderId) {
        return NextResponse.redirect(`${appUrl}/checkout?error=missing_token`)
    }

    try {
        const payload = await getPayload({ config: configPromise })

        // Find the pending transaction created during initiatePayment
        const { docs } = await payload.find({
            collection: 'transactions',
            where: { 'paypal.orderId': { equals: paypalOrderId } },
            limit: 1,
        })

        const transaction = docs?.[0]

        if (!transaction) {
            console.error(`[PayPal Return] No transaction found for order: ${paypalOrderId}`)
            return NextResponse.redirect(`${appUrl}/checkout?error=transaction_not_found`)
        }

        // Call the plugin's confirm-order endpoint (note the hyphen — not confirmOrder)
        // Whatever we put in this body becomes `data` in adapter.confirmOrder()
        const confirmRes = await fetch(`${appUrl}/api/payments/paypal/confirm-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Forward the auth cookie so the plugin has user context
                cookie: req.headers.get('cookie') || '',
            },
            body: JSON.stringify({
                paypalOrderId,
                payerId,
                transactionId: String(transaction.id),
                cartId: (transaction.cart as Cart).id || '',
                customerEmail: transaction.customerEmail || '',
            }),
        })

        if (!confirmRes.ok) {
            const body = await confirmRes.text()
            console.error(`[PayPal Return] confirm-order failed (${confirmRes.status}):`, body)
            return NextResponse.redirect(`${appUrl}/checkout?error=capture_failed`)
        }

        const result = await confirmRes.json()

        // The plugin returns { doc: { id } } or { orderID } depending on version
        const orderId = result?.doc?.id ?? result?.orderID ?? ''

        return NextResponse.redirect(
            `${appUrl}/orders/${orderId}`,
        )
    } catch (err) {
        console.error('[PayPal Return] Unexpected error:', err)
        return NextResponse.redirect(`${appUrl}/checkout?error=unexpected`)
    }
}