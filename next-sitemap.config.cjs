/** @type {import('next-sitemap').IConfig} */

const SITE_URL = 'https://music-books-ecomerce.vercel.app'
const LOCALES = ['en', 'ar', 'pt']

module.exports = {
    siteUrl: SITE_URL,
    generateRobotsTxt: true,
    exclude: ['/*'],
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            {
                userAgent: '*',
                disallow: [
                    ...LOCALES.map(l => `/${l}/login`),
                    ...LOCALES.map(l => `/${l}/create-account`),
                    '/admin',
                ],
            },
        ],
        additionalSitemaps: [`${SITE_URL}/server-sitemap.xml`],
    },
}