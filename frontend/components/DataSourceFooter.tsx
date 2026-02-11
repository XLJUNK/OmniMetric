import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export const DataSourceFooter = () => {
    return (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800" aria-label="Data Sources and Attributions">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500">
                        <Database className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                            Verified Data Sources (Institutional Grade)
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                            <span className="source-citation" title="Federal Reserve Economic Data">FRED (St. Louis Fed)</span> •
                            <span className="source-citation">Yahoo Finance</span> •
                            <span className="source-citation">Investing.com</span> •
                            <span className="source-citation" title="Chicago Board Options Exchange">CBOE</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Algorithmic Synthesis Validity: 2026-02-11 Checked</span>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic leading-relaxed">
                    OmniMetric specializes in proprietary algorithmic synthesis (<abbr title="Global Macro Signal">GMS</abbr>/<abbr title="OmniMetric Global Volatility">OGV</abbr>/<abbr title="OmniMetric Western Bond">OWB</abbr>) to provide unique macro insights. These metrics are synthesized from raw institutional data to provide predictive signals for professional analysis.
                </p>
            </div>
        </div>
    );
};
