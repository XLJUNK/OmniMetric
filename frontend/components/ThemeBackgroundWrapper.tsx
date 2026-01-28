'use client';

import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { usePathname } from 'next/navigation';

export const ThemeBackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();
    const pathname = usePathname();

    // Determine background color based on theme
    // User requested Light Gray for Light Mode, Black for Dark Mode
    const backgroundColor = theme === 'dark' ? '#0a0a0a' : '#F1F5F9';

    return (
        <div
            className="omni-terminal-root relative min-h-screen flex transition-colors duration-300"
            style={{ backgroundColor: backgroundColor, color: theme === 'dark' ? '#e2e8f0' : '#0f172a' }}
        >
            {children}
        </div>
    );
};
