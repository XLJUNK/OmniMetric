'use client';

import React, { useEffect, useRef } from 'react';

export const AdUnit = () => {
    const initialized = useRef(false);

    useEffect(() => {
        // Prevent double execution in React Strict Mode
        if (initialized.current) {
            return;
        }

        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            initialized.current = true;
        } catch (err: any) {
            // Ignore the specific tag error if it happens despite safeguards
            if (process.env.NODE_ENV === 'development' && err.message?.includes('already have ads')) {
                return;
            }
            console.error('AdSense error', err);
        }
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <span className="absolute top-0 right-1 text-[8px] font-mono text-gray-700 uppercase tracking-widest z-10">Sponsored</span>
            {/* Horizontal Display Unit */}
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-0000000000000000"
                data-ad-slot="1234567890" // Placeholder slot
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    );
};
