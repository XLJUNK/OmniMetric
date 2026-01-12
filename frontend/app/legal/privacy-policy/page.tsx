import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy | OmniMetric",
    description: "Privacy Policy and Data Collection practices for OmniMetric Terminal.",
};

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 text-slate-300">
            <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
            <p className="mb-4 text-sm">Last Updated: January 12, 2026</p>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">1. Data Collection</h2>
                <p className="mb-4">
                    OmniMetric uses Google Analytics 4 (GA4) to collect anonymous usage data.
                    This includes page views, session duration, and geographic location (at a country/city level).
                    We do not collect Personally Identifiable Information (PII) unless explicitly provided via our contact forms.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">2. Cookies</h2>
                <p className="mb-4">
                    We use cookies to enhance user experience and for analytics purposes.
                    Specifically:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Functional Cookies:</strong> To remember your language preference (EN/JP/CN/ES).</li>
                    <li><strong>Analytics Cookies:</strong> Google Analytics cookies to track site performance.</li>
                    <li><strong>Advertising Cookies:</strong> Google AdSense cookies to display relevant advertisements.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">3. Third-Party Vendors</h2>
                <p className="mb-4">
                    <strong>Google AdSense:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                    Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
                    Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-sky-500 hover:underline">Ads Settings</a>.
                </p>
            </section>
        </div>
    );
}
