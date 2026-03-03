import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware(routing);

export const config = {
    // Match all paths EXCEPT Payload admin and API routes
    matcher: [
        '/((?!admin|api|_next|_vercel|.*\\..*).*)',
    ],
};