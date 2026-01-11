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
        <div className="fixed bottom-4 right-4 z-[9999] max-w-[320px] w-full bg-[#111]/90 backdrop-blur-md border border-gray-800 p-4 rounded-lg shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                We use cookies to analyze traffic and optimize your experience.
            </p>
            <div className="flex gap-2 justify-end">
                <button
                    onClick={handleDecline}
                    className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors"
                >
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase font-bold rounded transition-colors"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
