import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/private/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'Google-Extended',
                    'CCBot',
                    'PerplexityBot',
                    'ClaudeBot',
                    'Claude-Bot',
                    'Anthropic-AI',
                    'FacebookBot',
                    'cohere-ai',
                    'Bytespider'
                ],
                allow: '/',
            },
        ],
        sitemap: 'https://www.omnimetric.net/sitemap.xml',
    };
}
