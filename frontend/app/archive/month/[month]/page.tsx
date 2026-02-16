import React from 'react';
import { MonthlyArchiveClient } from '@/components/MonthlyArchiveClient';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ month: string }>;
};

// Generate Static Params for all archived months (English root)
export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');
    let months: string[] = [];

    const monthlyIndexFile = path.join(archiveDir, 'monthly_index.json');
    if (fs.existsSync(monthlyIndexFile)) {
        const data = JSON.parse(fs.readFileSync(monthlyIndexFile, 'utf8'));
        months = data.months || [];
    }

    return months.map(m => ({ month: m }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { month } = await params;
    return {
        title: `Monthly Synopsis - ${month} | OmniMetric`,
        description: `Macro intelligence summary and quantitative audit for ${month}.`,
        robots: {
            index: true,
            follow: true,
        }
    };
}

export default async function MonthlyArchivePage({ params }: Props) {
    const { month } = await params;
    return <MonthlyArchiveClient month={month} lang="EN" selectorMode="path" />;
}
