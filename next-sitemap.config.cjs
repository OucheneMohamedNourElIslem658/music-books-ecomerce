// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://music-books-ecomerce.vercel.app',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,

    // Exclude pages you don’t want in sitemap
    exclude: ['/secret-page', '/admin/*'],

    // Custom transform function (optional)
    transform: async (config, path) => {
        return {
            loc: path, // full URL will be built automatically
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        }
    },

    // Add dynamic or extra pages here
    additionalPaths: async (config) => {
        const products = [
            { slug: '/en/crescendo-of-the-clouds' },
            { slug: '/en/echoes-of-the-gear' },
            { slug: '/en/the-coral-cantata' }, // replace with real product IDs from DB
            { slug: '/ar/crescendo-of-the-clouds' },
            { slug: '/ar/echoes-of-the-gear' },
            { slug: '/ar/the-coral-cantata' },
            { slug: '/pt/crescendo-of-the-clouds' },
            { slug: '/pt/echoes-of-the-gear' },
            { slug: '/pt/the-coral-cantata' }
        ];

        const paths = products.map(p => ({
            loc: `/products/${p.slug}`,
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: new Date().toISOString()
        }));

        // You can add more static extra pages
        paths.push({ loc: '/en/author' });
        paths.push({ loc: '/ar/author' });
        paths.push({ loc: '/pt/author' });


        paths.push({ loc: '/en/contact' });
        paths.push({ loc: '/ar/contact' });
        paths.push({ loc: '/pt/contact' });


        paths.push({ loc: '/en/chronicals' });
        paths.push({ loc: '/ar/chronicals' });
        paths.push({ loc: '/pt/chronicals' });

        paths.push({ loc: '/en/' });
        paths.push({ loc: '/ar/' });
        paths.push({ loc: '/pt/' });

        paths.push({ loc: '/en/shop' });
        paths.push({ loc: '/ar/shop' });
        paths.push({ loc: '/pt/shop' });

        paths.push({ loc: '/en/login' });
        paths.push({ loc: '/ar/login' });
        paths.push({ loc: '/pt/login' });

        paths.push({ loc: '/en/create-account' });
        paths.push({ loc: '/ar/create-account' });
        paths.push({ loc: '/pt/create-account' });

        paths.push({ loc: '/en/the-dragons-lullaby' });
        paths.push({ loc: '/ar/the-dragons-lullaby' });
        paths.push({ loc: '/pt/the-dragons-lullaby' });

        paths.push({ loc: '/en/writing-with-music' });
        paths.push({ loc: '/ar/writing-with-music' });
        paths.push({ loc: '/pt/writing-with-music' });

        return paths;
    }
};