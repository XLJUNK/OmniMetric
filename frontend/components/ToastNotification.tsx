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
            setShouldRender(true);
            const timer = setTimeout(() => {
                onClose();
            }, 2000); // 2 seconds display
            return () => clearTimeout(timer);
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
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999] transition-all duration-300 ease-out flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E293B] border border-slate-700 shadow-2xl backdrop-blur-md ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}
        >
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
            </div>
            <span className="text-xs font-bold text-slate-200 tracking-wide font-sans">
                {message}
            </span>
        </div>
    );
};
