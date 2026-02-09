import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export const DataSourceFooter = () => {
    return (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500">
                        <Database className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                            Verified Data Sources
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                            FRED (St. Louis Fed) • Yahoo Finance • Investing.com • CBOE
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Algorithmic Validity Checked Daily</span>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic leading-relaxed">
                    OmniMetric specializes in proprietary algorithmic synthesis (GMS/OGV/OWB/OTG) to provide unique macro insights not available on traditional news platforms.
                </p>
            </div>
        </div>
    );
};
