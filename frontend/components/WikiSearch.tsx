'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { WikiItem } from '@/lib/wiki';
import Link from 'next/link';
import { LangType, DICTIONARY } from '@/data/dictionary';

interface WikiSearchProps {
    items: WikiItem[];
    lang: LangType;
    placeholder?: string;
}

export const WikiSearch = ({ items, lang, placeholder }: WikiSearchProps) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isRTL = lang === 'AR';

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredItems = useMemo(() => {
        if (!query || query.length < 2) return [];
        const lowerQuery = query.toLowerCase();

        return items.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(lowerQuery);
            const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
            const categoryMatch = item.category.toLowerCase().includes(lowerQuery);
            return titleMatch || tagMatch || categoryMatch;
        }).slice(0, 10); // Limit to 10 results for performance
    }, [items, query]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full flex justify-end mb-8 z-[40]">
            <div className={`relative flex items-center bg-white dark:bg-[#050505] border border-slate-200 dark:border-slate-800 rounded-lg focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 focus-within:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder={placeholder || "Search..."}
                    className={`appearance-none relative z-10 w-72 h-12 border-none text-base text-slate-900 wiki-search-input caret-sky-500 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 px-4 bg-transparent outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                    autoComplete="off"
                    onFocus={() => setIsOpen(true)}
                />

                {/* Icons Container (Flex Sibling - No Overlap) */}
                <div className={`flex items-center gap-2 ${isRTL ? 'pl-4' : 'pr-4'}`}>
                    {query && (
                        <button
                            onClick={clearSearch}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <Search className="w-6 h-6 text-sky-500 select-none" />
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 wiki-search-dropdown rounded-lg shadow-2xl z-[9999] overflow-hidden max-h-[60vh] overflow-y-auto isolate"
                >
                    {filteredItems.length > 0 ? (
                        <ul>
                            {filteredItems.map(item => (
                                <li key={item.slug} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <Link
                                        href={`/${lang.toLowerCase()}/wiki/${item.slug}`}
                                        className={`block p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                                            <span className="text-xs text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                                                {item.type}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-sky-500">{item.category}</span>
                                            {item.tags.length > 0 && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <span className="truncate max-w-[200px]">{item.tags.join(', ')}</span>
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            No matches found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
