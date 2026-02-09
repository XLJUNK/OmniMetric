export interface MarketImpact {
    up: string;
    down: string;
}

export interface GlossaryTerm {
    id: string;
    category: string;
    term: string;
    definition: string;
    market_impact: MarketImpact;
    context_2026: string;
    gms_relevance?: string;
    seo_keywords: string[];
}

export type GlossaryData = GlossaryTerm[];
