'use client';
import { SectorDashboard } from '@/components/SectorDashboard';
import { useState } from 'react';
import { LangType } from '@/data/dictionary';

export default function CryptoPage({ searchParams }: { searchParams: { lang?: string } }) {
    const [lang, setLang] = useState<LangType>((searchParams?.lang as LangType) || 'EN');
    return <SectorDashboard sectorKey="CRYPTO" lang={lang} setLang={setLang} />;
}
