'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, Activity, Layers } from 'lucide-react';
import Link from 'next/link';

interface ArchiveCalendarProps {
    lang: string;
    t: any; // subpages.archive from dictionary
}

export const ArchiveCalendar: React.FC<ArchiveCalendarProps> = ({ lang, t }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [dates, setDates] = useState<string[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIndex = async () => {
            try {
                // Fetch Daily Index
                const dailyRes = await fetch('/data/archive/index.json');
                if (dailyRes.ok) {
                    const dailyData = await dailyRes.json();
                    setDates(dailyData.dates || []);
                }

                // Fetch Monthly Index
                const monthlyRes = await fetch('/data/archive/monthly_index.json');
                if (monthlyRes.ok) {
                    const monthlyData = await monthlyRes.json();
                    setMonths(monthlyData.months || []);
                }
            } catch (e) {
                console.error("Failed to fetch archive index", e);
            } finally {
                setLoading(false);
            }
        };
        fetchIndex();
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const hasMonthlyReport = months.includes(monthKey);

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const renderCalendar = () => {
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const calendarDays = [];

        // Padding for previous month
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`pad-${i}`} className="h-12 border border-transparent" />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isAvailable = dates.includes(dateStr);

            calendarDays.push(
                <div key={d} className={`h-12 border border-slate-100 dark:border-white/5 relative group transition-colors ${isAvailable ? 'bg-sky-500/5 hover:bg-sky-500/20' : 'opacity-20'}`}>
                    {isAvailable ? (
                        <Link
                            href={lang === 'en' ? `/archive/${dateStr}` : `/${lang}/archive/${dateStr}`}
                            className="absolute inset-0 flex flex-col items-center justify-center no-underline"
                        >
                            <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">{d}</span>
                            <div className="w-1 h-1 rounded-full bg-sky-500 mt-1 animate-pulse" />
                        </Link>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-mono text-slate-400">{d}</span>
                        </div>
                    )}
                </div>
            );
        }

        return calendarDays;
    };

    if (loading) {
        return (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Activity className="w-6 h-6 text-sky-500 animate-spin" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">{t.loading_calendar || "SYNCING ARCHIVE..."}</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* CALENDAR HEADER */}
            <div className="flex items-center justify-between bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 p-4 rounded-lg shadow-sm">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors" title="Previous Month">
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                        {viewDate.toLocaleString(lang, { month: 'long', year: 'numeric' })}
                    </span>
                </div>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors" title="Next Month">
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CALENDAR GRID */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon className="w-3 h-3 text-sky-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.calendar_title || "DAILY SNAPSHOTS"}</span>
                    </div>
                    <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-white/5 overflow-hidden rounded-lg">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                            <div key={day} className="h-8 flex items-center justify-center bg-slate-50 dark:bg-white/5 border-b border-r border-slate-200 dark:border-white/5">
                                <span className="text-[8px] font-bold text-slate-400">{day}</span>
                            </div>
                        ))}
                        {renderCalendar()}
                    </div>
                </div>

                {/* MONTHLY SUMMARY CARD */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-3 h-3 text-sky-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.monthly_reports_title || "STATISTICAL SYNOPSIS"}</span>
                    </div>

                    <div className={`p-6 rounded-xl border transition-all ${hasMonthlyReport ? 'bg-sky-50 dark:bg-sky-500/5 border-sky-200 dark:border-sky-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-50'}`}>
                        {hasMonthlyReport ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-sky-900 dark:text-sky-400 uppercase tracking-tighter">AI Analysis Ready</span>
                                        <span className="text-[8px] text-slate-500 uppercase">{monthKey} Report</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-mono italic">
                                    {t.monthly_summary_desc || "Automated synthesis of the month's macro regime and asset correlations."}
                                </p>
                                <Link
                                    href={lang === 'en' ? `/archive/month/${monthKey}` : `/${lang}/archive/month/${monthKey}`}
                                    className="block text-center py-2 bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded transition-colors no-underline"
                                >
                                    {t.view_report || "VIEW SYNOPSIS"}
                                </Link>
                            </div>
                        ) : (
                            <div className="h-32 flex flex-col items-center justify-center text-center space-y-2">
                                <FileText className="w-5 h-5 text-slate-300" />
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{t.no_data || "AWAITING END OF MONTH"}</span>
                            </div>
                        )}
                    </div>

                    {/* STATUS MINI GRID */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-lg">
                            <span className="block text-[8px] text-slate-500 uppercase mb-1">Total Logs</span>
                            <span className="text-xs font-mono font-bold text-sky-500">{dates.length}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-lg">
                            <span className="block text-[8px] text-slate-500 uppercase mb-1">Summaries</span>
                            <span className="text-xs font-mono font-bold text-sky-500">{months.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
