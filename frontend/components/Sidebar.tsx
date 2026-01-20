'use client';
import { Home, LineChart, Bitcoin, Banknote, Gem, ChevronRight, BookOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { DICTIONARY } from '@/data/dictionary';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export const Sidebar = () => {
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
        { key: 'wiki', label: t.labels.wiki || 'Wiki', icon: BookOpen, path: '/glossary' },
    ];

    return (
        <aside className="fixed start-0 top-0 bottom-0 hidden md:flex flex-col w-[60px] bg-white dark:bg-[#0A0A0A] border-e border-slate-200 dark:border-[#1E293B] overflow-visible z-50 transition-colors duration-300">
            {/* Logo Area */}
            <div className="h-[60px] flex items-center justify-center border-b border-slate-200 dark:border-[#1E293B]">
                <div className={`w-3 h-3 rounded-full ${pathname === '/' ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]' : 'bg-slate-600'}`}></div>
            </div>

            {/* Navigation - Icon Only + Tooltips */}
            <nav className="flex-1 flex flex-col justify-start pt-10 gap-8 items-center">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => router.push(`${tab.path}?lang=${lang}`)}
                            className={`group relative flex items-center justify-center p-3 rounded-lg transition-all duration-300 border border-transparent ${isActive
                                ? 'bg-slate-100 dark:bg-[#333] border-slate-200 dark:border-[#555] shadow-sm dark:shadow-lg'
                                : 'bg-transparent hover:bg-slate-50 dark:hover:bg-[#222] hover:border-slate-200 dark:hover:border-[#333]'
                                }`}
                        >
                            {/* Active Indicator (Dot) - Subtle */}
                            {isActive && (
                                <div className="absolute inset-y-1/2 -translate-y-1/2 w-1 h-6 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)] start-0"></div>
                            )}

                            {/* Icon - OPTIMIZED COLOR PALETTE */}
                            <tab.icon
                                className={`w-[20px] h-[20px] transition-all duration-300 ${isActive
                                    ? 'text-sky-600 dark:text-[#F1F5F9]'
                                    : 'text-slate-400 dark:text-[#94A3B8] group-hover:text-sky-500'
                                    }`}
                            />

                            {/* Tooltip (Label) - TYPOGRAPHY MASTERPIECE */}
                            <div
                                className="absolute ltr:left-full rtl:right-full top-1/2 -translate-y-1/2 ms-4 px-3 py-2 bg-black border border-[#333] !text-[#F1F5F9] text-[10.5px] font-semibold tracking-[0.15em] uppercase rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,1)] z-[9999]"
                                style={{ color: '#F1F5F9' }}
                            >
                                {tab.label}
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Status Indicator */}
            <div className="h-[60px] flex items-center justify-center border-t border-slate-200 dark:border-[#1E293B]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
            </div>
        </aside>
    );
};
