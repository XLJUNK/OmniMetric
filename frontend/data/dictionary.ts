import * as MESSAGES from './messages.json';

export type LangType = 'EN' | 'JP' | 'CN' | 'ES' | 'HI' | 'ID' | 'AR' | 'DE' | 'FR';

export const DICTIONARY: Record<LangType, any> = {
    EN: {
        status: {
            ai: MESSAGES.ai_status.EN,
            market: MESSAGES.market_data_status.EN
        },
        settings: {
            title: "Market Pulse Config",
            subtitle: "CUSTOMIZE YOUR WORKSPACE",
            theme_title: "Theme Interface",
            dark_mode: "DARK MODE",
            light_mode: "LIGHT MODE",
            active_modules: "Active Modules",
            reset: "RESET",
            disabled_modules: "Disabled Modules",
            last_updated: "Last Updated",
            system_operational: "SYSTEM OPERATIONAL"
        },
        partner: {
            badge: "TradingView Official Partner",
            title: "Get $15 Credit: Save on your new TradingView plan. Experience world-class charting starting from OmniMetric.",
            action: "Start Analysis (Get $15 Credit)",
            disclaimer: "OmniMetric is an official partner of TradingView. Benefits apply via our referral links. Please invest at your own risk.",
            link_text: "Analyze on TradingView ($15 Bonus)"
        },
        titles: {
            risk_score: "Market Regime Indicator",
            insights: "OmniMetric: Quantitative Macro Insights",
            risk_factors: "Institutional Data Grid",
            legal: "LEGAL NOTICE & DISCLAIMER",
            delayed: "1H Delay",
            partner_ad: "Institutional Partner Placement",
            market_regime: "MARKET REGIME",
            risk_preference: "RISK PREFERENCE",
            institutional_analysis: "GMS Macro AI Analysis (Institutional Level)",
            sponsored: "SPONSORED",
            current_strategy: "CURRENT STRATEGY",
            upcoming_events: "UPCOMING RISK EVENTS",
            gms_score: "GMS SCORE",
            breaking_news: "BREAKING NEWS",
            live: "LIVE",
            breaking: "BREAKING",
            delayed_tick: "*15m DLY",
            methodology: "METHODOLOGY",
            analysis_history: "Analysis History",
            live_stream: "LIVE INTELLIGENCE STREAM",
            ai_disclaimer: "This insight is a multi-faceted analysis by AI and does not guarantee accuracy."
        },
        methodology: {
            title: "GMS QUANT METHODOLOGY",
            desc: "The GMS Score integrates Market 'Fear', 'Credit Stress', and 'Momentum' into a proprietary 0-100 quantitative risk index.",
            owb_title: "Omni Warning Beacons (OWB)",
            owb_desc: "Real-time monitoring system for critical market stress indicators. Watch for 'INVERTED' Yield Curves or 'STRESS' in Credit Markets as early warning signs of recession.",
            ogv_title: "Omni Gravity Vector (OGV)",
            ogv_desc: "A 3D visualization of market momentum. It tracks the 'Gravitational Pull' (Trend Strength) of Global Sectors, visualizing flow of funds in real-time.",
            otg_title: "Omni Trend Gauge (OTG)",
            otg_desc: "Direct trend strength meters for key asset classes (Crypto, FX, Rates). Green indicates strong uptrend, Red indicates downtrend.",
            zone_accumulate: "60-100: ACCUMULATE (Risk On)",
            zone_accumulate_desc: "Color: Blue. Expansion phase. Inflows to Equities, Commodities, and High Yield bonds suggested.",
            zone_neutral: "40-60: NEUTRAL (Trendless)",
            zone_neutral_desc: "Color: Slate. Volatility compression. Position adjustment phase.",
            zone_defensive: "0-40: DEFENSIVE (Risk Off)",
            zone_defensive_desc: "Color: Red. Cash/Treasury dominance. Watch for panic selling and credit contraction.",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
            scale_labels: {
                panic: "Defensive (0)",
                neutral: "Neutral (50)",
                greed: "Accumulate (100)"
            },
            factors: { VOL: "VOL", MOM: "MOM", CRED: "CRED", SENT: "SENT", RATES: "RATES", BREADTH: "BREADTH", LIQ: "LIQ", INFL: "INFL", EXP: "EXP", MACRO: "MACRO" },
            factors_status: {
                LOW: "LOW", HIGH: "HIGH",
                ELEVATED: "ELEVATED", CRITICAL: "CRITICAL",
                STABLE: "STABLE", FEAR: "FEAR", CALM: "CALM",
                BULLISH: "BULLISH", BEARISH: "BEARISH",
                RISING: "RISING", FALLING: "FALLING",
                NEUTRAL: "NEUTRAL",
                GREED: "GREED",
                STRESS: "STRESS",
                HEALTHY: "HEALTHY",
                SKEWED: "SKEWED",
                SAFE: "SAFE",
                DANGER: "DANGER"
            },
            gms_tooltip_desc: "GMS Score is a quantitative risk indicator integrated by AI algorithms. The current score primarily reflects trends in [FACTOR1] and [FACTOR2].",
        },
        modals: {
            ogv: {
                title: "Omni Gravity Vector (OGV)",
                func_title: "FUNCTION",
                func_desc: "Projects the relative position of major assets (Stocks, Gold, BTC, USD, Bonds) onto a four-quadrant map composed of 'Economic Growth' and 'Inflation/Prices'. Draws a 60-day 'Trail' to visualize market inertia and trends.",
                purpose_title: "PURPOSE",
                purpose_desc: "To determine at a glance whether the current macro environment is 'Goldilocks', 'Overheating', 'Stagflation', or 'Recession'. Acts as a compass to read which quadrant assets are gravitating towards, helping to decide portfolio 'safe havens' or 'attack opportunities'."
            },
            owb: {
                title: "Omni Warning Beacons (OWB)",
                func_title: "FUNCTION",
                func_desc: "A traffic light system monitoring 3 critical macro indicators (Yield Curve, Credit Risk, Volatility) 24/7. Signals change from 'NORMAL / CALM' to 'DANGER / STRESS' upon detecting anomalies.",
                purpose_title: "PURPOSE",
                purpose_desc: "To detect systemic risk (market collapse) early. Even if individual stocks are strong, 'Red' beacons indicate a catastrophic shock is smoldering behind the scenes. Serves as the 'final line of defense'."
            },
            otg: {
                title: "Omni Thermal Grid (OTG)",
                func_title: "FUNCTION",
                func_desc: "A heatmap visualizing the 'heat' of sectors (Tech, Energy, Finance, Crypto) based on the GMS algorithm. Uses color intensity to show in real-time where funds are concentrating and where they are fleeing.",
                purpose_title: "PURPOSE",
                purpose_desc: "To capture waves of Sector Rotation. While OGV shows the 'ocean currents', OTG identifies 'active schools of fish'. Supports efficient capital allocation by spotting locally heating sectors even in a cooling market."
            }
        },
        ogv_guide: {
            title: "Quick Interpretation Guide",
            overheating: "OVERHEATING",
            overheating_pos: "(Top Right)",
            overheating_desc: "Strong growth but high inflationary pressure. 'Overheating' state. Be cautious of adjustment risks due to monetary tightening.",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(Bottom Right)",
            goldilocks_desc: "Moderate growth and stable prices. A 'just right' state where monetary easing continues. Risk-on phase expecting asset value rise.",
            recession: "RECESSION",
            recession_pos: "(Bottom Left)",
            recession_desc: "Economic downturn phase. Growth slows and interest rates fall. 'Cooling' period where flight to safety (bonds) advances.",
            stagflation: "STAGFLATION",
            stagflation_pos: "(Top Left)",
            stagflation_desc: "Stagnant economy and persistent high prices. The toughest phase where asset defense is priority. Inflation hedge assets are favored.",
            footer_note: "*Length of 'Light Path' suggests market inertia; dot density suggests trend hesitation."
        },
        strategy: {
            accumulate: "ACCUMULATE",
            neutral: "NEUTRAL",
            defensive: "DEFENSIVE"
        },
        momentum: {
            bottoming: "BOTTOMING OUT",
            peaking: "PEAKING",
            rising: "RISING",
            falling: "FALLING",
            stable: "STABLE"
        },
        events: {
            cpi: "CPI INFLATION DATA",
            fomc: "FOMC RATE DECISION",
            nfp: "NON-FARM PAYROLLS",
            high: "HIGH IMPACT",
            critical: "CRITICAL",
            tue: "TUE",
            wed: "WED",
            fri: "FRI",
            est: "EST"
        },
        attribution: {
            src: "SRC: FRED/CBOE • UPD: LIVE"
        },
        terms: {
            VIX: {
                def: "Volatility Index. Measures expected market volatility.",
                benchmark: "Ref: <15 (Complacency), >20 (Caution), >30 (Panic)."
            },
            MOVE: {
                def: "Bond Market Volatility. The 'VIX' of Treasuries.",
                benchmark: "Ref: >120 indicates systemic stress in collateral markets."
            },
            NFCI: {
                def: "National Financial Conditions Index (Chicago Fed).",
                benchmark: "Ref: Positive = Tight (Bearish). Negative = Loose (Bullish)."
            },
            HY_SPREAD: {
                def: "High Yield Option-Adjusted Spread.",
                benchmark: "Ref: <3.5% (Healthy Risk Appetite), >5.0% (Credit Stress)."
            },
            REAL_INTEREST_RATE: {
                def: "10-Year Real Interest Rate (TIPS).",
                benchmark: "Ref: Rising real rates pressure risk assets."
            },
            BREAKEVEN_INFLATION: {
                def: "10-Year Breakeven Inflation Rate.",
                benchmark: "Ref: Inflation expectations derived from TIPS/Treasury spread."
            },
            NET_LIQUIDITY: {
                def: "US Net Liquidity Proxy (Fed Balance Sheet adjusted).",
                benchmark: "Ref: Expansion supports asset prices, Contraction is a headwind."
            },
            CRYPTO_SENTIMENT: {
                def: "Crypto Fear & Greed Index.",
                benchmark: "Ref: <20 (Extreme Fear), >80 (Extreme Greed)."
            },
            COPPER_GOLD: {
                def: "Copper/Gold Ratio. Proxy for Global Growth vs Safety.",
                benchmark: "Ref: Rising trend signals economic expansion."
            },
            BREADTH: {
                def: "Market Breadth (RSP vs SPY Performance).",
                benchmark: "Ref: Positive spread indicates healthy broad participation."
            },
            SPY: {
                def: "SPDR S&P 500 ETF. Global Equity Risk proxy.",
                benchmark: "Ref: Uptrend = Risk On."
            },
            TNX: {
                def: "10-Year Treasury Yield.",
                benchmark: "Ref: >4.5% pressures equity valuations."
            },
            DXY: {
                def: "US Dollar Index.",
                benchmark: "Ref: >105 tightens global liquidity."
            },
            YIELD_SPREAD: {
                def: "10Y-3M Yield Spread.",
                benchmark: "Ref: Inversion (<0) is a leading recession indicator."
            }
        },
        legal_text: {
            t1: "OmniMetric ('The Ultimate Asset Hub') provides quantitative macro insights for informational purposes only. The information presented herein is generated by OmniMetric Proprietary Algorithms and does not constitute investment advice. UNAUTHORIZED AUTOMATED SCRAPING, DATA MINING, OR USAGE FOR AI TRAINING IS STRICTLY PROHIBITED WITHOUT A COMMERCIAL LICENSE BY OMNIMETRIC. By accessing this site, you acknowledge and accept these terms.",
            t2: "Past performance is not indicative of future results. Market data provided 'as is'.",
            copyright: "Powered by OmniMetric Project"
        },
        regime: {
            bull: "Risk Preference",
            neutral: "Neutral Regime",
            bear: "Risk Avoidance",
            legend: "BULL > 60 // BEAR < 40"
        },
        sections: {
            s1: "SECTION I: MARKET VOLATILITY & FEAR",
            s2: "SECTION II: STRUCTURAL CREDIT & FORECASTS",
            s3: "SECTION III: REFERENCE BENCHMARKS"
        },
        chart: {
            trend: "60-Hour Terminal Trend",
            sync: "Awaiting Signal Sync...",
            insight: "Proprietary Insight",
            engine: "Institutional Engine v5.2.0",
            neutral_insight: "Awaiting institutional confluence.",
            bull_insight: "Conditions favor risk assets. Momentum confirming expansion.",
            bear_insight: "Defensive posture advised. Elevated structural stress detected."
        },
        labels: {
            signal: "SIGNAL:",
            benchmark_mode: "BENCHMARK MODE",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "CORRELATION HISTORY",
            back_to_terminal: "BACK TO TERMINAL",
            vix: "VIX (Equity Vol)",
            move: "MOVE (Bond Vol)",
            privacy: "Privacy",
            terms: "Terms",
            contact: "Contact",
            cookie: {
                title: "System Protocol",
                text: "Accessing this terminal requires data stream authorization (Cookies).",
                subtext: "Optimization protocols initialized.",
                accept: "[Initialize]",
                decline: "[Deny]"
            },
            hy_spread: "HY Spread (OAS)",
            nfci: "NFCI (Financial Cond.)",
            yield_spread: "10Y-3M Yield Spread",
            copper_gold: "Copper/Gold Ratio",
            dxy: "US Dollar Index",
            tnx: "US 10Y Yield",
            spy: "S&P 500 (SPY)",
            summary: "SUMMARY",
            stocks: "STOCKS",
            crypto: "CRYPTO",
            forex: "FOREX",
            commodities: "COMMODITIES",
            wiki: "MACRO WIKI",
            maxims: "MAXIMS",
            technical: "TECHNICAL",
            indicator: "Assets & Indicators",
            tickers: {
                BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana",
                GOLD: "Gold", OIL: "WTI Crude Oil", COPPER: "Copper", NATGAS: "Natural Gas",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "DXY Dollar Index",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 Equal Weight", HYG: "High Yield Bond", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "Nikkei 225", HANGSENG: "Hang Seng", ASX200: "ASX 200",
                G_REIT: "Global REIT", US_HOUSING: "US Housing", LOGISTICS: "Logistics REIT", INFRA: "Infrastructure",
                HY_BOND: "High Yield", IG_BOND: "Inv Grade", TIPS: "TIPS", SHY: "Short Gov",
                BALTIC: "Baltic Dry", SHIPPING: "Shipping", AGRI: "Agri",
                SEMIS: "Semis", DEFENSE: "Defense", RARE_EARTH: "Rare Earth", CYBER: "Cyber",
                SILVER: "Silver", USDCNY: "USD/CNY",
                VIX: "VIX Volatility", TNX: "US 10Y Yield", MOVE: "MOVE Index", CRYPTO_SENTIMENT: "Crypto Fear & Greed"
            },
            search_placeholder: "Search Knowledge Base...",
            wiki_deep_dive: "Deep Dive Analysis"
        },
        subpages: {
            about: {
                title: "ABOUT OMNIMETRIC",
                subtitle: "AI-Driven Institutional Macro Analysis Terminal for Retail Investors",
                what_is_title: "What is OmniMetric?",
                what_is_content: "OmniMetric is an AI-driven macro economic analysis terminal that transforms institutional-grade financial data into actionable insights for retail investors. Unlike traditional financial news sites that focus on headlines and opinions, we process real-time market data through sophisticated algorithms to generate our proprietary Global Macro Signal (GMS) Score—a quantitative risk index from 0 to 100.",
                diff_title: "What Makes Us Different",
                diff_card_1_title: "📊 Institutional-Grade Data Sources",
                diff_card_1_content: "We analyze Net Liquidity (Federal Reserve Balance Sheet - TGA - RRP), MOVE Index (bond volatility), and High Yield Credit Spreads—metrics typically reserved for hedge funds and institutional investors.",
                diff_card_2_title: "🤖 AI-Powered Real-Time Analysis",
                diff_card_2_content: "Our proprietary algorithms process data from FRED, CBOE, Yahoo Finance, and alternative sources every 60 seconds, generating multilingual AI insights powered by Google Gemini.",
                diff_card_3_title: "🎯 Quantitative Risk Scoring",
                diff_card_3_content: "The GMS Score eliminates subjective opinions, providing a data-driven, objective assessment of global market risk levels in real-time.",
                mission: "Our Mission",
                mission_content_highlight: "To democratize access to institutional-grade macro analysis by visualizing structural economic shifts that impact all investors—from retail traders to long-term portfolio managers.",
                tech: "Technology Stack",
                tech_stack_frontend: "Frontend: Next.js 15 + TypeScript",
                tech_stack_backend: "Backend: Python + FastAPI",
                tech_stack_ai: "AI Engine: Google Gemini 2.0 Flash",
                tech_stack_pipeline: "Data Pipeline: Real-time REST APIs",
                data_sources_title: "Data Sources",
                data_sources_content: "Federal Reserve Economic Data (FRED), CBOE Market Volatility Indices, Yahoo Finance, Financial Modeling Prep, Alternative.me Crypto Fear & Greed",
                disclaimer_title: "Important Disclaimer",
                disclaimer_content: "OmniMetric is provided for informational purposes only and does not constitute investment advice. All data is sourced from public APIs and third-party providers. We do not guarantee accuracy, completeness, or timeliness. Investment decisions are the sole responsibility of the user.",
                system_status: "System Status: Operational (OmniMetric Project) // Version 2.0 // Updated",
                footer_note: "OmniMetric is a 100% autonomous algorithmic project. We do not provide individual support or investment consulting."
            },
            legal: {
                title: "LEGAL NOTICE & COMPLIANCE",
                disclaimer: "Financial Disclaimer",
                disclaimer_content: "OmniMetric is an information aggregator. The information provided does not constitute investment, financial, or legal advice. All data and analysis are provided 'as is' without warranty of any kind.",
                usage: "Terms of Usage",
                usage_content: "Unauthorized automated scraping, data mining, or usage for AI training is strictly prohibited. Commercial usage requires a specific license. By using this terminal, you agree to these project-specific legal terms."
            },
            archive: {
                title: "SIGNAL CORRELATION HISTORY",
                desc: "Objective replay of historical indicator states and the corresponding GMS algorithmic signal.",
                disclaimer: "THIS DATA REPRESENTS HISTORICAL CORRELATIONS ONLY AND DOES NOT SUGGEST OR GUARANTEE FUTURE INVESTMENT RESULTS."
            }
        },
    },
    JP: {
        status: {
            ai: MESSAGES.ai_status.JP,
            market: MESSAGES.market_data_status.JP
        },
        settings: {
            title: "マーケットパルス設定",
            subtitle: "ワークスペースのカスタマイズ",
            theme_title: "テーマ設定",
            dark_mode: "ダークモード",
            light_mode: "ライトモード",
            active_modules: "有効なモジュール",
            reset: "リセット",
            disabled_modules: "無効なモジュール",
            last_updated: "最終更新",
            system_operational: "システム稼働中"
        },
        partner: {
            badge: "TradingView Official Partner",
            title: "15ドルの特典を獲得：TradingViewの有料プランが割引に。世界最高峰のチャートで分析を極めよう。",
            action: "分析を開始する（15ドルの特典付き）",
            disclaimer: "当サイトはTradingViewの公式パートナーです。紹介リンク経由の登録で特典が適用されます。投資判断は自己責任で行ってください。",
            link_text: "TradingViewで分析（15ドルの特典）"
        },
        titles: {
            risk_score: "市場局面分析 (Market Regime)",
            insights: "定量的マクロインサイト",
            risk_factors: "機関投資家向けデータグリッド",
            legal: "法的通知・免責事項",
            delayed: "1時間遅延",
            partner_ad: "広告掲載枠",
            market_regime: "市場局面分析",
            risk_preference: "リスク選好",
            institutional_analysis: "GMSマクロAI分析（機関投資家レベル）",
            sponsored: "SPONSORED",
            current_strategy: "CURRENT STRATEGY",
            upcoming_events: "UPCOMING RISK EVENTS",
            gms_score: "GMS SCORE",
            breaking_news: "速報（BREAKING）",
            live: "ライブ",
            breaking: "速報",
            delayed_tick: "*15分遅延",
            methodology: "算出ロジック (METHODOLOGY)",
            analysis_history: "分析履歴 (Analysis History)",
            live_stream: "ライブ・インテリジェンス（LIVE INTELLIGENCE）",
            ai_disclaimer: "本インサイトはAIによる多角的な分析結果であり、内容の正確性を保証するものではありません。"
        },
        methodology: {
            title: "GMS QUANT METHODOLOGY",
            desc: "GMSスコアは、市場の「恐怖」「信用」「勢い」を統合し、0〜100で数値化した独自の定量的リスク指標です。",
            zone_accumulate: "60-100: ACCUMULATE (リスク選好)",
            zone_accumulate_desc: "株式・コモディティ・ハイイールド債への資金流入が推奨される拡大局面。",
            zone_neutral: "40-60: NEUTRAL (中立)",
            zone_neutral_desc: "トレンドレス。ボラティリティ収縮待ち。ポジション調整局面。",
            zone_defensive: "0-40: DEFENSIVE (リスク回避)",
            zone_defensive_desc: "現金・国債優位。パニック売りや信用収縮への警戒が必要。",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
            scale_labels: {
                panic: "Panic (0)",
                neutral: "Neutral (50)",
                greed: "Greed (100)"
            },
            factors: { VOL: "ボラティリティ", MOM: "モメンタム", CRED: "信用リスク", SENT: "センチメント", RATES: "金利", BREADTH: "騰落", LIQ: "流動性", INFL: "物価", EXP: "期待", MACRO: "マクロ" },
            factors_status: {
                LOW: "低", HIGH: "高",
                ELEVATED: "上昇", CRITICAL: "危機的",
                STABLE: "安定", FEAR: "恐怖", CALM: "凪",
                BULLISH: "強気", BEARISH: "弱気",
                RISING: "上昇", FALLING: "下落",
                NEUTRAL: "中立",
                GREED: "強欲",
                STRESS: "ストレス",
                HEALTHY: "健全",
                SKEWED: "偏り",
                SAFE: "安全",
                DANGER: "危険"
            }
        },
        modals: {
            ogv: {
                title: "オムニ・グラビティ・ベクトル (OGV)",
                func_title: "機能",
                func_desc: "主要資産（株、金、ビットコイン、ドル、債券）の相対的な立ち位置を、「経済成長（景気）」と「物価（インフレ/デフレ）」の2軸で構成される四象限マップに投影します。過去60日間の「航跡（Trail）」を描画することで、市場の慣性とトレンドを可視化します。",
                purpose_title: "目的",
                purpose_desc: "現在のマクロ経済環境が「適温（Goldilocks）」「過熱（Overheating）」「停滞（Stagflation）」「不況（Recession）」のどこに位置しているかを一目で判別することです。資産がどの象限へ引き寄せられているか（重力）を読み解き、ポートフォリオの「逃げ先」や「攻め時」を判断するための羅針盤として機能します。"
            },
            owb: {
                title: "オムニ・ワーニング・ビーコン (OWB)",
                func_title: "機能",
                func_desc: "市場の「急所」である3つのマクロ指標（イールドカーブ、クレジットリスク、ボラティリティ）を24時間監視する信号機システムです。正常時は「NORMAL / CALM」、異常検知時は「DANGER / STRESS」へと色が変化し、警告を発します。",
                purpose_title: "目的",
                purpose_desc: "システミック・リスク（市場全体の崩壊リスク）を早期に察知することです。個別の株価が堅調であっても、ビーコンが「赤」を点灯させている場合は、裏側で壊滅的なショックの火種が燻っていることを意味します。投資判断における「最終的な防衛線」としての役割を担います。"
            },
            otg: {
                title: "オムニ・サーマル・グリッド (OTG)",
                func_title: "機能",
                func_desc: "ハイテク、エネルギー、金融、クリプトといった各セクターの「熱量」を、独自アルゴリズム（GMSスコア）に基づいてヒートマップ化したものです。どの分野に資金が集中し、どの分野から資金が抜けているかを色の濃淡でリアルタイムに表現します。",
                purpose_title: "目的",
                purpose_desc: "セクター・ローテーション（資金の循環）の波を捉えることです。OGVが「市場全体の海流」を示すのに対し、OTGは「どの魚群が活発か」を特定します。相場全体が冷え込んでいる中でも、局所的に熱を帯びているセクターを見つけ出し、効率的な資金配分をサポートします。"
            }
        },
        ogv_guide: {
            title: "Quick Interpretation Guide",
            overheating: "OVERHEATING",
            overheating_pos: "(右上)",
            overheating_desc: "成長は強いがインフレ圧力が高い「過熱」状態。金融引き締めによる調整リスクに警戒が必要な局面。",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(右下)",
            goldilocks_desc: "適度な成長と安定した物価。金融緩和が継続しやすい「適温」の状態であり、資産価値の上昇が期待できるリスクオン局面。",
            recession: "RECESSION",
            recession_pos: "(左下)",
            recession_desc: "景気後退局面。成長鈍化と金利低下が進行し、現金比率を高め安全資産（国債等）への避難が進む市場の「冷却」期。",
            stagflation: "STAGFLATION",
            stagflation_pos: "(左上)",
            stagflation_desc: "停滞する景気と止まらない物価高。資産防衛が最優先される最も厳しい局面であり、インフレヘッジ資産が注目される。",
            footer_note: "*「光の道」の長さは市場の慣性を、ドットの密集度はトレンドの迷いを示唆します。"
        },
        strategy: {
            accumulate: "ACCUMULATE (強気)",
            neutral: "NEUTRAL (静観)",
            defensive: "DEFENSIVE (守備)"
        },
        momentum: {
            bottoming: "底打ち (BOTTOMING)",
            peaking: "天井 (PEAKING)",
            rising: "上昇 (RISING)",
            falling: "下落 (FALLING)",
            stable: "安定 (STABLE)"
        },
        events: {
            cpi: "CPI 消費者物価指数",
            fomc: "FOMC 政策金利発表",
            nfp: "米国雇用統計",
            high: "重要 (HIGH IMPACT)",
            critical: "最重要 (CRITICAL)",
            tue: "火",
            wed: "水",
            fri: "金",
            est: "EST" // Timezone usually kept en
        },
        attribution: {
            src: "ソース: FRED/CBOE • 更新: ライブ"
        },
        terms: {
            VIX: {
                def: "恐怖指数。S&P500の予想変動率。",
                benchmark: "基準: 20超は警戒域。30超はパニック売りを示唆。"
            },
            MOVE: {
                def: "米国債ボラティリティ指数。債券版VIX。",
                benchmark: "基準: 120超は債券市場の機能不全リスクを示唆。"
            },
            NFCI: {
                def: "シカゴ連銀金融環境指数。",
                benchmark: "基準: プラスは引き締め(弱気)、マイナスは緩和(強気)を示す。"
            },
            REAL_INTEREST_RATE: {
                def: "米国10年実質金利 (TIPS)。",
                benchmark: "基準: 上昇は株式などリスク資産のバリュエーションを圧迫。"
            },
            BREAKEVEN_INFLATION: {
                def: "米国10年期待インフレ率 (ブレークイーブン・インフレ率)。",
                benchmark: "基準: 期待インフレの低下はデフレ懸念、急昇は stagflation 懸念。"
            },
            NET_LIQUIDITY: {
                def: "FRB純流動性プロキシ（米ドル建・10億ドル単位）。",
                benchmark: "基準: 増加(拡大)はアセット価格の追い風、減少(収縮)は向かい風。"
            },
            CRYPTO_SENTIMENT: {
                def: "仮想通貨 恐怖＆強欲指数 (Fear & Greed Index)。",
                benchmark: "基準: 20以下は総悲観、80以上は過熱を意味する。"
            },
            HY_SPREAD: {
                def: "ハイイールド債スプレッド (OAS)。企業の信用リスク。",
                benchmark: "基準: 5.0%超は信用収縮(クレジットクランチ)の兆候。"
            },
            COPPER_GOLD: {
                def: "銅金レシオ。世界経済の成長期待に対する代替指標。",
                benchmark: "基準: 上昇は景気拡大期待(リスクオン)を反映。"
            },
            BREADTH: {
                def: "市場の裾野 (RSP対SPY)。",
                benchmark: "基準: 均等加重指数が優位な場合、上昇相場は健全。"
            },
            SPY: {
                def: "S&P 500 ETF。米国株のエクスポージャー。",
                benchmark: "基準: 長期トレンドの維持が重要。"
            },
            TNX: {
                def: "米国10年債利回り。",
                benchmark: "基準: 4.5%を超えると株式バリュエーションを圧迫。"
            },
            DXY: {
                def: "ドルインデックス。",
                benchmark: "基準: 105超は世界的な流動性逼迫を招く。"
            },
            YIELD_SPREAD: {
                def: "長短金利差 (10年-3ヶ月)。",
                benchmark: "基準: 逆イールド(マイナス)はリセッションの先行指標。"
            }
        },
        legal_text: {
            t1: "オムニ・メトリック (究極のアセットハブ) は情報提供のみを目的としており、投資助言ではありません。本サイトの分析は独自のアルゴリズムによって生成されたものであり、無断でのAI学習、データマイニング、および商用目的の自動スクレイピングは固く禁じられています。\n本サイトへのアクセスをもって、これらの条件に同意したものとみなされます。過去の実績は将来の成果を保証するものではありません。市場データは遅延する場合があります。",
            t2: "",
            copyright: "Powered by オムニ・メトリック・プロジェクト"
        },
        regime: {
            bull: "リスク選好",
            neutral: "中立局面",
            bear: "リスク回避",
            legend: "強気 > 60 // 弱気 < 40"
        },
        sections: {
            s1: "第Iセクション: 市場ボラティリティと警戒感",
            s2: "第IIセクション: 構造的信用リスクと分析",
            s3: "第IIIセクション: 主要リファレンス指標"
        },
        chart: {
            trend: "過去60時間のターミナルトレンド",
            sync: "シグナル同期待機中...",
            insight: "独占的インサイト",
            engine: "機関投資家向けエンジン v5.2.0",
            neutral_insight: "機関投資家の合意形成を待機中。",
            bull_insight: "リスク資産に追い風。モメンタムは拡張を継続。",
            bear_insight: "防衛的ポジションを推奨。構造的ストレスを検出。"
        },
        labels: {
            signal: "シグナル:",
            benchmark_mode: "ベンチマークモード",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "相関履歴 (Signal Correlation History)",
            back_to_terminal: "ターミナルに戻る",
            vix: "VIX (株式ボラティリティ)",
            move: "MOVE (債券ボラティリティ)",
            privacy: "プライバシー",
            terms: "利用規約",
            contact: "お問い合わせ",
            cookie: {
                title: "システムプロトコル",
                text: "このターミナルへのアクセスにはデータストリームの承認（Cookie）が必要です。",
                subtext: "最適化プロトコルが初期化されました。",
                accept: "[初期化]",
                decline: "[拒否]"
            },
            hy_spread: "HYスプレッド (実質利回り差)",
            nfci: "NFCI (金融環境指数)",
            yield_spread: "長短金利差 (10Y-3M)",
            copper_gold: "銅金比率",
            dxy: "ドルインデックス",
            tnx: "米国10年債利回り",
            spy: "S&P 500 (米国株)",
            summary: "サマリー",
            stocks: "株式市場",
            crypto: "暗号資産",
            forex: "為替・金利",
            commodities: "コモディティ",
            wiki: "マクロ事典",
            maxims: "投資金言",
            technical: "テクニカル",
            indicator: "アセット & 指標",
            tickers: {
                BTC: "ビットコイン", ETH: "イーサリアム", SOL: "ソラナ",
                GOLD: "金 (Gold)", OIL: "WTI原油", COPPER: "銅", NATGAS: "天然ガス",
                USDJPY: "ドル円", EURUSD: "ユーロドル", USDINR: "ドル/ルピー", USDSAR: "ドル/リヤル", DXY: "ドル指数",
                SPY: "S&P 500", QQQ: "ナスダック100", IWM: "ラッセル2000", RSP: "S&P500均等加重", HYG: "ハイイールド債", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "日経225", HANGSENG: "ハンセン指数", ASX200: "ASX 200",
                G_REIT: "Glb REIT", US_HOUSING: "US住宅", LOGISTICS: "物流REIT", INFRA: "インフラ",
                HY_BOND: "ハイイールド", IG_BOND: "投資適格債", TIPS: "物価連動債", SHY: "短期国債",
                BALTIC: "バルチック指数", SHIPPING: "海運", AGRI: "農業",
                SEMIS: "半導体", DEFENSE: "防衛", RARE_EARTH: "レアアース", CYBER: "サイバー",
                SILVER: "銀 (Silver)", USDCNY: "人民元/ドル",
                VIX: "VIX恐怖指数", TNX: "米国10年債利回り", MOVE: "MOVE債券恐怖指数", CRYPTO_SENTIMENT: "暗号資産恐怖指数 (F&G)"
            },
            search_placeholder: "マクロ知識ベースを検索...",
            wiki_deep_dive: "詳細分析を読む"
        },
        subpages: {
            about: {
                title: "ABOUT OMNIMETRIC",
                subtitle: "個人投資家向けAI駆動型マクロ分析ターミナル",
                what_is_title: "オムニ・メトリックとは？",
                what_is_content: "オムニ・メトリックは、機関投資家級の金融データをAIで解析し、個人投資家向けに実用的なインサイトへ変換するAI駆動型マクロ経済分析ターミナルです。ヘッドラインや意見に焦点を当てた従来の金融ニュースサイトとは異なり、リアルタイム市場データを高度なアルゴリズムで処理し、独自のグローバル・マクロ・シグナル（GMS）スコア—0から100までの定量的リスク指数を生成します。",
                diff_title: "オムニ・メトリックの独自性",
                diff_card_1_title: "📊 機関投資家級のデータソース",
                diff_card_1_content: "純流動性（連邦準備制度資産 - TGA - RRP）、MOVE指数（債券ボラティリティ）、ハイイールド・クレジット・スプレッドなど、通常はヘッジファンドや機関投資家が使用する指標を分析します。",
                diff_card_2_title: "🤖 AIによるリアルタイム分析",
                diff_card_2_content: "独自のアルゴリズムが、FRED、CBOE、Yahoo Finance等のソースから60秒ごとにデータを処理し、Google Gemini搭載の多言語AIインサイトを生成します。",
                diff_card_3_title: "🎯 定量的リスクスコアリング",
                diff_card_3_content: "GMSスコアは主観的な意見を排除し、グローバル市場リスクレベルをデータ駆動型かつ客観的にリアルタイムで評価します。",
                mission: "ミッション",
                mission_content_highlight: "構造的経済変化を可視化することで、機関投資家級のマクロ分析へのアクセスを民主化し、個人トレーダーから長期ポートフォリオマネージャーまで、あらゆる投資家に影響を与えます。",
                tech: "技術スタック",
                tech_stack_frontend: "フロントエンド: Next.js 15 + TypeScript",
                tech_stack_backend: "バックエンド: Python + FastAPI",
                tech_stack_ai: "AIエンジン: Google Gemini 2.0 Flash",
                tech_stack_pipeline: "データパイプライン: リアルタイムREST API",
                data_sources_title: "データソース",
                data_sources_content: "連邦準備経済データ（FRED）、CBOE市場ボラティリティ指数、Yahoo Finance、Financial Modeling Prep、Alternative.me 暗号通貨恐怖と欲望指数",
                disclaimer_title: "重要な免責事項",
                disclaimer_content: "オムニ・メトリックは情報提供のみを目的としており、投資助言を構成するものではありません。すべてのデータは公開APIおよび第三者プロバイダーから取得されています。正確性、完全性、適時性を保証するものではありません。投資判断はユーザーの単独責任です。",
                system_status: "システム状態: 運用中 (OmniMetric Project) // バージョン 2.0 // 更新日",
                footer_note: "OmniMetricは100％自律的なアルゴリズムプロジェクトです。個別のサポートや投資コンサルティングは行っておりません。"
            },
            legal: {
                title: "法的通知およびコンプライアンス",
                disclaimer: "免責事項",
                disclaimer_content: "OmniMetricは情報の集約プラットフォームです。提供される情報は投資、金融、または法的助言を構成するものではありません。すべてのデータと分析は、いかなる種類の保証もなく「現状のまま」提供されます。",
                usage: "利用規約",
                usage_content: "無断の自動スクレイピング、データマイニング、またはAI学習への利用は固く禁じられています。商用利用には特定のライセンスが必要です。本ターミナルを利用することで、これらのプロジェクト固有の法的条件に同意したものとみなされます。"
            },
            archive: {
                title: "シグナルと市場の相関履歴",
                desc: "当時の各指標（ボラティリティ・流動性等）の客観的データと、それに基づき算出されたGMSスコアの履歴です。",
                disclaimer: "本データは過去の相関を示すものであり、将来の投資成果を示唆または保証するものではない"
            }
        }
    },
    CN: {
        status: {
            ai: MESSAGES.ai_status.CN,
            market: MESSAGES.market_data_status.CN
        },
        settings: {
            title: "市场脉搏配置",
            subtitle: "自定义您的工作区",
            theme_title: "主题界面",
            dark_mode: "深色模式",
            light_mode: "浅色模式",
            active_modules: "活动模块",
            reset: "重置",
            disabled_modules: "禁用模块",
            last_updated: "最后更新",
            system_operational: "系统运行正常"
        },
        partner: {
            badge: "TradingView 官方合作伙伴",
            title: "获得 $15 奖励：节省您的 TradingView 新计划费用。从 OmniMetric 开始体验世界级的图表分析。",
            action: "开始分析 (获得 $15 奖励)",
            disclaimer: "OmniMetric 是 TradingView 的官方合作伙伴。通过我们的推荐链接注册可享受优惠。投资请自担风险。",
            link_text: "在 TradingView 上分析（获得 $15 奖励）"
        },
        titles: {
            risk_score: "市场机制指标 (Market Regime)",
            insights: "量化宏观分析",
            risk_factors: "机构数据网格",
            legal: "法律声明",
            delayed: "延迟 1 小时",
            partner_ad: "机构合作伙伴广告位",
            market_regime: "市场机制",
            risk_preference: "风险偏好",
            institutional_analysis: "机构AI分析",
            sponsored: "赞助商",
            current_strategy: "当前策略",
            upcoming_events: "即将发生的风险事件",
            gms_score: "GMS评分",
            breaking_news: "突发新闻",
            live: "实时",
            breaking: "突发",
            delayed_tick: "*延迟15分",
            methodology: "方法论",
            analysis_history: "分析历史 (Analysis History)",
            live_stream: "实时情报流",
            ai_disclaimer: "本洞察是由人工智能进行的多元化分析结果，不保证内容的准确性。"
        },
        methodology: {
            title: "GMS QUANT METHODOLOGY",
            desc: "GMS评分将市场的“恐惧”、“信贷压力”和“动量”整合为一个0-100的专有量化风险指数。",
            zone_accumulate: "60-100: ACCUMULATE (风险偏好)",
            zone_accumulate_desc: "扩张阶段。建议资金流入股票、大宗商品和高收益债券。",
            zone_neutral: "40-60: NEUTRAL (中立)",
            zone_neutral_desc: "无趋势。等待波动率收缩。仓位调整阶段。",
            zone_defensive: "0-40: DEFENSIVE (风险回避)",
            zone_defensive_desc: "现金/国债主导。警惕恐慌性抛售和信贷收缩。",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
            scale_labels: {
                panic: "Panic (0)",
                neutral: "Neutral (50)",
                greed: "Greed (100)"
            },
            factors: { VOL: "波动", MOM: "动量", CRED: "信贷", SENT: "情绪", RATES: "利率", BREADTH: "广度", LIQ: "流动性", INFL: "通胀", EXP: "预期", MACRO: "宏观" },
            factors_status: {
                LOW: "低", HIGH: "高",
                ELEVATED: "升高", CRITICAL: "关键",
                STABLE: "稳定", FEAR: "恐惧", CALM: "平静",
                BULLISH: "看涨", BEARISH: "看跌",
                RISING: "上升", FALLING: "下降",
                NEUTRAL: "中立",
                GREED: "贪婪",
                STRESS: "压力",
                HEALTHY: "健康",
                SKEWED: "偏斜",
                SAFE: "安全",
                DANGER: "危险"
            }
        },
        modals: {
            ogv: {
                title: "全向重力向量 (OGV)",
                func_title: "功能",
                func_desc: "将主要资产（股票、黄金、比特币、美元、债券）的相对位置映射到由“经济增长”和“通胀/价格”构成的四象限地图上。绘制60天的“轨迹”以可视化市场惯性和趋势。",
                purpose_title: "目的",
                purpose_desc: "一眼识别当前宏观环境处于“金发姑娘（Goldilocks）”、“过热（Overheating）”、“滞胀（Stagflation）”还是“衰退（Recession）”。作为指南针，解读资产正被吸引向哪个象限（重力），帮助判断投资组合的“避风港”或“进攻时机”。"
            },
            owb: {
                title: "全向警示灯塔 (OWB)",
                func_title: "功能",
                func_desc: "这是一个24小时监控市场“要害”三大宏观指标（收益率曲线、信用风险、波动率）的信号灯系统。正常时显示为“NORMAL / CALM”，检测到异常时颜色会变为“DANGER / STRESS”并发出警报。",
                purpose_title: "目的",
                purpose_desc: "尽早察觉系统性风险（整个市场崩盘的风险）。即使个别股价稳健，如果灯塔点亮“红色”，则意味着背后潜伏着毁灭性冲击的火种。在投资决策中担任“最后防线”的角色。"
            },
            otg: {
                title: "全向热力网格 (OTG)",
                func_title: "功能",
                func_desc: "基于专有算法（GMS评分），将科技、能源、金融、加密等各板块的“热量”热力图化。实时通过色彩深浅表现资金正集中在哪些领域，又从哪些领域流出。",
                purpose_title: "目的",
                purpose_desc: "把握行业轮动（资金循环）的浪潮。OGV显示“整个市场的洋流”，而OTG则识别“哪些鱼群活跃”。即使在整体行情低迷时，也能找出局部受热的板块，支持高效的资金配置。"
            }
        },
        ogv_guide: {
            title: "快速解读指南",
            overheating: "OVERHEATING",
            overheating_pos: "(右上)",
            overheating_desc: "增长强劲但通胀压力高企的“过热”状态。需警惕因货币紧缩带来的调整风险。",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(右下)",
            goldilocks_desc: "适度增长与物价稳定。货币宽松易于持续的“适温”状态，是预期资产升值的风险偏好阶段。",
            recession: "RECESSION",
            recession_pos: "(左下)",
            recession_desc: "经济衰退阶段。增长放缓，利率下降。资金流向安全资产（国债等）的“冷却”期。",
            stagflation: "STAGFLATION",
            stagflation_pos: "(左上)",
            stagflation_desc: "经济停滞与物价居高不下。资产防御优先的最严峻阶段，通胀对冲资产受到关注。",
            footer_note: "*“光路”的长度暗示市场惯性，点的密度暗示趋势的犹豫。"
        },
        strategy: {
            accumulate: "积极累积",
            neutral: "中立观望",
            defensive: "防御姿态"
        },
        momentum: {
            bottoming: "筑底 (BOTTOMING)",
            peaking: "见顶 (PEAKING)",
            rising: "上涨 (RISING)",
            falling: "下跌 (FALLING)",
            stable: "稳定 (STABLE)"
        },
        events: {
            cpi: "CPI 通胀数据",
            fomc: "FOMC 利率决议",
            nfp: "非农就业数据",
            high: "高影响",
            critical: "关键",
            tue: "周二",
            wed: "周三",
            fri: "周五",
            est: "EST"
        },
        attribution: {
            src: "来源: FRED/CBOE • 更新: 实时"
        },
        terms: {
            VIX: { def: "波动率指数。", benchmark: "基准：>20 为警戒区。" },
            MOVE: { def: "债券市场波动率。", benchmark: "基准：>120 表明系统性压力。" },
            NFCI: { def: "国家金融状况指数。", benchmark: "基准：正值为紧缩，负值为宽松。" },
            HY_SPREAD: { def: "高收益债券利差。", benchmark: "基准：>5% 表明信贷压力。" },
            COPPER_GOLD: { def: "铜金比率。", benchmark: "基准：上升表明经济扩张。" },
            BREADTH: { def: "市场广度。", benchmark: "基准：广泛的参与表明牛市健康。" },
            SPY: { def: "标准普尔 500 ETF。", benchmark: "基准：趋势向上为风险开启。" },
            TNX: { def: "10年期国债收益率。", benchmark: "基准：>4.5% 压低估值。" },
            DXY: { def: "美元指数。", benchmark: "基准：>105 导致流动性紧缩。" },
            YIELD_SPREAD: { def: "收益率曲线。", benchmark: "基准：倒挂为衰退信号。" }
        },
        legal_text: {
            t1: "OmniMetric (终极资产中心) 仅供参考，不构成投资建议。本文信息由专有算法生成。未经书面许可，严禁将本网站数据用于 AI 训练、数据挖掘或商业自动抓取。访问本网站即表示您同意这些条款。",
            t2: "过往表现不代表未来结果。市场数据按原样提供。",
            copyright: "Powered by OmniMetric Project"
        },
        regime: {
            bull: "风险偏好",
            neutral: "中立机制",
            bear: "风险规避",
            legend: "看涨 > 60 // 看跌 < 40"
        },
        sections: {
            s1: "第一部分：市场波动与恐惧",
            s2: "第二部分：结构性信贷与分析",
            s3: "第三部分：参考基准"
        },
        chart: {
            trend: "60小时终端趋势",
            sync: "正在等待信号同步...",
            insight: "独家见解",
            engine: "机构版版本 v5.2.0",
            neutral_insight: "等待机构达成共识。",
            bull_insight: "条件有利于风险资产。动量确认扩张。",
            bear_insight: "建议采取防御性姿态。检测到结构性压力。"
        },
        labels: {
            signal: "信号:",
            benchmark_mode: "基准模式",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "相关性历史 (Correlation History)",
            back_to_terminal: "返回终端",
            vix: "VIX (股票波动率)",
            move: "MOVE (债券波动率)",
            privacy: "隐私政策",
            terms: "使用条款",
            contact: "联系我们",
            cookie: {
                title: "系统协议",
                text: "访问此终端需要数据流授权（Cookie）。",
                subtext: "优化协议已启动。",
                accept: "[初始化]",
                decline: "[拒绝]"
            },
            hy_spread: "HY利差 (OAS)",
            nfci: "NFCI (金融状况指数)",
            yield_spread: "10Y-2Y收益率差",
            copper_gold: "铜金比率",
            dxy: "美元指数",
            tnx: "美国10年期收益率",
            spy: "标普500 (SPY)",
            summary: "概要",
            stocks: "股票",
            crypto: "加密货币",
            forex: "外汇",
            commodities: "大宗商品",
            wiki: "宏观百科",
            maxims: "投资金言",
            technical: "技术指标",
            indicator: "资产与指标",
            tickers: {
                BTC: "比特币", ETH: "以太坊", SOL: "Solana",
                GOLD: "黄金", OIL: "WTI原油", COPPER: "铜", NATGAS: "天然气",
                USDJPY: "美元/日元", EURUSD: "欧元/美元", USDINR: "美元/卢比", USDSAR: "美元/里亚尔", DXY: "DXY Dollar Index",
                SPY: "标普500", QQQ: "纳斯达克100", IWM: "罗素2000", RSP: "标普500等权", HYG: "高收益债", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "日经225", HANGSENG: "恒生指数", ASX200: "ASX 200",
                G_REIT: "全球REITs", US_HOUSING: "美国住房", LOGISTICS: "物流REIT", INFRA: "基建",
                HY_BOND: "高收益", IG_BOND: "投资级", TIPS: "通胀保值债", SHY: "短期国债",
                BALTIC: "波罗的海指数", SHIPPING: "航运", AGRI: "农业",
                SEMIS: "半导体", DEFENSE: "国防", RARE_EARTH: "稀土", CYBER: "网络安全",
                SILVER: "白银", USDCNY: "美元/人民币",
                VIX: "VIX恐慌指数", TNX: "美10年收益率", MOVE: "MOVE指数", CRYPTO_SENTIMENT: "加密恐慌贪婪"
            },
            search_placeholder: "搜索宏观知识库...",
            wiki_deep_dive: "阅读深度分析"
        },
        subpages: {
            about: {
                title: "À PROPOS D'OMNIMETRIC",
                subtitle: "终端提供针对散户投资者的AI驱动型机构宏观分析",
                what_is_title: "什么是 OmniMetric？",
                what_is_content: "OmniMetric 是一个 AI 驱动的宏观经济分析终端，旨在将机构级金融数据转化为零售投资者的行动建议。与侧重于头条新闻和观点的传统财经网站不同，我们通过复杂的算法处理实时市场数据，并生成我们专有的全球宏观信号（GMS）评分——一个从 0 到 100 的量化风险指数。",
                diff_title: "我们的独特性",
                diff_card_1_title: "📊 机构级数据源",
                diff_card_1_content: "我们分析净流动性（美联储资产负债表 - TGA - RRP）、MOVE 指数（债券波动率）和高收益信贷利差——这些指标通常仅供对冲基金和机构投资者使用。",
                diff_card_2_title: "🤖 AI 驱动的实时分析",
                diff_card_2_content: "我们的专有算法每 60 秒处理一次来自 FRED、CBOE、雅虎财经等来源的数据，并生成由 Google Gemini 支持的多语言 AI 洞察。",
                diff_card_3_title: "🎯 量化风险评分",
                diff_card_3_content: "GMS 评分消除了主观意见，实时提供基于数据的全球市场风险水平客观评估。",
                mission: "我们的使命",
                mission_content_highlight: "通过可视化影响所有投资者（从零售交易者到长期投资组合经理）的结构性经济变化，实现机构级宏观分析的透明化。",
                tech: "技术架构",
                tech_stack_frontend: "前端：Next.js 15 + TypeScript",
                tech_stack_backend: "后端：Python + FastAPI",
                tech_stack_ai: "AI 引擎：Google Gemini 2.0 Flash",
                tech_stack_pipeline: "数据管道：实时 REST API",
                data_sources_title: "数据源",
                data_sources_content: "美联储经济数据 (FRED), CBOE 波动率指数, 雅虎财经, Financial Modeling Prep, Alternative.me 加密恐惧与贪婪指数",
                disclaimer_title: "重要免责声明",
                disclaimer_content: "OmniMetric 仅供参考，不构成投资建议。所有数据均来自公共 API。我们不保证准确性。投资决策由用户自行承担。",
                system_status: "系统状态：运行中 // 版本 2.0 // 更新日期",
                footer_note: "OmniMetric 是一个 100% 自律的算法项目。我们不提供个人支持或投资咨询。"
            },
            legal: {
                title: "法律声明与合规性",
                disclaimer: "免责声明",
                disclaimer_content: "OmniMetric 是一个信息汇总平台。所提供的信息不构成投资、金融或法律建议。所有数据和分析均按“原样”提供，不作任何形式的保证。",
                usage: "使用条款",
                usage_content: "严禁未经授权的自动抓取、数据挖掘或用于 AI 训练。商业用途需要特定许可。使用本终端即表示您同意这些特定的法律条款。"
            },
            archive: {
                title: "信号相关性历史",
                desc: "客观重现历史指标状态以及相应的 GMS 算法信号。",
                disclaimer: "此数据仅代表历史相关性，不暗示或保证未来的投资结果。"
            }
        }
    },
    ES: {
        status: {
            ai: MESSAGES.ai_status.ES,
            market: MESSAGES.market_data_status.ES
        },
        settings: {
            title: "Configuración de Market Pulse",
            subtitle: "PERSONALIZA TU ESPACIO",
            theme_title: "Interfaz de Tema",
            dark_mode: "MODO OSCURO",
            light_mode: "MODO CLARO",
            active_modules: "Módulos Activos",
            reset: "REINICIAR",
            disabled_modules: "Módulos Desactivados",
            last_updated: "Última Actualización",
            system_operational: "SISTEMA OPERATIVO"
        },
        partner: {
            badge: "Socio Oficial de TradingView",
            title: "Obtenga $15 de Crédito: Ahorre en su nuevo plan TradingView. Experimente gráficos de clase mundial desde OmniMetric.",
            action: "Iniciar Análisis (Obtener $15)",
            disclaimer: "OmniMetric es socio oficial de TradingView. Los beneficios aplican a través de nuestros enlaces de referencia. Invierta bajo su propio riesgo.",
            link_text: "Analizar en TradingView (Bono de $15)"
        },
        titles: {
            risk_score: "Indicador de Régimen de Mercado",
            insights: "Análisis Macro Cuantitativo",
            risk_factors: "Red de Datos Institucionales",
            legal: "AVISO LEGAL",
            delayed: "Retraso de 1H",
            partner_ad: "Espacio Publicitario Institucional",
            market_regime: "RÉGIMEN DE MERCADO",
            risk_preference: "PREFERENCIA DE RIESGO",
            institutional_analysis: "Análisis AI Institucional",
            sponsored: "PATROCINADO",
            current_strategy: "ESTRATEGIA ACTUAL",
            upcoming_events: "PRÓXIMOS EVENTOS DE RIESGO",
            gms_score: "PUNTUACIÓN GMS",
            breaking_news: "NOTICIAS DE ÚLTIMA HORA",
            live: "EN VIVO",
            breaking: "ÚLTIMA HORA",
            delayed_tick: "*RETRASO 15m",
            methodology: "METODOLOGÍA",
            analysis_history: "Historial de Análisis",
            live_stream: "FLUJO DE INTELIGENCIA EN VIVO",
            ai_disclaimer: "Este análisis es el resultado de un estudio multifacético realizado por IA y no garantiza la precisión de su contenido."
        },
        methodology: {
            title: "METODOLOGÍA CUANTITATIVA GMS",
            desc: "El puntaje GMS integra el 'Miedo', 'Estrés Crediticio' y 'Momento' del mercado en un índice de riesgo cuantitativo propietario de 0-100.",
            zone_accumulate: "60-100: ACUMULAR (Risk On)",
            zone_accumulate_desc: "Fase de expansión. Se sugieren entradas en Acciones, Materias Primas y Bonos de Alto Rendimiento.",
            zone_neutral: "40-60: NEUTRAL (Sin Tendencia)",
            zone_neutral_desc: "Compresión de volatilidad. Fase de ajuste de posición.",
            zone_defensive: "0-40: DEFENSIVA (Risk Off)",
            zone_defensive_desc: "Dominio de efectivo/bonos. Cuidado con la venta de pánico y la contracción del crédito.",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
            scale_labels: {
                panic: "Panic (0)",
                neutral: "Neutral (50)",
                greed: "Greed (100)"
            },
            factors: { VOL: "VOL", MOM: "MOM", CRED: "CRÉD", SENT: "SENT", RATES: "TIPOS", BREADTH: "AMPL", LIQ: "LIQ", INFL: "INFL", EXP: "EXP", MACRO: "MACRO" },
            factors_status: {
                LOW: "BAJO", HIGH: "ALTO",
                ELEVATED: "ELEV", CRITICAL: "CRÍT",
                STABLE: "ESTAB", FEAR: "MIEDO", CALM: "CALMA",
                BULLISH: "ALCISTA", BEARISH: "BAJISTA",
                RISING: "ALZA", FALLING: "BAJA",
                NEUTRAL: "NEUTRO",
                GREED: "CODICIA",
                STRESS: "ESTRÉS",
                HEALTHY: "SANO",
                SKEWED: "SESGO",
                SAFE: "SEGURO",
                DANGER: "PELIGRO"
            }
        },
        modals: {
            ogv: {
                title: "Omni Gravity Vector (OGV)",
                func_title: "FUNCIÓN",
                func_desc: "Proyecta la posición relativa de los principales activos (Acciones, Oro, BTC, USD, Bonos) en un mapa de cuatro cuadrantes compuesto por 'Crecimiento Económico' e 'Inflación/Precios'. Dibuja un 'Trayecto' de 60 días para visualizar la inercia y las tendencias del mercado.",
                purpose_title: "PROPÓSITO",
                purpose_desc: "Identificar de un vistazo si el entorno macro actual es 'Goldilocks', 'Recalentamiento', 'Estanflación' o 'Recesión'. Funciona como una brújula para interpretar hacia qué cuadrante se ven atraídos los activos (gravedad), ayudando a decidir los 'refugios' o 'momentos de ataque' de la cartera."
            },
            owb: {
                title: "Omni Warning Beacons (OWB)",
                func_title: "FUNCIÓN",
                func_desc: "Sistema de semáforos macro que monitorea 24 h tres indicadores críticos (Curva de tipos, Riesgo de crédito, Volatilidad). Cambia de color a 'DANGER / STRESS' cuando detecta anomalías.",
                purpose_title: "PROPÓSITO",
                purpose_desc: "Detectar tempranamente riesgos sistémicos. Si los faros están en 'Rojo', hay peligro oculto aunque los precios parezcan estables. Es la 'última línea de defensa' en la inversión.",
            },
            ogv_guide: {
                title: "Guía de Interpretación Rápida",
                overheating: "OVERHEATING",
                overheating_pos: "(Arriba Der)",
                overheating_desc: "Crecimiento fuerte pero alta presión inflacionaria. Estado de 'sobrecalentamiento'. Precaución ante riesgos de ajuste por endurecimiento monetario.",
                goldilocks: "GOLDILOCKS",
                goldilocks_pos: "(Abajo Der)",
                goldilocks_desc: "Crecimiento moderado y precios estables. Estado 'ideal' donde la relajación monetaria continúa. Fase de riesgo con expectativa de alza de activos.",
                recession: "RECESSION",
                recession_pos: "(Abajo Izq)",
                recession_desc: "Fase de recesión económica. El crecimiento se desacelera y las tasas caen. Periodo de 'enfriamiento' con fuga hacia activos seguros (bonos).",
                stagflation: "STAGFLATION",
                stagflation_pos: "(Arriba Izq)",
                stagflation_desc: "Economía estancada y precios altos persistentes. La fase más difícil donde la defensa de activos es prioridad. Se favorecen activos de cobertura.",
                footer_note: "*La longitud del 'Camino de Luz' sugiere inercia del mercado; la densidad de puntos sugiere indecisión."
            },
            otg: {
                title: "Omni Thermal Grid (OTG)",
                func_title: "FUNCIÓN",
                func_desc: "Mapa de calor basado en el GMS Score que muestra la 'energía' en sectores como Tech, Energía, Finanzas y Crypto. Expresa en tiempo real dónde se concentra el capital.",
                purpose_title: "PROPÓSITO",
                purpose_desc: "Capturar las olas de rotación sectorial. Mientras OGV muestra la 'corriente oceánica', OTG identifica qué 'sectores' están activos, apoyando una asignación eficiente de fondos."
            }
        },
        strategy: {
            accumulate: "ACUMULAR",
            neutral: "NEUTRAL",
            defensive: "DEFENSIVA"
        },
        momentum: {
            bottoming: "SUELO (BOTTOMING)",
            peaking: "TECHO (PEAKING)",
            rising: "ALZA (RISING)",
            falling: "BAJA (FALLING)",
            stable: "ESTABLE (STABLE)"
        },
        events: {
            cpi: "DATOS DE INFLACIÓN (CPI)",
            fomc: "DECISIÓN DE TASAS FOMC",
            nfp: "NÓMINAS NO AGRÍCOLAS",
            high: "ALTO IMPACTO",
            critical: "CRÍTICO",
            tue: "MAR",
            wed: "MIÉ",
            fri: "VIE",
            est: "EST"
        },
        attribution: {
            src: "FUENTE: FRED/CBOE • ACTUALIZ.: VIVO"
        },
        terms: {
            VIX: { def: "Índice de Volatilidad.", benchmark: "Ref: >20 Precaución." },
            MOVE: { def: "Volatilidad de Bonos.", benchmark: "Ref: >120 Estrés sistémico." },
            NFCI: { def: "Índice de Condiciones Financieras.", benchmark: "Ref: Positivo = Ajustado." },
            HY_SPREAD: { def: "Diferencial High Yield.", benchmark: "Ref: >5% Estrés crediticio." },
            COPPER_GOLD: { def: "Ratio Cobre/Oro.", benchmark: "Ref: Subida = Expansión." },
            BREADTH: { def: "Amplitud del Mercado.", benchmark: "Ref: Participación amplia es saludable." },
            SPY: { def: "S&P 500 ETF.", benchmark: "Ref: Alcista = Risk On." },
            TNX: { def: "Rendimiento 10 Años.", benchmark: "Ref: >4.5% presiona valoraciones." },
            DXY: { def: "Índice Dólar.", benchmark: "Ref: >105 ajusta liquidez." },
            YIELD_SPREAD: { def: "Curva de Tipos.", benchmark: "Ref: Inversión = Recesión." }
        },
        legal_text: {
            t1: "OmniMetric ('The Ultimate Asset Hub') proporciona análisis macro cuantitativos solo con fines informativos. No constituye asesoramiento de inversión. Se prohíbe estrictamente el raspado (scraping) automatizado y el entrenamiento de IA sin licencia comercial. Al acceder a este sitio, acepta estos términos.",
            t2: "El rendimiento pasado no garantiza resultados futuros.",
            copyright: "Powered by OmniMetric Project"
        },
        regime: {
            bull: "Preferencia al Riesgo",
            neutral: "Régimen Neutral",
            bear: "Aversión al Riesgo",
            legend: "ALCISTA > 60 // BAJISTA < 40"
        },
        sections: {
            s1: "SECCIÓN I: VOLATILIDAD Y TEMOR",
            s2: "SECCIÓN II: CRÉDITO Y ANÁLISIS",
            s3: "SECCIÓN III: PUNTOS DE REFERENCIA"
        },
        chart: {
            trend: "Tendencia de Terminal de 60 Horas",
            sync: "Esperando sincronización de señal...",
            insight: "Información Propietaria",
            engine: "Motor Institucional v5.2.0",
            neutral_insight: "Esperando confluencia institucional.",
            bull_insight: "Las condiciones favorecen los activos de riesgo.",
            bear_insight: "Se recomienda una postura defensiva."
        },
        labels: {
            signal: "SEÑAL:",
            benchmark_mode: "MODO DE REFERENCIA",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "HISTORIAL DE CORRELACIÓN",
            back_to_terminal: "VOLVER AL TERMINAL",
            vix: "VIX (Vol. Variable)",
            move: "MOVE (Vol. Bonos)",
            privacy: "Privacidad",
            terms: "Términos",
            contact: "Contacto",
            cookie: {
                title: "Protocolo del Sistema",
                text: "El acceso a esta terminal requiere autorización de flujo de datos (Cookies).",
                subtext: "Protocolos de optimización inicializados.",
                accept: "[Inicializar]",
                decline: "[Denegar]"
            },
            hy_spread: "HY Spread (OAS)",
            nfci: "NFCI (Cond. Financieras)",
            yield_spread: "Spread 10Y-2Y",
            copper_gold: "Ratio Cobre/Oro",
            dxy: "Índice Dólar",
            tnx: "Rendimiento 10A",
            spy: "S&P 500 (SPY)",
            summary: "RESUMEN",
            stocks: "ACCIONES",
            crypto: "CRIPTO",
            forex: "DIVISAS",
            commodities: "MATERIAS PRIMAS",
            wiki: "MACRO WIKI",
            maxims: "MÁXIMAS",
            technical: "TÉCNICO",
            indicator: "Activos e Indicadores",
            tickers: {
                BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana",
                GOLD: "Oro", OIL: "Petróleo WTI", COPPER: "Cobre", NATGAS: "Gas Natural",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "Índice Dólar",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 Peso Igual", HYG: "Bonos Alto Rendimiento", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "Nikkei 225", HANGSENG: "Hang Seng", ASX200: "ASX 200",
                G_REIT: "REITs Globales", US_HOUSING: "Vivienda US", LOGISTICS: "REIT Logística", INFRA: "Infraestructura",
                HY_BOND: "Alto Rendimiento", IG_BOND: "Grado Inv.", TIPS: "TIPS (Infl.)", SHY: "Bonos Corto Plazo",
                BALTIC: "Baltic Dry", SHIPPING: "Transporte", AGRI: "Agro",
                SEMIS: "Semiconductores", DEFENSE: "Defensa", RARE_EARTH: "Tierras Raras", CYBER: "Ciberseguridad",
                SILVER: "Plata", USDCNY: "USD/CNY",
                VIX: "Volatilidad VIX", TNX: "Bono 10 Años", MOVE: "Índice MOVE", CRYPTO_SENTIMENT: "Índice Miedo/Codicia"
            },
            search_placeholder: "Buscar...",
            wiki_deep_dive: "Leer Análisis Detallado"
        },
        subpages: {
            about: {
                title: "SOBRE OMNIMETRIC",
                subtitle: "Terminal de Análisis Macro Institucional impulsado por IA para Inversores Minoristas",
                what_is_title: "¿Qué es OmniMetric?",
                what_is_content: "OmniMetric es un terminal de análisis macroeconómico impulsado por IA que transforma datos financieros de grado institucional en información útil para inversores minoristas. A diferencia de los sitios de noticias financieras tradicionales, procesamos datos de mercado en tiempo real mediante algoritmos sofisticados para generar nuestro Puntaje de Señal Macro Global (GMS), un índice de riesgo cuantitativo de 0 a 100.",
                diff_title: "Lo que nos hace diferentes",
                diff_card_1_title: "📊 Fuentes de Datos de Grado Institucional",
                diff_card_1_content: "Analizamos la liquidez neta (Balance de la Fed - TGA - RRP), el índice MOVE (volatilidad de bonos) y los diferenciales de crédito de alto rendimiento, métricas reservadas para fondos de cobertura.",
                diff_card_2_title: "🤖 Análisis en Tiempo Real con IA",
                diff_card_2_content: "Nuestros algoritmos procesan datos de FRED, CBOE, Yahoo Finance y otras fuentes cada 60 segundos, generando perspectivas de IA en varios idiomas con tecnología de Google Gemini.",
                diff_card_3_title: "🎯 Puntuación de Riesgo Cuantitativa",
                diff_card_3_content: "El puntaje GMS elimina opiniones subjetivas, proporcionando una evaluación objetiva y basada en datos de los niveles de riesgo del mercado global en tiempo real.",
                mission: "Nuestra Misión",
                mission_content_highlight: "Democratizar el acceso al análisis macro institucional visualizando cambios económicos estructurales que afectan a todos los inversores, desde traders hasta gestores de carteras.",
                tech: "Pila Tecnológica",
                tech_stack_frontend: "Frontend: Next.js 15 + TypeScript",
                tech_stack_backend: "Backend: Python + FastAPI",
                tech_stack_ai: "Motor IA: Google Gemini 2.0 Flash",
                tech_stack_pipeline: "Pipeline de Datos: APIs REST en tiempo real",
                data_sources_title: "Fuentes de Datos",
                data_sources_content: "Datos Económicos de la Reserva Federal (FRED), Índices de Volatilidad de CBOE, Yahoo Finance, Financial Modeling Prep, Alternative.me Crypto Fear & Greed",
                disclaimer_title: "Aviso Legal Importante",
                disclaimer_content: "OmniMetric se proporciona solo con fines informativos y no constituye asesoramiento de inversión. No garantizamos la exactitud. Las decisiones de inversión son responsabilidad exclusiva del usuario.",
                system_status: "Estado del Sistema: Operativo // Versión 2.0 // Actualizado",
                footer_note: "OmniMetric es un proyecto algorítmico 100% autónomo. No proporcionamos soporte individual ni consultoría de inversión."
            },
            legal: {
                title: "AVISO LEGAL Y CUMPLIMIENTO",
                disclaimer: "Aviso Legal",
                disclaimer_content: "OmniMetric es un agregador de información. La información proporcionada no constituye asesoramiento de inversión. Todos los datos se proporcionan 'tal cual'.",
                usage: "Términos de Uso",
                usage_content: "Queda estrictamente prohibido el raspado automatizado y el entrenamiento de IA sin licencia comercial. Al usar esta terminal, acepta estos términos legales."
            },
            archive: {
                title: "HISTORIAL DE CORRELACIÓN DE SEÑALES",
                desc: "Reproducción objetiva de los estados de los indicadores históricos y la señal algorítmica GMS correspondiente.",
                disclaimer: "ESTOS DATOS REPRESENTAN ÚNICAMENTE CORRELACIONES HISTÓRICAS Y NO SUGIEREN NI GARANTIZAN RESULTADOS DE INVERSIÓN FUTUROS."
            }
        }
    },
    HI: {
        status: {
            ai: MESSAGES.ai_status.HI,
            market: MESSAGES.market_data_status.HI
        },
        settings: {
            title: "मार्केट पल्स कॉन्फ़िगरेशन",
            subtitle: "अपने कार्यस्थान को अनुकूलित करें",
            theme_title: "थीम इंटरफ़ेस",
            dark_mode: "डार्क मोड",
            light_mode: "लाइट मोड",
            active_modules: "सक्रिय मॉड्यूल",
            reset: "रीसेट",
            disabled_modules: "अक्षम मॉड्यूल",
            last_updated: "अंतिम अद्यतन",
            system_operational: "सिस्टम चालू"
        },
        partner: {
            badge: "TradingView आधिकारिक भागीदार",
            title: "$15 का क्रेडिट प्राप्त करें: अपनी नई TradingView योजना पर बचत करें। OmniMetric के साथ विश्व स्तरीय चार्टिंग का अनुभव करें।",
            action: "विश्लेषण शुरू करें ($15 क्रेडिट प्राप्त करें)",
            disclaimer: "OmniMetric TradingView का आधिकारिक भागीदार है। लाभ हमारे रेफरल लिंक के माध्यम से लागू होते हैं। कृपया अपने जोखिम पर निवेश करें।",
            link_text: "TradingView पर विश्लेषण ($15 बोनस)"
        },
        titles: {
            risk_score: "बाज़ार व्यवस्था संकेतक (Market Regime)",
            insights: "मात्रात्मक मैक्रो अंतर्दृष्टि",
            risk_factors: "संस्थागत डेटा ग्रिड",
            legal: "कानूनी नोटिस",
            delayed: "1 घंटा विलंब",
            partner_ad: "संस्थागत भागीदार विज्ञापन",
            market_regime: "बाज़ार व्यवस्था",
            risk_preference: "ज़ोखिम वरीयता",
            institutional_analysis: "GMS मैक्रो एआई विश्लेषण (संस्थागत स्तर)",
            sponsored: "प्रायोजित",
            current_strategy: "वर्तमान रणनीति",
            upcoming_events: "आगामी जोखिम घटनाएँ",
            gms_score: "GMS स्कोर",
            breaking_news: "ताज़ा खबर (BREAKING)",
            live: "लाइव",
            breaking: "ताज़ा खबर",
            delayed_tick: "*15 मिनट देरी",
            methodology: "पद्धति (METHODOLOGY)",
            analysis_history: "विश्लेषण इतिहास",
            live_stream: "LIVE INTELLIGENCE STREAM",
            ai_disclaimer: "यह अंतर्दृष्टि AI द्वारा बहुआयामी विश्लेषण का परिणाम है और सामग्री की सटीकता की गारंटी नहीं देती है।"
        },
        methodology: {
            title: "GMS मात्रात्मक पद्धति",
            desc: "GMS स्कोर बाज़ार के 'डर', 'क्रेडिट तनाव' and 'मोमेंटम' को 0-100 के स्वामित्व वाले मात्रात्मक जोखिम सूचकांक में एकीकृत करता है।",
            zone_accumulate: "60-100: संचय (Risk On)",
            zone_accumulate_desc: "विस्तार चरण। इक्विटी, कमोडिटी और हाई यील्ड बॉन्ड में निवेश का सुझाव।",
            zone_neutral: "40-60: तटस्थ (Trendless)",
            zone_neutral_desc: "अस्थिरता संपीड़न। स्थिति समायोजन चरण।",
            zone_defensive: "0-40: रक्षात्मक (Risk Off)",
            zone_defensive_desc: "नकदी/ट्रेजरी की प्रधानता। घबराहट में बिक्री और क्रेडिट संकुचन पर नज़र रखें।",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
            scale_labels: {
                panic: "Panic (0)",
                neutral: "Neutral (50)",
                greed: "Greed (100)"
            },
            factors: { VOL: "अस्थिरता", MOM: "वेग", CRED: "क्रेडिट", SENT: "भावना", RATES: "दरें", BREADTH: "विस्तार", LIQ: "तरलता", INFL: "मुद्रास्फीति", EXP: "प्रत्याशा", MACRO: "मैक्रो" },
            factors_status: {
                LOW: "कम", HIGH: "उच्च",
                ELEVATED: "उन्नत", CRITICAL: "नाजुक",
                STABLE: "स्थिर", FEAR: "डर", CALM: "शांत",
                BULLISH: "तेजी", BEARISH: "मंदी",
                RISING: "बढ़ रहा", FALLING: "गिर रहा",
                NEUTRAL: "तटस्थ",
                GREED: "लालच",
                STRESS: "तनाव",
                HEALTHY: "स्वस्थ",
                SKEWED: "विषम",
                SAFE: "सुरक्षित",
                DANGER: "खतरा"
            }
        },
        modals: {
            ogv: {
                title: "ओम्नी ग्रेविटी वेक्टर (OGV)",
                func_title: "कार्य",
                func_desc: "प्रमुख संपत्तियों (स्टॉक, सोना, BTC, USD, बॉन्ड) की सापेक्ष स्थिति को 'आर्थिक विकास' और 'मुद्रास्फीति/कीमतों' से बने चार-चतुर्थांश मानचित्र पर प्रोजेक्ट करता है। बाजार की जड़ता और रुझानों की कल्पना करने के लिए 60-दिवसीय 'ट्रेल' खींचता है।",
                purpose_title: "उद्देश्य",
                purpose_desc: "एक नज़र में यह निर्धारित करना कि वर्तमान मैक्रो वातावरण 'गोल्डिलॉक्स', 'ओवरहीटिंग', 'स्टैगफ्लेशन' या 'मंदी' है। यह समझने के लिए एक कम्पास के रूप में कार्य करता है कि संपत्ति किस चतुर्थांश की ओर आकर्षित हो रही है (गुरुत्वाकर्षण)।"
            },
            owb: {
                title: "ओम्नी चेतावनी बीकन (OWB)",
                func_title: "कार्य",
                func_desc: "ट्रैफ़िक लाइट सिस्टम जो बाज़ार के तीन महत्वपूर्ण संकेतकों (यील्ड कर्व, क्रेडिट ज़ोखिम, अस्थिरता) की 24 घंटे निगरानी करता है। विसंगतियों का पता चलने पर रंग 'DANGER / STRESS' में बदल जाता है।",
                purpose_title: "उद्देश्य",
                purpose_desc: "प्रणालीगत जोखिमों का जल्द पता लगाना। यदि बीकन 'लाल' दिखा रहे हैं, तो इसका मतलब है कि पृष्ठभूमि में झटके सुलग रहे हैं, भले ही व्यक्तिगत स्टॉक की कीमतें स्थिर लगें।"
            },
            otg: {
                title: "ओम्नी थर्मल ग्रिड (OTG)",
                func_title: "कार्य",
                func_desc: "GMS स्कोर के आधार पर टेक, एनर्जी, फाइनेंस और क्रिप्टो जैसे क्षेत्रों की 'गर्मी' का हीटमैप। रीयल-टाइम में दिखाता है कि पूंजी कहाँ केंद्रित हो रही है।",
                purpose_title: "उद्देश्य",
                purpose_desc: "सेक्टर रोटेशन की लहरों को पकड़ना। जबकि OGV 'समुद्री धारा' दिखाता है, OTG पहचानता है कि 'मछलियों के झुंड' (पूंजी प्रवाह) कहाँ सक्रिय हैं।"
            }
        },
        ogv_guide: {
            title: "त्वरित व्याख्या गाइड",
            overheating: "OVERHEATING",
            overheating_pos: "(ऊपर दाएं)",
            overheating_desc: "मजबूत विकास लेकिन उच्च मुद्रास्फीति दबाव। 'ओवरहीटिंग' स्थिति। मौद्रिक सख्ती के कारण समायोजन जोखिमों से सावधान रहें।",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(नीचे दाएं)",
            goldilocks_desc: "मध्यम विकास और स्थिर कीमतें। एक 'बिल्कुल सही' स्थिति जहां मौद्रिक ढील जारी रहती है। संपत्ति मूल्य वृद्धि की उम्मीद में रिस्क-ऑन चरण।",
            recession: "RECESSION",
            recession_pos: "(नीचे बाएं)",
            recession_desc: "आर्थिक मंदी का चरण। विकास धीमा हो जाता है और ब्याज दरें गिर जाती हैं। 'कूलिंग' की अवधि जहां सुरक्षा (बॉन्ड) की ओर पलायन बढ़ता है।",
            stagflation: "STAGFLATION",
            stagflation_pos: "(ऊपर बाएं)",
            stagflation_desc: "ठहरा हुआ अर्थतंत्र और लगातार ऊंची कीमतें। सबसे कठिन चरण जहां संपत्ति की रक्षा प्राथमिकता है। मुद्रास्फीति हेज संपत्तियों को प्राथमिकता दी जाती है।",
            footer_note: "*'प्रकाश पथ' की लंबाई बाजार की जड़ता का सुझाव देती है; डोट घनत्व प्रवृत्ति हिचकिचाहट का सुझाव देता है।"
        },
        strategy: {
            accumulate: "संचय (ACCUMULATE)",
            neutral: "तटस्थ (NEUTRAL)",
            defensive: "रक्षात्मक (DEFENSIVE)"
        },
        momentum: {
            bottoming: "बॉटमिंग आउट (BOTTOMING)",
            peaking: "पीकिंग (PEAKING)",
            rising: "बढ़ रहा (RISING)",
            falling: "गिर रहा (FALLING)",
            stable: "स्थिर (STABLE)"
        },
        events: {
            cpi: "CPI मुद्रास्फीति डेटा",
            fomc: "FOMC दर निर्णय",
            nfp: "नॉन-फार्म पेरोल",
            high: "उच्च प्रभाव",
            critical: "महत्वपूर्ण",
            tue: "मंगल",
            wed: "बुध",
            fri: "शुक्र",
            est: "EST"
        },
        attribution: {
            src: "स्रोत: FRED/CBOE • अद्यतन: लाइव"
        },
        terms: {
            VIX: { def: "अस्थिरता सूचकांक।", benchmark: "संदर्भ: >20 सावधानी।" },
            MOVE: { def: "बॉन्ड बाज़ार अस्थिरता।", benchmark: "संदर्भ: >120 प्रणालीगत तनाव।" },
            NFCI: { def: "वित्तीय स्थिति सूचकांक।", benchmark: "संदर्भ: सकारात्मक = तंग।" },
            HY_SPREAD: { def: "हाई यील्ड स्प्रेड।", benchmark: "संदर्भ: >5% क्रेडिट तनाव।" },
            COPPER_GOLD: { def: "तांबा/सोना अनुपात।", benchmark: "संदर्भ: बढ़ना = विस्तार।" },
            BREADTH: { def: "बाज़ार की चौड़ाई (RSP vs SPY)।", benchmark: "संदर्भ: व्यापक भागीदारी स्वस्थ है।" },
            SPY: { def: "S&P 500 ETF।", benchmark: "संदर्भ: अपट्रेंड = जोखिम चालू।" },
            TNX: { def: "10-वर्षीय ट्रेजरी यील्ड।", benchmark: "संदर्भ: >4.5% मूल्यांकन पर दबाव।" },
            DXY: { def: "अमेरिकी डॉलर सूचकांक।", benchmark: "संदर्भ: >105 तरलता को कसता है।" },
            YIELD_SPREAD: { def: "यील्ड वक्र (10Y-2Y)।", benchmark: "संदर्भ: व्युत्क्रमण = मंदी।" }
        },
        legal_text: {
            t1: "OmniMetric ('The Ultimate Asset Hub') केवल सूचनात्मक उद्देश्यों के लिए मात्रात्मक मैक्रो अंतर्दृष्टि प्रदान करता है। निवेश सलाह नहीं है।",
            t2: "पिछला प्रदर्शन भविष्य के परिणामों का संकेत नहीं है।",
            copyright: "Powered by OmniMetric Project"
        },
        regime: {
            bull: "ज़ोखिम वरीयता",
            neutral: "तटस्थ व्यवस्था",
            bear: "ज़ोखिम से बचाव",
            legend: "तेजी > 60 // मंदी < 40"
        },
        sections: {
            s1: "खंड I: बाज़ार अस्थिरता",
            s2: "खंड II: क्रेडिट और विश्लेषण",
            s3: "खंड III: संदर्भ बेंचमार्क"
        },
        chart: {
            trend: "60-घंटे टर्मिनल रुझान",
            sync: "सिग्नल सिंक की प्रतीक्षा है...",
            insight: "स्वामित्व अंतर्दृष्टि",
            engine: "संस्थागत इंजन v5.2.0",
            neutral_insight: "संस्थागत संगम की प्रतीक्षा है।",
            bull_insight: "परिस्थितियाँ जोखिम वाली संपत्तियों के अनुकूल हैं।",
            bear_insight: "रक्षात्मक मुद्रा की सलाह दी जाती है।"
        },
        labels: {
            signal: "संकेत:",
            benchmark_mode: "बेंचमार्क मोड",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "सहसंबंध इतिहास (Correlation History)",
            back_to_terminal: "टर्मिनल पर वापस",
            vix: "VIX (Equity Vol)",
            move: "MOVE (Bond Vol)",
            privacy: "गोपनीयता",
            terms: "शर्तें",
            contact: "संपर्क",
            cookie: {
                title: "सिस्टम प्रोटोकॉल",
                text: "इस टर्मिनल तक पहुँचने के लिए डेटा स्ट्रीम प्राधिकरण (कुकीज़) की आवश्यकता है।",
                subtext: "अनुकूलन प्रोटोकॉल आरंभ किए गए।",
                accept: "[आरंभ करें]",
                decline: "[अस्वीकार करें]"
            },
            hy_spread: "HY Spread (OAS)",
            nfci: "NFCI (Cond.)",
            yield_spread: "10Y-2Y Spread",
            copper_gold: "Copper/Gold",
            dxy: "Dollar Index",
            tnx: "US 10Y Yield",
            spy: "S&P 500 (SPY)",
            summary: "सार",
            stocks: "शेयर बाज़ार",
            crypto: "क्रिप्टो",
            forex: "विदेशी मुद्रा",
            commodities: "कमोडिटीज",
            wiki: "मैक्रो ज्ञान",
            maxims: "निवेश मंत्र",
            technical: "तकनीकी",
            indicator: "संपत्ति और संकेतक",
            tickers: {
                BTC: "बिटकॉइन", ETH: "एथेरियम", SOL: "सोलाना",
                GOLD: "सोना (Gold)", OIL: "कच्चा तेल", COPPER: "तांबा", NATGAS: "प्राकृतिक गैस",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "डॉलर सूचकांक",
                SPY: "S&P 500", QQQ: "नैस्डैक 100", IWM: "रसेल 2000", RSP: "S&P 500 EW", HYG: "High Yield Bond", NIFTY: "निफ्टी 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "Nikkei 225", HANGSENG: "Hang Seng", ASX200: "ASX 200",
                G_REIT: "Global REIT", US_HOUSING: "अमेरिकी आवास", LOGISTICS: "Logistics REIT", INFRA: "बुनियादी ढांचा",
                HY_BOND: "उच्च उपज", IG_BOND: "Inv Grade", TIPS: "TIPS", SHY: "लघु सरकारी",
                BALTIC: "Baltic Dry", SHIPPING: "शिपिंग", AGRI: "कृषि",
                SEMIS: "सेमीकंडक्टर", DEFENSE: "रक्षा", RARE_EARTH: "दुर्लभ पृथ्वी", CYBER: "साइबर",
                SILVER: "चांदी", USDCNY: "USD/CNY",
                VIX: "VIX सूचकांक", TNX: "US 10Y Yield", MOVE: "MOVE Index", CRYPTO_SENTIMENT: "Crypto Fear & Greed"
            },
            search_placeholder: "खोज...",
            wiki_deep_dive: "विस्तृत विश्लेषण पढ़ें"
        },
        subpages: {
            about: {
                title: "OMNIMETRIC के बारे में",
                subtitle: "खुदरा निवेशकों के लिए AI-संचालित संस्थागत मैक्रो विश्लेषण टर्मिनल",
                what_is_title: "OmniMetric क्या है?",
                what_is_content: "OmniMetric एक AI-संचालित मैक्रो आर्थिक विश्लेषण टर्मिनल है जो संस्थागत स्तर के वित्तीय डेटा को खुदरा निवेशकों के लिए उपयोगी अंतर्दृष्टि में बदल देता है। पारंपरिक वित्तीय समाचार साइटों के विपरीत, हम अपने मालिकाना ग्लोबल मैक्रो सिग्नल (GMS) स्कोर को उत्पन्न करने के लिए परिष्कृत एल्गोरिदम के माध्यम से रीयल-टाइम मार्केट डेटा संसाधित करते हैं—0 से 100 तक का एक मात्रात्मक जोखिम सूचकांक।",
                diff_title: "हमें क्या अलग बनाता है",
                diff_card_1_title: "📊 संस्थागत स्तर के डेटा स्रोत",
                diff_card_1_content: "हम नेट लिक्विडिटी (फेडरल रिजर्व बैलेंस शीट - TGA - RRP), MOVE इंडेक्स (बॉन्ड वोलैटिलिटी), और हाई यील्ड क्रेडिट स्प्रेड का विश्लेषण करते हैं।",
                diff_card_2_title: "🤖 AI-संचालित रीयल-टाइम विश्लेषण",
                diff_card_2_content: "हमारे एल्गोरिदम हर 60 सेकंड में FRED, CBOE और Yahoo Finance के डेटा को संसाधित करते हैं, जिससे Google Gemini द्वारा संचालित बहुभाषी AI अंतर्दृष्टि उत्पन्न होती है।",
                diff_card_3_title: "🎯 मात्रात्मक जोखिम स्कोरिंग",
                diff_card_3_content: "GMS स्कोर व्यक्तिपरक राय को समाप्त करता है, जो वास्तविक समय में वैश्विक बाजार जोखिम स्तरों का डेटा-संचालित, वस्तुनिष्ठ मूल्यांकन प्रदान करता है।",
                mission: "हमारा लक्ष्य",
                mission_content_highlight: "संस्थागत स्तर के मैक्रो विश्लेषण तक पहुंच को लोकतांत्रिक बनाने के लिए संरचनात्मक आर्थिक परिवर्तनों की कल्पना करना जो सभी निवेशकों को प्रभावित करते हैं।",
                tech: "तकनीकी स्टैक",
                tech_stack_frontend: "फ्रंटएंड: Next.js 15 + TypeScript",
                tech_stack_backend: "बैकएंड: Python + FastAPI",
                tech_stack_ai: "AI इंजन: Google Gemini 2.0 Flash",
                tech_stack_pipeline: "डेटा पाइपलाइन: रीयल-टाइम REST API",
                data_sources_title: "डेटा स्रोत",
                data_sources_content: "फेडरल रिजर्व इकोनॉमिक डेटा (FRED), CBOE मार्केट वोलैटिलिटी इंडेक्स, Yahoo Finance, Financial Modeling Prep",
                disclaimer_title: "महत्वपूर्ण अस्वीकरण",
                disclaimer_content: "OmniMetric केवल सूचनात्मक उद्देश्यों के लिए प्रदान किया जाता है। सभी डेटा सार्वजनिक API से प्राप्त किया जाता है। हम सटीकता की गारंटी नहीं देते हैं।",
                system_status: "सिस्टम स्थिति: चालू // संस्करण 2.0 // अद्यतन",
                footer_note: "OmniMetric 100% स्वायत्त है। हम व्यक्तिगत सहायता या निवेश परामर्श प्रदान नहीं करते हैं।"
            },
            legal: {
                title: "कानूनी नोटिस",
                disclaimer: "अस्वीकरण",
                disclaimer_content: "OmniMetric एक सूचना एग्रीगेटर है। निवेश सलाह नहीं है।",
                usage: "उपयोग की शर्तें",
                usage_content: "अनधिकृत स्क्रैपिंग निषिद्ध है।"
            },
            archive: {
                title: "सिग्नल सहसंबंध इतिहास",
                desc: "ऐतिहासिक संकेतक राज्यों और संबंधित GMS एल्गोरिथम सिग्नल का वस्तुनिष्ठ रीप्ले।",
                disclaimer: "यह डेटा केवल ऐतिहासिक सहसंबंधों का प्रतिनिधित्व करता है और भविष्य के निवेश परिणामों का सुझाव या गारंटी नहीं देता है।"
            }
        }
    },
    ID: {
        status: {
            ai: MESSAGES.ai_status.ID,
            market: MESSAGES.market_data_status.ID
        },
        settings: {
            title: "Konfigurasi Market Pulse",
            subtitle: "SESUAIKAN RUANG KERJA ANDA",
            theme_title: "Antarmuka Tema",
            dark_mode: "MODE GELAP",
            light_mode: "MODE TERANG",
            active_modules: "Modul Aktif",
            reset: "RESET",
            disabled_modules: "Modul Dinonaktifkan",
            last_updated: "Terakhir Diperbarui",
            system_operational: "SISTEM BEROPERASI"
        },
        partner: {
            badge: "Mitra Resmi TradingView",
            title: "Dapatkan Kredit $15: Hemat pada paket TradingView baru Anda. Nikmati charting kelas dunia mulai dari OmniMetric.",
            action: "Mulai Analisis (Dapatkan $15)",
            disclaimer: "OmniMetric adalah mitra resmi TradingView. Manfaat berlaku melalui tautan referensi kami. Harap berinvestasi dengan risiko Anda sendiri.",
            link_text: "Analisis di TradingView (Bonus $15)"
        },
        titles: {
            risk_score: "Indikator Rezim Pasar",
            insights: "Wawasan Makro Kuantitatif",
            risk_factors: "Grid Data Institusional",
            legal: "PEMBERITAHUAN HUKUM",
            delayed: "Tunda 1J",
            partner_ad: "Penempatan Mitra Institusional",
            market_regime: "REZIM PASAR",
            risk_preference: "PREFERENSI RISIKO",
            institutional_analysis: "Analisis AI Makro GMS (Tingkat Institusional)",
            sponsored: "DISPONSORI",
            current_strategy: "STRATEGI SAAT INI",
            upcoming_events: "ACARA RISIKO MENDATANG",
            gms_score: "SKOR GMS",
            breaking_news: "BERITA TERKINI",
            live: "LANGSUNG",
            breaking: "BERITA TERKINI",
            delayed_tick: "*Tunda 15m",
            methodology: "METODOLOGI",
            analysis_history: "Riwayat Analisis",
            live_stream: "ALIRAN INTELIJEN LANGSUNG",
            ai_disclaimer: "Wawasan ini adalah hasil analisis multifaset oleh AI dan tidak menjamin keakuratan isinya."
        },
        methodology: {
            title: "METODOLOGI KUANTITATIF GMS",
            desc: "Skor GMS mengintegrasikan 'Ketakutan', 'Stres Kredit', dan 'Momentum' pasar ke dalam indeks risiko kuantitatif 0-100.",
            zone_accumulate: "60-100: AKUMULASI (Risk On)",
            zone_accumulate_desc: "Fase ekspansi. Arus masuk ke Saham, Komoditas, dan Obligasi High Yield disarankan.",
            zone_neutral: "40-60: NETRAL (Tanpa Tren)",
            zone_neutral_desc: "Kompresi volatilitas. Fase penyesuaian posisi.",
            zone_defensive: "0-40: DEFENSIF (Risk Off)",
            zone_defensive_desc: "Dominasi Uang Tunai/Obligasi. Waspadai penjualan panik dan kontraksi kredit.",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
            scale_labels: {
                panic: "Panic (0)",
                neutral: "Neutral (50)",
                greed: "Greed (100)"
            },
            factors: { VOL: "VOL", MOM: "MOM", CRED: "KRED", SENT: "SENT", RATES: "BUNGA", BREADTH: "LUAS", LIQ: "LIKUID", INFL: "INFL", EXP: "EXP", MACRO: "MAKRO" },
            factors_status: {
                LOW: "RNDH", HIGH: "TGGI",
                ELEVATED: "NAIK", CRITICAL: "KRITS",
                STABLE: "STBL", FEAR: "TAKUT", CALM: "TENANG",
                BULLISH: "NAIK", BEARISH: "TURUN",
                RISING: "NAIK", FALLING: "TURUN",
                NEUTRAL: "NETRAL",
                GREED: "RAKUS",
                STRESS: "STRES",
                HEALTHY: "SEHAT",
                SKEWED: "MIRING",
                SAFE: "AMAN",
                DANGER: "BAHAYA"
            }
        },
        modals: {
            ogv: {
                title: "Omni Gravity Vector (OGV)",
                func_title: "FUNGSI",
                func_desc: "Memproyeksikan posisi relatif aset utama (Saham, Emas, BTC, USD, Obligasi) ke dalam peta empat kuadran (Pertumbuhan vs Inflasi). Menggambar 'Trail' 60 hari untuk memvisualisasikan inersia.",
                purpose_title: "TUJUAN",
                purpose_desc: "Menentukan apakah lingkungan makro saat ini adalah 'Goldilocks', 'Overheating', 'Stagflation', atau 'Recession'. Bertindak sebagai kompas untuk melihat ke mana aset gravitasi."
            },
            owb: {
                title: "Omni Warning Beacons (OWB)",
                func_title: "FUNGSI",
                func_desc: "Sistem lampu lalu lintas yang memantau 3 indikator makro kritis (Yield Curve, Risiko Kredit, Volatilitas). Berubah menjadi 'DANGER / STRESS' saat ada anomali.",
                purpose_title: "TUJUAN",
                purpose_desc: "Deteksi dini risiko sistemik. Jika beacon 'Merah', berarti ada guncangan di latar belakang meskipun harga saham stabil."
            },
            otg: {
                title: "Omni Thermal Grid (OTG)",
                func_title: "FUNGSI",
                func_desc: "Heatmap 'panas' di sektor-sektor seperti Teknologi, Energi, Keuangan, dan Kripto berdasarkan GMS Score. Menunjukkan konsentrasi kapital secara real-time.",
                purpose_title: "TUJUAN",
                purpose_desc: "Menangkap gelombang rotasi sektor. OGV menunjukkan 'arus laut', OTG mengidentifikasi 'kelompok ikan' yang aktif."
            }
        },
        ogv_guide: {
            title: "Panduan Interpretasi Cepat",
            overheating: "OVERHEATING",
            overheating_pos: "(Kanan Atas)",
            overheating_desc: "Pertumbuhan kuat tetapi tekanan inflasi tinggi. Status 'Overheating'. Waspadai risiko penyesuaian karena pengetatan moneter.",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(Kanan Bawah)",
            goldilocks_desc: "Pertumbuhan moderat dan harga stabil. Status 'just right' di mana pelonggaran moneter berlanjut. Fase risk-on mengharapkan kenaikan nilai aset.",
            recession: "RECESSION",
            recession_pos: "(Kiri Bawah)",
            recession_desc: "Fase penurunan ekonomi. Pertumbuhan melambat dan suku bunga turun. Periode 'pendinginan' di mana pelarian ke aset aman (obligasi) meningkat.",
            stagflation: "STAGFLATION",
            stagflation_pos: "(Kiri Atas)",
            stagflation_desc: "Ekonomi stagnan dan harga tinggi yang terus-menerus. Fase tersulit di mana pertahanan aset adalah prioritas. Aset lindung nilai inflasi diunggulkan.",
            footer_note: "*Panjang 'Jalur Cahaya' menunjukkan inersia pasar; kepadatan titik menunjukkan keraguan tren."
        },
        strategy: {
            accumulate: "AKUMULASI",
            neutral: "NETRAL",
            defensive: "DEFENSIF"
        },
        momentum: {
            bottoming: "BOTTOMING OUT",
            peaking: "PEAKING",
            rising: "NAIK (RISING)",
            falling: "TURUN (FALLING)",
            stable: "STABIL (STABLE)"
        },
        events: {
            cpi: "DATA INFLASI CPI",
            fomc: "KEPUTUSAN SUKU BUNGA FOMC",
            nfp: "NON-FARM PAYROLLS",
            high: "DAMPAK TINGGI",
            critical: "KRITIS",
            tue: "SEL",
            wed: "RAB",
            fri: "JUM",
            est: "EST"
        },
        attribution: {
            src: "SUMBER: FRED/CBOE • PEMBARUAN: LANGSUNG"
        },
        terms: {
            VIX: { def: "Indeks Volatilitas.", benchmark: "Ref: >20 Waspada." },
            MOVE: { def: "Volatilitas Obligasi.", benchmark: "Ref: >120 Stres sistemik." },
            NFCI: { def: "Indeks Kondisi Keuangan.", benchmark: "Ref: Positif = Ketat." },
            HY_SPREAD: { def: "Spread High Yield.", benchmark: "Ref: >5% Stres kredit." },
            COPPER_GOLD: { def: "Rasio Tembaga/Emas.", benchmark: "Ref: Naik = Ekspansi." },
            BREADTH: { def: "Luas Pasar.", benchmark: "Ref: Partisipasi luas itu sehat." },
            SPY: { def: "ETF S&P 500.", benchmark: "Ref: Tren naik = Risk On." },
            TNX: { def: "Imbal Hasil 10 Tahun.", benchmark: "Ref: >4.5% menekan valuasi." },
            DXY: { def: "Indeks Dolar AS.", benchmark: "Ref: >105 memperketat likuiditas." },
            YIELD_SPREAD: { def: "Kurva Imbal Hasil.", benchmark: "Ref: Inversi = Resesi." }
        },
        legal_text: {
            t1: "OmniMetric ('The Ultimate Asset Hub') menyediakan wawasan makro kuantitatif hanya untuk tujuan informasi. Tidak merupakan saran investasi.",
            t2: "Kinerja masa lalu bukan indikasi hasil masa depan.",
            copyright: "Powered by OmniMetric Project"
        },
        regime: {
            bull: "Preferensi Risiko",
            neutral: "Rezim Netral",
            bear: "Penghindaran Risiko",
            legend: "BULL > 60 // BEAR < 40"
        },
        sections: {
            s1: "BAGIAN I: VOLATILITAS PASAR",
            s2: "BAGIAN II: KREDIT STRUKTURAL",
            s3: "BAGIAN III: TOLOK UKUR REFERENSI"
        },
        chart: {
            trend: "Tren Terminal 60 Jam",
            sync: "Menunggu Sinkronisasi Sinyal...",
            insight: "Wawasan Kepemilikan",
            engine: "Mesin Institusional v5.2.0",
            neutral_insight: "Menunggu pertemuan institusional.",
            bull_insight: "Kondisi menguntungkan aset risiko.",
            bear_insight: "Sikap defensif disarankan."
        },
        labels: {
            signal: "SINYAL:",
            benchmark_mode: "MODE TOLOK UKUR",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "RIWAYAT KORELASI",
            back_to_terminal: "KEMBALI KE TERMINAL",
            vix: "VIX (Vol Ekuitas)",
            move: "MOVE (Vol Obligasi)",
            privacy: "Privasi",
            terms: "Ketentuan",
            contact: "Kontak",
            cookie: {
                title: "Protokol Sistem",
                text: "Mengakses terminal ini memerlukan otorisasi aliran data (Cookie).",
                subtext: "Protokol optimasi diinisialisasi.",
                accept: "[Inisialisasi]",
                decline: "[Tolak]"
            },
            hy_spread: "Spread HY (OAS)",
            nfci: "NFCI (Kondisi)",
            yield_spread: "Spread 10Y-2Y",
            copper_gold: "Tembaga/Emas",
            dxy: "Indeks Dolar",
            tnx: "Yield AS 10Y",
            spy: "S&P 500 (SPY)",
            summary: "RANGKUMAN",
            stocks: "SAHAM",
            crypto: "KRIPTO",
            forex: "VALAS",
            commodities: "KOMODITAS",
            wiki: "WIKI MAKRO",


            maxims: "PETUAH EMAS",
            technical: "TEKNIS",
            indicator: "Aset & Indikator",
            tickers: {
                BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana",
                GOLD: "Emas", OIL: "Minyak WTI", COPPER: "Tembaga", NATGAS: "Gas Alam",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "Indeks Dolar",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 Equal Weight", HYG: "High Yield Bond", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "Nikkei 225", HANGSENG: "Hang Seng", ASX200: "ASX 200",
                G_REIT: "Global REIT", US_HOUSING: "Properti US", LOGISTICS: "Logistik REIT", INFRA: "Infrastruktur",
                HY_BOND: "Imbal Hasil Tinggi", IG_BOND: "Inv Grade", TIPS: "TIPS", SHY: "Obligasi Pendek",
                BALTIC: "Baltic Dry", SHIPPING: "Pelayaran", AGRI: "Agri",
                SEMIS: "Semikonduktor", DEFENSE: "Pertahanan", RARE_EARTH: "Rare Earth", CYBER: "Siber",
                SILVER: "Perak", USDCNY: "USD/CNY",
                VIX: "Volatilitas VIX", TNX: "Yield AS 10T", MOVE: "Indeks MOVE", CRYPTO_SENTIMENT: "Crypto Fear & Greed"
            },
            search_placeholder: "Cari...",
            wiki_deep_dive: "Baca Analisis Mendalam"
        },
        subpages: {
            about: {
                title: "TENTANG OMNIMETRIC",
                subtitle: "Terminal Analisis Makro Institusional Berbasis AI untuk Investor Ritel",
                what_is_title: "Apa itu OmniMetric?",
                what_is_content: "OmniMetric adalah terminal analisis ekonomi makro berbasis AI yang mengubah data keuangan kelas institusional menjadi wawasan yang dapat ditindaklanjuti bagi investor ritel. Berbeda dengan situs berita keuangan tradisional, kami memproses data pasar waktu nyata melalui algoritma canggih untuk menghasilkan Skor Global Macro Signal (GMS) kami—indeks risiko kuantitatif dari 0 hingga 100.",
                diff_title: "Apa yang Membuat Kami Berbeda",
                diff_card_1_title: "📊 Sumber Data Kelas Institusional",
                diff_card_1_content: "Kami menganalisis Likuiditas Bersih (Neraca Federal Reserve - TGA - RRP), Indeks MOVE, dan Spread Kredit High Yield.",
                diff_card_2_title: "🤖 Analisis Waktu Nyata Berbasis AI",
                diff_card_2_content: "Algoritma kami memproses data dari FRED, CBOE, dan Yahoo Finance setiap 60 detik, menghasilkan wawasan AI multi-bahasa yang didukung oleh Google Gemini.",
                diff_card_3_title: "🎯 Penilaian Risiko Kuantitatif",
                diff_card_3_content: "Skor GMS menghilangkan opini subjektif, memberikan penilaian objektif berbasis data tentang tingkat risiko pasar global secara real-time.",
                mission: "Misi Kami",
                mission_content_highlight: "Mendemokratisasi akses ke analisis makro institusional dengan memvisualisasikan pergeseran ekonomi struktural yang berdampak pada semua investor.",
                tech: "Stack Teknologi",
                tech_stack_frontend: "Frontend: Next.js 15 + TypeScript",
                tech_stack_backend: "Backend: Python + FastAPI",
                tech_stack_ai: "AI Engine: Google Gemini 2.0 Flash",
                tech_stack_pipeline: "Data Pipeline: API REST Real-time",
                data_sources_title: "Sumber Data",
                data_sources_content: "Federal Reserve Economic Data (FRED), Indeks Volatilitas CBOE, Yahoo Finance, Financial Modeling Prep",
                disclaimer_title: "Penafian Penting",
                disclaimer_content: "OmniMetric disediakan hanya untuk tujuan informasi. Semua data bersumber dari API publik. Kami tidak menjamin keakuratan.",
                system_status: "Status Sistem: Beroperasi // Versi 2.0 // Diperbarui",
                footer_note: "OmniMetric 100% otonom. Kami tidak menyediakan dukungan individu atau konsultasi investasi."
            },
            legal: {
                title: "PEMBERITAHUAN HUKUM",
                disclaimer: "Penafian",
                disclaimer_content: "OmniMetric adalah agregator informasi. Bukan saran investasi.",
                usage: "Syarat Penggunaan",
                usage_content: "Scraping tidak sah dilarang."
            },
            archive: {
                title: "RIWAYAT KORELASI SINYAL",
                desc: "Pemutaran ulang objektif dari status indikator historis dan sinyal algoritmik GMS yang sesuai.",
                disclaimer: "DATA INI HANYA MEWAKILI KORELASI HISTORIS DAN TIDAK MENYARANKAN ATAU MENJAMIN HASIL INVESTASI DI MASA DEPAN."
            }
        }
    },
    AR: {
        dir: "rtl",
        status: {
            ai: MESSAGES.ai_status.AR,
            market: MESSAGES.market_data_status.AR
        },
        settings: {
            title: "تكوين نبض السوق",
            subtitle: "تخصيص مساحة العمل الخاصة بك",
            theme_title: "واجهة الموضوع",
            dark_mode: "الوضع الداكن",
            light_mode: "الوضع الفاتح",
            active_modules: "الوحدات النشطة",
            reset: "إعادة ضبط",
            disabled_modules: "الوحدات المعطلة",
            last_updated: "آخر تحديث",
            system_operational: "النظام يعمل"
        },
        partner: {
            badge: "شريك رسمي لـ TradingView",
            title: "!OmniMetric الجديدة. جرب الرسوم البيانية عالمية المستوى من TradingView واحصل على رصيد 15 دولارًا؛ وفر في خطتك.",
            action: "ابدأ التحليل (احصل على 15 دولارًا)",
            disclaimer: "OmniMetric هو شريك رسمي لـ TradingView. تطبق المزايا عبر روابط الإحالة الخاصة بنا. يرجى الاستثمار على مسؤوليتك الخاصة.",
            link_text: "تحليل على TradingView (مكافأة 15 دولارًا)"
        },
        titles: {
            risk_score: "مؤشر نظام السوق",
            live_stream: "الذكاء المباشر",
            insights: "رؤى كمية كلية",
            risk_factors: "شبكة البيانات المؤسسية",
            legal: "إشعار قانوني",
            delayed: "تأخير 1 ساعة",
            partner_ad: "إعلان شريك مؤسسي",
            market_regime: "نظام السوق",
            risk_preference: "تفضيل المخاطر",
            institutional_analysis: "تحليل GMS الكلي بالذكاء الاصطناعي (مستوى مؤسسي)",
            sponsored: "برعاية",
            current_strategy: "الاستراتيجية الحالية",
            upcoming_events: "أحداث المخاطر القادمة",
            gms_score: "درجة GMS",
            breaking_news: "أخبار عاجلة",
            live: "مباشر",
            breaking: "عاجل",
            delayed_tick: "*تأخير 15د",
            methodology: "المنهجية (METHODOLOGY)",
            analysis_history: "سجل التحليل",
            ai_disclaimer: "هذه الرؤية هي نتيجة تحليل متعدد الأوجه بواسطة الذكاء الاصطناعي ولا تضمن دقة محتواها."
        },
        methodology: {
            title: "منهجية GMS الكمية",
            desc: "تدمج درجة GMS 'الخوف' و 'الضغط الائتماني' و 'الزخم' في السوق في مؤشر مخاطر كمي خاص من 0-100.",
            zone_accumulate: "60-100: تجميع (مخاطر)",
            zone_accumulate_desc: "مرحلة التوسع. يُقترح تدفق الأموال إلى الأسهم والسلع والسندات ذات العائد المرتفع.",
            zone_neutral: "40-60: محايد (بلا اتجاه)",
            zone_neutral_desc: "ضغط التقلبات. مرحلة تعديل المركز.",
            zone_defensive: "0-40: دفاعي (تجنب المخاطر)",
            zone_defensive_desc: "هيمنة النقد/السندات. راقب بيع الذعر وتقلص الائتمان.",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
            scale_labels: {
                panic: "Panic (0)",
                neutral: "Neutral (50)",
                greed: "Greed (100)"
            },
            factors: { VOL: "تقلب", MOM: "زخم", CRED: "ائتمان", SENT: "شعور", RATES: "فائدة", BREADTH: "اتساع", LIQ: "سيولة", INFL: "تضخم", EXP: "توقع", MACRO: "كلي" },
            factors_status: {
                LOW: "منخفض", HIGH: "مرتفع",
                ELEVATED: "مرتفع", CRITICAL: "حرج",
                STABLE: "مستقر", FEAR: "خوف", CALM: "هدوء",
                BULLISH: "صعودي", BEARISH: "هبوطي",
                RISING: "صاعد", FALLING: "هابط",
                NEUTRAL: "محايد",
                GREED: "جشع",
                STRESS: "ضغط",
                HEALTHY: "صحي",
                SKEWED: "منحرف",
                SAFE: "آمن",
                DANGER: "خطر"
            }
        },
        modals: {
            ogv: {
                title: "Omni Gravity Vector (OGV)",
                func_title: "الوظيفة",
                func_desc: "يسقط الموضع النسبي للأصول الرئيسية (الأسهم، الذهب، BTC، USD، السندات) على خريطة رباعية (النمو مقابل التضخم). يرسم 'أثراً' لمدة 60 يوماً لتصور العطالة.",
                purpose_title: "الغرض",
                purpose_desc: "تحديد ما إذا كانت البيئة الكلية الحالية هي 'Goldilocks' أو 'Surchauffe' أو 'Stagflation' أو 'Recession'. يعمل كبوصلة لمعرفة الاتجاه الذي تنجذب إليه الأصول."
            },
            owb: {
                title: "Omni Warning Beacons (OWB)",
                func_title: "الوظيفة",
                func_desc: "نظام إشارات مرور يراقب 3 مؤشرات كلية حرجة (منحنى العائد، الائتمان، التقلب). يتغير إلى 'DANGER / STRESS' عند حدوث خلل.",
                purpose_title: "الغرض",
                purpose_desc: "الكشف المبكر عن المخاطر النظامية. إذا كانت التنبيهات باللون الأحمر، فهذا يعني وجود صدمات في الخلفية."
            },
            otg: {
                title: "Omni Thermal Grid (OTG)",
                func_title: "الوظيفة",
                func_desc: "خريطة حرارية للقطاعات بناءً على درجة GMS. توضح في الوقت الفعلي أماكن تركيز رأس المال.",
                purpose_title: "الغرض",
                purpose_desc: "التقاط موجات دوران القطاع. يوضح OGV 'تيار المحيط'، بينما يحدد OTG 'أسراب الأسماك' النشطة."
            }
        },
        ogv_guide: {
            title: "دليل التفسير السريع",
            overheating: "OVERHEATING",
            overheating_pos: "(أعلى اليمين)",
            overheating_desc: "نمو قوي ولكن ضغوط تضخمية عالية. حالة 'فوق المتوسط'. كن حذراً من مخاطر التعديل بسبب التشدد النقدي.",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(أسفل اليمين)",
            goldilocks_desc: "نمو معتدل وأسعار مستقرة. حالة 'مثالية' حيث يستمر التيسير النقدي. مرحلة المخاطرة مع توقع ارتفاع قيمة الأصول.",
            recession: "RECESSION",
            recession_pos: "(أسفل اليسار)",
            recession_desc: "مرحلة الانكماش الاقتصادي. يتباطأ النمو وتنخفض أسعار الفائدة. فترة 'تبييض' حيث يزداد الهروب إلى الأصول الآمنة (السندات).",
            stagflation: "STAGFLATION",
            stagflation_pos: "(أعلى اليسار)",
            stagflation_desc: "اقتصاد راكد وأسعار مرتفعة مستمرة. المرحلة الأصعب حيث تكون حماية الأصول أولوية. يفضل استخدام أصول التحوط من التضخم.",
            footer_note: "*يشير طول 'مسار الضوء' إلى عطالة السوق؛ تشير كثافة النقاط إلى تردد الاتجاه."
        },
        strategy: {
            accumulate: "تجميع",
            neutral: "محايد",
            defensive: "دفاعي"
        },
        momentum: {
            bottoming: "القاع (BOTTOMING)",
            peaking: "القمة (PEAKING)",
            rising: "صعود (RISING)",
            falling: "هبوط (FALLING)",
            stable: "مستقر (STABLE)"
        },
        events: {
            cpi: "بيانات تضخم CPI",
            fomc: "قرار سعر الفائدة FOMC",
            nfp: "الوظائف غير الزراعية",
            high: "تأثير عالي",
            critical: "حرج",
            tue: "الثلاثاء",
            wed: "الأربعاء",
            fri: "الجمعة",
            est: "EST"
        },
        attribution: {
            src: "المصدر: FRED/CBOE • تحديث: مباشر"
        },
        terms: {
            VIX: { def: "مؤشر التقلب.", benchmark: "مرجع: >20 حذر." },
            MOVE: { def: "تقلب سوق السندات.", benchmark: "مرجع: >120 إجهاد نظامي." },
            NFCI: { def: "مؤشر الأوضاع المالية.", benchmark: "مرجع: إيجابي = مشدد." },
            HY_SPREAD: { def: "فارق العائد المرتفع.", benchmark: "مرجع: >5% إجهاد ائتماني." },
            COPPER_GOLD: { def: "نسبة النحاس/الذهب.", benchmark: "مرجع: ارتفاع = توسع." },
            BREADTH: { def: "اتساع السوق.", benchmark: "مرجع: المشاركة الواسعة صحية." },
            SPY: { def: "S&P 500 ETF.", benchmark: "مرجع: اتجاه صاعد = مخاطر." },
            TNX: { def: "عائد سندات 10 سنوات.", benchmark: "مرجع: >4.5% يضغط على التقييمات." },
            DXY: { def: "مؤشر الدولار الأمريكي.", benchmark: "مرجع: >105 يشدد السيولة." },
            YIELD_SPREAD: { def: "منحنى العائد (10Y-2Y).", benchmark: "مرجع: انعكاس = ركود." }
        },
        legal_text: {
            t1: "يوفر OmniMetric ('مركز الأصول النهائي') رؤى كلية كمية لأغراض إعلامية فقط. لا يشكل نصيحة استثمارية.",
            t2: "الأداء السابق ليس مؤشراً على النتائج المستقبلية.",
            copyright: "مدعوم من مشروع OmniMetric"
        },
        regime: {
            bull: "تفضيل المخاطر",
            neutral: "نظام محايد",
            bear: "تجنب المخاطر",
            legend: "صعود > 60 // هبوط < 40"
        },
        sections: {
            s1: "القسم الأول: تقلبات السوق",
            s2: "القسم الثاني: الائتمان الهيكلي",
            s3: "القسم الثالث: المعايير المرجعية"
        },
        chart: {
            trend: "اتجاه المحطة لمدة 60 ساعة",
            sync: "في انتظار مزامنة الإشارة...",
            insight: "رؤية خاصة",
            engine: "المحرك المؤسسي v5.2.0",
            neutral_insight: "في انتظار التوافق المؤسسي.",
            bull_insight: "الظروف تفضل الأصول الخطرة.",
            bear_insight: "يُنصح بموقف دفاعي."
        },
        labels: {
            signal: "إشارة:",
            benchmark_mode: "وضع المعيار",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "سجل الارتباط (Correlation History)",
            back_to_terminal: "عودة للمحطة",
            vix: "VIX (تقلب الأسهم)",
            move: "MOVE (تقلب السندات)",
            privacy: "الخصوصية",
            terms: "الشروط",
            contact: "اتصل بنا",
            cookie: {
                title: "بروتوكول النظام",
                text: "الوصول إلى هذه المحطة يتطلب تفويض تدفق البيانات (ملفات تعريف الارتباط).",
                subtext: "تم بدء بروتوكولات التحسين.",
                accept: "[بدء التشغيل]",
                decline: "[رفض]"
            },
            hy_spread: "فارق HY (OAS)",
            nfci: "NFCI (أوضاع)",
            yield_spread: "فارق 10Y-2Y",
            copper_gold: "نحاس/ذهب",
            dxy: "مؤشر الدولار",
            tnx: "عائد 10Y",
            spy: "S&P 500 (SPY)",
            summary: "ملخص",
            stocks: "الأسهم",
            crypto: "تشفير",
            forex: "فوركس",
            commodities: "سلع",
            wiki: "الماكرو",
            maxims: "درر",

            technical: "المؤشرات الفنية",
            indicator: "الأصول والمؤشرات",
            tickers: {
                BTC: "بيتكوين", ETH: "إيثيريوم", SOL: "سولانا",
                GOLD: "الذهب", OIL: "خام WTI", COPPER: "النحاس", NATGAS: "الغاز الطبيعي",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "مؤشر الدولار",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 EW", HYG: "سندات عالية العائد", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "Nikkei 225", HANGSENG: "Hang Seng", ASX200: "ASX 200",
                G_REIT: "Global REIT", US_HOUSING: "الإسكان الأمريكي", LOGISTICS: "Logistics REIT", INFRA: "البنية التحتية",
                HY_BOND: "عائد مرتفع", IG_BOND: "درجة استثمارية", TIPS: "TIPS", SHY: "سندات قصيرة",
                BALTIC: "Baltic Dry", SHIPPING: "الشحن", AGRI: "الزراعة",
                SEMIS: "أشباه الموصلات", DEFENSE: "الدفاع", RARE_EARTH: "الأتربة النادرة", CYBER: "الأمن السيبراني",
                SILVER: "الفضة", USDCNY: "USD/CNY",
                VIX: "VIX المتذبذب", TNX: "عائد 10 سنوات", MOVE: "مؤشر MOVE", CRYPTO_SENTIMENT: "مؤشر الخوف والجشع"
            },
            search_placeholder: "بحث...",
            wiki_deep_dive: "قراءة التحليل العميق"
        },
        subpages: {
            about: {
                title: "حول OMNIMETRIC",
                subtitle: "محطة تحليل ماكرو مؤسسية مدعومة بالذكاء الاصطناعي للمستثمرين الأفراد",
                what_is_title: "ما هو OmniMetric؟",
                what_is_content: "OmniMetric هي محطة تحليل اقتصاد كلي مدعومة بالذكاء الاصطناعي تعمل على تحويل البيانات المالية ذات المستوى المؤسسي إلى رؤى قابلة للتنفيذ للمستثمرين الأفراد. على عكس مواقع الأخبار المالية التقليدية، نقوم بمعالجة بيانات السوق في الوقت الفعلي من خلال خوارزميات متطورة لإنشاء درجة إشارة الماكرو العالمية (GMS) الخاصة بنا - وهي مؤشر مخاطر كمي من 0 إلى 100.",
                diff_title: "ما الذي يميزنا",
                diff_card_1_title: "📊 مصادر بيانات مؤسسية",
                diff_card_1_content: "نحلل صافي السيولة (الميزانية العمومية للاحتياطي الفيدرالي - TGA - RRP)، ومؤشر MOVE، وفوارق الائتمان ذات العائد المرتفع.",
                diff_card_2_title: "🤖 تحليل فوري مدعوم بالذكاء الاصطناعي",
                diff_card_2_content: "تعالج خوارزمياتنا البيانات من FRED و CBOE و Yahoo Finance كل 60 ثانية، مما يولد رؤى ذكاء اصطناعي متعددة اللغات مدعومة من Google Gemini.",
                diff_card_3_title: "🎯 تسجيل المخاطر الكمية",
                diff_card_3_content: "تلغي درجة GMS الآراء الشخصية، مما يوفر تقييماً موضوعياً قائماً على البيانات لمستويات مخاطر السوق العالمية في الوقت الفعلي.",
                mission: "مهمتنا",
                mission_content_highlight: "إضفاء الطابع الديمقراati على الوصول إلى تحليل الماكرو المؤسسي من خلال تصور التحولات الاقتصادية الهيكلية التي تؤثر على جميع المستثمرين.",
                tech: "التكنولوجيا",
                tech_stack_frontend: "الواجهة الأمامية: Next.js 15 + TypeScript",
                tech_stack_backend: "الخلفية: Python + FastAPI",
                tech_stack_ai: "محرك الذكاء الاصطناعي: Google Gemini 2.0 Flash",
                tech_stack_pipeline: "خط أنابيب البيانات: APIs REST في الوقت الفعلي",
                data_sources_title: "مصادر البيانات",
                data_sources_content: "Federal Reserve Economic Data (FRED), CBOE Market Volatility Indices, Yahoo Finance",
                disclaimer_title: "إخلاء مسؤولية هام",
                disclaimer_content: "يتم توفير OmniMetric لأغراض إعلامية فقط. جميع البيانات مأخوذة من واجهات برمجة تطبيقات عامة. لا نضمن الدقة.",
                system_status: "حالة النظام: يعمل // الإصدار 2.0 // محدث",
                footer_note: "OmniMetric مستقل بنسبة 100%. نحن لا نقدم دعماً فردياً أو استشارات استثمارية."
            },
            legal: {
                title: "إشعار قانوني",
                disclaimer: "إخلاء مسؤولية",
                disclaimer_content: "OmniMetric هو مجمع معلومات. ليس نصيحة استثمارية.",
                usage: "شروط الاستخدام",
                usage_content: "يحظر الكشط غير المصرح به."
            },
            archive: {
                title: "سجل ارتباط الإشارة",
                desc: "إعادة عرض موضوعية لحالات المؤشرات التاريخية وإشارة GMS الخوارزمية المقابلة.",
                disclaimer: "تمثل هذه البيانات الارتباطات التاريخية فقط ولا تقترح أو تضمن نتائج الاستثمار المستقبلية."
            }
        }
    },
    DE: {
        status: {
            ai: MESSAGES.ai_status.DE,
            market: MESSAGES.market_data_status.DE
        },
        partner: {
            badge: "Offizieller TradingView Partner",
            title: "Holen Sie sich $15 Guthaben: Sparen Sie bei Ihrem neuen TradingView-Plan.",
            action: "Analyse Starten ($15 Guthaben)",
            disclaimer: "OmniMetric ist offizieller Partner von TradingView.",
            link_text: "Auf TradingView Analysieren"
        },
        titles: {
            risk_score: "Marktregime-Indikator",
            insights: "Quant Makro Insights",
            risk_factors: "Institutionelles Datennetz",
            legal: "RECHTLICHER HINWEIS",
            delayed: "1H Verzögerung",
            partner_ad: "Partner Platzierung",
            market_regime: "MARKTREGIME",
            risk_preference: "RISIKOPRÄFERENZ",
            institutional_analysis: "GMS Makro AI Analyse",
            sponsored: "GESPONSERT",
            current_strategy: "AKTUELLE STRATEGIE",
            upcoming_events: "KOMMENDE RISIKOEVENTS",
            gms_score: "GMS SCORE",
            breaking_news: "BREAKING NEWS",
            live: "LIVE",
            breaking: "EILMELDUNG",
            delayed_tick: "*15m VERZ",
            methodology: "METHODIK",
            analysis_history: "Analyse Historie",
            live_stream: "LIVE INTELLIGENCE STREAM",
            ai_disclaimer: "Diese Einsicht ist eine Analyse durch KI."
        },
        methodology: {
            title: "GMS QUANT METHODIK",
            desc: "Der GMS Score integriert Markt-'Angst', 'Kreditstress' und 'Momentum' in einen proprietären quantitativen Risikoindex von 0-100.",
            zone_accumulate: "60-100: AKKUMULIEREN (Risk On)",
            zone_accumulate_desc: "Expansionsphase. Zuflüsse in Aktien, Rohstoffe und Hochzinsanleihen empfohlen.",
            zone_neutral: "40-60: NEUTRAL (Trendlos)",
            zone_neutral_desc: "Volatilitätskompression. Positionsanpassungsphase.",
            zone_defensive: "0-40: DEFENSIV (Risk Off)",
            zone_defensive_desc: "Cash/Staatsanleihen dominieren. Achten Sie auf Panikverkäufe und Kreditverknappung.",
            inputs: "Inputs: VIX, MOVE, HY OAS, NFCI, SPY Momentum",
        },
        modals: {
            ogv: {
                title: "Omni Gravity Vector (OGV)",
                func_title: "FUNKTION",
                func_desc: "Projiziert die relative Position wichtiger Vermögenswerte (Aktien, Gold, BTC, USD, Anleihen) auf eine Vier-Quadranten-Karte aus 'Wirtschaftswachstum' und 'Inflation'. Zeichnet eine 60-Tage-'Spur', um Trägheit und Trends zu visualisieren.",
                purpose_title: "ZWECK",
                purpose_desc: "Auf einen Blick erkennen, ob das Makroumfeld 'Goldilocks', 'Überhitzung', 'Stagflation' oder 'Rezession' ist. Dient als Kompass, um zu sehen, zu welchem Quadranten Assets tendieren (Gravitation)."
            },
            owb: {
                title: "Omni Warning Beacons (OWB)",
                func_title: "FUNKTION",
                func_desc: "Ampelsystem zur 24h-Überwachung kritischer Makroindikatoren (Zinskurve, Kreditrisiko, Volatilidad). Wechselt bei Anomalien auf 'DANGER / STRESS'.",
                purpose_title: "ZWECK",
                purpose_desc: "Frühzeitige Erkennung systemischer Risiken. Wenn die Beacons 'Rot' zeigen, schwelen im Hintergrund Schocks, auch wenn Einzelaktien stabil scheinen. Die 'letzte Verteidigungslinie'."
            },
            otg: {
                title: "Omni Thermal Grid (OTG)",
                func_title: "FUNKTION",
                func_desc: "Heatmap der 'Hitze' in Sektoren wie Tech, Energie, Finanzen und Krypto basierend auf dem GMS-Score. Zeigt in Echtzeit, wo sich Kapital konzentriert.",
                purpose_title: "ZWECK",
                purpose_desc: "Erfassen von Sektor-Rotationen. Während OGV die 'Meeresströmung' zeigt, identifiziert OTG, welche 'Fischschwärme' aktiv sind."
            }
        },
        ogv_guide: {
            title: "Schnell-Interpretations-Leitfaden",
            overheating: "OVERHEATING",
            overheating_pos: "(Oben Rechts)",
            overheating_desc: "Starkes Wachstum, aber hoher Inflationsdruck. Status 'Überhitzung'. Vorsicht vor Anpassungsrisiken durch geldpolitische Straffung.",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(Unten Rechts)",
            goldilocks_desc: "Moderates Wachstum und stabile Preise. Ein 'optimaler' Status, in dem die geldpolitische Lockerung anhält. Risk-On-Phase mit Erwartung von Wertsteigerungen.",
            recession: "RECESSION",
            recession_pos: "(Unten Links)",
            recession_desc: "Phase des wirtschaftlichen Abschwungs. Das Wachstum verlangsamt sich und die Zinsen sinken. 'Abkühlungsphase', in der die Flucht in Sicherheit (Anleihen) zunimmt.",
            stagflation: "STAGFLATION",
            stagflation_pos: "(Oben Links)",
            stagflation_desc: "Stagnierende Wirtschaft und anhaltend hohe Preise. Die schwierigste Phase, in der der Schutz von Vermögenswerten Priorität hat. Inflationsschutz-Assets bevorzugt.",
            footer_note: "*Die Länge des 'Lichtpfads' deutet auf Marktträgheit hin; die Punktdichte deutet auf Trendzögern hin."
        },
        strategy: {
            accumulate: "AKKUMULIEREN",
            neutral: "NEUTRAL",
            defensive: "DEFENSIV"
        },
        momentum: {
            bottoming: "BODENBILDUNG (BOTTOMING)",
            peaking: "TOPBILDUNG (PEAKING)",
            rising: "STEIGEND (RISING)",
            falling: "FALLEND (FALLING)",
            stable: "STABIL (STABLE)"
        },
        events: {
            cpi: "CPI INFLATIONSDATEN",
            fomc: "FOMC ZINSENTSCHEID",
            nfp: "NON-FARM PAYROLLS",
            high: "HOHE AUSWIRKUNG",
            critical: "KRITISCH",
            tue: "DIE",
            wed: "MIT",
            fri: "FRE",
            est: "EST"
        },
        attribution: {
            src: "QUELLE: FRED/CBOE • UPDATE: LIVE"
        },
        terms: {
            VIX: { def: "Volatilitätsindex.", benchmark: "Ref: >20 Vorsicht." },
            MOVE: { def: "Anleihen-Volatilität.", benchmark: "Ref: >120 Systemischer Stress." },
            NFCI: { def: "Finanzkonditionen.", benchmark: "Ref: Positiv = Restriktiv." },
            HY_SPREAD: { def: "High Yield Spread.", benchmark: "Ref: >5% Kreditstress." },
            COPPER_GOLD: { def: "Kupfer/Gold Verhältnis.", benchmark: "Ref: Anstieg = Expansion." },
            BREADTH: { def: "Marktbreite.", benchmark: "Ref: Breite Partizipation ist gesund." },
            SPY: { def: "S&P 500 ETF.", benchmark: "Ref: Aufwärtstrend = Risk On." },
            TNX: { def: "US 10J Rendite.", benchmark: "Ref: >4.5% drückt Bewertungen." },
            DXY: { def: "US Dollar Index.", benchmark: "Ref: >105 verknappt Liquidität." },
            YIELD_SPREAD: { def: "Zinsstrukturkurve.", benchmark: "Ref: Inversion = Rezession." }
        },
        legal_text: {
            t1: "OmniMetric bietet quantitative Makroanalysen nur zu Informationszwecken.",
            t2: "Vergangene Wertentwicklung garantiert keine zukünftigen Ergebnisse.",
            copyright: "Powered by OmniMetric Project"
        },
        regime: {
            bull: "Risikopräferenz",
            neutral: "Neutrales Regime",
            bear: "Risikovermeidung",
            legend: "BULL > 60 // BEAR < 40"
        },
        sections: {
            s1: "SEKTION I: MARKT-VOLATILITÄT",
            s2: "SEKTION II: KREDIT-STRUKTUR",
            s3: "SEKTION III: REFERENZ-BENCHMARKS"
        },
        chart: {
            trend: "60-Stunden Terminal Trend",
            sync: "Warte auf Signal-Sync...",
            insight: "Proprietärer Insight",
            engine: "Institutionelle Engine v5.2.0",
            neutral_insight: "Warte auf institutionellen Konsens.",
            bull_insight: "Bedingungen begünstigen Risiko-Assets.",
            bear_insight: "Defensive Haltung empfohlen."
        },
        subpages: {
            about: {
                title: "Über OmniMetric",
                subtitle: "KI-gesteuertes Terminal für makroökonomische Analysen",
                what_is_title: "Was ist OmniMetric?",
                what_is_content: "OmniMetric ist ein KI-gesteuertes Terminal für makroökonomische Analysen, das institutionelle Finanzdaten in handfeste Erkenntnisse für Privatanleger verwandelt. Im Gegensatz zu herkömmlichen Finanznachrichtenseiten, die sich auf Schlagzeilen und Meinungen konzentrieren, verarbeiten wir Echtzeit-Marktdaten durch hochentwickelte Algorithmen, um unseren proprietären Global Macro Signal (GMS) Score zu generieren – einen quantitativen Risikoindex von 0 bis 100.",
                diff_title: "Was uns unterscheidet",
                diff_card_1_title: "📊 Institutionelle Datenquellen",
                diff_card_1_content: "Wir analysieren die Netto-Liquidität (Bilanz der Federal Reserve - TGA - RRP), den MOVE-Index (Anleihenvolatilität) und High-Yield-Credit-Spreads – Kennzahlen, die normalerweise Hedgefonds und institutionellen Anlegern vorbehalten sind.",
                diff_card_2_title: "🤖 KI-gestützte Echtzeitanalyse",
                diff_card_2_content: "Unsere proprietären Algorithmen verarbeiten alle 60 Sekunden Daten von FRED, CBOE, Yahoo Finance und alternativen Quellen und generieren mehrsprachige KI-Einblicke, unterstützt durch Google Gemini.",
                diff_card_3_title: "🎯 Quantitatives Risiko-Scoring",
                diff_card_3_content: "Der GMS Score eliminiert subjektive Meinungen und bietet eine datengesteuerte, objektive Bewertung des globalen Marktrisikos in Echtzeit.",
                mission: "Unsere Mission",
                mission_content_highlight: "Den Zugang zu makroökonomischen Analysen auf institutionellem Niveau zu demokratisieren, indem wir strukturelle wirtschaftliche Verschiebungen visualisieren, die alle Anleger betreffen – vom Daytrader bis zum langfristigen Portfoliomanager.",
                tech: "Technologie-Stack",
                tech_stack_frontend: "Frontend: Next.js 15 + TypeScript",
                tech_stack_backend: "Backend: Python + FastAPI",
                tech_stack_ai: "KI-Engine: Google Gemini 2.0 Flash",
                tech_stack_pipeline: "Daten-Pipeline: Echtzeit-REST-APIs",
                data_sources_title: "Datenquellen",
                data_sources_content: "Federal Reserve Economic Data (FRED), CBOE Market Volatility Indices, Yahoo Finance, Financial Modeling Prep, Alternative.me Crypto Fear & Greed",
                disclaimer_title: "Wichtiger Haftungsausschluss",
                disclaimer_content: "OmniMetric dient ausschließlich zu Informationszwecken und stellt keine Anlageberatung dar. Alle Daten stammen von öffentlichen Schnittstellen und Drittanbietern. Wir garantieren keine Genauigkeit, Vollständigkeit oder Aktualität. Anlageentscheidungen liegen in der alleinigen Verantwortung des Nutzers.",
                system_status: "Systemstatus: Betriebsbereit (OmniMetric Projekt) // Version 2.0 // Aktualisiert",
                footer_note: "OmniMetric ist ein zu 100 % autonomes algorithmisches Projekt. Wir bieten keine individuelle Unterstützung oder Anlageberatung an."
            },
            legal: {
                title: "RECHTLICHER HINWEIS & COMPLIANCE",
                disclaimer: "Finanz-Haftungsausschluss",
                disclaimer_content: "OmniMetric ist ein Informationsaggregator. Die bereitgestellten Informationen stellen keine Anlage-, Finanz- oder Rechtsberatung dar. Alle Daten und Analysen werden ohne Gewähr zur Verfügung gestellt.",
                usage: "Nutzungsbedingungen",
                usage_content: "Unbefugtes automatisiertes Scraping, Data Mining oder die Nutzung für KI-Training ist strengstens untersagt. Für die kommerzielle Nutzung ist eine spezifische Lizenz erforderlich."
            },
            archive: {
                title: "SIGNAL-KORRELATIONSHISTORIE",
                desc: "Objektive Wiedergabe historischer Indikatorzustände und des entsprechenden algorithmischen GMS-Signals.",
                disclaimer: "DIESE DATEN STELLEN NUR HISTORISCHE KORRELATIONEN DAR UND LASSEN KEINE RÜCKSCHLÜSSE AUF ZUKÜNFTIGE ANLAGEERGEBNISSE ZU ODER GARANTIEREN DIESE."
            }
        },
        settings: {
            title: "Marktpuls-Konfiguration",
            subtitle: "CUSTOMIZE YOUR WORKSPACE",
            theme_title: "Theme Interface",
            dark_mode: "DARK MODE",
            light_mode: "LIGHT MODE",
            active_modules: "Active Modules",
            reset: "RESET",
            disabled_modules: "Disabled Modules",
            last_updated: "Last Updated",
            system_operational: "System Operational"
        },
        labels: {
            signal: "SIGNAL:",
            benchmark_mode: "BENCHMARK MODE",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "CORRELATION HISTORY",
            back_to_terminal: "BACK TO TERMINAL",
            vix: "VIX (Equity Vol)",
            move: "MOVE (Bond Vol)",
            privacy: "Privacy",
            terms: "Terms",
            contact: "Contact",
            cookie: {
                title: "System Protocol",
                text: "Accessing this terminal requires data stream authorization (Cookies).",
                subtext: "Optimization protocols initialized.",
                accept: "[Initialize]",
                decline: "[Deny]"
            },
            hy_spread: "HY Spread (OAS)",
            nfci: "NFCI (Financial Cond.)",
            yield_spread: "10Y-3M Yield Spread",
            copper_gold: "Copper/Gold Ratio",
            dxy: "US Dollar Index",
            tnx: "US 10Y Yield",
            spy: "S&P 500 (SPY)",
            summary: "SUMMARY",
            stocks: "STOCKS",
            crypto: "CRYPTO",
            forex: "FOREX",
            commodities: "COMMODITIES",
            wiki: "MACRO WIKI",
            maxims: "MAXIMS",
            technical: "TECHNICAL",
            indicator: "Assets & Indicators",
            tickers: {
                BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana",
                GOLD: "Gold", OIL: "WTI Crude Oil", COPPER: "Copper", NATGAS: "Natural Gas",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "DXY Dollar Index",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 Equal Weight", HYG: "High Yield Bond", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "Nikkei 225", HANGSENG: "Hang Seng", ASX200: "ASX 200",
                G_REIT: "Global REIT", US_HOUSING: "US Housing", LOGISTICS: "Logistics REIT", INFRA: "Infrastructure",
                HY_BOND: "High Yield", IG_BOND: "Inv Grade", TIPS: "TIPS", SHY: "Short Gov",
                BALTIC: "Baltic Dry", SHIPPING: "Shipping", AGRI: "Agri",
                SEMIS: "Semis", DEFENSE: "Defense", RARE_EARTH: "Rare Earth", CYBER: "Cyber",
                SILVER: "Silver", USDCNY: "USD/CNY",
                VIX: "VIX Volatility", TNX: "US 10Y Yield", MOVE: "MOVE Index", CRYPTO_SENTIMENT: "Crypto Fear & Greed"
            },
            search_placeholder: "Search Knowledge Base...",
            wiki_deep_dive: "Deep Dive Analysis"
        }
    },
    FR: {
        status: {
            ai: MESSAGES.ai_status.FR,
            market: MESSAGES.market_data_status.FR
        },
        partner: {
            badge: "Partenaire Officiel TradingView",
            title: "Obtenez 15$ de Crédit: Économisez sur votre plan TradingView.",
            action: "Lancer Analyse (15$ Offerts)",
            disclaimer: "OmniMetric est partenaire officiel de TradingView.",
            link_text: "Analyser sur TradingView"
        },
        titles: {
            risk_score: "Indicateur Régime Marché",
            insights: "Insights Macro Quant",
            risk_factors: "Grille Données Institutionnelles",
            legal: "MENTIONS LÉGALES",
            delayed: "Délai 1H",
            partner_ad: "Placement Partenaire",
            market_regime: "RÉGIME DE MARCHÉ",
            risk_preference: "PRÉFÉRENCE RISQUE",
            institutional_analysis: "Analyse GMS Macro AI",
            sponsored: "SPONSORISÉ",
            current_strategy: "STRATÉGIE ACTUELLE",
            upcoming_events: "ÉVÉNEMENTS À RISQUE",
            gms_score: "SCORE GMS",
            breaking_news: "DERNIÈRES NOUVELLES",
            live: "EN DIRECT",
            breaking: "URGENT",
            delayed_tick: "*15m DÉLAI",
            methodology: "MÉTHODOLOGIE",
            analysis_history: "Historique Analyse",
            live_stream: "FLUX INTELLIGENCE LIVE",
            ai_disclaimer: "Cet aperçu est une analyse par IA."
        },
        strategy: {
            accumulate: "ACCUMULER",
            neutral: "NEUTRE",
            defensive: "DÉFENSIF"
        },
        momentum: {
            bottoming: "FORMATION DE FOND (BOTTOMING)",
            peaking: "FORMATION DE SOMMET (PEAKING)",
            rising: "HAUSSIER (RISING)",
            falling: "BAISSIER (FALLING)",
            stable: "STABLE (STABLE)"
        },
        events: {
            cpi: "DONNÉES INFLATION CPI",
            fomc: "DÉCISION TAUX FOMC",
            nfp: "EMPLOIS NON AGRICOLES",
            high: "IMPACT ÉLEVÉ",
            critical: "CRITIQUE",
            tue: "MAR",
            wed: "MER",
            fri: "VEN",
            est: "EST"
        },
        attribution: {
            src: "SRC: FRED/CBOE • MAJ: LIVE"
        },
        terms: {
            VIX: { def: "Indice de Volatilité.", benchmark: "Ref: >20 Prudence." },
            MOVE: { def: "Volatilité Obligations.", benchmark: "Ref: >120 Stress Systémique." },
            NFCI: { def: "Conditions Financières.", benchmark: "Ref: Positif = Restrictif." },
            HY_SPREAD: { def: "Spread Haut Rendement.", benchmark: "Ref: >5% Stress Crédit." },
            COPPER_GOLD: { def: "Ratio Cuivre/Or.", benchmark: "Ref: Hausse = Expansion." },
            BREADTH: { def: "Largeur de Marché.", benchmark: "Ref: Partipation large est saine." },
            SPY: { def: "ETF S&P 500.", benchmark: "Ref: Tendance Haussière = Risk On." },
            TNX: { def: "Taux 10 ans US.", benchmark: "Ref: >4.5% pèse sur les valorisations." },
            DXY: { def: "Indice Dollar.", benchmark: "Ref: >105 resserre la liquidité." },
            YIELD_SPREAD: { def: "Courbe des Taux.", benchmark: "Ref: Inversion = Récession." }
        },
        legal_text: {
            t1: "OmniMetric fournit des analyses macro quantitatives à titre informatif uniquement.",
            t2: "Les performances passées ne préjugent pas des résultats futurs.",
            copyright: "Propulsé par OmniMetric Project"
        },
        regime: {
            bull: "Préférence Risque",
            neutral: "Régime Neutre",
            bear: "Aversion Risque",
            legend: "HAUSSIER > 60 // BAISSIER < 40"
        },
        sections: {
            s1: "SECTION I: VOLATILITÉ & PEUR",
            s2: "SECTION II: CRÉDIT STRUCTUREL",
            s3: "SECTION III: RÉFÉRENCES"
        },
        chart: {
            trend: "Tendance Terminal 60 Heures",
            sync: "Attente Synchro Signal...",
            insight: "Insight Propriétaire",
            engine: "Moteur Institutionnel v5.2.0",
            neutral_insight: "Attente consensus institutionnel.",
            bull_insight: "Conditions favorables aux actifs risqués.",
            bear_insight: "Posture défensive conseillée."
        },
        methodology: {
            title: "MÉTHODOLOGIE QUANT GMS",
            desc: "Le score GMS intègre la 'peur', le 'stress du crédit' et le 'momentum' du marché dans un indice de risque quantitatif exclusif de 0 à 100.",
            zone_accumulate: "60-100 : ACCUMULER (Risk On)",
            zone_accumulate_desc: "Phase d'expansion. Entrées suggérées sur les actions, les matières premières et les obligations à haut rendement.",
            zone_neutral: "40-60 : NEUTRE (Sans tendance)",
            zone_neutral_desc: "Compression de la volatilité. Phase d'ajustement de position.",
            zone_defensive: "0-40 : DÉFENSIF (Risk Off)",
            zone_defensive_desc: "Domination du cash/obligations d'État. Attention aux ventes de panique et à la contraction du crédit.",
            inputs: "Inputs : VIX, MOVE, HY OAS, NFCI, SPY Momentum",
        },
        modals: {
            ogv: {
                title: "Omni Gravity Vector (OGV)",
                func_title: "FONCTION",
                func_desc: "Projette la position relative des principaux actifs (Actions, Or, BTC, USD, Obligations) sur une carte à quatre quadrants (Croissance vs Inflation). Trace une 'traîne' de 60 jours pour visualiser l'inertie.",
                purpose_title: "OBJECTIF",
                purpose_desc: "Identifier d'un coup d'œil si l'environnement macro est 'Boucle d'or', 'Surchauffe', 'Stagflation' ou 'Récession'. Sert de boussole pour voir vers quel quadrant les actifs gravitent."
            },
            owb: {
                title: "Omni Warning Beacons (OWB)",
                func_title: "FONCTION",
                func_desc: "Système de feux de signalisation surveillant 24h/24 les indicateurs macro critiques (Courbe des taux, risque de crédit, volatilité). Passe au 'DANGER / STRESS' en cas d'anomalie.",
                purpose_title: "OBJECTIF",
                purpose_desc: "Détection précoce des risques systémiques. Si les balises sont 'Rouge', un choc couve malgré la stabilité apparente des prix. C'est la 'dernière ligne de défense'."
            },
            otg: {
                title: "Omni Thermal Grid (OTG)",
                func_title: "FONCTION",
                func_desc: "Carte thermique de la 'chaleur' des secteurs basée sur le score GMS. Exprime en temps réel où le capital se concentre.",
                purpose_title: "OBJECTIF",
                purpose_desc: "Capturer les vagues de rotation sectorielle. OGV montre le 'courant marin', OTG identifie les 'bancs de poissons' actifs."
            }
        },
        ogv_guide: {
            title: "Guide d'Interprétation Rapide",
            overheating: "OVERHEATING",
            overheating_pos: "(Haut Droite)",
            overheating_desc: "Croissance forte mais pressions inflationnistes élevées. Statut 'Surchauffe'. Attention aux risques d'ajustement dus au resserrement monétaire.",
            goldilocks: "GOLDILOCKS",
            goldilocks_pos: "(Bas Droite)",
            goldilocks_desc: "Croissance modérée et prix stables. Un statut 'idéal' où l'assouplissement monétaire se poursuit. Phase de Risk-On avec espoir de valorisation des actifs.",
            recession: "RECESSION",
            recession_pos: "(Bas Gauche)",
            recession_desc: "Phase de ralentissement économique. La croissance ralentit et les taux d'intérêt baissent. Période de 'refroidissement' où la fuite vers la sécurité (obligations) augmente.",
            stagflation: "STAGFLATION",
            stagflation_pos: "(Haut Gauche)",
            stagflation_desc: "Économie stagnante et prix élevés persistants. La phase la plus difficile où la protection des actifs est prioritaire. Les actifs de couverture contre l'inflation sont privilégiés.",
            footer_note: "*La longueur de la 'Traîne Lumineuse' suggère l'inertie du marché ; la densité des points suggère une hésitation de tendance."
        },
        subpages: {
            about: {
                title: "À propos d'OmniMetric",
                subtitle: "Terminal d'analyse macro institutionnelle piloté par l'IA",
                what_is_title: "Qu'est-ce qu'OmniMetric ?",
                what_is_content: "OmniMetric est un terminal d'analyse macro-économique piloté par l'IA qui transforme les données financières de niveau institutionnel en informations exploitables pour les investisseurs particuliers. Contrairement aux sites d'actualités financières traditionnels qui se concentrent sur les titres et les opinions, nous traitons les données de marché en temps réel via des algorithmes sophistiqués pour générer notre score exclusif Global Macro Signal (GMS) — un indice de risque quantitatif de 0 à 100.",
                diff_title: "Ce qui nous différencie",
                diff_card_1_title: "📊 Sources de données institutionnelles",
                diff_card_1_content: "Nous analysons la liquidité nette (bilan de la Réserve fédérale - TGA - RRP), l'indice MOVE (volatilité obligataire) et les spreads de crédit à haut rendement — des indicateurs réservés aux fonds spéculatifs et aux investisseurs institutionnels.",
                diff_card_2_title: "🤖 Analyse en temps réel par l'IA",
                diff_card_2_content: "Nos algorithmes traitent les données de FRED, CBOE, Yahoo Finance et d'autres sources toutes les 60 secondes, générant des analyses multilingues propulsées par Google Gemini.",
                diff_card_3_title: "🎯 Scoring de risque quantitatif",
                diff_card_3_content: "Le score GMS élimine les opinions subjectives pour fournir une évaluation objective et basée sur les données des niveaux de risque du marché mondial en temps réel.",
                mission: "Notre Mission",
                mission_content_highlight: "Démocratiser l'accès à l'analyse macro institutionnelle en visualisant les changements structurels économiques qui impactent tous les investisseurs — du daytrader au gestionnaire de portefeuille à long terme.",
                tech: "Pile Technologique",
                tech_stack_frontend: "Frontend : Next.js 15 + TypeScript",
                tech_stack_backend: "Backend : Python + FastAPI",
                tech_stack_ai: "Moteur IA : Google Gemini 2.0 Flash",
                tech_stack_pipeline: "Pipeline de données : APIs REST en temps réel",
                data_sources_title: "Sources de données",
                data_sources_content: "Federal Reserve Economic Data (FRED), CBOE Market Volatility Indices, Yahoo Finance, Financial Modeling Prep, Alternative.me Crypto Fear & Greed",
                disclaimer_title: "Avertissement Important",
                disclaimer_content: "OmniMetric est fourni à titre informatif uniquement et ne constitue pas un conseil en investissement. Toutes les données proviennent d'APIs publiques et de fournisseurs tiers. Nous ne garantissons pas l'exactitude, l'exhaustivité ou l'actualité. Les décisions d'investissement relèvent de la seule responsabilité de l'utilisateur.",
                system_status: "Statut du système : Opérationnel (Projet OmniMetric) // Version 2.0 // Mis à jour",
                footer_note: "OmniMetric est un projet algorithmique 100% autonome. Nous ne fournissons pas de support individuel ou de conseil en investissement."
            },
            legal: {
                title: "MENTIONS LÉGALES & CONFORMITÉ",
                disclaimer: "Avertissement Financier",
                disclaimer_content: "OmniMetric est un agrégateur d'informations. Les informations fournies ne constituent pas un conseil en investissement, financier ou juridique. Toutes les données et analyses sont fournies « en l'état » sans garantie d'aucune sorte.",
                usage: "Conditions d'utilisation",
                usage_content: "Le scraping automatisé non autorisé, le minage de données ou l'utilisation pour l'entraînement d'IA est strictement interdit. L'utilisation commerciale nécessite une licence spécifique. En utilisant ce terminal, vous acceptez ces conditions légales spécifiques au projet."
            },
            archive: {
                title: "HISTORIQUE DE CORRÉLATION DES SIGNAUX",
                desc: "Relecture objective des états historiques des indicateurs et du signal algorithmique GMS correspondant.",
                disclaimer: "CES DONNÉES REPRÉSENTENT UNIQUEMENT DES CORRÉLATIONS HISTORIQUES ET NE GARANTISSENT PAS LES RÉSULTATS FUTURS."
            }
        },
        settings: {
            title: "Configuration Market Pulse",
            subtitle: "CUSTOMIZE YOUR WORKSPACE",
            theme_title: "Theme Interface",
            dark_mode: "DARK MODE",
            light_mode: "LIGHT MODE",
            active_modules: "Active Modules",
            reset: "RESET",
            disabled_modules: "Disabled Modules",
            last_updated: "Last Updated",
            system_operational: "System Operational"
        },
        labels: {
            signal: "SIGNAL:",
            benchmark_mode: "BENCHMARK MODE",
            about: "SYSTEM INFO",
            legal: "LEGAL NOTICE",
            archive: "CORRELATION HISTORY",
            back_to_terminal: "BACK TO TERMINAL",
            vix: "VIX (Equity Vol)",
            move: "MOVE (Bond Vol)",
            privacy: "Privacy",
            terms: "Terms",
            contact: "Contact",
            cookie: {
                title: "System Protocol",
                text: "Accessing this terminal requires data stream authorization (Cookies).",
                subtext: "Optimization protocols initialized.",
                accept: "[Initialize]",
                decline: "[Deny]"
            },
            hy_spread: "HY Spread (OAS)",
            nfci: "NFCI (Financial Cond.)",
            yield_spread: "10Y-3M Yield Spread",
            copper_gold: "Copper/Gold Ratio",
            dxy: "US Dollar Index",
            tnx: "US 10Y Yield",
            spy: "S&P 500 (SPY)",
            summary: "SUMMARY",
            stocks: "STOCKS",
            crypto: "CRYPTO",
            forex: "FOREX",
            commodities: "COMMODITIES",
            wiki: "MACRO WIKI",
            maxims: "MAXIMS",
            technical: "TECHNICAL",
            indicator: "Assets & Indicators",
            tickers: {
                BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana",
                GOLD: "Gold", OIL: "WTI Crude Oil", COPPER: "Copper", NATGAS: "Natural Gas",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "DXY Dollar Index",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 Equal Weight", HYG: "High Yield Bond", NIFTY: "Nifty 50",
                DAX: "DAX 40", CAC40: "CAC 40", FTSE: "FTSE 100", STOXX600: "Stoxx 600",
                NIKKEI: "Nikkei 225", HANGSENG: "Hang Seng", ASX200: "ASX 200",
                G_REIT: "Global REIT", US_HOUSING: "US Housing", LOGISTICS: "Logistics REIT", INFRA: "Infrastructure",
                HY_BOND: "High Yield", IG_BOND: "Inv Grade", TIPS: "TIPS", SHY: "Short Gov",
                BALTIC: "Baltic Dry", SHIPPING: "Shipping", AGRI: "Agri",
                SEMIS: "Semis", DEFENSE: "Defense", RARE_EARTH: "Rare Earth", CYBER: "Cyber",
                SILVER: "Silver", USDCNY: "USD/CNY",
                VIX: "VIX Volatility", TNX: "US 10Y Yield", MOVE: "MOVE Index", CRYPTO_SENTIMENT: "Crypto Fear & Greed"
            },
            search_placeholder: "Search Knowledge Base...",
            wiki_deep_dive: "Deep Dive Analysis"
        }
    }
};
