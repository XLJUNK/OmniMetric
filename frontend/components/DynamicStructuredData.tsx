'use client';

import { useEffect, useState } from 'react';

interface MarketData {
    gms_score: number;
    market_data: {
        NET_LIQUIDITY?: { price: number };
        MOVE?: { price: number };
        VIX?: { price: number };
        HY_SPREAD?: { price: number };
    };
    last_updated: string;
}

export const DynamicStructuredData = () => {
    const [data, setData] = useState<MarketData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/signal');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error('Failed to fetch structured data:', e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every 60s
        return () => clearInterval(interval);
    }, []);

    if (!data) return null;

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Dataset",
                "@id": "https://omnimetric.net/#gms-dataset",
                "name": "OmniMetric Global Macro Signal Index",
                "description": "Institutional-grade real-time risk assessment integrating Net Liquidity, Bond Volatility (MOVE), Equity Volatility (VIX), and Credit Spreads. Updated continuously.",
                "url": "https://omnimetric.net",
                "creator": {
                    "@type": "Organization",
                    "name": "OmniMetric Project",
                    "url": "https://omnimetric.net"
                },
                "isAccessibleForFree": true,
                "license": "https://creativecommons.org/licenses/by-nc/4.0/",
                "dateModified": data.last_updated,
                "variableMeasured": [
                    {
                        "@type": "PropertyValue",
                        "name": "Global Macro Score",
                        "value": data.gms_score,
                        "unitText": "INDEX",
                        "description": "Composite risk score from 0-100"
                    },
                    {
                        "@type": "PropertyValue",
                        "name": "US Net Liquidity",
                        "value": data.market_data.NET_LIQUIDITY?.price || 0,
                        "unitText": "USD_BILLIONS",
                        "description": "Federal Reserve Balance Sheet minus TGA and RRP"
                    },
                    {
                        "@type": "PropertyValue",
                        "name": "MOVE Index",
                        "value": data.market_data.MOVE?.price || 0,
                        "unitText": "INDEX",
                        "description": "Bond Market Volatility Index"
                    },
                    {
                        "@type": "PropertyValue",
                        "name": "VIX Index",
                        "value": data.market_data.VIX?.price || 0,
                        "unitText": "INDEX",
                        "description": "Equity Market Volatility Index"
                    }
                ]
            },
            {
                "@type": "FinancialProduct",
                "name": "Global Macro Signal",
                "description": "Algorithmic market risk indicator combining institutional-grade data sources",
                "provider": {
                    "@type": "Organization",
                    "name": "OmniMetric"
                },
                "feesAndCommissionsSpecification": "Free for informational use"
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
};
