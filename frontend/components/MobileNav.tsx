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
        <nav className="fixed top-0 left-0 right-0 h-[48px] bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E293B] flex md:hidden items-center justify-between w-full z-[9999] shadow-2xl overflow-hidden">
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                // Compact Label Logic for Mobile
                let label = tab.label;
                if (lang === 'EN') {
                    if (tab.key === 'technical') label = 'Tech';
                    if (tab.key === 'commodities') label = 'Cmdty';
                    if (tab.key === 'stocks') label = 'Stock';
                    if (tab.key === 'crypto') label = 'Crypt';
                    if (tab.key === 'forex') label = 'Forex';
                    if (tab.key === 'maxims') label = 'Maxim';
                    if (tab.key === 'home') label = 'Home';
                }

                return (
                    <button
                        key={tab.key}
                        onClick={() => router.push(`${tab.path}?lang=${lang}`)}
                        className={`group flex flex-col items-center justify-center flex-1 min-w-0 h-full transition-colors relative ${isActive ? 'text-sky-500' : 'text-slate-500'
                            }`}
                    >
                        {/* Invisible Touch Target Expansion */}
                        <span className="absolute -inset-1 z-[-1]" />

                        <tab.icon className={`w-3.5 h-3.5 mb-0.5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : ''}`} />
                        <span className="text-[9px] font-bold uppercase tracking-tight truncate w-full text-center leading-none px-0 transform scale-[0.8] origin-center">
                            {label}
                        </span>
                        {/* Active Indicator Dot */}
                        {isActive && (
                            <span className="absolute bottom-0.5 w-0.5 h-0.5 bg-sky-500 rounded-full shadow-[0_0_5px_rgba(14,165,233,0.8)]"></span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};
