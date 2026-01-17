'use client';

import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';

interface TVPartnerCardProps {
    lang: LangType;
    variant?: 'default' | 'minimal' | 'sidebar' | 'text-link';
}

export const TVPartnerCard = ({ lang, variant = 'default' }: TVPartnerCardProps) => {
    // 1. Language & Dictionary Logic
    // Fallback to EN if language is not supported or dictionary entry is missing
    const t = DICTIONARY[lang] || DICTIONARY['EN'];
    const isRTL = lang === 'AR';

    // Robust fallback logic for partner data
    let p = (t as any).partner;
    if (!p && DICTIONARY['EN']) {
        p = (DICTIONARY['EN'] as any).partner;
    }

    // Ultimate safety fallback to prevent runtime crashes
    if (!p) {
        p = {
            badge: "TradingView Official Partner",
            title: "Get $15 Credit: Save on your new TradingView plan. Experience world-class charting starting from OmniMetric.",
            action: "Start Analysis (Get $15 Credit)",
            disclaimer: "OmniMetric is an official partner of TradingView. Benefits apply via our referral links. Please invest at your own risk."
        };
    }

    // 2. URL Branching Logic
    const AFFILIATE_ID = '162240';
    let baseUrl = 'https://www.tradingview.com/';

    switch (lang) {
        case 'JP': baseUrl = 'https://jp.tradingview.com/'; break;
        case 'CN': baseUrl = 'https://cn.tradingview.com/'; break;
        case 'ES': baseUrl = 'https://es.tradingview.com/'; break;
        case 'HI': baseUrl = 'https://in.tradingview.com/'; break; // India
        case 'ID': baseUrl = 'https://id.tradingview.com/'; break;
        case 'AR': baseUrl = 'https://ar.tradingview.com/'; break;
        default: baseUrl = 'https://www.tradingview.com/'; break;
    }

    const affiliateUrl = `${baseUrl}?aff_id=${AFFILIATE_ID}`;

    const linkText = (p as any).link_text || "Analyze on TradingView ($15 Bonus)";

    // Short offer text for minimal card
    const offerTextMap: Record<string, string> = {
        EN: "Get $15 Credit",
        JP: "15ドルの特典を獲得",
        CN: "获得 $15 奖励",
        ES: "Obtenga $15 de Crédito",
        HI: "$15 का क्रेडिट प्राप्त करें",
        ID: "Dapatkan Kredit $15",
        AR: "احصل على رصيد 15 دولارًا"
    };
    const offerText = offerTextMap[lang] || offerTextMap['EN'];

    if (variant === 'text-link') {
        return (
            <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-500 transition-colors"
                title={p.title}
            >
                <div className="w-5 h-5 rounded bg-[#131722] flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-sky-500 transition-colors">
                    {/* Tiny TV Icon representation */}
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current">
                        <path d="M12 0L0 12h5v12h14V12h5L12 0zm0 4.8l7.2 7.2h-2.4v9.6H7.2V12H4.8L12 4.8z" />
                        <path d="M21 12L12 3 3 12h4v8h10v-8h4z" />
                    </svg>
                </div>
                {linkText}
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
            </a>
        );
    }

    if (variant === 'minimal') {
        return (
            <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full mt-4 bg-gradient-to-r from-[#131722] to-[#0A0A0A] border border-[#1E293B] hover:border-sky-500/50 rounded-lg p-3 transition-all duration-300"
            >
                <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        {/* TradingView Logo Icon / Branding */}
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-black fill-current">
                                <path d="M12 0L0 12h5v12h14V12h5L12 0zm0 4.8l7.2 7.2h-2.4v9.6H7.2V12H4.8L12 4.8z" />
                                <path d="M4 16h16v2H4zM4 19h16v1H4z" fill="none" />
                                <path d="M21 12L12 3 3 12h4v8h10v-8h4z" />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-[9px] font-bold text-sky-500 uppercase tracking-wider">{p.badge}</span>
                            <span className={`block text-xs font-bold text-slate-200 group-hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                                {offerText}
                            </span>
                        </div>
                    </div>
                    <ExternalLink className={`w-4 h-4 text-slate-500 group-hover:text-sky-500 transition-colors ${isRTL ? 'rotate-180' : ''}`} />
                </div>
            </a>
        );
    }

    return (
        <div className="w-full relative group overflow-hidden bg-[#131722] border border-[#1E293B] rounded-xl hover:border-sky-500/30 transition-all duration-300">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className={`relative z-10 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>

                {/* Visual / Text Side */}
                <div className={`flex-1 space-y-3 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[#2A2E39] border border-[#434651]">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">{p.badge}</span>
                    </div>

                    <h3 className={`text-sm md:text-base font-bold text-white leading-relaxed max-w-xl ${isRTL ? 'font-arabic' : ''}`}>
                        {p.title}
                    </h3>
                </div>

                {/* CTA Side */}
                <div className="shrink-0 w-full sm:w-auto">
                    <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#2962FF] hover:bg-[#1E53E5] text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 text-sm"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        {p.action}
                    </a>
                </div>
            </div>

            {/* Bottom Disclaimer for Card (Optional, but user asked for Footer disclaimer. I will add a tiny one here too just in case or keep clean?) 
                User instruction: "Footer: ... disclaimer". Doesn't strictly say on card. 
                But for "Trustworthiness", a clean card is better. I'll leave it clean.
            */}
        </div>
    );
};
