import React from 'react';
import ArchiveClient from './ArchiveClient';
import fs from 'fs';
import path from 'path';
import { DICTIONARY, LangType } from '@/data/dictionary';

// Generate Static Params for all archived dates AND languages
export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');

    let dates: string[] = [];
    if (fs.existsSync(archiveDir)) {
        const files = fs.readdirSync(archiveDir);
        dates = files
            .filter(file => file.endsWith('.json') && file !== 'index.json')
            .map(file => file.replace('.json', ''));
    }

    const langs = Object.keys(DICTIONARY).filter(l => l !== 'EN').map(l => l.toLowerCase());

    // Create combination of ALL dates and ALL languages
    const params = [];
    for (const d of dates) {
        for (const l of langs) {
            params.push({ lang: l, date: d });
        }
    }

    return params;
}

type Props = {
    params: Promise<{ date: string; lang: string }>;
};

export default async function ArchiveDetailPage({ params }: Props) {
    const { date, lang } = await params;
    const normalizedLang = (lang.toUpperCase() as LangType) || 'EN';
    return <ArchiveClient date={date} lang={normalizedLang} />;
}
