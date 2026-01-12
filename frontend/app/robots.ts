import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
            {
                userAgent: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'CCBot', 'Google-Extended'],
                allow: '/',
            }
        ],
        sitemap: 'https://omnimetric.net/sitemap.xml',
    };
}

