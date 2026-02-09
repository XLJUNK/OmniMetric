'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export const ToastNotification = ({ message, isVisible, onClose }: ToastProps) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const renderTimer = setTimeout(() => setShouldRender(true), 0);
            const closeTimer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => {
                clearTimeout(renderTimer);
                clearTimeout(closeTimer);
            };
        } else {
            // Allow animation to finish before unmounting
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-300 ease-out flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-2xl ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}
        >
            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-slate-600 dark:text-white" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide font-sans">
                {message}
            </span>
        </div>
    );
};
