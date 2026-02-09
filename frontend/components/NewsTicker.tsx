'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { DICTIONARY, LangType } from '@/data/dictionary';


// Professional stack approach (v5.5 UI Optimization)
// Purpose: Instant situational awareness via "simultaneity of information"

export const NewsTicker = ({ lang }: { lang: LangType }) => {
    const [news, setNews] = useState<{ title: string, link: string, isoDate?: string }[]>([]);
    const t = DICTIONARY[lang] || DICTIONARY['EN'];

    // SWR Integration for Static Data
    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const { data: marketData, error } = useSWR('/data/market_data.json', fetcher, {
        refreshInterval: 60000
    });

    useEffect(() => {
        const processNews = () => {
            if (marketData && marketData.intelligence) {
                const intelligence = marketData.intelligence;
                const rawNews = intelligence.news || [];

                const decodeEntities = (str: string) => {
                    const entities: Record<string, string> = { '&apos;': "'", '&amp;': "&", '&quot;': '"', '&lt;': "<", '&gt;': ">" };
                    return str.replace(/&(apos|amp|quot|lt|gt);/g, match => entities[match] || match);
                };

                const decodedNews = rawNews.map((item: { title: string; link?: string; url?: string; isoDate?: string; published?: string }, index: number) => {
                    let displayTitle = item.title;
                    if (lang !== 'EN' && intelligence.translations && intelligence.translations[lang] && intelligence.translations[lang][index]) {
                        displayTitle = intelligence.translations[lang][index];
                    }

                    return {
                        title: decodeEntities(displayTitle),
                        link: item.link || item.url || '#',
                        isoDate: item.isoDate || item.published
                    };
                });

                const finalNews = decodedNews.length > 0 ? decodedNews.slice(0, 5) : [];
                if (finalNews.length > 0) {
                    setNews(finalNews);
                    try {
                        localStorage.setItem(`gms_news_cache_${lang}`, JSON.stringify({
                            timestamp: Date.now(),
                            news: finalNews
                        }));
                    } catch {
                        // Storage full or disabled, ignore
                    }
                    return;
                }
            }

            // Fallback Logic (Cache or Error)
            try {
                const cachedRaw = localStorage.getItem(`gms_news_cache_${lang}`);
                if (cachedRaw) {
                    const cached = JSON.parse(cachedRaw);
                    if (cached.news && Array.isArray(cached.news) && cached.news.length > 0) {
                        setNews(cached.news);
                        return;
                    }
                }
            } catch { }

            // Final Fallback
            if (!marketData && !error) return; // Wait for loading if no cache

            setNews([{
                title: t.status.market || "Synchronizing market intelligence...",
                link: "#",
                isoDate: new Date().toISOString()
            }]);
        };

        processNews();
    }, [marketData, lang, t.status.market, error]);



    const isRTL = lang === 'AR';

    // Skeleton container with fixed height matching final render to prevent CLS
    if (news.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-black border-0 min-h-[160px] flex flex-col divide-0 overflow-hidden">
                {[1, 2, 3, 4, 5].map((v) => (
                    <div key={v} className="h-[32px] bg-slate-50/50 dark:bg-black"></div>
                ))}
            </div>
        );
    }

    // Absolute time logic: JST for JP, UTC for others
    const getFormattedTime = (isoDate?: string) => {
        if (!isoDate) return "";

        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return ""; // CRITICAL FIX: Prevent invalid dates from crashing the app
        const isJP = lang === 'JP';
        const timeZone = isJP ? 'Asia/Tokyo' : 'UTC';
        const label = isJP ? '(JST)' : '(UTC)';

        const nowJST = new Date(new Date().toLocaleString("en-US", { timeZone }));
        const targetJST = new Date(date.toLocaleString("en-US", { timeZone }));

        const isSameDay = nowJST.toDateString() === targetJST.toDateString();

        const timeStr = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone
        }).format(date);

        if (isSameDay) {
            return `${timeStr} ${label}`;
        } else {
            const dateStr = new Intl.DateTimeFormat('en-US', {
                month: '2-digit',
                day: '2-digit',
                timeZone
            }).format(date);
            return `${dateStr} ${timeStr} ${label}`;
        }
    };

    return (
        <div
            className="w-full bg-white dark:bg-black border-0 shadow-2xl relative z-10 select-none"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className={`flex flex-col divide-0 min-h-[160px]`}>
                {news.map((item, i) => (
                    <Link
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between h-[32px] px-3 md:px-5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer border-0 no-underline text-inherit"
                    >
                        <div
                            className={`flex items-center overflow-hidden flex-1 gap-5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* LIVE BADGE - Designer Red Gradient - Professional Look */}
                            <div
                                className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] shadow-sm border border-red-700/30 min-w-[76px] justify-center bg-[linear-gradient(to_bottom_right,#ef4444,#991b1b)]"

                            >
                                <span className="w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_4px_rgba(255,255,255,0.8)]"></span>
                                <span className="text-[9px] md:text-[10px] font-black !text-white tracking-[0.05em] uppercase whitespace-nowrap">
                                    {i === 0 ? (t.titles.live || "LIVE") : (t.titles.breaking || "BREAKING")}
                                </span>
                            </div>


                            {/* TITLE - Institutional Slate - Theme Responsive */}
                            <span
                                className={`text-[11px] md:text-xs font-bold truncate group-hover:text-red-700 dark:group-hover:text-white transition-colors tracking-tight flex-1 ${isRTL ? 'text-right pr-2 font-arabic' : 'text-left'} !text-slate-700 dark:!text-slate-200 text-[var(--foreground)]`}
                            >
                                {item.title}
                            </span>
                        </div>

                        {/* TIMESTAMP - Right-aligned metadata */}
                        <span className={`shrink-0 text-[9px] md:text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors ${isRTL ? 'mr-4' : 'ml-4'}`}>
                            {getFormattedTime(item.isoDate)}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
