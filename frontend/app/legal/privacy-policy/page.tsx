import { Metadata } from 'next';
import { TerminalPage } from '@/components/TerminalPage';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: "Privacy Policy | OmniMetric Terminal",
    description: "Privacy Policy and Data Protection practices for OmniMetric.",
};

export default function PrivacyPage() {
    return (
        <TerminalPage pageKey="legal">
            <div className="max-w-4xl space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Shield className="w-8 h-8 text-cyan-500" />
                    <h1 className="text-3xl font-black tracking-tight text-white">Privacy Policy</h1>
                </div>
                <p className="text-sm text-slate-500 font-mono">Last Updated: January 12, 2026</p>

                {/* Google AdSense Disclosure - CRITICAL FOR APPROVAL */}
                <section className="bg-[#111] !border !border-yellow-500/30 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-wide">
                        🔔 Advertising & Cookie Notice
                    </h2>
                    <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                        <p>
                            OmniMetric uses <strong className="text-white">Google AdSense</strong>, a third-party advertising service, to display relevant advertisements to our users.
                        </p>
                        <p>
                            Google and its partners use <strong className="text-cyan-400">DoubleClick Cookies</strong> and similar tracking technologies to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-400">
                            <li>Serve ads based on your browsing history and interests</li>
                            <li>Measure ad performance and engagement</li>
                            <li>Personalize advertising content across websites you visit</li>
                        </ul>
                        <p className="pt-2">
                            <strong className="text-green-400">You can opt out of personalized advertising</strong> by visiting:
                        </p>
                        <div className="bg-black !border !border-slate-700 !rounded-lg p-4 font-mono text-xs">
                            <a
                                href="https://www.google.com/settings/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-400 hover:text-sky-300 underline"
                            >
                                Google Ads Settings →
                            </a>
                        </div>
                        <p className="text-xs text-slate-500">
                            For more information on how Google uses data when you use partner sites, visit:{' '}
                            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener" className="text-sky-500 hover:underline">
                                policies.google.com/technologies/partner-sites
                            </a>
                        </p>
                    </div>
                </section>

                {/* Data Collection */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        1. Data We Collect
                    </h2>
                    <div className="space-y-3 text-sm text-slate-300">
                        <div>
                            <h3 className="text-cyan-400 font-bold mb-2">Automatically Collected Information</h3>
                            <ul className="list-disc pl-6 space-y-1 text-slate-400">
                                <li>Page views and navigation patterns</li>
                                <li>Language preferences (EN/JP/CN/ES/HI/ID/AR)</li>
                                <li>Device type and browser information</li>
                                <li>Geographic location (country/city level, anonymized)</li>
                                <li>Session duration and interaction timestamps</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-cyan-400 font-bold mb-2">Cookies Used</h3>
                            <ul className="list-disc pl-6 space-y-1 text-slate-400">
                                <li><strong>Functional Cookies:</strong> Language selection, consent preferences</li>
                                <li><strong>Analytics Cookies:</strong> Google Analytics 4 (GA4) for site performance</li>
                                <li><strong>Advertising Cookies:</strong> Google AdSense for ad personalization</li>
                            </ul>
                        </div>
                        <p className="text-xs text-slate-500 pt-2">
                            We do <strong>NOT</strong> collect Personally Identifiable Information (PII) such as email addresses, names, or payment details.
                        </p>
                    </div>
                </section>

                {/* Third-Party Services */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        2. Third-Party Services
                    </h2>
                    <div className="space-y-4 text-sm text-slate-300">
                        <div>
                            <h3 className="text-sky-400 font-bold mb-2">Google AdSense</h3>
                            <p className="text-slate-400">
                                Third-party vendors, including Google, use cookies to serve ads based on your prior visits to OmniMetric and other websites. This enables Google and its partners to deliver relevant advertising across the internet.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sky-400 font-bold mb-2">Google Analytics</h3>
                            <p className="text-slate-400">
                                We use Google Analytics 4 to understand user behavior, measure site performance, and improve our services. No personal data is shared with third parties beyond Google's analytics services.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sky-400 font-bold mb-2">Vercel Analytics</h3>
                            <p className="text-slate-400">
                                Privacy-focused analytics provided by our hosting platform to monitor uptime and performance metrics.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Data Security */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        3. Data Security
                    </h2>
                    <p className="text-sm text-slate-300">
                        All data transmitted between your browser and our servers is encrypted using HTTPS/TLS. We do not store sensitive financial data or payment information on our servers.
                    </p>
                </section>

                {/* Your Rights */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        4. Your Rights
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-slate-300">
                        <li><strong>Opt-out of personalized ads:</strong> Visit Google Ads Settings (link above)</li>
                        <li><strong>Block cookies:</strong> Configure your browser settings to reject cookies</li>
                        <li><strong>Do Not Track:</strong> We respect browser DNT signals where applicable</li>
                    </ul>
                </section>

                {/* Changes to Policy */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                        5. Changes to This Policy
                    </h2>
                    <p className="text-sm text-slate-300">
                        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of OmniMetric constitutes acceptance of any changes.
                    </p>
                </section>

                {/* Contact */}
                <section className="bg-[#111] !border !border-slate-800 !rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-3">
                        6. Contact
                    </h2>
                    <p className="text-sm text-slate-300">
                        For privacy-related inquiries, contact us via Direct Message on X (Twitter):{' '}
                        <a href="https://twitter.com/OmniMetric_GMS" target="_blank" rel="noopener" className="text-sky-400 hover:underline font-mono">
                            @OmniMetric_GMS
                        </a>
                    </p>
                </section>

                <div className="pt-8 border-t border-slate-800 opacity-50">
                    <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600">
                        Privacy Framework: GDPR-Compliant // Cookie Consent v2.0
                    </p>
                </div>
            </div>
        </TerminalPage>
    );
}
