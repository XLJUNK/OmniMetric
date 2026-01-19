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
        <nav className="fixed top-0 left-0 right-0 h-[54px] bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E293B] flex md:hidden items-center justify-between w-full z-[9999] shadow-2xl overflow-x-hidden">
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                    <button
                        key={tab.key}
                        onClick={() => router.push(`${tab.path}?lang=${lang}`)}
                        className={`group flex flex-col items-center justify-center flex-1 min-w-0 px-0 h-full transition-colors relative ${isActive ? 'text-sky-500' : 'text-slate-500'
                            }`}
                    >
                        {/* Invisible Touch Target Expansion */}
                        <span className="absolute -inset-2 z-[-1]" />

                        <tab.icon className={`w-4 h-4 mb-0.5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : ''}`} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter truncate w-full text-center leading-none px-0.5">
                            {tab.label}
                        </span>
                        {/* Active Indicator Dot */}
                        {isActive && (
                            <span className="absolute bottom-1 w-1 h-1 bg-sky-500 rounded-full shadow-[0_0_5px_rgba(14,165,233,0.8)]"></span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};
