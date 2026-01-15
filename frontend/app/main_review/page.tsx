import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "UI Review | OmniMetric Terminal",
    description: "Private environment for verifying Next-Gen Universal Responsive UI (v2.4.0).",
    robots: "noindex, nofollow"
};

export default function ReviewPage() {
    return (
        <div className="relative">
            <div className="bg-sky-500/10 border-b border-sky-500/20 px-4 py-2 text-[10px] font-bold text-sky-500 uppercase tracking-widest text-center z-[10000]">
                Global Macro Signal v2.4.0 (Private Review Environment)
            </div>
            <MultiAssetSummary />
        </div>
    );
}
