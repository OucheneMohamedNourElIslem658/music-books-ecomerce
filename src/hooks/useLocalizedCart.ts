'use client'

import type { Cart, Config, Product, Variant } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { CartsCollection } from 'node_modules/@payloadcms/plugin-ecommerce/dist/types'
import { useEffect, useRef, useState } from 'react'
// The plugin's CartsUntyped expects `items?: any[]` (no null), but Payload
// generates `items?: ... | null`. This shim makes Cart compatible.
type CartCompat = Omit<Cart, 'items'> & {
    items?: NonNullable<Cart['items']>
} & CartsCollection

// ─── Types ────────────────────────────────────────────────────────────────────

type Locale = Config['locale']

/** A cart item where both product and variant are always fully populated objects */
export type LocalizedCartItem = {
    id?: string | null
    quantity: number
    product: Product
    variant?: Variant | null
}

type UseLocalizedCartReturn = ReturnType<typeof useCart<CartCompat>> & {
    localizedItems: LocalizedCartItem[]
    isLocalizing: boolean
    localizationError: Error | null
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Drop-in wrapper around `useCart()` that re-fetches product and variant data
 * with the correct locale so cart items are always translated.
 *
 * Reads locale from Next.js App Router params automatically.
 * You can also pass it explicitly if you're reading it from context/cookies.
 *
 * @example
 * const { localizedItems, isLoading, isLocalizing, addItem } = useLocalizedCart()
 * localizedItems[0].product.title // ✅ translated string
 * localizedItems[0].variant?.priceInUSD // ✅ properly typed
 */
export function useLocalizedCart(localeProp?: Locale): UseLocalizedCartReturn {
    const cartContext = useCart<CartCompat>()
    const { cart } = cartContext

    // useParams() can return {} inside portals/sheets that render outside the
    // route segment tree. Always pass locale explicitly from useLocale() instead.
    const locale: Locale = localeProp ?? 'en'

    const [localizedItems, setLocalizedItems] = useState<LocalizedCartItem[]>([])
    const [isLocalizing, setIsLocalizing] = useState(false)
    const [localizationError, setLocalizationError] = useState<Error | null>(null)

    const prevKeyRef = useRef<string>('')

    useEffect(() => {
        const items = cart?.items

        if (!items?.length) {
            setLocalizedItems([])
            prevKeyRef.current = ''
            return
        }

        // Extract IDs — product/variant can be a number (not populated) or the full object
        const productIds = items.map((item) =>
            typeof item.product === 'number' ? item.product : item.product?.id,
        )

        const variantIds = items
            .map((item) =>
                typeof item.variant === 'number' ? item.variant : item.variant?.id,
            )
            .filter((id): id is number => id != null)

        const key = `${locale}:p:${[...productIds].sort().join(',')}:v:${[...variantIds].sort().join(',')}`
        // Same data + same locale — nothing to do, ensure we're not stuck loading
        if (key === prevKeyRef.current) {
            setIsLocalizing(false)
            return
        }
        prevKeyRef.current = key

        let cancelled = false
        const safeItems = items

        async function fetchLocalized() {
            setIsLocalizing(true)
            setLocalizationError(null)

            try {
                const uniqueProductIds = [...new Set(productIds.filter((id): id is number => id != null))]
                const uniqueVariantIds = [...new Set(variantIds)]

                // Fetch products and variants in parallel — both with locale
                const [productsRes, variantsRes] = await Promise.all([
                    fetch(
                        `/api/products?${new URLSearchParams({
                            locale,
                            depth: '1',
                            limit: String(uniqueProductIds.length),
                            'where[id][in]': uniqueProductIds.join(','),
                        })}`,
                    ),
                    uniqueVariantIds.length > 0
                        ? fetch(
                            `/api/variants?${new URLSearchParams({
                                locale,
                                depth: '1',
                                limit: String(uniqueVariantIds.length),
                                'where[id][in]': uniqueVariantIds.join(','),
                            })}`,
                        )
                        : Promise.resolve(null),
                ])

                if (!productsRes.ok) {
                    throw new Error(`Failed to fetch products: ${productsRes.status} ${productsRes.statusText}`)
                }
                if (variantsRes && !variantsRes.ok) {
                    throw new Error(`Failed to fetch variants: ${variantsRes.status} ${variantsRes.statusText}`)
                }

                const productsData: { docs: Product[] } = await productsRes.json()
                const variantsData: { docs: Variant[] } | null = variantsRes
                    ? await variantsRes.json()
                    : null

                if (cancelled) return

                const productMap = new Map(productsData.docs.map((p) => [p.id, p]))
                const variantMap = new Map(variantsData?.docs.map((v) => [v.id, v]) ?? [])

                const merged: LocalizedCartItem[] = safeItems.flatMap((item) => {
                    const productId =
                        typeof item.product === 'number' ? item.product : item.product?.id
                    const variantId =
                        typeof item.variant === 'number'
                            ? item.variant
                            : item.variant?.id ?? null

                    const localizedProduct = productId != null ? productMap.get(productId) : undefined

                    // Skip items whose product wasn't returned (shouldn't happen, but be safe)
                    if (!localizedProduct) return []

                    const localizedVariant =
                        variantId != null ? (variantMap.get(variantId) ?? null) : null

                    return [
                        {
                            id: item.id,
                            quantity: item.quantity,
                            product: localizedProduct,
                            variant: localizedVariant,
                        },
                    ]
                })

                setLocalizedItems(merged)
            } catch (err) {
                if (cancelled) return

                const error = err instanceof Error ? err : new Error(String(err))
                setLocalizationError(error)
                console.error('[useLocalizedCart]', error)

                // Fallback: keep the raw items cast as best we can so the cart isn't empty
                setLocalizedItems(
                    safeItems.flatMap((item) => {
                        if (typeof item.product !== 'object' || !item.product) return []
                        return [
                            {
                                id: item.id,
                                quantity: item.quantity,
                                product: item.product as Product,
                                variant:
                                    item.variant != null && typeof item.variant === 'object'
                                        ? (item.variant as Variant)
                                        : null,
                            },
                        ]
                    }),
                )
            } finally {
                if (!cancelled) setIsLocalizing(false)
            }
        }

        fetchLocalized()
        return () => {
            cancelled = true
            // Reset the key so the next mount (e.g. Strict Mode double-invoke) re-fetches
            prevKeyRef.current = ''
        }
    }, [cart?.items, locale])

    return {
        ...cartContext,
        localizedItems,
        isLocalizing,
        localizationError,
    }
}