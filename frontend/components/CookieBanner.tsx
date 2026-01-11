'use client';

import React, { useEffect, useState } from 'react';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent !== 'granted' && consent !== 'denied') {
            setIsVisible(true);
        } else if (consent === 'granted') {
            loadScripts();
        }
    }, []);

    const loadScripts = () => {
        // Here we would load AdSense or Analytics if not already loaded via layout
        // For Vercel Analytics, it handles its own consent usually, or we can control it if needed.
        // AdSense example:
        // const script = document.createElement('script');
        // script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        // script.async = true;
        // script.crossOrigin = "anonymous";
        // document.body.appendChild(script);
        console.log("Consent granted: Loading third-party scripts...");
    };

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'granted');
        setIsVisible(false);
        loadScripts();
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'denied');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[9999] max-w-[300px] w-full bg-[#050505] border border-sky-500/30 p-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] text-sky-500 font-mono uppercase tracking-[0.2em]">System Consent</span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                [NOTICE]: This terminal uses localized storage cookies to optimize data streams. Acknowledge to proceed.
            </p>
            <div className="flex gap-2 justify-end pt-2">
                <button
                    onClick={handleDecline}
                    className="px-4 py-1.5 text-[9px] font-mono uppercase tracking-wider text-gray-600 hover:text-gray-400 transition-colors"
                >
                    [Decline]
                </button>
                <button
                    onClick={handleAccept}
                    className="px-4 py-1.5 bg-sky-900/20 hover:bg-sky-500/20 border border-sky-500/50 text-sky-400 hover:text-sky-300 text-[9px] font-mono uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(14,165,233,0.1)] hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                >
                    [Accept]
                </button>
            </div>
        </div>
    );
}
