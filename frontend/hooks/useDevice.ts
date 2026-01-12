'use client';

import { useState, useEffect } from 'react';

export const useDevice = () => {
    const [device, setDevice] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 0,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setDevice({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024,
                width,
            });
        };

        // Set initial size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return device;
};
