// 100% Server-Compatible Structured Data Component
import React from 'react';

interface MarketData {
    gms_score: number;
    market_data: {
        [key: string]: { price: number } | undefined;
    };
    last_updated: string;
    analysis?: {
        title?: string;
        content?: string;
    };
}

export const DynamicStructuredData = ({ data: externalData }: { data?: any }) => {
    if (!externalData) return null;

    let finalSchema: any = externalData;

    // Detection logic: If it's MarketData (has gms_score), build the platform schema
    if (externalData.gms_score !== undefined) {
        const data = externalData as MarketData;
        const isoDate = new Date(data.last_updated).toISOString();

        finalSchema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Dataset",
                    "@id": "https://www.omnimetric.net/#gms-dataset",
                    "name": "OmniMetric Global Macro Signal Index",
                    "description": "Institutional-grade real-time market risk assessment dataset integrating Net Liquidity, MOVE, VIX, and Credit Spreads.",
                    "url": "https://www.omnimetric.net",
                    "creator": {
                        "@type": "Organization",
                        "name": "OmniMetric Project",
                        "url": "https://www.omnimetric.net",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://www.omnimetric.net/icon.png"
                        }
                    },
                    "isAccessibleForFree": true,
                    "license": "https://creativecommons.org/licenses/by-nc/4.0/",
                    "dateModified": isoDate,
                    "variableMeasured": [
                        { "@type": "PropertyValue", "name": "Global Macro Score", "value": data.gms_score }
                    ]
                },
                {
                    "@type": "FinancialService",
                    "name": "OmniMetric Terminal",
                    "description": "Professional algorithmic macroeconomic analysis platform.",
                    "url": "https://www.omnimetric.net",
                    "areaServed": "World",
                    "provider": { "@type": "Organization", "name": "OmniMetric" }
                }
            ]
        };

        if (data.analysis) {
            finalSchema["@graph"].push({
                "@type": "AnalysisNewsArticle",
                "headline": data.analysis.title || "Market Analysis",
                "description": data.analysis.content?.slice(0, 160) || "OmniMetric Market Analysis",
                "author": { "@type": "Organization", "name": "OmniMetric AI" },
                "datePublished": isoDate
            });
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
        />
    );
};
