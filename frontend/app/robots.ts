import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/private/'],
            },
            {
                userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'PerplexityBot', 'ClaudeBot', 'FacebookBot'],
                allow: '/',
            },
        ],
        sitemap: 'https://omnimetric.net/sitemap.xml',
    };
}

