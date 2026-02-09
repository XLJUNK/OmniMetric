
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    funcTitle?: string;
    funcDesc?: string;
    purposeTitle?: string;
    purposeDesc?: string;
    children?: React.ReactNode;
}

export const ExplanationModal = ({
    isOpen,
    onClose,
    title,
    funcTitle,
    funcDesc,
    purposeTitle,
    purposeDesc,
    children
}: ExplanationModalProps) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-slate-700 rounded-xl w-[95%] sm:w-full max-w-2xl p-6 shadow-2xl bg-[#0F172A] opacity-100 z-[10000] pointer-events-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pe-2 custom-scrollbar">
                    {children ? children : (
                        <>
                            {/* Function Section */}
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-200">
                                    {funcTitle}
                                </h3>
                                <p className="text-sm leading-relaxed font-sans text-slate-400">
                                    {funcDesc}
                                </p>
                            </section>

                            {/* Purpose Section */}
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-200">
                                    {purposeTitle}
                                </h3>
                                <p className="text-sm leading-relaxed font-sans text-slate-400">
                                    {purposeDesc}
                                </p>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
