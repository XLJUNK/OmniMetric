'use client';

import React from 'react';

export const ThemeBackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
    // Theme is now always 'dark', no need to check context
    return (
        <div
            className="omni-terminal-root relative min-h-screen flex bg-black text-[#e2e8f0]"
        >
            {children}
        </div>
    );
};
