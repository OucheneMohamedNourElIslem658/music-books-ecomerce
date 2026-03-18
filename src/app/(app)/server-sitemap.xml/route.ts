import config from '@payload-config'
import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'

const SITE_URL = 'https://music-books-ecomerce.vercel.app'
const LOCALES = ['en', 'ar', 'pt'] as const
const STATIC_PAGES = ['shop', 'contact', 'chronicals']
const EXCLUDED_PAGE_SLUGS = new Set(['shop', 'contact', 'chronicals', 'home'])

export async function GET() {
    const payload = await getPayload({ config })

    const [{ docs: products }, { docs: pages }] = await Promise.all([
        payload.find({
            collection: 'products',
            limit: 1000,
            select: { slug: true, updatedAt: true },
        }),
        payload.find({
            collection: 'pages',
            limit: 1000,
            select: { slug: true, updatedAt: true },
        }),
    ])

    const fields: ISitemapField[] = []

    // 1. Homepages
    for (const locale of LOCALES) {
        fields.push({
            loc: `${SITE_URL}/${locale}`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 1.0,
            alternateRefs: LOCALES.map(l => ({
                href: `${SITE_URL}/${l}`,
                hreflang: l,
            })),
        })
    }

    // 2. Static pages
    for (const page of STATIC_PAGES) {
        for (const locale of LOCALES) {
            fields.push({
                loc: `${SITE_URL}/${locale}/${page}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.8,
                alternateRefs: LOCALES.map(l => ({
                    href: `${SITE_URL}/${l}/${page}`,
                    hreflang: l,
                })),
            })
        }
    }

    // 3. Dynamic pages from Payload page builder
    for (const page of pages) {
        const slug = page.slug as string
        const updatedAt = page.updatedAt as string

        if (EXCLUDED_PAGE_SLUGS.has(slug)) continue

        for (const locale of LOCALES) {
            fields.push({
                loc: `${SITE_URL}/${locale}/${slug}`,
                lastmod: updatedAt,
                changefreq: 'weekly',
                priority: 0.7,
                alternateRefs: LOCALES.map(l => ({
                    href: `${SITE_URL}/${l}/${slug}`,
                    hreflang: l,
                })),
            })
        }
    }

    // 4. Product pages
    for (const product of products) {
        const slug = product.slug as string
        const updatedAt = product.updatedAt as string

        for (const locale of LOCALES) {
            fields.push({
                loc: `${SITE_URL}/${locale}/${slug}`,
                lastmod: updatedAt,
                changefreq: 'weekly',
                priority: 0.9,
                alternateRefs: LOCALES.map(l => ({
                    href: `${SITE_URL}/${l}/${slug}`,
                    hreflang: l,
                })),
            })
        }
    }

    return getServerSideSitemap(fields)
}