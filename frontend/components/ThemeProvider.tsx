'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const savedConfig = localStorage.getItem('gms_terminal_config_v1');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                if (config.theme) {
                    setThemeState(config.theme);
                }
            }
        } catch (e) {
            console.warn('Failed to load theme preference', e);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Sync with legacy config storage for MultiAssetSummary compatibility
        // This ensures if user refreshes, MultiAssetSummary reads the correct theme from local storage
        try {
            const saved = localStorage.getItem('gms_terminal_config_v1');
            const config = saved ? JSON.parse(saved) : {};
            if (config.theme !== theme) {
                config.theme = theme;
                localStorage.setItem('gms_terminal_config_v1', JSON.stringify(config));
            }
        } catch (e) {
            // Ignore storage errors
        }

    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
            {!mounted && <div style={{ visibility: 'hidden' }} />}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
