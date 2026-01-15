import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['EN', 'JP', 'CN', 'ES'];
const DEFAULT_LOCALE = 'EN';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. Skip if static files or API
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return NextResponse.next();
    }

    // 2. Check for explicit lang param (User Override)
    const queryLang = searchParams.get('lang');
    if (queryLang && SUPPORTED_LOCALES.includes(queryLang.toUpperCase())) {
        const response = NextResponse.next();
        response.cookies.set('gms_locale', queryLang.toUpperCase());
        return response;
    }

    // 3. Check Cookie (Persistence)
    const cookieLang = request.cookies.get('gms_locale')?.value;
    if (cookieLang && SUPPORTED_LOCALES.includes(cookieLang)) {
        if (!queryLang) {
            // Append lang param if missing for consistency (Optional, but keeps URL stateful)
            // For now, we trust the component to read the cookie or we inject it?
            // Actually, simplest is to just let the page load. 
            // The client components read useSearchParams. Ideally we should redirect to ?lang=XX
            // But infinite redirect loop risk. Let's just pass.
        }
        return NextResponse.next();
    }

    // 4. Accept-Language Header (First Visit) - COOKIE ONLY
    // We no longer REDIRECT if ?lang is missing, to allow Googlebot to index the root URL.
    // Instead, we just set the cookie and continue.
    const acceptLang = request.headers.get('accept-language');
    let detectedLang = DEFAULT_LOCALE;

    if (acceptLang) {
        if (acceptLang.includes('ja')) detectedLang = 'JP';
        else if (acceptLang.includes('zh')) detectedLang = 'CN';
        else if (acceptLang.includes('es')) detectedLang = 'ES';
    }

    // Just set cookie if missing, no redirect
    const response = NextResponse.next();
    if (!request.cookies.get('gms_locale')) {
        response.cookies.set('gms_locale', detectedLang);
    }
    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
