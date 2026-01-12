import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service | OmniMetric",
    description: "Terms and Conditions for using OmniMetric Terminal.",
};

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 text-slate-300">
            <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
            <p className="mb-4 text-sm">Last Updated: January 12, 2026</p>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
                <p className="mb-4">
                    By accessing OmniMetric Terminal, you agree to be bound by these Terms of Service.
                    If you do not agree, strictly stop using the service immediately.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">2. Usage Restrictions</h2>
                <p className="mb-4">
                    You agree NOT to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Use automated scripts to scrape data without a commercial license.</li>
                    <li>Use this data for training Artificial Intelligence (AI) models.</li>
                    <li>Reverse engineer the proprietary GMS scoring algorithm.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">3. Intellectual Property</h2>
                <p className="mb-4">
                    The "OmniMetric" name, the GMS Algorithm, and the visual design of this terminal are the intellectual property of the OmniMetric Project.
                </p>
            </section>
        </div>
    );
}
