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
                    let label = tab.label;

                    // Ultra-Compact Labels for 8-col Layout (Mobile)
                    if (lang === 'EN') {
                        if (tab.key === 'technical') label = 'Tech';
                        if (tab.key === 'commodities') label = 'Cmdty';
                        if (tab.key === 'stocks') label = 'Stock';
                        if (tab.key === 'crypto') label = 'Crypt';
                        if (tab.key === 'forex') label = 'Forex';
                        if (tab.key === 'maxims') label = 'Maxim';
                        if (tab.key === 'home') label = 'Home';
                    } else if (lang === 'ES') {
                        if (tab.key === 'commodities') label = 'M.Pri'; // Materias Primas -> M.Pri
                        if (tab.key === 'technical') label = 'Técn.';
                        if (tab.key === 'crypto') label = 'Cripto';
                        if (tab.key === 'stocks') label = 'Acción'; // Acciones -> Acción
                        if (tab.key === 'home') label = 'Inicio';
                    }

                    return (
                        <button
                            key={tab.key}
                            onClick={() => router.push(`${tab.path}?lang=${lang}`)}
                            className={`group flex flex-col items-center justify-center w-full h-full transition-all relative ${isActive ? 'text-[#007AFF]' : 'text-slate-500'
                                }`}
                        >
                            <tab.icon className={`w-3.5 h-3.5 mb-0.5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,122,255,0.6)]' : ''}`} />
                            <span className="text-[8.5px] font-bold uppercase tracking-tighter truncate w-full text-center leading-[0.9] px-0 transform scale-[0.9] origin-center">
                                {label}
                            </span>

                            {/* Brand Blue Line Indicator */}
                            {isActive && (
                                <span className="absolute top-0 w-full h-[2px] bg-[#007AFF] shadow-[0_0_6px_#007AFF]"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
