import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function DELETE(req: NextRequest) {
    try {
        const payload = await getPayload({ config: configPromise })
        const { searchParams } = new URL(req.url)
        const cartId = searchParams.get('cartId')

        if (!cartId) {
            return NextResponse.json({ error: 'Missing cartId' }, { status: 400 })
        }

        const { docs } = await payload.find({
            collection: 'transactions',
            where: {
                cart: { equals: Number(cartId) },
                status: { equals: 'pending' },
            },
            limit: 20,
            overrideAccess: true,
        })

        await Promise.all(
            docs.map((tx) =>
                payload.delete({
                    collection: 'transactions',
                    id: tx.id,
                    overrideAccess: true,
                }),
            ),
        )

        return NextResponse.json({ deleted: docs.length })
    } catch (err) {
        console.error('clear-pending-transactions error:', err)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}