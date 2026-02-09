import React, { Suspense } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';

export function generateStaticParams() {
    return Object.keys(DICTIONARY).filter((lang) => lang !== 'EN').map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const isJP = normalizedLang === 'JP';
    return getMultilingualMetadata('/contact', normalizedLang, isJP ? 'お問い合わせとサポート' : 'Contact & Support', isJP ? 'お問い合わせとサポートに関する情報' : 'Contact and support information for OmniMetric.');
}

export default async function ContactPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    const isJP = normalizedLang === 'JP';

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cyan-500 font-mono text-xs animate-pulse">CONNECTING TO SUPPORT SERVER...</div>}>
            <div className="min-h-screen text-slate-800 dark:text-[#E0E0E0] font-sans selection:bg-cyan-100 dark:selection:bg-sky-500 selection:text-cyan-900 dark:selection:text-white">
                <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 lg:px-24">
                    {/* Breadcrumb / Top Nav */}
                    <div className="flex justify-end items-center mb-16 opacity-100">
                        <LanguageSelector currentLang={normalizedLang} mode="path" />
                    </div>

                    {/* Main Content */}
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <MessageSquare className="w-8 h-8 text-cyan-500" />
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                {isJP ? 'お問い合わせとサポート' : 'Contact & Support'}
                            </h1>
                        </div>

                        {/* Critical Warning */}
                        <section id="contact" className="!border-2 !border-red-500 bg-red-950/20 !rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <h2 className="text-lg font-black text-red-600 dark:text-red-400 uppercase">
                                        {isJP ? '投資コンサルティングは提供しておりません' : 'WE DO NOT PROVIDE INVESTMENT CONSULTATION'}
                                    </h2>
                                    <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                                        {isJP
                                            ? 'オムニ・メトリックは情報プラットフォームのみです。個別の投資助言、財務計画、ポートフォリオの推奨事項、個別の取引提案は提供していません。投資コンサルティングに関するリクエストには返答いたしません。'
                                            : 'OmniMetric is an informational platform only. We do not offer personalized investment advice, financial planning, portfolio recommendations, or individual trade suggestions. Any requests for investment consultation will not be answered.'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* No Reply Obligation Disclaimer - NEW */}
                        <div className="text-center px-4">
                            <p className="text-xs text-slate-500 font-mono border-b border-slate-800 pb-2 inline-block">
                                {isJP ? '重要：すべてのメッセージを確認しますが、返信の義務は負いません。個別の回答が必要な投資相談等には一切応じられません。' : 'IMPORTANT: We review all messages but are under no obligation to reply. We do not respond to individual investment inquiries.'}
                            </p>
                        </div>

                        {/* Primary Contact */}
                        <section className="bg-transparent dark:bg-[#111] !border !border-cyan-500/30 !rounded-xl p-8 text-center space-y-6 shadow-sm dark:shadow-none">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-full mb-2">
                                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                    {isJP ? '主要連絡チャネル' : 'Primary Contact Channel'}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    {isJP ? '技術的な問題、データフィードバック、または一般的なお問い合わせ' : 'For technical issues, data feedback, or general inquiries'}
                                </p>
                            </div>
                            <div className="bg-transparent dark:bg-black !border !border-slate-200 dark:!border-slate-700 !rounded-lg p-6">
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                                    {isJP ? 'X（Twitter）でダイレクトメッセージを送信' : 'Send a Direct Message on X (Twitter)'}
                                </p>
                                <a
                                    href="https://twitter.com/OmniMetric_GMS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block text-2xl font-mono font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                                >
                                    @OmniMetric_GMS
                                </a>
                                <p className="text-xs text-slate-600 mt-3">
                                    {isJP ? '返信時間: 24-72時間（営業日）' : 'Response time: 24-72 hours (business days)'}
                                </p>
                            </div>
                        </section>

                        {/* What We Can Help With */}
                        <section className="bg-transparent dark:bg-[#111] !border !border-slate-200 dark:!border-slate-800 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                                {isJP ? '✅ 対応可能な内容' : '✅ What We Can Help With'}
                            </h2>
                            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{isJP ? 'ターミナルの技術的問題やバグ' : 'Technical issues or bugs with the terminal'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{isJP ? 'データの正確性に関する懸念や異常' : 'Data accuracy concerns or anomalies'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{isJP ? '機能リクエストや提案' : 'Feature requests or suggestions'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{isJP ? 'APIアクセスまたは商用ライセンスのお問い合わせ' : 'API access or commercial licensing inquiries'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{isJP ? 'プレス/メディアのお問い合わせ' : 'Press/media inquiries'}</span>
                                </li>
                            </ul>
                        </section>

                        {/* What We Don't Respond To */}
                        <section className="bg-transparent dark:bg-[#111] !border !border-slate-200 dark:!border-slate-800 !rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                                {isJP ? '❌ 対応できない内容' : '❌ What We Don\'t Respond To'}
                            </h2>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>{isJP ? '投資助言または「買うべきか/売るべきか」の質問' : 'Investment advice or "should I buy/sell" questions'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>{isJP ? 'ポートフォリオレビューまたは個別推奨事項' : 'Portfolio reviews or personalized recommendations'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>{isJP ? '特定の株式または資産に関する予測' : 'Predictions about specific stocks or assets'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>{isJP ? 'スパム、宣伝コンテンツ、または無関係なお問い合わせ' : 'Spam, promotional content, or irrelevant inquiries'}</span>
                                </li>
                            </ul>
                        </section>

                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 opacity-50">
                            <p className="text-[10px] font-mono tracking-widest uppercase text-slate-600 text-center">
                                {isJP ? 'サポートプロトコル: SNS（X/Bluesky）DMのみ // メールフォーム・電話対応なし' : 'Support Protocol: SNS (X/Bluesky) DM Only // No Email Forms // No Phone Support'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
