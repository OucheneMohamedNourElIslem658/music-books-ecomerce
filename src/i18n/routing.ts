import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'pt', 'ar'],
    defaultLocale: 'en',
});