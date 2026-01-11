import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'System Info | OmniMetric Terminal',
    description: 'Operational architecture and AI analysis methodology of Global Macro Signal.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-gray-300 font-mono p-6 md:p-12 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none opacity-20"></div>

            <div className="max-w-3xl mx-auto relative z-10 space-y-12">
                {/* Header */}
                <header className="border-b border-gray-800 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded-sm animate-pulse shadow-[0_0_10px_#06b6d4]"></div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-[0.15em] uppercase">System Information</h1>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest pl-6">OmniMetric Terminal v2.1.0 // Status: Nominal</p>
                </header>

                {/* Section 1: Vision */}
                <section className="space-y-4">
                    <h2 className="text-sm text-cyan-400 uppercase tracking-widest border-l-2 border-cyan-500 pl-3 mb-4">01. Mission Directive</h2>
                    <p className="leading-relaxed text-sm md:text-base text-gray-400">
                        OmniMetric Terminal is engineered to bridge the information asymmetry between institutional algorithms and individual investors.
                        By synthesizing fragmented global market signals into a coherent, real-time risk metric, we provide a "Head-Up Display" for the modern financial navigator.
                    </p>
                    <p className="leading-relaxed text-sm md:text-base text-gray-400">
                        Our objective is not merely data aggregation, but **Intelligence amplification**—transforming noise into actionable signal through tiered AI processing.
                    </p>
                </section>

                {/* Section 2: Architecture */}
                <section className="space-y-4">
                    <h2 className="text-sm text-cyan-400 uppercase tracking-widest border-l-2 border-cyan-500 pl-3 mb-4">02. Architecture & AI Core</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-sm">
                            <h3 className="text-xs text-white uppercase mb-2">Analysis Engine</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Powered by Google's **Gemini 1.5 Pro** and **Gemini 2.0 Flash**, our engine performs multi-dimensional analysis of:
                                <br />- VIX & MOVE Volatility Indices
                                <br />- High Yield Credit Spreads
                                <br />- Fed Financial Conditions (NFCI)
                            </p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-sm">
                            <h3 className="text-xs text-white uppercase mb-2">Real-time GMS Score</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                The Global Macro Score (0-100) is calculated every 60 minutes, utilizing a weighted algorithm verified against 20 years of historical market cycles.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Specs */}
                <section className="space-y-4">
                    <h2 className="text-sm text-cyan-400 uppercase tracking-widest border-l-2 border-cyan-500 pl-3 mb-4">03. System Specifications</h2>
                    <ul className="space-y-2 text-xs text-gray-500 font-mono">
                        <li className="flex justify-between border-b border-gray-900 pb-1">
                            <span>Frontend Core</span>
                            <span className="text-gray-300">Next.js 15 (App Router)</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-900 pb-1">
                            <span>Data Processing</span>
                            <span className="text-gray-300">Python 3.10 + Pandas</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-900 pb-1">
                            <span>AI Model Backend</span>
                            <span className="text-gray-300">Google Gemini API (Vertex AI)</span>
                        </li>
                        <li className="flex justify-between border-b border-gray-900 pb-1">
                            <span>Deployment</span>
                            <span className="text-gray-300">Vercel Edge Network</span>
                        </li>
                    </ul>
                </section>

                {/* Footer Action */}
                <div className="pt-12 flex justify-center">
                    <Link href="/" className="group flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-cyan-500 transition-colors bg-gray-900/50 hover:bg-cyan-950/20 text-gray-400 hover:text-cyan-400 uppercase text-xs tracking-widest">
                        <span className="w-1.5 h-1.5 bg-gray-500 group-hover:bg-cyan-400 rounded-full transition-colors"></span>
                        Return to Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
