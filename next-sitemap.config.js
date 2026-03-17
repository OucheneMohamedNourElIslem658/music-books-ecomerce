/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://music-books-ecomerce.vercel.app', // your live URL
    generateRobotsTxt: true, // generate robots.txt
    sitemapSize: 5000, // optional: max URLs per sitemap
    changefreq: 'daily', // optional: default frequency
    priority: 0.7, // optional: default priority
    exclude: ['/secret-page'], // optional: pages you want to exclude
};