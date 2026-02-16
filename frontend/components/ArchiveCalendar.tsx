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
                <div key={d} className={`h-12 border border-slate-100 dark:border-white/5 relative group transition-colors ${isAvailable ? 'bg-sky-500/5 hover:bg-sky-500/20' : 'bg-slate-50/50 dark:bg-white/5'}`}>
                    {isAvailable ? (
                        <Link
                            href={lang === 'en' ? `/archive/${dateStr}` : `/${lang}/archive/${dateStr}`}
                            className="absolute inset-0 flex flex-col items-center justify-center no-underline"
                        >
                            <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">{d}</span>
                            <div className="w-1 h-1 rounded-full bg-sky-500 mt-1 animate-pulse" />
                        </Link>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 font-medium">{d}</span>
                        </div>
                    )}
                </div>
            );
        }

        return calendarDays;
    };

    // Generate localized day names
    const getDayNames = () => {
        const days = [];
        const baseDate = new Date(2021, 5, 6); // A Sunday
        for (let i = 0; i < 7; i++) {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + i);
            days.push(new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(date).toUpperCase());
        }
        return days;
    };

    if (loading) {
        return (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Activity className="w-6 h-6 text-sky-500 animate-spin" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">{t.loading_calendar || "SYNCING ARCHIVE..."}</span>
            </div>
        );
    }

    const dayNames = getDayNames();
    const isCJK = ['jp', 'cn'].includes(lang.toLowerCase());

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* CALENDAR HEADER */}
            <div className="flex items-center justify-between bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
                <button
                    onClick={prevMonth}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95"
                    title="Previous Month"
                >
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase">
                        {viewDate.toLocaleString(lang, { month: 'long', year: 'numeric' })}
                    </span>
                </div>
                <button
                    onClick={nextMonth}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95"
                    title="Next Month"
                >
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* CALENDAR GRID */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 py-1 px-2 mb-2 w-fit">
                        <CalendarIcon className="w-4 h-4 text-sky-500" />
                        <span className={`text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 ${isCJK ? 'tracking-wider' : 'tracking-[0.3em]'}`}>
                            {t.calendar_title || "DAILY SNAPSHOTS"}
                        </span>
                    </div>

                    <div className="relative border border-slate-200 dark:border-white/5 overflow-hidden rounded-xl shadow-sm bg-white dark:bg-[#0a0a0a]">
                        <div className="grid grid-cols-7 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                            {dayNames.map(day => (
                                <div key={day} className="h-10 flex items-center justify-center">
                                    <span className="text-[9px] font-black tracking-widest text-slate-400">{day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 min-h-[192px]">
                            {renderCalendar()}
                        </div>
                    </div>
                </div>

                {/* MONTHLY SUMMARY CARD */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 py-1 px-2 mb-2 w-fit">
                        <Layers className="w-4 h-4 text-sky-500" />
                        <span className={`text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 ${isCJK ? 'tracking-wider' : 'tracking-[0.3em]'}`}>
                            {t.monthly_reports_title || "STATISTICAL SYNOPSIS"}
                        </span>
                    </div>

                    <div className={`p-8 rounded-2xl border transition-all relative overflow-hidden group ${hasMonthlyReport ? 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/10' : 'bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-40'}`}>
                        {hasMonthlyReport ? (
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-500/20">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Report Ready</span>
                                            <span className="text-[9px] font-mono text-sky-500 dark:text-sky-400 uppercase font-bold">{monthKey} Snapshot</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-sky-500/10 rounded-full">
                                        <Activity className="w-3 h-3 text-sky-500" />
                                        <span className="text-[9px] font-black text-sky-600 uppercase">Verified</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-mono italic p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                    "{t.monthly_summary_desc || "Automated synthesis of the month's macro regime and asset correlations."}"
                                </p>
                                <Link
                                    href={lang === 'en' ? `/archive/month/${monthKey}` : `/${lang}/archive/month/${monthKey}`}
                                    className="block text-center py-3 bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98] no-underline"
                                >
                                    {t.view_report || "VIEW SYNOPSIS"}
                                </Link>
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.no_data || "AWAITING PERIOD END"}</span>
                                    <span className="block text-[9px] font-mono text-slate-400 uppercase">Data stream incomplete</span>
                                </div>
                            </div>
                        )}
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none">
                            <Activity className="w-32 h-32" />
                        </div>
                    </div>

                    {/* STATUS MINI GRID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Logs</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-mono font-black text-sky-600 dark:text-sky-400">{dates.length}</span>
                                <span className="text-[9px] font-mono text-slate-400">UNITS</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Intelligence</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-mono font-black text-sky-600 dark:text-sky-400">{months.length}</span>
                                <span className="text-[9px] font-mono text-slate-400">SUMS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
