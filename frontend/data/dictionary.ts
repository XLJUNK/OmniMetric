import MESSAGES from './messages.json';

export type LangType = 'EN' | 'JP' | 'CN' | 'ES' | 'HI' | 'ID' | 'AR';

export const DICTIONARY = {
    EN: {
        status: {
            ai: MESSAGES.ai_status.EN,
            market: MESSAGES.market_data_status.EN
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
            delayed_tick: "*15m DLY",
            methodology: "METHODOLOGY",
            analysis_history: "Analysis History",
            live_stream: "LIVE INTELLIGENCE STREAM"
        },
        methodology: {
            title: "GMS QUANT METHODOLOGY",
            desc: "The GMS Score integrates market 'Fear', 'Credit Stress', and 'Momentum' into a proprietary 0-100 quantitative risk index.",
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
            factors: { VOL: "VOL", MOM: "MOM", CRED: "CRED", SENT: "SENT", RATES: "RATES", BREADTH: "BREADTH", LIQ: "LIQ" },
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
                SKEWED: "SKEWED"
            },
            gms_tooltip_desc: "GMS Score is a quantitative risk indicator integrated by AI algorithms. The current score primarily reflects trends in [FACTOR1] and [FACTOR2].",
        },
        strategy: {
            accumulate: "ACCUMULATE",
            neutral: "NEUTRAL",
            defensive: "DEFENSIVE"
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
            trend: "30-Day Terminal Trend",
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
            tickers: {
                BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana",
                GOLD: "Gold", OIL: "WTI Crude Oil", COPPER: "Copper", NATGAS: "Natural Gas",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "DXY Dollar Index",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 Equal Weight", HYG: "High Yield Bond", NIFTY: "Nifty 50",
                VIX: "VIX Volatility", TNX: "US 10Y Yield", MOVE: "MOVE Index", CRYPTO_SENTIMENT: "Crypto Fear & Greed"
            },
            search_placeholder: "Search Knowledge Base..."
        },
        subpages: {
            about: {
                title: "ABOUT OMNIMETRIC",
                mission: "Our Mission",
                mission_content: "OmniMetric is a personal quant-macro project dedicated to market transparency. We aggregate disparate institutional lead indicators—from high-yield spreads to bond volatility—into a single, high-density terminal interface. Our goal is to democratize institutional-grade macro analysis for individual researchers.",
                tech: "Quant Methodology",
                tech_content: "The GMS (Global Macro Signal) score is calculated using weighted algorithmic analysis of credit spreads, volatility indices, and growth proxies. Data is sourced from FRED (St. Louis Fed) and Yahoo Finance, processed through proprietary regime-detection logic.",
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
        }
    },
    JP: {
        status: {
            ai: MESSAGES.ai_status.JP,
            market: MESSAGES.market_data_status.JP
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
            delayed_tick: "*15分遅延",
            methodology: "算出ロジック (METHODOLOGY)",
            analysis_history: "分析履歴 (Analysis History)",
            live_stream: "ライブ・インテリジェンス（LIVE INTELLIGENCE）"
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
            factors: { VOL: "ボラティリティ", MOM: "モメンタム", CRED: "信用リスク", SENT: "センチメント", RATES: "金利", BREADTH: "騰落", LIQ: "流動性" },
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
                SKEWED: "偏り"
            }
        },
        strategy: {
            accumulate: "ACCUMULATE (強気)",
            neutral: "NEUTRAL (静観)",
            defensive: "DEFENSIVE (守備)"
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
            trend: "過去30日間のターミナルトレンド",
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
            tickers: {
                BTC: "ビットコイン", ETH: "イーサリアム", SOL: "ソラナ",
                GOLD: "金 (Gold)", OIL: "WTI原油", COPPER: "銅", NATGAS: "天然ガス",
                USDJPY: "ドル円", EURUSD: "ユーロドル", USDINR: "ドル/ルピー", USDSAR: "ドル/リヤル", DXY: "ドル指数",
                SPY: "S&P 500", QQQ: "ナスダック100", IWM: "ラッセル2000", RSP: "S&P500均等加重", HYG: "ハイイールド債", NIFTY: "Nifty 50",
                VIX: "VIX恐怖指数", TNX: "米国10年債利回り", MOVE: "MOVE債券恐怖指数", CRYPTO_SENTIMENT: "暗号資産恐怖指数 (F&G)"
            },
            search_placeholder: "マクロ知識ベースを検索..."
        },
        subpages: {
            about: {
                title: "ABOUT OMNIMETRIC",
                mission: "プロジェクトの使命",
                mission_content: "OmniMetric（オムニ・メトリック）は、市場の透明性を追求する個人主導のクオンツ・マクロ・プロジェクトです。ハイイールド債のスプレッドから債券ボラティリティに至るまで、分散した機関投資家向け先行指標を1つの高密度なターミナル・インターフェースに統合します。私たちの目標は、機関投資家レベルのマクロ分析を個人の研究者が利用できるようにすることです。",
                tech: "クオンツ・メソドロジー",
                tech_content: "GMS（グローバル・マクロ・シグナル）スコアは、信用スプレッド、ボラティリティ指数、成長プロキシを加重アルゴリズムで分析して算出されます。データはFRED（セントルイス連銀）およびYahoo Financeから取得され、独自の局面検出ロジックによって処理されます。",
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
            delayed_tick: "*延迟15分",
            methodology: "方法论",
            analysis_history: "分析历史 (Analysis History)",
            live_stream: "实时情报流"
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
            factors: { VOL: "波动", MOM: "动量", CRED: "信贷", SENT: "情绪", RATES: "利率", BREADTH: "广度", LIQ: "流动性" },
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
                SKEWED: "偏斜"
            }
        },
        strategy: {
            accumulate: "积极累积",
            neutral: "中立观望",
            defensive: "防御姿态"
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
            trend: "30天终端趋势",
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
            tickers: {
                BTC: "比特币", ETH: "以太坊", SOL: "索拉纳",
                GOLD: "黄金", OIL: "WTI原油", COPPER: "铜", NATGAS: "天然气",
                USDJPY: "美元/日元", EURUSD: "欧元/美元", USDINR: "美元/卢比", USDSAR: "美元/里亚尔", DXY: "美元指数",
                SPY: "标普500", QQQ: "纳斯达克100", IWM: "罗素2000", RSP: "标普500等权", HYG: "高收益债", NIFTY: "Nifty 50",
                VIX: "VIX恐慌指数", TNX: "美国10年期国债", MOVE: "MOVE指数", CRYPTO_SENTIMENT: "加密恐慌/贪婪指数"
            },
            search_placeholder: "搜索宏观知识库..."
        },
        subpages: {
            about: {
                title: "关于 OMNIMETRIC",
                mission: "项目使命",
                mission_content: "OmniMetric 是一个致力于提高市场透明度的个人量化宏观项目。我们将分散的机构领先指标（从高收益债利差到债券波动率）汇总到一个高密度的终端界面中。我们的目标是为个人研究人员提供机构级的宏观分析工具。",
                tech: "量化方法",
                tech_content: "GMS（全球宏观信号）评分是通过对信用利差、波动率指数和增长指标进行加权算法分析得出的。数据源自 FRED（圣路易斯联储）和雅虎财经，并通过专有的机制检测逻辑进行处理。",
                footer_note: "OmniMetric 是一个100%自律的算法项目。我们不提供个人支持或投资咨询。"
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
            delayed_tick: "*RETRASO 15m",
            methodology: "METODOLOGÍA",
            analysis_history: "Historial de Análisis",
            live_stream: "FLUJO DE INTELIGENCIA EN VIVO"
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
            factors: { VOL: "VOL", MOM: "MOM", CRED: "CRÉD", SENT: "SENT", RATES: "TIPOS", BREADTH: "AMPL", LIQ: "LIQ" },
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
                SKEWED: "SESGO"
            }
        },
        strategy: {
            accumulate: "ACUMULAR",
            neutral: "NEUTRAL",
            defensive: "DEFENSIVA"
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
            trend: "Tendencia de Terminal de 30 Días",
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
            tickers: {
                BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana",
                GOLD: "Oro", OIL: "Petróleo WTI", COPPER: "Cobre", NATGAS: "Gas Natural",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "Índice Dólar",
                SPY: "S&P 500", QQQ: "Nasdaq 100", IWM: "Russell 2000", RSP: "S&P 500 Equal Weight", HYG: "High Yield Bond", NIFTY: "Nifty 50",
                VIX: "Volatilidad VIX", TNX: "Bono 10 Años", MOVE: "Índice MOVE", CRYPTO_SENTIMENT: "Índice Miedo/Codicia"
            },
            search_placeholder: "Buscar..."
        },
        subpages: {
            about: {
                title: "SOBRE OMNIMETRIC",
                mission: "Nuestra Misión",
                mission_content: "OmniMetric es un proyecto personal de macro-cuantitativo dedicado a la transparencia del mercado. Agregamos indicadores líderes institucionales dispersos en una única interfaz de terminal de alta densidad. Nuestro objetivo es democratizar el análisis macro profesional para investigadores individuales.",
                tech: "Metodología Cuantitativa",
                tech_content: "El puntaje GMS (Global Macro Signal) se calcula mediante un análisis algorítmico ponderado de diferenciales de crédito, índices de volatilidad y proxis de crecimiento.",
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
            delayed_tick: "*15 मिनट देरी",
            methodology: "पद्धति (METHODOLOGY)",
            analysis_history: "विश्लेषण इतिहास",
            live_stream: "LIVE INTELLIGENCE STREAM"
        },
        methodology: {
            title: "GMS मात्रात्मक पद्धति",
            desc: "GMS स्कोर बाज़ार के 'डर', 'क्रेडिट तनाव' और 'मोमेंटम' को 0-100 के स्वामित्व वाले मात्रात्मक जोखिम सूचकांक में एकीकृत करता है।",
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
            factors: { VOL: "अस्थिरता", MOM: "वेग", CRED: "क्रेडिट", SENT: "भावना", RATES: "दरें", BREADTH: "विस्तार", LIQ: "तरलता" },
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
                SKEWED: "विषम"
            }
        },
        strategy: {
            accumulate: "संचय (ACCUMULATE)",
            neutral: "तटस्थ (NEUTRAL)",
            defensive: "रक्षात्मक (DEFENSIVE)"
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
            trend: "30-दिवसीय टर्मिनल रुझान",
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
            tickers: {
                BTC: "बिटकॉइन", ETH: "एथेरियम", SOL: "सोलाना",
                GOLD: "सोना", OIL: "कच्चा तेल", COPPER: "तांबा", NATGAS: "प्राकृतिक गैस",
                USDJPY: "USD/JPY", EURUSD: "EUR/USD", USDINR: "USD/INR", USDSAR: "USD/SAR", DXY: "डॉलर सूचकांक",
                SPY: "S&P 500", QQQ: "नैस्डैक 100", IWM: "रसेल 2000", RSP: "S&P 500 Equal Weight", HYG: "High Yield Bond", NIFTY: "निफ्टी 50",
                VIX: "VIX सूचकांक", TNX: "US 10Y Yield", MOVE: "MOVE Index", CRYPTO_SENTIMENT: "Crypto Fear & Greed"
            }
        },
        subpages: {
            about: {
                title: "OMNIMETRIC के बारे में",
                mission: "हमारा लक्ष्य",
                mission_content: "OmniMetric बाज़ार पारदर्शिता के लिए समर्पित एक व्यक्तिगत क्वांट-मैक्रो प्रोजेक्ट है।",
                tech: "क्वांट पद्धति",
                tech_content: "GMS स्कोर की गणना क्रेडिट स्प्रेड और अस्थिरता सूचकांकों के भारित एल्गोरिथम विश्लेषण का उपयोग करके की जाती है।",
                footer_note: "OmniMetric 100% स्वायत्त है।"
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
            delayed_tick: "*Tunda 15m",
            methodology: "METODOLOGI",
            analysis_history: "Riwayat Analisis",
            live_stream: "ALIRAN INTELIJEN LANGSUNG"
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
            factors: { VOL: "VOL", MOM: "MOM", CRED: "KRED", SENT: "SENT", RATES: "BUNGA", BREADTH: "LUAS", LIQ: "LIKUID" },
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
                SKEWED: "MIRING"
            }
        },
        strategy: {
            accumulate: "AKUMULASI",
            neutral: "NETRAL",
            defensive: "DEFENSIF"
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
            trend: "Tren Terminal 30 Hari",
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
            technical: "TEKNIKAL"
        },
        subpages: {
            about: {
                title: "TENTANG OMNIMETRIC",
                mission: "Misi Kami",
                mission_content: "OmniMetric adalah proyek makro-kuantitatif pribadi yang didedikasikan untuk transparansi pasar.",
                tech: "Metodologi Kuantitatif",
                tech_content: "Skor GMS dihitung menggunakan analisis algoritmik tertimbang dari spread kredit dan indeks volatilitas.",
                footer_note: "OmniMetric 100% otonom."
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
            delayed_tick: "*تأخير 15د",
            methodology: "المنهجية (METHODOLOGY)",
            analysis_history: "سجل التحليل"
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
            factors: { VOL: "تقلب", MOM: "زخم", CRED: "ائتمان", SENT: "شعور", RATES: "فائدة", BREADTH: "اتساع", LIQ: "سيولة" },
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
                SKEWED: "منحرف"
            }
        },
        strategy: {
            accumulate: "تجميع",
            neutral: "محايد",
            defensive: "دفاعي"
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
            trend: "اتجاه المحطة لمدة 30 يومًا",
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
            technical: "فني"
        },
        subpages: {
            about: {
                title: "حول OMNIMETRIC",
                mission: "مهمتنا",
                mission_content: "OmniMetric هو مشروع كمي كلي شخصي مخصص لشفافية السوق.",
                tech: "المنهجية الكمية",
                tech_content: "يتم حساب درجة GMS باستخدام تحليل خوارزمي مرجح لفوارق الائتمان ومؤشرات التقلب.",
                footer_note: "OmniMetric مستقل بنسبة 100%."
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
    }
};
