import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Disclaimer | OmniMetric",
    description: "Financial Disclaimer regarding OmniMetric analysis.",
};

export default function DisclaimerPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 text-slate-300">
            <h1 className="text-3xl font-bold mb-6 text-white">Financial Disclaimer</h1>

            <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl mb-8">
                <h2 className="text-xl font-bold mb-4 text-red-500">Not Investment Advice</h2>
                <p className="mb-4 font-bold">
                    OmniMetric is an informational platform only. Nothing on this website constitutes financial, investment, legal, or tax advice.
                </p>
            </div>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">No Fiduciary Duty</h2>
                <p className="mb-4">
                    We are not your financial advisor. The "GMS Score" and other metrics are theoretical outputs of a mathematical model and should not be used as the sole basis for any investment decision.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">Risk Warning</h2>
                <p className="mb-4">
                    Trading in financial markets (Stocks, Crypto, Forex, Commodities) involves a high degree of risk and is not suitable for all investors.
                    You could lose some or all of your initial investment.
                </p>
            </section>
        </div>
    );
}
