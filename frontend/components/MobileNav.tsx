'use client';
import React from 'react';
import { Home, LineChart, Bitcoin, Banknote, Gem, Globe, ScrollText, Activity } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { DICTIONARY } from '@/data/dictionary';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export const MobileNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const lang = useCurrentLang();
    const t = DICTIONARY[lang];

    const tabs = [
        { key: 'home', label: t.labels.summary || 'Summary', icon: Home, path: '/' },
        { key: 'stocks', label: t.labels.stocks || 'Stocks', icon: LineChart, path: '/stocks' },
        { key: 'crypto', label: t.labels.crypto || 'Crypto', icon: Bitcoin, path: '/crypto' },
        { key: 'forex', label: t.labels.forex || 'Forex', icon: Banknote, path: '/forex' },
        { key: 'cmdty', label: t.labels.commodities || 'Cmdty', icon: Gem, path: '/commodities' },
        { key: 'technical', label: t.labels.technical || 'Technical', icon: Activity, path: '/technical' },
        { key: 'wiki', label: t.labels.wiki || 'Wiki', icon: Globe, path: '/glossary' },
        { key: 'maxims', label: t.labels.maxims || 'Maxims', icon: ScrollText, path: '/maxims' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-[48px] bg-[#000000]/95 backdrop-blur-xl border-b border-[#1E293B] md:hidden w-full z-[9999] shadow-2xl overflow-hidden">
            <div className="grid grid-cols-8 h-full w-full items-center px-0">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    // Full labels allowing resize/wrap - No Truncation
                    const label = tab.label;

                    // Size Logic: AR needs larger text, others smaller
                    const isAR = lang === 'AR';
                    const textSizeClass = isAR ? 'text-[9px]' : 'text-[7px]';

                    return (
                        <button
                            key={tab.key}
                            onClick={() => router.push(`${tab.path}?lang=${lang}`)}
                            className={`group flex flex-col items-center justify-center w-full h-full transition-all relative p-0.5`}
                        >
                            {/* Icon: Active=Blue (#007AFF), Inactive=Bright Gray (slate-400) */}
                            <tab.icon
                                className={`w-3.5 h-3.5 mb-0.5 transition-colors ${isActive ? 'text-[#007AFF] drop-shadow-[0_0_10px_#007AFF] fill-[#007AFF]/20' : 'text-slate-400'}`}
                                strokeWidth={2}
                            />

                            {/* Text: Active=Blue, Inactive=Bright Gray. Wrapped, No Truncation */}
                            <span className={`${textSizeClass} font-bold uppercase tracking-tight text-center leading-[0.85] w-full whitespace-normal break-words px-0 transition-colors ${isActive ? 'text-[#007AFF] drop-shadow-[0_0_5px_#007AFF]' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
