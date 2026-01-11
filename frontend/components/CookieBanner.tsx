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
        <div className="fixed bottom-4 left-4 z-[9999] max-w-[320px] w-full bg-[#000000] border-l-2 border-cyan-500 p-5 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
                <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.25em]">System Protocol</span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono leading-relaxed tracking-wide">
                Accessing this terminal requires data stream authorization (Cookies).
                <br /><span className="text-gray-600 text-[10px]">Optimization protocols initialized.</span>
            </p>
            <div className="flex gap-3 justify-end pt-1">
                <button
                    onClick={handleDecline}
                    className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors border border-transparent hover:border-gray-800"
                >
                    [Deny]
                </button>
                <button
                    onClick={handleAccept}
                    className="px-5 py-2 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 text-[10px] font-mono uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-105"
                >
                    [Initialize]
                </button>
            </div>
        </div>
    );
}
