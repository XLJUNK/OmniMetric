'use client';

import React, { useEffect, useRef, useState } from 'react';
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
 * Prevents TagError: No slot size for availableWidth=0 by checking visibility.
 */
export const AdComponent = ({
    slot = "8020292211",
    format = "fluid",
    layout = "in-article",
    className = "",
    minHeight = "150px"
}: AdComponentProps) => {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isPushed, setIsPushed] = useState(false);

    useEffect(() => {
        // Reset state on route change
        setIsVisible(false);
        setIsPushed(false);

        const checkVisibility = () => {
            if (containerRef.current && containerRef.current.offsetWidth > 0) {
                setIsVisible(true);
            }
        };

        // Check initially after a short delay
        const timer = setTimeout(checkVisibility, 500);

        // Optional: Resize observer for more robust hydration handling
        const observer = new ResizeObserver(checkVisibility);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [pathname]);

    useEffect(() => {
        if (isVisible && !isPushed && typeof window !== 'undefined') {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                setIsPushed(true);
            } catch (err) {
                // Silently handle push errors
            }
        }
    }, [isVisible, isPushed]);

    return (
        <div
            ref={containerRef}
            className={`ad-container w-full mx-auto my-4 overflow-hidden ${className}`}
        >
            <div className="flex justify-start mb-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">
                    Sponsored Link
                </span>
            </div>

            {/* ONLY render the 'ins' tag when visible width is confirmed. 
                This prevents AdSense from attempting to measure a 0-width element. */}
            {isVisible && (
                <ins
                    className="adsbygoogle"
                    data-ad-layout={layout}
                    data-ad-format={format}
                    data-ad-client="ca-pub-1230621442620902"
                    data-ad-slot={slot}
                />
            )}

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
