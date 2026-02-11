'use client';

import { LangType, DICTIONARY } from '@/data/dictionary';

export type Allocation = {
    equities: number;
    crypto: number;
    metals: number;
    fixedIncome: number;
    cash: number;
};

interface OmniResonanceInputProps {
    allocation: Allocation;
    onChange: (newAllocation: Allocation) => void;
    lang: LangType;
}

export const OmniResonanceInput: React.FC<OmniResonanceInputProps> = ({ allocation, onChange, lang }) => {
    const t = DICTIONARY[lang] || DICTIONARY.EN;
    const ot = t.subpages.omni_resonance;

    const categories = [
        { key: 'equities', label: ot.allocations.equities, color: '#3b82f6' },
        { key: 'crypto', label: ot.allocations.crypto, color: '#8b5cf6' },
        { key: 'metals', label: ot.allocations.metals, color: '#f59e0b' },
        { key: 'fixedIncome', label: ot.allocations.fixedIncome, color: '#10b981' },
        { key: 'cash', label: ot.allocations.cash, color: '#64748b' },
    ];

    const handleSliderChange = (key: keyof Allocation, value: number) => {
        const diff = value - allocation[key];
        const otherKeys = categories.map(c => c.key as keyof Allocation).filter(k => k !== key);

        const totalOther = otherKeys.reduce((sum, k) => sum + allocation[k], 0);

        let newAllocation = { ...allocation, [key]: value };

        if (totalOther > 0) {
            otherKeys.forEach(k => {
                const ratio = allocation[k] / totalOther;
                newAllocation[k] = Math.max(0, allocation[k] - diff * ratio);
            });
        } else {
            // If others are all zero, distribute equally
            otherKeys.forEach(k => {
                newAllocation[k] = Math.max(0, (100 - value) / otherKeys.length);
            });
        }

        // Final normalization to ensure exact 100%
        const finalTotal = Object.values(newAllocation).reduce((a, b) => a + b, 0);
        if (finalTotal !== 100) {
            const adjustment = (100 - finalTotal) / categories.length;
            categories.forEach(c => {
                newAllocation[c.key as keyof Allocation] += adjustment;
            });
        }

        onChange(newAllocation);
    };

    return (
        <div className="w-full space-y-6 p-6 bg-slate-900/50 rounded-2xl border border-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <h3 className="text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{ot.allocations_title}</h3>

            <div className="space-y-4">
                {categories.map((cat) => (
                    <div key={cat.key} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-slate-400">{cat.label}</span>
                            <span
                                style={{ '--cat-color': cat.color } as React.CSSProperties}
                                className="font-mono text-[var(--cat-color)]"
                            >
                                {allocation[cat.key as keyof Allocation].toFixed(1)}%
                            </span>
                        </div>
                        <div className="relative h-8 flex items-center group">
                            <div className="absolute w-full h-1.5 bg-slate-800/80 rounded-full" />
                            <div
                                className="absolute h-1.5 rounded-full transition-all duration-300 bg-[var(--cat-color)] shadow-[0_0_15px_var(--cat-glow-color)]"
                                style={{
                                    '--cat-color': cat.color,
                                    '--cat-glow-color': `${cat.color}80`,
                                    width: `${allocation[cat.key as keyof Allocation]}%`,
                                } as React.CSSProperties}
                            />
                            {/* Visible Thumb Indicator */}
                            <div
                                className="absolute w-4 h-4 rounded-full bg-white border-2 border-[var(--cat-color)] shadow-[0_0_10px_white] z-20 pointer-events-none transition-all duration-300 group-hover:scale-125"
                                style={{
                                    '--cat-color': cat.color,
                                    left: `calc(${allocation[cat.key as keyof Allocation]}% - 8px)`,
                                } as React.CSSProperties}
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={allocation[cat.key as keyof Allocation]}
                                onChange={(e) => handleSliderChange(cat.key as keyof Allocation, parseFloat(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                                aria-label={`${cat.label} allocation`}
                                title={`${cat.label} allocation slider`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 italic">{ot.total_allocation_label}</span>
                </div>
            </div>
        </div>
    );
};
