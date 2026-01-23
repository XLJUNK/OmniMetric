'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DICTIONARY, LangType } from '@/data/dictionary';

// Professional stack approach (v5.5 UI Optimization)
// Purpose: Instant situational awareness via "simultaneity of information"

export const NewsTicker = ({ lang }: { lang: LangType }) => {
    const [news, setNews] = useState<{ title: string, link: string, isoDate?: string }[]>([]);
    const [now, setNow] = useState(Date.now());
    const t = DICTIONARY[lang];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/news?lang=${lang}`);
                const json = await res.json();
                const decodeEntities = (str: string) => {
                    const entities: any = { '&apos;': "'", '&amp;': "&", '&quot;': '"', '&lt;': "<", '&gt;': ">" };
                    return str.replace(/&(apos|amp|quot|lt|gt);/g, match => entities[match] || match);
                };
                const decodedNews = (json.news || []).map((item: any) => ({
                    ...item,
                    title: decodeEntities(item.title)
                }));
                // Strictly take top 3 for the vertical stack
                setNews(decodedNews.slice(0, 3));
            } catch (e) {
                // Fail silently to maintain terminal aesthetic
            }
        };
        fetchNews();
        // Update news feed every 5 mins to ensure fresh data
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, [lang]);

    // Keep "now" current every minute to refresh relative timestamps
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const isRTL = lang === 'AR';

    // Skeleton container with fixed height matching final render to prevent CLS
    if (news.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-[#050505] border-y border-slate-200 dark:border-white/5 min-h-[102px] flex flex-col divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
                {[1, 2, 3].map((v) => (
                    <div key={v} className="h-[34px] bg-slate-50/50 dark:bg-white/[0.02]"></div>
                ))}
            </div>
        );
    }

    // Absolute time logic: JST for JP, UTC for others
    const getFormattedTime = (isoDate?: string) => {
        if (!isoDate) return "";

        const date = new Date(isoDate);
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
        <div className="w-full bg-white dark:bg-[#050505] border-y border-slate-200 dark:border-white/5 shadow-2xl relative z-10 select-none" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`flex flex-col divide-y divide-slate-100 dark:divide-white/5 min-h-[102px]`}>
                {news.map((item, i) => (
                    <Link
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between h-[40px] px-3 md:px-5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer border-l-2 border-transparent hover:border-red-600/80"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div
                            className={`flex items-center overflow-hidden flex-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                            style={{ gap: '20px' }}
                        >
                            {/* LIVE BADGE - Designer Red Gradient - Professional Look */}
                            <div
                                className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] shadow-sm border border-red-700/30"
                                style={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
                                    minWidth: '76px',
                                    justifyContent: 'center'
                                }}
                            >
                                <span className="w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_4px_rgba(255,255,255,0.8)]"></span>
                                <span className="text-[9px] md:text-[10px] font-black text-white tracking-[0.05em] uppercase whitespace-nowrap">
                                    {i === 0 ? "LIVE" : "BREAKING"}
                                </span>
                            </div>

                            {/* TITLE - Institutional Slate - Theme Responsive */}
                            <span
                                className={`text-[11px] md:text-xs font-bold truncate group-hover:text-red-700 dark:group-hover:text-white transition-colors tracking-tight flex-1 ${isRTL ? 'text-right pr-2 font-arabic' : 'text-left'} !text-slate-700 dark:!text-slate-200`}
                                style={{ color: 'var(--foreground)' }}
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
