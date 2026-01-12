'use client';
import { Home, LineChart, Bitcoin, Banknote, Gem, Globe } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LangType } from '@/data/dictionary';

export const MobileMenu = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const lang = (searchParams.get('lang') as LangType) || 'EN';

    const tabs = [
        { key: 'home', label: 'Summary', icon: Home, path: '/' },
        { key: 'stocks', label: 'Stocks', icon: LineChart, path: '/stocks' },
        { key: 'crypto', label: 'Crypto', icon: Bitcoin, path: '/crypto' },
        { key: 'forex', label: 'Forex', icon: Banknote, path: '/forex' },
        { key: 'cmdty', label: 'Cmdty', icon: Gem, path: '/commodities' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0a] border-t border-white/10 z-50 pb-safe md:hidden">
            <div className="flex justify-around items-center h-[60px]">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => router.push(`${tab.path}?lang=${lang}`)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? 'text-sky-500' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <tab.icon className={`w-5 h-5 ${isActive ? 'fill-current/20' : ''}`} />
                            <span className="text-[9px] font-bold uppercase tracking-wide">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            {/* Safe Area Spacer for iOS Home Bar */}
            <div className="h-[env(safe-area-inset-bottom)] bg-[#0a0a0a]"></div>
        </div>
    );
};
