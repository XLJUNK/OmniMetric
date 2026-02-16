import React from 'react';
import { MonthlyArchiveClient } from '@/components/MonthlyArchiveClient';
import fs from 'fs';
import path from 'path';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ month: string; lang: string }>;
};

// Generate Static Params for all archived months AND languages
export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');
    let months: string[] = [];

    const monthlyIndexFile = path.join(archiveDir, 'monthly_index.json');
    if (fs.existsSync(monthlyIndexFile)) {
        const data = JSON.parse(fs.readFileSync(monthlyIndexFile, 'utf8'));
        months = data.months || [];
    }

    const langs = Object.keys(DICTIONARY).filter(l => l !== 'EN').map(l => l.toLowerCase());

    const params = [];
    for (const m of months) {
        for (const l of langs) {
            params.push({ lang: l, month: m });
        }
    }

    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { month } = await params;
    return {
        title: `Monthly Synopsis - ${month} | OmniMetric`,
        description: `Macro intelligence summary and quantitative audit for ${month}.`,
    };
}

export default async function MonthlyArchivePage({ params }: Props) {
    const { month, lang } = await params;
    const normalizedLang = (lang.toUpperCase() as LangType) || 'EN';
    return <MonthlyArchiveClient month={month} lang={normalizedLang} selectorMode="path" />;
}
