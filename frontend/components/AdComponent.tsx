'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        adsbygoogle: Array<Record<string, unknown>>;
    }
}

interface AdComponentProps {
    slot?: string;
    format?: 'fluid' | 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    layout?: 'in-article' | 'in-feed';
    className?: string;
    minHeight?: string;
}

/**
 * AdComponent - Robust AdSense integration for Next.js SPA.
 * Handled with specified slot: 8020292211
 */
export const AdComponent = ({
    slot = "8020292211",
    format = "fluid",
    layout = "in-article",
    className = "",
    minHeight = "150px"
}: AdComponentProps) => {
    const pathname = usePathname();
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        const pushAd = () => {
            try {
                if (typeof window !== 'undefined' && adRef.current) {
                    // CRITICAL: Ensure the element has a width before pushing.
                    // AdSense throws "No slot size for availableWidth=0" if width is 0.
                    if (adRef.current.offsetWidth > 0) {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    } else {
                        // If not ready, retry once after a short delay
                        setTimeout(() => {
                            if (adRef.current && adRef.current.offsetWidth > 0) {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        }, 500);
                    }
                }
            } catch (err) {
                // Silently handle "adsbygoogle.push() error: All 'ins' elements in the DOM with class=adsbygoogle already have ads in them."
                // This happens in SPA transitions sometimes.
            }
        };

        // Small delay to ensure Next.js/Turbopack have finished DOM updates
        const timer = setTimeout(pushAd, 300);
        return () => clearTimeout(timer);
    }, [pathname]); // Reload on route change

    return (
        <div
            className={`ad-container w-full mx-auto my-4 overflow-hidden ${className}`}
            style={{ '--min-height': minHeight } as React.CSSProperties}
        >
            <div className="flex justify-start mb-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">
                    Sponsored Link
                </span>
            </div>

            <ins
                ref={adRef}
                className="adsbygoogle"
                data-ad-layout={layout}
                data-ad-format={format}
                data-ad-client="ca-pub-1230621442620902"
                data-ad-slot={slot}
            />

            <style jsx>{`
        .ad-container {
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          padding: 1rem 0;
          background: transparent;
          min-height: var(--min-height);
        }
        .adsbygoogle {
          display: block;
          text-align: center;
        }
        :global(.adsbygoogle[data-ad-status="unfilled"]) {
          display: none !important;
        }
      `}</style>
        </div>
    );
};
