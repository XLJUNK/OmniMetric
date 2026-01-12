'use client';

import React, { useEffect, useRef } from 'react';

export const AdUnit = () => {
    const initialized = useRef(false);
    const insRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        if (initialized.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && insRef.current && insRef.current.offsetWidth > 0) {
                    // Only push if not already initialized
                    if (!initialized.current) {
                        initialized.current = true;

                        // Safety delay to ensure DOM is fully painted and has width
                        setTimeout(() => {
                            try {
                                const element = insRef.current;
                                if (element) {
                                    const rect = element.getBoundingClientRect();
                                    const style = window.getComputedStyle(element);

                                    // STRICT CHECK: Must have physical dimensions and be visible
                                    if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
                                        // @ts-ignore
                                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                                    } else {
                                        console.warn("AdSense: Skipped push due to zero dimensions or hidden state.");
                                    }
                                }
                            } catch (err: any) {
                                // Silently suppress errors to avoid console spam
                            }
                        }, 500);

                        observer.disconnect(); // Stop observing once loaded
                    }
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% visible
        });

        if (insRef.current) {
            observer.observe(insRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative w-full min-h-[90px] flex items-center justify-center overflow-hidden !bg-transparent !shadow-none !ring-0 !outline-none border-y border-[#1E293B] my-2">
            <div className="absolute top-1 right-2 z-10 opacity-30 hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">ADS</span>
            </div>

            {/* Horizontal Display Unit */}
            <ins className="adsbygoogle"
                ref={insRef}
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-0000000000000000"
                data-ad-slot="1234567890"
                data-ad-format="horizontal"
                data-full-width-responsive="true"></ins>
        </div>
    );
};
