'use client';
import React from 'react';
import { Home, LineChart, Bitcoin, Banknote, Gem } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LangType, DICTIONARY } from '@/data/dictionary';

export const MobileNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryLang = searchParams.get('lang') as LangType;
    const lang = queryLang && DICTIONARY[queryLang] ? queryLang : 'EN';
    const t = DICTIONARY[lang];

    const tabs = [
        { key: 'home', label: t.labels.summary || 'Summary', icon: Home, path: '/' },
        { key: 'stocks', label: t.labels.stocks || 'Stocks', icon: LineChart, path: '/stocks' },
        { key: 'crypto', label: t.labels.crypto || 'Crypto', icon: Bitcoin, path: '/crypto' },
        { key: 'forex', label: t.labels.forex || 'Forex', icon: Banknote, path: '/forex' },
        { key: 'cmdty', label: t.labels.commodities || 'Cmdty', icon: Gem, path: '/commodities' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-[54px] bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E293B] flex md:hidden items-center justify-evenly px-2 z-[9999] shadow-2xl">
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                    <button
                        key={tab.key}
                        onClick={() => router.push(`${tab.path}?lang=${lang}`)}
                        className={`flex flex-col items-center gap-1 transition-colors relative ${isActive ? 'text-sky-500' : 'text-slate-500'
                            }`}
                    >
                        <tab.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : ''}`} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter truncate w-full text-center">
                            {tab.label}
                        </span>
                        {/* Active Indicator Dot */}
                        {isActive && (
                            <span className="absolute -bottom-2 w-1 h-1 bg-sky-500 rounded-full shadow-[0_0_5px_rgba(14,165,233,0.8)]"></span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};
