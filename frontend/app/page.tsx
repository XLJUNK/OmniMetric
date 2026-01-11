'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Dashboard } from "@/components/Dashboard";
import { LangType } from "@/data/dictionary";
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<LangType>('JP');

  useEffect(() => {
    const urlLang = searchParams.get('lang') as LangType;
    if (urlLang && ['EN', 'JP', 'CN', 'ES'].includes(urlLang)) {
      setLang(urlLang);
    } else {
      // Default to JP, but try to detect browser language if it's one of ours
      let browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0].toUpperCase() : '';
      if (browserLang === 'JA') browserLang = 'JP';
      if (browserLang === 'ZH') browserLang = 'CN';

      if (['EN', 'JP', 'CN', 'ES'].includes(browserLang)) {
        setLang(browserLang as LangType);
      } else {
        setLang('JP'); // Absolute default
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0A0A0A] text-[#E0E0E0] selection:bg-sky-500 selection:text-white">
      <main className="flex-grow">
        <Dashboard lang={lang} setLang={setLang} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">INITIALIZING OMNIMETRIC CORE...</div>}>
      <HomeContent />
    </Suspense>
  );
}
