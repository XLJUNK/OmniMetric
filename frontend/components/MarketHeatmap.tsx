import React, { useState } from 'react';
import { SignalData } from '@/lib/signal';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { IndicatorHelpButton } from '@/components/IndicatorHelpButton';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import { useSignalData } from '@/hooks/useSignalData';
import { Thermometer } from 'lucide-react';
import { ExplanationModal } from '@/components/ExplanationModal';

// Localization Map
const TRANSLATIONS: Record<string, {
    title: string;
    seo_description: string;
    view_sectors: string;
    view_performance: string;
    sector_indices: string;
    sector_physical: string;
    sector_themes: string;
    sector_crypto_fx: string;
    logic_title: string;
    logic_desc: string;
    logic_display_label: string;
    logic_display_val: string;
    logic_display_sub: string;
    logic_trend_label: string;
    logic_trend_val: string;
    logic_trend_sub: string;
    legend_title: string;
    legend_normal: string;
    legend_5: string;
    legend_10: string;
    powered_by: string;
    loading: string;
}> = {
    EN: {
        title: "OmniThermal Grid",
        seo_description: "The official market thermometer. Real-time scanning of 40 global market assets to visualize the 'current temperature' of macro trends.",
        view_sectors: "🌍 SECTORS",
        view_performance: "📈 PERFORMANCE",
        sector_indices: "MAJ EQUITY INDICES",
        sector_physical: "PHYSICAL & FIXED INCOME",
        sector_themes: "THEMATIC & VOLATILITY",
        sector_crypto_fx: "CRYPTO & EMERGING FX",
        logic_title: "PROFESSIONAL SCANNER LOGIC",
        logic_desc: "This grid uses a hybrid configuration to filter noise and visualize true macro 'heat' across asset classes.",
        logic_display_label: "CURRENT TEMP",
        logic_display_val: "Daily Change (%)",
        logic_display_sub: "Immediate market pulse and momentum.",
        logic_trend_label: "GRID SIZE & COLOR",
        logic_trend_val: "5-Day Momentum",
        logic_trend_sub: "Visualizes accumulated weekly heat levels.",
        legend_title: "LIVE INTELLIGENCE STREAM",
        legend_normal: "Normal Temp",
        legend_5: "Fever (5%)",
        legend_10: "Extreme (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "Calibrating Grid..."
    },
    JP: {
        title: "OmniThermal Grid",
        seo_description: "市場の体温計（スキャナー）。40のグローバル市場資産をリアルタイムでスキャンし、マクロトレンドの「現在温度」を一目で把握します。",
        view_sectors: "🌍 セクター別",
        view_performance: "📈 騰落トレンド",
        sector_indices: "主要株価指数",
        sector_physical: "実体経済・債券市場",
        sector_themes: "特定テーマ・ボラティリティ",
        sector_crypto_fx: "暗号資産・新興国通貨",
        logic_title: "プロフェッショナルスキャン・ロジック",
        logic_desc: "本グリッドは、市場のノイズを排し、アセットクラスを跨いだ「真の熱量（トレンド）」を可視化します。",
        logic_display_label: "現在の温度",
        logic_display_val: "前日比 (%)",
        logic_display_sub: "今の速報値をリアルタイムで把握",
        logic_trend_label: "サイズ・色判定",
        logic_trend_val: "5日間 モメンタム",
        logic_trend_sub: "週足レベルの蓄積された熱量を可視化",
        legend_title: "ライブ・インテリジェンス・ストリーム",
        legend_normal: "標準温度",
        legend_5: "微熱 (5%)",
        legend_10: "高熱 (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "グリッド調整中..."
    },
    CN: {
        title: "OmniThermal Grid",
        seo_description: "官方市场体温计。实时扫描40个全球市场资产，可视化宏观趋势的“当前温度”。",
        view_sectors: "🌍 板块视图",
        view_performance: "📈 涨跌趋势",
        sector_indices: "主要股指数",
        sector_physical: "实体经济与债券",
        sector_themes: "主题板块与波动率",
        sector_crypto_fx: "加密货币与新兴外汇",
        logic_title: "专业扫描器逻辑",
        logic_desc: "本网格采用混合配置，旨在过滤噪音并可视化跨资产类别的真实宏观“热度”。",
        logic_display_label: "当前温度",
        logic_display_val: "当日涨跌 (%)",
        logic_display_sub: "实时掌握市场脉搏与动量。",
        logic_trend_label: "网格尺寸与颜色",
        logic_trend_val: "5日动量",
        logic_trend_sub: "可视化累积的周度热度水平。",
        legend_title: "扫描图例",
        legend_normal: "正常温度",
        legend_5: "发烧 (5%)",
        legend_10: "极端 (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "正在校准网格..."
    },
    ES: {
        title: "OmniThermal Grid",
        seo_description: "El termómetro oficial del mercado. Escaneo en tiempo real de 40 activos globales para visualizar la 'temperatura actual' de las tendencias macro.",
        view_sectors: "🌍 SECTORES",
        view_performance: "📈 RENDIMIENTO",
        sector_indices: "ÍNDICES ACCIONARIOS",
        sector_physical: "ACTIVOS FÍSICOS Y RENTA FIJA",
        sector_themes: "TEMÁTICOS Y VOLATILIDAD",
        sector_crypto_fx: "CRIPTO Y DIVISAS EMERGENTES",
        logic_title: "LÓGICA DE ESCÁNER PROFESIONAL",
        logic_desc: "Esta cuadrícula utiliza una configuración híbrida para filtrar el ruido y visualizar el verdadero 'calor' macro.",
        logic_display_label: "TEMP ACTUAL",
        logic_display_val: "Cambio Diario (%)",
        logic_display_sub: "Pulso y momentum inmediato del mercado.",
        logic_trend_label: "TAMAÑO Y COLOR",
        logic_trend_val: "Momentum de 5 Días",
        logic_trend_sub: "Visualiza los niveles de calor acumulados semanalmente.",
        legend_title: "Leyenda de Escaneo",
        legend_normal: "Temp Normal",
        legend_5: "Fiebre (5%)",
        legend_10: "Extremo (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "Calibrando Cuadrícula..."
    },
    DE: {
        title: "OmniThermal Grid",
        seo_description: "Das offizielle Marktthermometer. Echtzeit-Scanning von 40 globalen Marktwerten zur Visualisierung der 'aktuellen Temperatur' von Makrotrends.",
        view_sectors: "🌍 SEKTOREN",
        view_performance: "📈 PERFORMANCE",
        sector_indices: "HAUPTAKTIENINDIZES",
        sector_physical: "PHYSISCHE WERTE & RENTEN",
        sector_themes: "THEMEN & VOLATILITÄT",
        sector_crypto_fx: "KRYPTO & EMERGING FX",
        logic_title: "PROFESSIONELLE SCANNER-LOGIK",
        logic_desc: "Dieses Gitter verwendet eine Hybrid-Konfiguration, um Rauschen zu filtern und die wahre Makro-'Hitze' zu visualisieren.",
        logic_display_label: "AKTUELL TEMP",
        logic_display_val: "Tägliche Änderung (%)",
        logic_display_sub: "Unmittelbarer Marktpuls und Momentum.",
        logic_trend_label: "GRÖSSE & FARBE",
        logic_trend_val: "5-Tage Momentum",
        logic_trend_sub: "Visualisiert die kumulierte wöchentliche Hitze.",
        legend_title: "Scanner-Legende",
        legend_normal: "Normal Temp",
        legend_5: "Fieber (5%)",
        legend_10: "Extrem (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "Grid wird kalibriert..."
    },
    FR: {
        title: "OmniThermal Grid",
        seo_description: "Le thermomètre officiel du marché. Analyse en temps réel de 40 actifs mondiaux pour visualiser la 'température actuelle' des tendances macro.",
        view_sectors: "🌍 SECTEURS",
        view_performance: "📈 PERFORMANCE",
        sector_indices: "INDICES BOURSIERS MAJEURS",
        sector_physical: "ACTIFS PHYSIQUES & TAUX",
        sector_themes: "THÈMES & VOLATILITÉ",
        sector_crypto_fx: "CRYPTO & DEVISES ÉMERGENTES",
        logic_title: "LOGIQUE DE SCANNER PROFESSIONNEL",
        logic_desc: "Cette grille utilise une configuration hybride pour filtrer le bruit et visualiser la véritable « chaleur » macro.",
        logic_display_label: "TEMP ACTUELLE",
        logic_display_val: "Variation Quotidienne (%)",
        logic_display_sub: "Pouls et momentum immédiat du marché.",
        logic_trend_label: "TAILLE & COULEUR",
        logic_trend_val: "Momentum sur 5 Jours",
        logic_trend_sub: "Visualise les niveaux de chaleur accumulés chaque semaine.",
        legend_title: "Légende du Scanner",
        legend_normal: "Temp Normale",
        legend_5: "Fièvre (5%)",
        legend_10: "Extrême (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "Calibrage de la grille..."
    },
    HI: {
        title: "OmniThermal Grid",
        seo_description: "आधिकारिक बाज़ार थर्मामीटर। मैक्रो रुझानों के 'वर्तमान तापमान' की कल्पना करने के लिए 40 वैश्विक बाज़ार परिसंपत्तियों की वास्तविक समय स्कैनिंग।",
        view_sectors: "🌍 क्षेत्र",
        view_performance: "📈 प्रदर्शन",
        sector_indices: "प्रमुख इक्विटी सूचकांक",
        sector_physical: "भौतिक और निश्चित आय",
        sector_themes: "विषयगत और अस्थिरता",
        sector_crypto_fx: "क्रिप्टो और उभरते एफएक्स",
        logic_title: "पेशेवर स्कैनर तर्क",
        logic_desc: "यह ग्रिड शोर को फ़िल्टर करने और परिसंपत्ति वर्गों में वास्तविक मैक्रो 'गर्मी' की कल्पना करने के लिए एक हाइब्रिड कॉन्फ़िगरेशन का उपयोग करता है।",
        logic_display_label: "वर्तमान तापमान",
        logic_display_val: "दैनिक परिवर्तन (%)",
        logic_display_sub: "तत्काल बाजार की नब्ज और गति।",
        logic_trend_label: "ग्रिड आकार और रंग",
        logic_trend_val: "5-दिवसीय गति",
        logic_trend_sub: "संचित साप्ताहिक गर्मी के स्तर की कल्पना करता है।",
        legend_title: "स्कैनर किंवदंती",
        legend_normal: "सामान्य तापमान",
        legend_5: "बुखार (5%)",
        legend_10: "चरम (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "ग्रिड कैलिब्रेट कर रहा है..."
    },
    ID: {
        title: "OmniThermal Grid",
        seo_description: "Termometer pasar resmi. Pemindaian real-time dari 40 aset pasar global untuk memvisualisasikan 'suhu saat ini' dari tren makro.",
        view_sectors: "🌍 SEKTOR",
        view_performance: "📈 PERFORMA",
        sector_indices: "INDEKS EKUITAS UTAMA",
        sector_physical: "FISIK & PENDAPATAN TETAP",
        sector_themes: "TEMATIK & VOLATILITAS",
        sector_crypto_fx: "KRIPTO & FX BERKEMBANG",
        logic_title: "LOGIKA PEMINDAI PROFESIONAL",
        logic_desc: "Grid ini menggunakan konfigurasi hibrida untuk menyaring kebisingan dan memvisualisasikan 'panas' makro yang sebenarnya di seluruh kelas aset.",
        logic_display_label: "SUHU SAAT INI",
        logic_display_val: "Perubahan Harian (%)",
        logic_display_sub: "Denyut pasar dan momentum langsung.",
        logic_trend_label: "UKURAN & WARNA",
        logic_trend_val: "Momentum 5 Hari",
        logic_trend_sub: "Memvisualisasikan tingkat panas mingguan yang terakumulasi.",
        legend_title: "Legenda Pemindai",
        legend_normal: "Suhu Normal",
        legend_5: "Demam (5%)",
        legend_10: "Ekstrem (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "Mengkalisbrasi Grid..."
    },
    AR: {
        title: "OmniThermal Grid",
        seo_description: "مقياس حرارة السوق الرسمي. مسح فوري لـ 40 من أصول السوق العالمية لتصور 'درجة الحرارة الحالية' للاتجاهات الكلية.",
        view_sectors: "🌍 القطاعات",
        view_performance: "📈 الأداء",
        sector_indices: "مؤشرات الأسهم الرئيسية",
        sector_physical: "الدخل المادي والثابت",
        sector_themes: "الموضوعية والتقلب",
        sector_crypto_fx: "العملات المشفرة والعملات الأجنبية الناشئة",
        logic_title: "منطق الماسح الضوئي للمحترفين",
        logic_desc: "تستخدم هذه الشبكة تكوينًا هجينًا لتصفية الضوضاء وتصور 'الحرارة' الكلية الحقيقية عبر فئات الأصول.",
        logic_display_label: "درجة الحرارة الحالية",
        logic_display_val: "التغيير اليومي (%)",
        logic_display_sub: "نبض السوق والزخم الفوري.",
        logic_trend_label: "حجم الشبكة واللون",
        logic_trend_val: "زخم 5 أيام",
        logic_trend_sub: "يتصور مستويات الحرارة الأسبوعية المتراكمة.",
        legend_title: "أسطورة الماسح الضوئي",
        legend_normal: "حرارة طبيعية",
        legend_5: "حمى (5%)",
        legend_10: "شديد (10%)",
        powered_by: "OmniMetric Project | Adaptive Insight Layer",
        loading: "جاري معايرة الشبكة..."
    },
};

interface MarketHeatmapProps {
    data: SignalData | null;
    lang: LangType;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ data: initialData, lang }) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;
    const globalT = DICTIONARY[lang] || DICTIONARY.EN;
    const [viewMode, setViewMode] = useState<'regional' | 'performance'>('performance');

    // Use the central hook for data fetching (SWR + Static JSON)
    const { data } = useSignalData(initialData);

    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [showInfo, setShowInfo] = useState(false);

    // Robust modal content fetching
    const raw_modal = DICTIONARY[lang]?.modals?.otg || DICTIONARY['EN'].modals.otg;
    const default_modal = DICTIONARY['EN'].modals.otg;
    const t_modal = {
        title: raw_modal?.title || default_modal.title,
        func_title: raw_modal?.func_title || default_modal.func_title,
        func_desc: raw_modal?.func_desc || default_modal.func_desc,
        purpose_title: raw_modal?.purpose_title || default_modal.purpose_title,
        purpose_desc: raw_modal?.purpose_desc || default_modal.purpose_desc
    };

    const renderTile = (key: string, label: string, wikiSlug: string, sizeLevel: number = 1) => {
        const item = data?.market_data[key];

        if (!item) return (
            <div key={key} className="transition-all duration-300 relative group overflow-hidden border active:scale-95 hover:z-10 bg-slate-100 dark:bg-black border-slate-200 dark:border-gray-900 flex flex-col items-center justify-center animate-pulse aspect-square">
                <span className="text-gray-500 text-[10px] text-center">{label}</span>
            </div>
        );

        const displayChg = item.daily_chg ?? 0;
        const trendChg = item.change_percent ?? 0;
        const absTrend = Math.abs(trendChg);

        let bgColorClass = isDark ? "bg-slate-800" : "bg-slate-200"; // Default

        // Always assign a color, even for small changes
        if (trendChg > 0) {
            if (absTrend >= 10.0) bgColorClass = "bg-[#064e3b]"; // Emerald 900
            else if (absTrend >= 5.0) bgColorClass = "bg-[#065f46]"; // Emerald 800
            else if (absTrend >= 2.0) bgColorClass = "bg-[#059669]"; // Emerald 600
            else if (absTrend >= 1.0) bgColorClass = "bg-[#10b981]"; // Emerald 500
            else bgColorClass = isDark ? "bg-[#34d399]" : "bg-[#6ee7b7]"; // Emerald 400 or 300
        } else if (trendChg < 0) {
            if (absTrend >= 10.0) bgColorClass = "bg-[#7f1d1d]"; // Red 900
            else if (absTrend >= 5.0) bgColorClass = "bg-[#991b1b]"; // Red 800
            else if (absTrend >= 2.0) bgColorClass = "bg-[#dc2626]"; // Red 700
            else if (absTrend >= 1.0) bgColorClass = "bg-[#ef4444]"; // Red 600
            else bgColorClass = isDark ? "bg-[#f87171]" : "bg-[#fca5a5]"; // Red 400 or 300
        } else {
            // Zero change exact
            bgColorClass = isDark ? "bg-slate-700" : "bg-[#d1fae5]"; // Light Green (Emerald 100) for zero in light mode
        }

        const labelSize = sizeLevel === 3 ? 'text-lg' : sizeLevel === 2 ? 'text-sm' : 'text-[9px]';
        const chgSize = sizeLevel === 3 ? 'text-5xl' : sizeLevel === 2 ? 'text-2xl' : 'text-sm';
        const priceSize = sizeLevel === 3 ? 'text-sm' : sizeLevel === 2 ? 'text-[10px]' : 'text-[8px]';

        const tickerLabel = (globalT.labels as { tickers?: Record<string, string> }).tickers?.[key] || label;

        // Dynamic Text Color for contrast in light mode
        // For light mode, if the background is light (absTrend < 2.0 or 0), use slate-900 text
        const textColorClass = !isDark && (absTrend < 2.0 || trendChg === 0) ? "text-slate-900" : "text-white";
        const textStyle = !isDark && (absTrend < 2.0 || trendChg === 0) ? { color: '#0f172a' } : { color: 'white' };

        return (
            <Link
                key={key}
                href={lang.toUpperCase() === 'EN' ? `/wiki/${wikiSlug}` : `/${lang.toLowerCase()}/wiki/${wikiSlug}`}
                className={`w-full h-full flex flex-col items-center justify-center transition-all hover:brightness-110 cursor-pointer border border-black/20 aspect-square p-1 font-inter ${textColorClass} ${bgColorClass}`}
                style={{ textDecoration: 'none', ...textStyle }}
                title={`${tickerLabel}: Daily ${displayChg}% | 5D Trend ${trendChg}%`}
                aria-label={`${tickerLabel} market data: ${displayChg > 0 ? 'up' : 'down'} ${Math.abs(displayChg).toFixed(2)}% today, ${trendChg > 0 ? 'positive' : 'negative'} ${Math.abs(trendChg).toFixed(2)}% 5-day trend`}
            >
                <div className={`flex flex-col items-center justify-center space-y-1 overflow-hidden h-full w-full ${textColorClass}`}>
                    <span className={`uppercase truncate w-full text-center font-bold tracking-wider leading-none ${textColorClass} ${labelSize}`}>
                        {tickerLabel}
                    </span>
                    <span className={`font-black tracking-tighter leading-none shadow-black drop-shadow-md ${textColorClass} ${chgSize}`}>
                        {displayChg > 0 ? '+' : ''}{displayChg.toFixed(2)}%
                    </span>
                    <span className={`font-mono ${isDark ? 'text-white/90' : 'text-slate-700/90'} ${priceSize}`}>
                        {item.price?.toLocaleString()}
                    </span>
                    {sizeLevel === 3 && (
                        <div className="w-12 h-0.5 bg-white/30 rounded mt-2 animate-pulse" />
                    )}
                </div>
            </Link>
        );
    };

    // Sector Definitions
    const MAJORS = [
        { key: 'SPY', label: 'S&P 500', slug: 'sp500-index', size: 3 },
        { key: 'QQQ', label: 'Nasdaq 100', slug: 'nasdaq-100', size: 2 },
        { key: 'IWM', label: 'Russell 2000', slug: 'russell-2000', size: 2 },
        { key: 'RSP', label: 'S&P 500 EW', slug: 'market-breadth', size: 2 },
        { key: 'DAX', label: 'DAX 40', slug: 'dax-index', size: 1 },
        { key: 'CAC40', label: 'CAC 40', slug: 'cac40-index', size: 1 },
        { key: 'FTSE', label: 'FTSE 100', slug: 'ftse-100', size: 1 },
        { key: 'STOXX600', label: 'Stoxx 600', slug: 'stoxx-600', size: 1 },
        { key: 'NIKKEI', label: 'Nikkei 225', slug: 'nikkei-225', size: 2 },
        { key: 'HANGSENG', label: 'Hang Seng', slug: 'hang-seng', size: 2 },
        { key: 'ASX200', label: 'ASX 200', slug: 'asx-200', size: 1 },
        { key: 'NIFTY', label: 'Nifty 50', slug: 'nifty-50', size: 1 }
    ];
    const PHYSICAL_BONDS = [
        { key: 'GOLD', label: 'Gold', slug: 'gold-price', size: 3 },
        { key: 'SILVER', label: 'Silver', slug: 'silver-price', size: 2 },
        { key: 'OIL', label: 'WTI Oil', slug: 'wti-oil', size: 2 },
        { key: 'NATGAS', label: 'Nat Gas', slug: 'natural-gas', size: 1 },
        { key: 'TIPS', label: 'TIPS', slug: 'tips-bond', size: 2 },
        { key: 'TNX', label: 'US 10Y Yield', slug: 'us10y-yield', size: 2 },
        { key: 'MOVE', label: 'MOVE Index', slug: 'move-index', size: 2 },
        { key: 'HYG', label: 'HY Bonds', slug: 'hy-bonds', size: 2 }
    ];
    const THEMATIC_SENTIMENT = [
        { key: 'VIX', label: 'VIX', slug: 'vix', size: 3 },
        { key: 'CRYPTO_SENTIMENT', label: 'Crypto F&G', slug: 'crypto-sentiment', size: 2 },
        { key: 'G_REIT', label: 'Global REIT', slug: 'global-reit', size: 1 },
        { key: 'US_HOUSING', label: 'US Housing', slug: 'us-housing', size: 1 },
        { key: 'LOGISTICS', label: 'Logistics', slug: 'logistics-reit', size: 1 },
        { key: 'INFRA', label: 'Infrastructure', slug: 'infrastructure', size: 1 },
        { key: 'SEMIS', label: 'Semiconductors', slug: 'semi-inventory-cycle', size: 2 },
        { key: 'DEFENSE', label: 'Defense', slug: 'defense', size: 1 },
        { key: 'RARE_EARTH', label: 'Rare Earth', slug: 'rare-earth', size: 1 },
        { key: 'CYBER', label: 'Cybersecurity', slug: 'cyber', size: 1 },
        { key: 'BALTIC', label: 'Baltic Dry', slug: 'baltic-index', size: 1 },
        { key: 'SHIPPING', label: 'Shipping', slug: 'shipping-index', size: 1 },
        { key: 'AGRI', label: 'Agri', slug: 'agri-index', size: 1 }
    ];
    const FX = [
        { key: 'DXY', label: 'DXY', slug: 'dxy-index' },
        { key: 'EURUSD', label: 'EUR/USD', slug: 'eurusd' },
        { key: 'USDJPY', label: 'USD/JPY', slug: 'usdjpy' },
        { key: 'USDCNY', label: 'USD/CNY', slug: 'usdcny' }
    ];
    const CRYPTO_FX = [
        { key: 'BTC', label: 'Bitcoin', slug: 'bitcoin' },
        { key: 'ETH', label: 'Ethereum', slug: 'ethereum' },
        { key: 'SOL', label: 'Solana', slug: 'solana' },
        { key: 'USDINR', label: 'USD/INR', slug: 'usdinr' },
        { key: 'USDSAR', label: 'USD/SAR', slug: 'usdsar' }
    ];

    const ALL_ASSETS = [...MAJORS, ...PHYSICAL_BONDS, ...THEMATIC_SENTIMENT, ...FX, ...CRYPTO_FX];

    const sortedAssets = ALL_ASSETS.map(item => {
        const d = data?.market_data[item.key];
        return { ...item, trendVal: d ? d.change_percent : 0 };
    }).sort((a, b) => {
        const aVal = a.trendVal ?? 0;
        const bVal = b.trendVal ?? 0;
        return bVal - aVal;
    });

    return (
        <section
            className="w-full bg-transparent dark:bg-black p-2 md:p-8 font-inter text-gray-200 relative"
            aria-label="Global Market Heatmap - Real-time market performance visualization"
            itemScope
            itemType="https://schema.org/Dataset"
        >
            {/* Header Structure - Row 1: Perfectly Centered Title */}
            <div className="w-full flex justify-center mb-2 px-2">
                <div className="flex items-center gap-2 opacity-80">
                    <Thermometer className="w-4 h-4 text-sky-500" />
                    <h2
                        className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]"
                        itemProp="name"
                    >
                        {t.title}
                    </h2>
                </div>
            </div>

            {/* Header Structure - Row 2: Right-Aligned Help Button */}
            <div className="w-full flex justify-end mb-6">
                <IndicatorHelpButton
                    label="What's OTG"
                    onClick={() => setShowInfo(true)}
                />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 text-center mb-6 max-w-3xl mx-auto" itemProp="description">
                {t.seo_description}
            </p>

            <div className="flex justify-center gap-2 sm:gap-4 mb-6">
                <button
                    onClick={() => setViewMode('regional')}
                    className={`whitespace-nowrap px-6 py-2 rounded-full font-bold text-xs transition-all border ${viewMode === 'regional' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-500'}`}
                >
                    {t.view_sectors}
                </button>
                <button
                    onClick={() => setViewMode('performance')}
                    className={`whitespace-nowrap px-6 py-2 rounded-full font-bold text-xs transition-all border ${viewMode === 'performance' ? 'bg-green-600 border-green-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-500'}`}
                >
                    {t.view_performance}
                </button>
            </div>

            <div className="mx-auto font-noto-jp max-w-[360px] w-full">

                {viewMode === 'regional' && (
                    <div className="animate-in fade-in zoom-in duration-300 space-y-4">
                        <div className="bg-slate-50 dark:bg-black border-0 p-2 rounded-lg">
                            <h3 className="text-[10px] font-black text-slate-600 dark:text-gray-600 mb-2 uppercase tracking-[0.2em] border-0 pb-1">{t.sector_indices}</h3>
                            <div className="grid grid-cols-4 gap-1">
                                {MAJORS.map(i => renderTile(i.key, i.label, i.slug))}
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-black border-0 p-2 rounded-lg">
                            <h3 className="text-[10px] font-black text-slate-600 dark:text-gray-600 mb-2 uppercase tracking-[0.2em] border-0 pb-1">{t.sector_physical}</h3>
                            <div className="grid grid-cols-4 gap-1">
                                {PHYSICAL_BONDS.map(i => renderTile(i.key, i.label, i.slug))}
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-black border-0 p-2 rounded-lg">
                            <h3 className="text-[10px] font-black text-slate-600 dark:text-gray-600 mb-2 uppercase tracking-[0.2em] border-0 pb-1">{t.sector_crypto_fx}</h3>
                            <div className="grid grid-cols-4 gap-1">
                                {CRYPTO_FX.map(i => renderTile(i.key, i.label, i.slug))}
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-black border-0 p-2 rounded-lg">
                            <h3 className="text-[10px] font-black text-slate-600 dark:text-gray-600 mb-2 uppercase tracking-[0.2em] border-0 pb-1">{t.sector_themes}</h3>
                            <div className="grid grid-cols-4 gap-1">
                                {[...THEMATIC_SENTIMENT, ...FX].map(i => renderTile(i.key, i.label, i.slug))}
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'performance' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <h3 className="text-[10px] font-black text-slate-600 dark:text-gray-600 mb-3 uppercase tracking-[0.4em] text-center">{t.legend_title}</h3>
                        <div className="border-4 border-slate-200 dark:border-gray-900 rounded-xl bg-white dark:bg-black p-1 shadow-2xl relative overflow-hidden">
                            <div className="grid grid-cols-6 gap-0 bg-slate-100 dark:bg-black grid-flow-dense border-0">
                                {sortedAssets.map(i => {
                                    const d = data?.market_data[i.key];
                                    const trendVal = d?.change_percent ?? 0;

                                    const absTrend = Math.abs(trendVal);

                                    let spanClass = "col-span-1 row-span-1";
                                    let sizeLevel = 1;
                                    if (absTrend >= 10.0) { spanClass = "col-span-3 row-span-3"; sizeLevel = 3; }
                                    else if (absTrend >= 5.0) { spanClass = "col-span-2 row-span-2"; sizeLevel = 2; }

                                    return (
                                        <div key={i.key} className={`${spanClass} relative`}>
                                            {renderTile(i.key, i.label, i.slug, sizeLevel)}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 space-y-6">
                    <div className="bg-slate-100 dark:bg-gray-900/50 border-0 p-4 rounded-xl">
                        <h4 className="text-slate-900 dark:text-white text-xs font-bold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            {t.logic_title}
                        </h4>
                        <p className="text-[10px] text-slate-600 dark:text-gray-400 leading-relaxed">
                            {t.logic_desc}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-[8px] text-slate-500 dark:text-gray-500 block uppercase mb-1">{t.logic_display_label}</span>
                                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">{t.logic_display_val}</span>
                                <p className="text-[8px] text-slate-500 dark:text-gray-600 mt-1">{t.logic_display_sub}</p>
                            </div>
                            <div>
                                <span className="text-[8px] text-slate-500 dark:text-gray-500 block uppercase mb-1">{t.logic_trend_label}</span>
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{t.logic_trend_val}</span>
                                <p className="text-[8px] text-slate-500 dark:text-gray-600 mt-1">{t.logic_trend_sub}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-gray-600 uppercase tracking-widest px-2">
                        <span>{t.legend_title}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 grayscale opacity-70">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-gray-700 border border-gray-800 rounded mb-1" />
                            <span className="text-[8px] text-slate-500 dark:text-gray-500">{t.legend_normal}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-gray-600 border border-gray-700 rounded mb-1" />
                            <span className="text-[8px] text-slate-500 dark:text-gray-500">{t.legend_5}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-500 border border-gray-600 rounded mb-1" />
                            <span className="text-[8px] text-slate-500 dark:text-gray-500">{t.legend_10}</span>
                        </div>
                    </div>


                    <div className="text-[10px] text-slate-400 dark:text-gray-800 text-center font-black tracking-widest uppercase pb-8">
                        {t.powered_by}
                    </div>
                </div>
            </div>

            <ExplanationModal
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                title={t_modal.title}
                funcTitle={t_modal.func_title}
                funcDesc={t_modal.func_desc}
                purposeTitle={t_modal.purpose_title}
                purposeDesc={t_modal.purpose_desc}
            />
        </section>
    );
};
