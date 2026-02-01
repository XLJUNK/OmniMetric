'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DICTIONARY, LangType } from '@/data/dictionary';


// Professional stack approach (v5.5 UI Optimization)
// Purpose: Instant situational awareness via "simultaneity of information"

export const NewsTicker = ({ lang }: { lang: LangType }) => {
    const [news, setNews] = useState<{ title: string, link: string, isoDate?: string }[]>([]);
    const t = DICTIONARY[lang] || DICTIONARY['EN'];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/news?lang=${lang}`);
                const json = await res.json();
                const decodeEntities = (str: string) => {
                    const entities: Record<string, string> = { '&apos;': "'", '&amp;': "&", '&quot;': '"', '&lt;': "<", '&gt;': ">" };
                    return str.replace(/&(apos|amp|quot|lt|gt);/g, match => entities[match] || match);
                };
                const decodedNews = (json.news || []).map((item: { title: string; link?: string; url?: string; isoDate?: string; published?: string }, index: number) => {
                    // v5.5: Multi-language Support (Check translations first)
                    // If we are in EN, use item.title (English).
                    // If we are in JP/CN/etc, check `json.translations[lang][index]`.
                    let displayTitle = item.title;
                    if (lang !== 'EN' && json?.translations && json.translations[lang] && json.translations[lang][index]) {
                        displayTitle = json.translations[lang][index];
                    }

                    return {
                        title: decodeEntities(displayTitle),
                        link: item.link || item.url || '#',
                        isoDate: item.isoDate || item.published
                    };
                });
                // Strictly take top 5 for the vertical stack
                // Success: Update Cache
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
                } else {
                    // If API returns empty, try cache before fallback
                    throw new Error("Empty API response");
                }
            } catch {
                // v5.5 FIX: Robust Fallback with Caching Strategy
                // 1. Try Cache
                try {
                    const cachedRaw = localStorage.getItem(`gms_news_cache_${lang}`);
                    if (cachedRaw) {
                        const cached = JSON.parse(cachedRaw);
                        // Optional: Check expiration (e.g. 24h?) - For now, show last known valid news to maintain utility
                        if (cached.news && Array.isArray(cached.news) && cached.news.length > 0) {
                            setNews(cached.news);
                            return; // Successfully used cache
                        }
                    }
                } catch {
                    // Cache corrupt, ignore
                }

                // 2. Final Fallback: System Synchronizing Status
                setNews([{
                    title: t.status.market || "Synchronizing market intelligence...",
                    link: "#",
                    isoDate: new Date().toISOString()
                }]);
            }
        };
        fetchNews();
        // Update news feed every 5 mins to ensure fresh data
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, [lang, t.status.market]);



    const isRTL = lang === 'AR';

    // Skeleton container with fixed height matching final render to prevent CLS
    if (news.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-[#050505] border-y border-slate-200 dark:border-white/5 min-h-[160px] flex flex-col divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
                {[1, 2, 3, 4, 5].map((v) => (
                    <div key={v} className="h-[32px] bg-slate-50/50 dark:bg-white/[0.02]"></div>
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
            className="w-full bg-white dark:bg-black border-y border-slate-200 dark:border-[#1E293B] shadow-2xl relative z-10 select-none"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className={`flex flex-col divide-y divide-slate-100 dark:divide-white/5 min-h-[160px]`}>
                {news.map((item, i) => (
                    <Link
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between h-[32px] px-3 md:px-5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer border-l-2 border-transparent hover:border-red-600/80 no-underline text-inherit"
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
