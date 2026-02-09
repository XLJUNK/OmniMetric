/**
 * Standardized API response utilities
 * Ensures consistent response format across all API routes
 */

import { NextResponse } from 'next/server';

/**
 * Security headers to be added to all API responses
 */
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
} as const;

/**
 * Add security headers to a NextResponse
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

/**
 * Create a success response with security headers
 */
export function successResponse<T>(
    data: T,
    options?: {
        status?: number;
        headers?: Record<string, string>;
        cacheControl?: string;
    }
): NextResponse {
    const response = NextResponse.json(data, {
        status: options?.status ?? 200,
        headers: options?.headers
    });

    // Add security headers
    addSecurityHeaders(response);

    // Add cache control if specified
    if (options?.cacheControl) {
        response.headers.set('Cache-Control', options.cacheControl);
    }

    return response;
}

/**
 * Create an error response with security headers
 */
export function errorResponse(
    error: string,
    options?: {
        status?: number;
        details?: unknown[];
        code?: string;
    }
): NextResponse {
    const response = NextResponse.json({
        error,
        code: options?.code,
        details: options?.details
    }, {
        status: options?.status ?? 500
    });

    // Add security headers
    addSecurityHeaders(response);

    return response;
}

/**
 * Create a validation error response (400)
 */
export function validationErrorResponse(
    message: string,
    details?: unknown[]
): NextResponse {
    return errorResponse(message, {
        status: 400,
        code: 'VALIDATION_ERROR',
        details
    });
}

/**
 * Create a not found error response (404)
 */
export function notFoundResponse(
    message: string = 'Resource not found'
): NextResponse {
    return errorResponse(message, {
        status: 404,
        code: 'NOT_FOUND'
    });
}

/**
 * Create an internal server error response (500)
 */
export function internalErrorResponse(
    message: string = 'Internal server error',
    details?: unknown
): NextResponse {
    // Don't expose internal error details in production
    const isDev = process.env.NODE_ENV === 'development';

    return errorResponse(message, {
        status: 500,
        code: 'INTERNAL_ERROR',
        details: isDev ? [details] : undefined
    });
}

/**
 * Create a rate limit error response (429)
 */
export function rateLimitResponse(
    message: string = 'Too many requests'
): NextResponse {
    const response = errorResponse(message, {
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED'
    });

    response.headers.set('Retry-After', '60');

    return response;
}
