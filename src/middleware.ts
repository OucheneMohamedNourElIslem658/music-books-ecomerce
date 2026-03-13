import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
    const response = intlMiddleware(request)
    response.headers.set('x-pathname', request.nextUrl.pathname)
    return response
}

export const config = {
    // Match all paths EXCEPT Payload admin and API routes
    matcher: [
        '/((?!admin|api|_next|_vercel|.*\\..*).*)',
    ],
};