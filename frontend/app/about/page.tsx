import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'System Info | OmniMetric Terminal',
    description: 'Operational architecture and AI analysis methodology of Global Macro Signal.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-gray-300 font-mono p-6 md:p-12 relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,#111_1px,#111_2px)] opacity-20 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10 space-y-16">
                {/* Header */}
                <header className="border-b border-gray-800 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-[0.2em] uppercase mb-2">System Protocol</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">OmniMetric Terminal // Architecture v2.0</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-green-500 uppercase tracking-widest">System Nominal</span>
                        </div>
                    </div>
                </header>

                {/* Section 1: Mission Control */}
                <section className="space-y-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-[0.25em] border-l-2 border-white/20 pl-3">01 // Mission Control</h2>
                    <div className="bg-[#050505] border border-gray-900 p-6 shadow-lg">
                        <p className="leading-relaxed text-sm text-gray-400 mb-4">
                            The modern financial landscape is characterized by extreme data fragmentation. OmniMetric Terminal is engineered to resolve this asymmetry by integrating scattered global market signals—volatility indices, credit spreads, and yield curves—into a coherent, high-density visualization.
                        </p>
                        <p className="leading-relaxed text-sm text-gray-400">
                            Our core objective is the **algorithmic quantification of market regimes**. By synthesizing disparate data points into a unified statistical indicator (GMS Score), we provide objective, data-driven situational awareness for the independent analyst.
                        </p>
                    </div>
                </section>

                {/* Section 2: Logic & Architecture */}
                <section className="space-y-6">
                    <h2 className="text-xs text-gray-400 uppercase tracking-[0.25em] border-l-2 border-white/20 pl-3">02 // Logic & Architecture</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#050505] border border-gray-900 p-6">
                            <h3 className="text-xs text-white uppercase tracking-widest mb-3 text-cyan-500">Processing Core</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Data ingestion is driven by a custom-built **High-Precision Python Scraper**, ensuring real-time synchronization with primary economic data sources.
                                The raw stream is processed by a **Next-Gen LLM (Large Language Model)** integration, fine-tuned to detect semantic shifts in financial disclosures.
                            </p>
                        </div>
                        <div className="bg-[#050505] border border-gray-900 p-6">
                            <h3 className="text-xs text-white uppercase tracking-widest mb-3 text-cyan-500">Infrastructure</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                The platform operates on a **Next.js 15 Compliant Modern Architecture**, utilizing **Edge Computing** networks for sub-millisecond data delivery globally.
                                Optimization protocols ensure consistent performance across mobile and desktop interfaces without compromising data density.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Legal Protocol */}
                <section className="space-y-6 pt-8">
                    <h2 className="text-xs text-red-500 uppercase tracking-[0.25em] border-l-2 border-red-900/50 pl-3">03 // LEGAL PROTOCOL & DISCLAIMER</h2>
                    <div className="bg-red-950/5 border border-red-900/20 p-6 md:p-8">
                        <div className="space-y-4 text-[11px] text-gray-400 font-mono leading-relaxed text-justify">
                            <p>
                                <strong className="text-red-400">DO NOT RELY ON THIS DATA FOR INVESTMENT DECISIONS.</strong>
                            </p>
                            <p>
                                This platform ("OmniMetric Terminal") is strictly an information aggregation and statistical analysis tool.
                                It is NOT intended to provide, and does not constitute, financial advice, investment recommendations, or an offer/solicitation to buy or sell any financial instruments.
                            </p>
                            <p>
                                The scores, indicators, and analysis presented herein are the result of automated AI processing and statistical modeling.
                                These models are experimental in nature and may contain errors, biases, or inaccuracies.
                                Past performance of any algorithmic indicator is not indicative of future results.
                            </p>
                            <p>
                                <strong className="text-gray-300">LIMITATION OF LIABILITY:</strong> By accessing this system, you acknowledge that you are solely responsible for your own investment decisions.
                                The operators and developers of OmniMetric Terminal assume NO LIABILITY for any financial losses, damages, or legal consequences resulting from the use or reliance upon this data.
                                Verify all data with certified financial institutions before taking action.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer Action */}
                <div className="pt-16 pb-8 flex justify-center">
                    <Link href="/" className="group relative px-8 py-3 bg-gray-900 hover:bg-gray-800 transition-colors border-t border-b border-gray-800 hover:border-gray-600">
                        <span className="text-[10px] text-gray-400 group-hover:text-white uppercase tracking-[0.3em] transition-colors">Terminate Session / Return</span>
                        <span className="absolute left-0 top-0 h-full w-[1px] bg-gray-800 group-hover:bg-cyan-500 transition-colors"></span>
                        <span className="absolute right-0 top-0 h-full w-[1px] bg-gray-800 group-hover:bg-cyan-500 transition-colors"></span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
