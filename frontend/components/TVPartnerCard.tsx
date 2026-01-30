'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { TRADINGVIEW_ADS, AdSegment } from '@/data/tradingview-ads';
import Image from 'next/image';

import { useTheme } from '@/components/ThemeProvider';

interface TVPartnerCardProps {
    lang: LangType;
    variant?: 'default' | 'minimal' | 'sidebar' | 'text-link';
}

export const TVPartnerCard = ({ lang, variant = 'default' }: TVPartnerCardProps) => {
    const { theme } = useTheme();
    // 1. Load Data
    const adContent = TRADINGVIEW_ADS[lang] || TRADINGVIEW_ADS['EN'];
    const isRTL = lang === 'AR';

    // 2. Random Segment Logic
    const [selectedSegment, setSelectedSegment] = useState<AdSegment | null>(null);

    useEffect(() => {
        const segments = adContent.segments;
        if (segments && segments.length > 0) {
            const random = segments[Math.floor(Math.random() * segments.length)];
            setSelectedSegment(random);
        }
    }, [adContent, lang]);

    // 3. Fallback for Safe Mode / SSR
    const segment = selectedSegment || adContent.segments[0];

    // 4. URL Construction
    const AFFILIATE_ID = '162240';
    let baseUrl = 'https://www.tradingview.com/';
    switch (lang) {
        case 'JP': baseUrl = 'https://jp.tradingview.com/'; break;
        case 'CN': baseUrl = 'https://cn.tradingview.com/'; break;
        case 'ES': baseUrl = 'https://es.tradingview.com/'; break;
        case 'HI': baseUrl = 'https://in.tradingview.com/'; break;
        case 'ID': baseUrl = 'https://id.tradingview.com/'; break;
        case 'AR': baseUrl = 'https://ar.tradingview.com/'; break;
        default: baseUrl = 'https://www.tradingview.com/'; break;
    }
    const affiliateUrl = `${baseUrl}?aff_id=${AFFILIATE_ID}&source=omnimetric_ad_${segment.id}`;

    // Helper for Button Text - MERGED CLEANLY
    let baseAction = (DICTIONARY[lang] as any)?.partner?.action || "Start Analysis";

    // Split by half OR full width parenthesis and take key part
    // This handles "分析を開始する (15ドルの特典付き)" or similar
    baseAction = baseAction.split(/[\(（]/)[0].trim();

    const bonusText = adContent.bonus;

    // Construct merged button text
    let fullButtonText = `${baseAction}。${bonusText}`;
    if (lang === 'EN') fullButtonText = `${baseAction}. ${bonusText}`;

    // VARIANT: Text Link
    if (variant === 'text-link') {
        const titleLink = (DICTIONARY[lang] as any)?.partner?.title || adContent.main;
        const linkText = (DICTIONARY[lang] as any)?.partner?.link_text || "Analyze on TradingView ($15 Bonus)";
        return (
            <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-500 transition-colors"
                title={titleLink}
            >
                <div className="w-5 h-5 rounded bg-slate-100 dark:bg-[#131722] flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 group-hover:border-sky-500 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-slate-900 dark:text-white fill-current">
                        <path d="M12 0L0 12h5v12h14V12h5L12 0zm0 4.8l7.2 7.2h-2.4v9.6H7.2V12H4.8L12 4.8z" />
                        <path d="M21 12L12 3 3 12h4v8h10v-8h4z" />
                    </svg>
                </div>
                {linkText}
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
            </a>
        );
    }

    // VARIANT: Minimal
    if (variant === 'minimal') {
        const badgeText = (DICTIONARY[lang] as any)?.partner?.badge || "TradingView Partner";
        const offerText = adContent.bonus.replace(/。$/, '');

        return (
            <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group block w-full mt-4 bg-[#F1F5F9] dark:bg-gradient-to-r dark:from-[#131722] dark:to-[#0A0A0A] border border-slate-200 dark:border-[#1E293B] hover:border-sky-500/50 rounded-lg p-3 transition-all duration-300 shadow-sm dark:shadow-none"
            >
                <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-white flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-black fill-current">
                                <path d="M12 0L0 12h5v12h14V12h5L12 0zm0 4.8l7.2 7.2h-2.4v9.6H7.2V12H4.8L12 4.8z" />
                                <path d="M4 16h16v2H4zM4 19h16v1H4z" fill="none" />
                                <path d="M21 12L12 3 3 12h4v8h10v-8h4z" />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-[9px] font-bold text-sky-500 uppercase tracking-wider">{badgeText}</span>
                            <span className={`block text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                                {offerText}
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        );
    }

    // VARIANT: Default (Main Banner) - COMPACT INTEGRATED DESIGN
    return (
        <div
            className="w-full relative group overflow-hidden bg-[#F1F5F9] dark:bg-[#0A0A0A] border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-300 shadow-sm dark:shadow-none my-6"
            style={{ backgroundColor: theme === 'dark' ? '#0A0A0A' : '#F1F5F9' }}
        >

            {/* Added: Specific min-height to ensure structure visibility */}
            <div className={`flex flex-col md:flex-row items-stretch min-h-[160px] ${isRTL ? 'md:flex-row-reverse' : ''}`}>

                {/* 1. Image Area REMOVED by user request */}
                {/* 2. Content Area - Full Width */}
                <div className={`p-4 md:p-5 flex-1 flex flex-col justify-center text-center`}>

                    {/* Main Copy - Dynamic Typography matching AI Insight EXACTLY (fluid-base) */}
                    <h3 className={`text-fluid-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl text-center mx-auto mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {segment.text}
                    </h3>

                    {/* CTA Button - Full Form Width, FLUID TEXT */}
                    <div className="w-full flex justify-center">
                        <a
                            href={affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#2962FF] hover:bg-[#1E53E5] !text-white text-[10px] xs:text-xs sm:text-sm font-bold rounded shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-center whitespace-normal leading-tight overflow-hidden"
                            style={{ color: '#FFFFFF' }}
                        >
                            <Zap className="w-3.5 h-3.5 fill-current text-white shrink-0" />
                            <span className="text-white relative top-[0.5px]">{fullButtonText}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
