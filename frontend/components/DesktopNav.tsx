'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { useEffect } from 'react';

export const DesktopNav = ({ lang: defaultLang }: { lang: LangType }) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryLang = searchParams.get('lang') as LangType;
    const lang = queryLang && DICTIONARY[queryLang] ? queryLang : defaultLang;
    const t = DICTIONARY[lang];

    // Handle RTL and Document Language
    useEffect(() => {
        if (lang === 'AR') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = lang.toLowerCase();
        }
    }, [lang]);

    const navItems = [
        { key: 'home', label: t.labels.summary || 'SUMMARY', path: '/' },
        { key: 'stocks', label: t.labels.stocks || 'STOCKS', path: '/stocks' },
        { key: 'crypto', label: t.labels.crypto || 'CRYPTO', path: '/crypto' },
        { key: 'forex', label: t.labels.forex || 'FOREX', path: '/forex' },
        { key: 'cmdty', label: t.labels.commodities || 'COMMODITIES', path: '/commodities' },
        { key: 'wiki', label: t.labels.wiki || 'WIKI', path: '/glossary' },
        { key: 'technical', label: t.labels.technical || 'TECHNICAL', path: '/technical' },
        { key: 'maxims', label: t.labels.maxims || 'MAXIMS', path: '/maxims' },
    ];

    return (
        <div className="hidden md:block w-full border-b border-slate-800 bg-[#050505] sticky top-0 z-50 shadow-md">
            <div className="max-w-[1600px] mx-auto flex items-center justify-start gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <button
                            key={item.key}
                            onClick={() => router.push(`${item.path}?lang=${lang}`)}
                            className={`px-6 py-3 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors border-b-2 ${isActive
                                ? 'text-sky-500 border-sky-500 bg-white/5'
                                : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
