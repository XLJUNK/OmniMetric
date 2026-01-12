import { Metadata } from 'next';
import { Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: "Contact | OmniMetric",
    description: "Contact the OmniMetric Team.",
};

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 text-slate-300 min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-4xl font-black mb-8 text-white uppercase tracking-tighter">Contact Support</h1>

            <div className="bg-[#111] border border-white/10 p-12 rounded-2xl flex flex-col items-center gap-6">
                <div className="p-4 bg-white/5 rounded-full">
                    <Mail className="w-8 h-8 text-sky-500" />
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">General Inquiries</h2>
                    <p className="text-slate-400 mb-4">
                        For institutional licensing, API access, or general support.
                    </p>
                    <a href="mailto:support@omnimetric.net" className="text-2xl font-mono font-bold text-sky-400 hover:text-sky-300">
                        support@omnimetric.net
                    </a>
                </div>

                <div className="w-full h-px bg-white/10 my-4"></div>

                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Response Time</p>
                    <p className="text-sm font-bold text-white">Within 24 Hours (Business Days)</p>
                </div>
            </div>
        </div>
    );
}
