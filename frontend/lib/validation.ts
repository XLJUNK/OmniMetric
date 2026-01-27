/**
 * Centralized validation schemas using Zod
 * Ensures consistent input validation across all API routes
 */

import { z } from 'zod';

/**
 * Supported language codes
 */
export const SUPPORTED_LANGUAGES = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR'] as const;

/**
 * Language validation schema
 */
export const LanguageSchema = z.enum(SUPPORTED_LANGUAGES);

/**
 * Date validation schema (YYYY-MM-DD format)
 */
export const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format. Must be YYYY-MM-DD'
}).refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
}, {
    message: 'Invalid date value'
});

/**
 * Positive integer schema
 */
export const PositiveIntSchema = z.number().int().positive({
    message: 'Must be a positive integer'
});

/**
 * Pagination schema
 */
export const PaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10)
});

/**
 * Query parameter validation helper
 * Converts string query params to appropriate types
 */
export function parseQueryParams<T extends z.ZodTypeAny>(
    schema: T,
    params: URLSearchParams,
    key: string
): z.infer<T> | null {
    const value = params.get(key);
    if (!value) return null;

    try {
        return schema.parse(value);
    } catch {
        return null;
    }
}

/**
 * Safe query parameter parser with default value
 */
export function parseQueryParamWithDefault<T extends z.ZodTypeAny>(
    schema: T,
    params: URLSearchParams,
    key: string,
    defaultValue: z.infer<T>
): z.infer<T> {
    const value = parseQueryParams(schema, params, key);
    return value ?? defaultValue;
}

/**
 * Validate and parse multiple query parameters
 */
export function validateQueryParams<T extends z.ZodObject<any>>(
    schema: T,
    searchParams: URLSearchParams
): { success: true; data: z.infer<T> } | { success: false; error: string; details: any[] } {
    try {
        // Convert URLSearchParams to object
        const params: Record<string, any> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        const result = schema.parse(params);
        return { success: true, data: result };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Validation failed',
                details: error.issues.map((err: z.ZodIssue) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            };
        }
        return {
            success: false,
            error: 'Unknown validation error',
            details: []
        };
    }
}

/**
 * Type-safe language validator
 */
export type Language = z.infer<typeof LanguageSchema>;

/**
 * Validate language code
 */
export function isValidLanguage(lang: string): lang is Language {
    return SUPPORTED_LANGUAGES.includes(lang as Language);
}
