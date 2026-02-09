'use client';

import React, { createContext, useContext, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    React.useLayoutEffect(() => {
        setMounted(true);
        // FORCE DARK MODE ALWAYS
        const root = window.document.documentElement;
        root.classList.remove('light');
        root.classList.add('dark');
        // Clear legacy config to prevent confusion, or just ignore it.
    }, []);

    // No effect needed for theme changes since it's constant.

    const toggleTheme = () => {
        // No-op
    };

    const setTheme = (_newTheme: Theme) => {
        // No-op
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
            {!mounted && <div className="invisible" />}
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
