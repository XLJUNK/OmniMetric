'use client';

import React, { useEffect, useState } from 'react';

import { DICTIONARY, LangType } from '@/data/dictionary';

// Marquee styles in pure Tailwind/CSS
// We need a keyframe animation. We'll inject a style for it or use standard marquee if allowed.
// But standard marquee tag is deprecated.
// Best approach: CSS animation.

export const NewsTicker = ({ lang }: { lang: LangType }) => {
    const [news, setNews] = useState<{ title: string, link: string }[]>([]);
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
                setNews(decodedNews);
            } catch (e) {
                // Warning suppressed
            }
        };
        fetchNews();
        // Update every 5 mins
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, []);

    const isRTL = lang === 'AR';
    if (news.length === 0) return <div className="h-[40px] bg-slate-50 dark:bg-black border-y border-slate-200 dark:border-[#222]"></div>;

    return (
        <div className="w-full bg-slate-50 dark:bg-black border-y border-slate-200 dark:border-[#222] h-[40px] shadow-md z-10" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-[1500px] mx-auto h-full relative overflow-hidden flex items-center">
                {/* LABEL */}
                <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 bg-[#dc2626] text-white font-black text-[10px] px-6 z-20 flex items-center tracking-[0.2em] uppercase shrink-0`}>
                    {t.titles.breaking_news}
                </div>

                {/* TICKER TRACK */}
                <div className={`flex whitespace-nowrap ${isRTL ? 'animate-marquee-rtl' : 'animate-marquee'} items-center h-full`}>
                    {news.map((item, i) => (
                        <span key={i} className={`${isRTL ? 'ms-12' : 'me-12'} text-[12px] font-mono font-bold text-yellow-300 dark:text-yellow-400 uppercase flex items-center gap-3`}>
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full inline-block animate-pulse"></span>
                            {item.title}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes marquee-rtl {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                .animate-marquee {
                    animation: marquee 120s linear infinite;
                    padding-left: 100%; /* Start off screen */
                    display: inline-block;
                    line-height: 40px;
                }
                .animate-marquee-rtl {
                    animation: marquee-rtl 120s linear infinite;
                    padding-right: 100%; /* Start off screen */
                    display: inline-block;
                    line-height: 40px;
                }
                .animate-marquee:hover, .animate-marquee-rtl:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};
