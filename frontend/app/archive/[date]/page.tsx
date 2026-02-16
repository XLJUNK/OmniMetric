import React from 'react';
import ArchiveClient from '@/app/[lang]/archive/[date]/ArchiveClient';
import fs from 'fs';
import path from 'path';

// Generate Static Params for all archived dates for the root English route
export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');

    let dates: string[] = [];
    if (fs.existsSync(archiveDir)) {
        const files = fs.readdirSync(archiveDir);
        dates = files
            .filter(file => file.endsWith('.json') && file !== 'index.json')
            .map(file => file.replace('.json', ''));
    }

    return dates.map(d => ({ date: d }));
}

import { Metadata } from 'next';

type Props = {
    params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { date } = await params;
    const targetDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // SEO Strategy: Only index the last 7 days of daily reports to avoid "thin content" bloat
    const shouldIndex = diffDays <= 7;

    return {
        title: `Archive - ${date} | OmniMetric`,
        robots: {
            index: shouldIndex,
            follow: true,
        }
    };
}

export default async function ArchiveDetailPage({ params }: Props) {
    const { date } = await params;
    // Root route defaults to English ('EN')
    return <ArchiveClient date={date} lang="EN" selectorMode="path" />;
}
