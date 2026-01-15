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
        const getDeviceFromCookie = () => {
            const match = document.cookie.match(/gms_device=([^;]+)/);
            return match ? match[1] : null;
        };

        const initialDevice = getDeviceFromCookie();

        const handleResize = () => {
            const width = window.innerWidth;
            const isMobile = width < 768;
            const isTablet = width >= 768 && width < 1024;
            const isDesktop = width >= 1024;

            setDevice({ isMobile, isTablet, isDesktop, width });
        };

        if (initialDevice) {
            setDevice(prev => ({
                ...prev,
                isMobile: initialDevice === 'mobile',
                isTablet: initialDevice === 'tablet',
                isDesktop: initialDevice === 'desktop',
                width: window.innerWidth
            }));
        } else {
            handleResize();
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return device;
};
