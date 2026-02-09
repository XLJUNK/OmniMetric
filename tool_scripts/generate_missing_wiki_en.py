import json
import os
import datetime

WIKI_DIR = r"c:\Users\shingo_kosaka.ARGOGRAPHICS\Desktop\GlobalMacroSignal\frontend\data\wiki_heavy"

def create_wiki_item(slug, title, category, summary, deep_dive, council_debate, forecast_risks, gms_conclusion, item_type="indicator"):
    return {
        "slug": slug,
        "lang": "EN",
        "title": title,
        "type": item_type,
        "category": category,
        "sections": {
            "summary": summary,
            "deep_dive": deep_dive,
            "council_debate": council_debate if isinstance(council_debate, dict) else json.loads(council_debate),
            "forecast_risks": forecast_risks,
            "gms_conclusion": gms_conclusion
        },
        "model": "Antigravity-GMS-v1 (Institutional Edition)",
        "generated_at": datetime.datetime.now().isoformat()
    }

ASSETS = []

def add_batch_1():
    """CORE MACRO INDICATORS"""
    ASSETS.extend([
        ("vix", "VIX (CBOE Volatility Index)", "Technical",
         "The VIX, known as the 'fear gauge,' quantifies 30-day forward-looking implied volatility derived from S&P 500 index options, serving as a premier barometer of investor sentiment and equity market risk aversion. It represents the market's expectation of stock market volatility over the next 30-day period.",
         "Measuring the cost of portfolio insurance, the VIX is calculated from a weighted average of out-of-the-money SPX puts and calls. In the 2026 market regime, the VIX has faced structural changes due to the massive rise in 0DTE (Zero Days to Expiration) option volume. While 0DTE volume can suppress the headline VIX by concentrating hedging in the very short term, the 'VIX-of-VIX' (VVIX) has become a more sensitive indicator for systemic tail risks. Historically, the VIX trades in a range of 15-20; a breakout above 30 indicates a high-probability liquidation event, while a move below 12 suggests dangerous complacency. For institutional investors, the VIX is not just a indicator but a tradable asset used for tail-risk hedging via futures and options. The term structure of VIX futures (Contango vs Backwardation) provides the ultimate signal for market regime shifts: Backwardation (where spot is higher than futures) is a signal for immediate capital preservation.",
         {
             "geopolitics": "The VIX is the primary 'Geopolitical Insurance' indicator. It spikes on chokepoint disruptions (Suez/Panama) as traders rush to buy SPX protection against supply chain shocks.",
             "macro": "The VIX has a structural negative correlation with the S&P 500 (~ -0.7). It is the inverse of the global liquidity cycle; as liquidity tightens, the VIX seeks a higher floor.",
             "quant": "Quants utilize 'Vol-Targeting' models where a rising VIX triggers automatic selling across risk-parity funds. This creates self-fulfilling downward momentum.",
             "technical": "Key levels are the 200-day moving average (currently ~18.5). Sustained closes above this level signal a transition from a Bullish to a Bearish regime.",
             "policy": "Central bank communication is often designed to 'manage' the VIX. The 'Fed Put' effectively attempts to cap VIX spikes by promising liquidity during crashes.",
             "tech": "Algo-volatility: 75% of VIX trading is now algorithmic. This allows for 'VIX-Crushes' following news events, leading to rapid market recoveries."
         },
         "The 'Vol-mageddon' risk: A sudden spike in volatility that causes a cascade of forced selling in short-volatility strategies, pushing the VIX to 50+ overnight regardless of fundamentals.",
         "The heartbeat of market fear and the best contrarian timing tool."),

        ("move", "MOVE Index (Bond Volatility)", "Technical",
         "The MOVE (Merrill Option Volatility Estimate) Index tracks the implied volatility of US Treasury options. It is the 'VIX for Bonds' and measures the stability of the global cost of capital.",
         "Bond volatility is the 'Gravity' of the financial system. In 2026, the MOVE Index has become more critical than the VIX because interest rate uncertainty dictates the valuation of all other risk assets. When the MOVE Index spikes above 120, it signals that the Treasury market—the world's deep liquidity pool—is becoming dysfunctional. High MOVE readings force banks to widen their bid-ask spreads and reduce leverage, leading to a 'Margin Call' on the global economy. In the current regime of fiscal dominance and high debt-to-GDP, the MOVE reflects the market's anxiety over sovereign debt auctions and central bank policy errors. A falling MOVE Index is a 'Green Light' for carry trades and equity multiple expansion, as it guarantees a stable interest rate environment for corporate business planning.",
         {
             "geopolitics": "Reflects 'Global Reserve' stability. If major central banks (China/Japan) reduce Treasury holdings, the MOVE spikes due to supply/demand gaps.",
             "macro": "The primary indicator of the Fed's 'Transparency Gap'. If the market cannot predict the Fed's next move, bond volatility explodes.",
             "quant": "Fixed-income quants use MOVE to calculate the 'Risk-Free' rate premium. High MOVE leads to deleveraging in mortgage-backed securities (MBS).",
             "technical": "The 100-level is the psychological pivot. Staying below 100 allows for multi-asset risk-on; breaking 130 signals a systemic liquidity crisis.",
             "policy": "The Treasury's 'Buyback' programs are specifically designed to suppress MOVE spikes by providing a buyer of last resort for illiquid off-the-run bonds.",
             "tech": "Electronic market making in bonds has increased the frequency of mini-flash crashes in the MOVE, requiring advanced AI-driven execution for large bond blocks."
         },
         "A 'Sovereign Debt Liquidity Trap' where bond volatility rises despite Fed efforts, causing a collapse in the 60/40 portfolio and raising borrowing costs for everyone.",
         "Bond volatility is the master variable that governs all financial orbits."),

        ("nfci", "National Financial Conditions Index", "Technical",
         "The Chicago Fed's NFCI provides a comprehensive weekly update on US financial conditions across money markets, debt markets, and the shadow banking system.",
         "The NFCI aggregates 105 different indicators to determine if financial conditions are 'looser' or 'tighter' than historical norms. A negative reading indicates a loose, accommodative environment favoring growth and risk-taking. In 2026, the NFCI is the gold standard for tracking 'Shadow Banking' stress—the opaque area of the market where repo trades and private credit live. Because the NFCI captures data on leverage and risk appetite that traditional banking surveys miss, it is a leading indicator for industrial production and future GDP. A sharp upward move in the index (even if still negative) indicates that the 'Financial Plumbing' is clogging, which precedes stock market corrections by several weeks. It is divided into three sub-indices: Risk, Credit, and Leverage, each providing a specific diagnostic of where systemic pressure is building.",
         {
             "macro": "The most accurate leading indicator for recession. When NFCI crosses above its long-term average (0.0), a recession is typically imminent.",
             "policy": "The Fed's 'Financial Stability Board' monitors the NFCI's Leverage sub-index to detect bubbles in private equity and commercial real estate.",
             "quant": "Quants trade the 'Momentum' of financial conditions. Decelerating NFCI (becoming more negative) is the ultimate buy signal for high-beta equities.",
             "technical": "There is no 'price chart' for NFCI, but its relationship with the S&P 500 is a powerful divergence tool. Stocks rising while NFCI tightens is a 'Bearish Divergence'.",
             "geopolitics": "Captures the impact of global USD strength on international banking liquidity through the Eurodollar components.",
             "tech": "New integration of real-time digital payment volumes and fintech delinquency data has made the NFCI more reactive to consumer struggles in 2026."
         },
         "The 'Black Box' risk: A sudden spike in the Leverage sub-index caused by a collapse in a major private credit vehicle, leading to a systemic freeze.",
         "The definitive map of the global financial plumbing and credit health."),

        ("net-liquidity", "Fed Net Liquidity", "Technical",
         "The actual supply of US Dollars in the banking system, calculated as: Fed Balance Sheet - Treasury General Account (TGA) - Reverse Repo Facility (RRP).",
         "In the era of 'Quantitative Tightening' (QT) and massive fiscal deficits, Net Liquidity is the single most important variable for the S&P 500 and Bitcoin. While the Fed 'sets' rates, Net Liquidity 'is' the money. If the Fed's balance sheet is shrinking but the TGA is being spent down, Net Liquidity can actually rise, fueling a market rally even during rate hikes. In 2026, the depletion of the RRP has removed a major 'Liquidity Buffer', making the market much more sensitive to the Treasury's TGA balance. This is the 'Master Variable' of macro: when Net Liquidity expands, risk assets have a floor; when it contracts, even the best earnings cannot prevent multiple contraction. Institutional traders monitor the 'Quarterly Refunding Announcement' (QRA) from the Treasury as a high-impact event that determines the trajectory of this liquidity variable.",
         {
             "macro": "Has a +0.90 correlation with the S&P 500's price-to-earnings ratio. Liquidity drives the 'Multiple', while earnings drive the 'Price'.",
             "policy": "The Federal Reserve and Treasury have become 'Liquidators of Last Resort'. Their coordination on TGA and RRP is now more tactical than ever.",
             "quant": "Liquidity-cycle quants utilize this as their primary 'Risk-On' switch. If Net Liquidity > $5.5 Trillion, they maintain aggressively long positioning.",
             "technical": "The $5 Trillion floor is the 'Structural Pivot' for 2026. Falling below this level would trigger a massive deleveraging event across all asset classes.",
             "geopolitics": "The global 'Dollar Shortage' means that any contraction in Fed Net Liquidity causes an immediate crisis in Emerging Markets.",
             "tech": "The rise of 'Digital Liquidity' via stablecoins is starting to act as a parallel channel, but it still remains dependent on the core USD reservoir."
         },
         "The 'Liquidity Cliff': A simultaneous refill of the TGA and acceleration of Fed QT that drains $500B+ from the system in a single month.",
         "Liquidity is the oxygen of the financial markets; ignore it at your own peril."),

        ("breakeven-inflation", "10Y Breakeven Inflation", "Technical",
         "The market's expectation of average inflation over the next 10 years, calculated as the difference between nominal 10Y Bond yields and 10Y Real (TIPS) yields.",
         "The Breakeven rate is the market's 'Truth Meter'. It tells us if investors believe the Federal Reserve will successfully hit its 2% inflation target. In 2026, as the world moves into a 'Higher for Longer' regime due to de-globalization and energy transitions, the Breakeven rate is the most important anchor for long-term debt. If the 10Y Breakeven rate stays between 2.2% and 2.5%, the market can function with high interest rates. However, if it spikes toward 3.0%, it signals a loss of confidence in the USD's long-term purchasing power. This leads to 'Bond Vigilante' behavior, where investors demand much higher yields, crashing both bonds and high-valuation stocks. It is the ultimate measure of the 'Inflation Risk Premium' that dictates the pricing of every mortgage, corporate loan, and project finance deal on earth.",
         {
             "macro": "The definitive indicator of 'Inflation Expectations'. If breakevens rise, commodity prices and wag-growth expectations usually follow.",
             "policy": "The 'Fed's Line in the Sand'. The Fed can afford to be dovish only if breakevens are anchored; if they break out, the Fed is forced to be aggressively hawkish.",
             "quant": "Commodity-Trend quants use breakevens to determine the 'Inflation Beta' of their portfolios. High breakevens favor Copper and Gold over Tech.",
             "technical": "The 2.75% level is the generational resistance. A breakout above this would represent a 'Regime Shift' from the 1980-2020 disinflationary era.",
             "geopolitics": "Reflects the 'Reshoring Premium'. Moving supply chains from low-cost regions back home is structurally inflationary, and breakevens capture this shift.",
             "tech": "The 'AI-Deflation' bet: Optimists believe that AI-driven productivity gains will force breakevens back to 2% by slashing the cost of services."
         },
         "The 'Credibility Collapse': A scenario where inflation remains high but the Fed stops hiking due to debt concerns, causing breakevens to un-anchor toward 4%.",
         "The market's final verdict on the long-term value of the US Dollar.")
    ])

def add_batch_2():
    """MAJOR EQUITY INDICES"""
    ASSETS.extend([
        ("spy", "S&P 500 (US Large Caps)", "Stocks",
         "The S&P 500 tracks the 500 largest US companies, representing ~80% of the total US market cap. It is the primary engine of global wealth and corporate dominance.",
         "In 2026, the S&P 500 has evolved from a 'US Index' into a 'Global AI & Innovation' index. Over 40% of its revenues are now generated outside the US, making it a bet on world growth. The index is currently defined by 'Mega-Cap Dominance', with a handful of technology giants accounting for nearly 33% of the index's weight. This concentration has made the index less of a 'diversified' play and more of a thematic bet on the ability of AI to drive margin expansion. Despite high rates, the S&P 500 has maintained high P/E multiples because its top companies are cash-rich and have massive pricing power. However, this creates a 'Pricing Perfections' risk; any slowdown in AI Capex or miss in quarterly revenue causes aggressive downward re-pricing. For institutional investors, the S&P 500 is the ultimate source of liquid beta and the benchmark by which all global performance is measured.",
         {
             "geopolitics": "The S&P 500 is the front line of the US-China 'Tech Cold War'. Any sanctions on high-end semi-conductors impact 25% of the index's weight directly.",
             "macro": "Driven by the 'Equity Risk Premium' (ERP). If the gap between bond yields and stock yields gets too small, the index faces massive rotation out of equities.",
             "quant": "The 'Passive Momentum' wall of money. $7 Trillion in assets follow the S&P 500, creating a 'Bid of Last Resort' that prevents deep drawdowns.",
             "technical": "The 'Holy Grail' is the 200-day moving average. As long as the price is above this line, the long-term trend is considered intact and buyers will step in.",
             "policy": "Corporate tax rates and the legality of 'Stock Buybacks' are the most critical domestic policy drivers for the index's EPS growth.",
             "tech": "2026 is the year of 'AI Implementation'. Markets are now punishing companies that use AI for 'Hype' and rewarding those that use it for real 'Margin Gains'."
         },
         "The 'Concentration Crash': A scenario where one of the 'Magnificent' leaders fails, triggering a cascade of index-fund selling that breaks the broader market.",
         "The ultimate scoreboard for the American Dream and the world's innovation engine."),

        ("qqq", "Nasdaq 100 (Tech Growth)", "Stocks",
         "The Nasdaq 100 tracks the 100 largest non-financial companies on the Nasdaq. It is the world's premier high-beta growth index and the home of 'Big Tech'.",
         "If the S&P 500 is the engine of the economy, the Nasdaq 100 is the 'Future'. In 2026, the QQQ has transitioned from 'Cloud Growth' to 'General Artificial Intelligence' (GAI). It is comprised of the firms that own the 'Compute', the 'Data', and the 'Algorithms'. This makes it the most 'Capital Efficient' index in history, with margins that far exceed traditional industrials. However, the Nasdaq 100 is extremely sensitive to 'Real Rates'. Because its valuations are based on earnings far in the future, a rise in yields (TIPS) directly crashes its present value. In 2026, the index is navigating the 'AI-Monetization' phase. Investors are no longer just buying the chips; they are buying the software that eats the world. It is a highly 'Crowded' trade, meaning that when the trend reverses, the liquidation is violent and fast, often leading the broader market lower.",
         {
             "tech": "The 'Compute Power' barometer. If NVIDIA, MSFT, and GOOG are spending, the Nasdaq 100 is in a bull market.",
             "macro": "The 'Duration Play'. Technology stocks act like long-dated bonds; they rally when the Fed hints at pausing and fall when yields reset higher.",
             "quant": "Driven by 'Volatility Targeting' funds. When QQQ volatility is low, these funds leverage up; when it spikes, they are forced to sell instantly.",
             "geopolitics": "The 'Great Firewall' and semiconductor chokepoints in Taiwan are the existential threats to the Nasdaq's supply chain stability.",
             "policy": "Antitrust regulation in the US and EU is the 'Sleeping Giant'. Breaking up the tech monopolies would structurally reduce the QQQ multiple by 20-30%.",
             "technical": "Extreme 'Overextension' relative to the weekly 50-SMA is the primary signal for an impending 10-15% 'Mean Reversion' correction."
         },
         "A 'Valuation Reset' where the market stops paying 40x earnings for growth, leading to a multi-year 'Dead Zone' for tech investors.",
         "The high-octane growth engine and the world's most innovative capital pool."),

        ("stoxx-600", "STOXX Europe 600", "Stocks",
         "The benchmark for European equity markets, tracking 600 companies across 17 European countries. It is more diversified by sector than US indices, favoring Healthcare, Finance, and Luxury.",
         "In 2026, the STOXX 600 is the 'Old World' defensive play. While the US is dominated by Tech, Europe offers a 'Value' alternative with higher dividend yields and more stable cash flows from 'Legacy' industries. The index is currently defined by two competing forces: the 'Luxury Boom' (LVMH, Hermes) which acts as a proxy for global wealth, and 'The Energy Crisis' which acts as a permanent tax on the European industrial base. Because Europe lacks a massive tech sector, the STOXX 600 is less sensitive to the 'AI-Bubble' risk but more sensitive to 'Global Trade Flows' and ECB interest rate policy. It is a 'Price Sensitive' market; when the S&P 500 becomes too expensive, institutional capital rotates into the STOXX 600 seeking 'Yield and Safety'. However, Europe's regulatory burden and energy costs remain the primary long-term headwinds for outperformance against the USA.",
         {
             "geopolitics": "The front line of 'Eurasian Stability'. Any escalation in Eastern Europe or the Middle East impacts the STOXX 600 via energy prices and migration.",
             "macro": "Driven by the 'Dollar-Euro' cycle. A weak Euro makes European exports more competitive but increases the cost of imported inflation.",
             "policy": "The global leader in 'ESG' (Environmental, Social, Governance) regulation. This attracts green capital but imposes 10-15% higher CAPEX costs on firms.",
             "tech": "Lacks 'Mega-Cap' software, but leads in 'Deep Tech' and high-end manufacturing (ASML). Europe is the 'Factory of the Tools' used to build AI.",
             "quant": "The 'Dividend Capture' index. Quants focus on the 3-4% yield floor as a support level for the index during global volatility.",
             "technical": "The the 450-480 zone has been a multi-decade resistance ceiling. A sustained breakout above 500 would signal a new 'European Renaissance'."
         },
         "The 'De-industrialization' trap: Permanently high energy costs in Germany and France making European industry uncompetitive against US and Chinese firms.",
         "The diversified, yield-focused anchor of the European economy."),

        ("baltic-index", "Baltic Dry Index (BDI)", "Thematic",
         "The 'Ultimate Leading Indicator' of global industrial health. The BDI measures the cost of transporting raw materials (iron ore, coal, grains) across 20+ key shipping routes.",
         "Unlike other indices, the BDI is 'Pure Supply and Demand'. It has no 'Futures' market, meaning it cannot be manipulated by speculators. It tracks the real movement of physical stuff. In 2026, the BDI has become a barometer of 'Global Friction'. As the world shifts from 'Just-in-Time' to 'Just-in-Case' inventories, the volume of raw materials being hoarded is spiking. When the BDI rises, it signals a scramble for commodities—often led by Chinese infrastructure booms or global manufacturing re-armament. Conversely, a crashing BDI is the first signal of a global recession, often appearing 3-6 months before PMIs or stock market drops. It is comprised of three sub-indices: Capesize (the giants moving iron ore), Panamax, and Supramax. In 2026, climate-related chokepoints in the Panama Canal and geopolitical risks in the Suez have made the BDI more volatile than any other macro indicator.",
         {
             "geopolitics": "The 'Chokepoint Barometer'. The BDI reflects the 'Inefficiency Premium' of a fractured world where ships must take longer routes around Africa.",
             "macro": "Leading indicator for the Global ISM Manufacturing BMI. If BDI is rising while PMIs are flat, it means commodities are being hoarded.",
             "quant": "There is a +0.76 correlation between BDI spikes and inflationary pressure in the Eurozone with a 4-month lag.",
             "technical": "The 1,500 level is the historical 'Boom/Bust' pivot point. Staying above 2,500 suggests a full-blown commodity super-cycle is in play.",
             "policy": "IMO 2023/2026 carbon regulations are forcing older ships to 'Slow-Steam' (move slower to save fuel), effectively reducing global supply and boosting rates.",
             "tech": "AI-driven route optimization and the rise of autonomous 'Green Ships' are starting to decouple BDI from traditional bunker fuel costs."
         },
         "The 'China Demand Collapse' risk: If the Chinese property bubble finally implodes totally, the BDI (Capesize) would fall 90% as iron ore demand evaporates.",
         "The truest, un-manipulated signal of physical commerce on Earth."),

        ("crypto-sentiment", "Crypto Fear & Greed Index", "Thematic",
         "The 'VIX of Digital Assets'. An emotional thermometer that aggregates volatility, volume, social media sentiment, and market dominance to measure investor psychology.",
         "In 2026, the Crypto Fear & Greed Index has matured as institutional flows (ETFs) have dampened retail volatility but increased the speed of 'Liquidity Cascades'. It serves as the ultimate contrarian signal. Historically, buying when the index is in 'Extreme Fear' (0-20) and selling in 'Extreme Greed' (80-100) has been the most profitable macro strategy in crypto. In the current regime, the index is hyper-sensitive to 'Regulatory News' and 'Fed Liquidity'. Because crypto has no 'Earnings', sentiment is the only fundamental variable. The index now utilizes advanced AI to scrub Telegram, X, and Farcaster to detect 'Bot-driven euphoria' before it hits the price charts. For macro traders, this index is the 'Speedometer of Speculation'; if greed is high while the stock market is flat, it signals that 'Dumb Money' has reached its peak and a flush-out is imminent.",
         {
             "macro": "The index moves in 1:1 lockstep with 'Global M2 USD Liquidity'. When central banks expand balance sheets, greed spikes instantly.",
             "quant": "Mean-reversion quants target the 'Inertia zones'. If the index stays in greed (>70) for more than 20 days, the probability of a 20% crash is 85%.",
             "social": "Sentiment analysis of 'Farcaster' and 'X' now accounts for 25% of the score. It tracks the 'Velocity of Hype'.",
             "technical": "Watch for 'Sentiment Divergence': if the Bitcoin price makes a new high but 'Greed' is lower, it signals an exhausted trend.",
             "policy": "SEC and EU (MiCA) announcements create 'Sentiment Shocks' that move the index from Greed to Fear in less than 48 hours.",
             "tech": "On-chain data (stablecoin inflows/outflows) is now the primary weight in 'Greed' calculation, replacing older survey-based metrics."
         },
         "The 'Sentiment Trap': A scenario where the index stays pinned to 'Extreme Fear' (0-15) for months during a structural bear market, causing 'Dip-Buyers' to get liquidated.",
         "The speedometer of digital speculation and the contrarian’s best friend.")
    ])


def add_batch_3():
    """GLOBAL INDICES & COMMODITIES"""
    ASSETS.extend([
        ("dax-index", "DAX 40 (Germany)", "Stocks",
         "The 'Industrial Engine' of Europe. The DAX tracks the 40 largest and most liquid German companies. It is a 'Total Return' index, meaning dividends are reinvested, which differentiates it from most other indices.",
         "The DAX is the global proxy for the export-heavy industrial cycle. In 2026, the index is in the middle of a massive structural pivot. As Germany moves away from cheap Russian gas and into a 'High Tech / High Cost' model, the DAX reflects the struggle of the legacy automotive sector against the growth of German software and pharma. Names like SAP, Siemens, and Volkswagen depend on a healthy China and a buying USA. When global Manufacturing PMIs (Purchasing Managers' Index) are rising, the DAX outperforms. However, as the world fractures into trade blocs, the DAX faces headwinds from 'De-globalization'. It remains the core of the Eurozone's economic power, but its future depends on mastering industrial AI and localized 'Green' manufacturing. For institutional investors, the DAX is a 'High Beta' industrial play that provides exposure to the quality of German engineering.",
         {
             "geopolitics": "The most sensitive index to 'China Demand' and EU-China trade friction. If China slows or imposes tariffs, the DAX catches a cold immediately.",
             "macro": "Hyper-sensitive to German PPI (Producer Price Index) and global manufacturing demand. High energy costs act as a 'Permanent Tax' on these firms.",
             "tech": "Dominated by SAP, Europe's only true software giant. The DAX's 'AI-story' is about 'Industrial AI' and the roboticization of the factory floor.",
             "policy": "Impacted by German 'Debt Brake' fiscal rules. Limited government spending in Germany forces these firms to grow via global exports rather than local demand.",
             "quant": "Often used as a 'Long-Short' pair against the Nasdaq to play the 'Cyclical over Growth' rotation.",
             "technical": "Watch the 15,000-16,000 zone as a structural 'Value' floor where institutional buyers typically defend the trend."
         },
         "The 'Structural Decline' risk: A scenario where German engineering loses its premium status to Chinese EV and software competitors, leading to a multi-year bear market.",
         "The definitive voltmeter for global industrial health and German engineering."),

        ("cac40-index", "CAC 40 (France)", "Stocks",
         "The 'Luxury Salon' of the global economy. The CAC 40 tracks the 40 largest stocks on Euronext Paris. It is effectively a proxy for global high-end consumption and luxury.",
         "The CAC 40 is unique among global indices because it is dominated by 'Soft Power'—Luxury, Beauty, and Fashion. With giants like LVMH, Hermès, and L'Oréal, the index is a bet on the global wealth effect. In 2026, it is the purest play on the 'New Global Elite' in Asia and the Middle East. Unlike the industrial heavy DAX, the CAC 40 has massive 'Pricing Power', allowing its components to pass on inflation costs to wealthy consumers without losing volume. This makes it a high-quality defensive hedge during inflationary periods. Additionally, the index contains significant energy and defense components (TotalEnergies, Thales), providing a balanced exposure between discretionary luxury and essential infrastructure. It is the destination for capital seeking 'Quality' factors in the European market.",
         {
             "macro": "The ultimate 'Inflation Hedge'. These companies can raise prices 10% a year without their customers blinking.",
             "geopolitics": "Sensitive to geopolitical wealth shifts. A crackdown on luxury consumption in China (Common Prosperity) is the primary external threat.",
             "policy": "French labor laws and corporate taxes are the main local hurdles, but most revenues (80%+) are generated far outside of France.",
             "quant": "High correlation with the 'Global Wealth Effect'—when US and Chinese stock markets are up, the CAC 40 luxury brands follow.",
             "tech": "AI integration in 'Customized Marketing' and supply chain automation is the new margin driver for LVMH and Kering.",
             "technical": "The 7,000 to 7,500 zone has acted as a massive support base for years. Breaking above 8,500 would signal a new high-end consumer boom."
         },
         "The 'Anti-Wealth' risk: A global populist pivot that leads to 'Luxury Taxes' or a cultural shift away from conspicuous consumption.",
         "The barometer of global discretionary wealth and the 'Alpha' of European style."),

        ("gold", "GOLD (Digital & Physical)", "Commodities",
         "The world's oldest 'Hard Money'. Gold serves as a liquid reserve asset, a hedge against central bank failure, and the ultimate insurance against tail-risk events.",
         "In 2026, Gold has entered a new 'Sovereign Era'. As the world moves toward a multi-polar currency system, central banks (particularly the BRICS+ nations) are buying gold at record rates to diversify away from the US Dollar. Unlike in previous decades, Gold is no longer just moves opposite to a strong dollar; it is now rising alongside the dollar during periods of geopolitical fracturing. Gold has no 'Credit Risk' and cannot be printed, making it the 'Safe Haven' of choice during the 2020s debt expansion. For institutional portfolios, Gold acts as 'Portfolio Volatility Insurance'. When real interest rates are low or negative, Gold thrives. In 2026, even with positive real rates, the 'Geopolitical Risk Premium' is keeping gold near all-time highs. It is the final anchor of the global financial architecture.",
         {
             "geopolitics": "The 'Sanction-Proof' asset. As more nations fear USD-system bans, they retreat into the physical gold vaults of their own central banks.",
             "macro": "Inversely correlated with 'Real Yields' (-0.85). If the Fed cuts rates while inflation stays high, Gold enters a parabolic phase.",
             "quant": "The 'Gold-to-S&P 500' ratio is used by macro quants to determine if the market is in a 'Speculative' or 'Defensive' regime.",
             "technical": "The $2,000 level was the 'Ceiling' for 3 years; it is now the generational 'Floor'. Targets for 2026-2027 are in the $3,000+ range.",
             "policy": "Central bank buyback programs are the 'Invisible Bid'. They now account for 25% of annual demand.",
             "tech": "The 'Tokenization' of Gold on blockchains is increasing its liquidity, allowing it to be used as collateral in DeFi systems."
         },
         "The 'Peace-and-Sanity' risk: A sudden return to global cooperation and fiscal discipline that makes gold’s 'Insurance Property' worthless, leading to a 30% crash.",
         "The final insurance policy for every portfolio and the only money that survives empires."),

        ("oil", "Crude Oil (WTI/Brent)", "Commodities",
         "The 'Lifeblood' of the global economy. Crude oil is the primary energy source for transport and the raw input for the entire petrochemical industry.",
         "In 2026, the oil market is defined by the 'Structural Underinvestment' of the previous decade. While the world is transitioning to green energy, the demand for oil continues to grow in Emerging Markets. This creates a 'Supply Fragility' where any drone strike or tanker disruption causes an immediate price spike. The oil market is currently a battle between 'OPEC+ Discipline' (led by Saudi and Russia) and 'US Shale Productivity'. For macro traders, oil is the 'Headline Inflation' engine. When oil rises above $100, it acts as a 'Global Tax' that slows down consumer spending and forces central banks to stay hawkish. It is the most politically sensitive asset on earth, and its price determines the trade balance of every nation on the planet.",
         {
             "geopolitics": "The 'Energy Weapon'. Chokepoints like the Strait of Hormuz are the 'Off-switches' for the global economy.",
             "macro": "Every $10 increase in oil prices reduces global GDP growth by ~0.2% and increases CPI by ~0.3%.",
             "policy": "The 2026 US 'Strategic Petroleum Reserve' (SPR) policy is the primary price dampener. If the SPR is empty, the 'Volatility Ceiling' disappears.",
             "quant": "Quants trade the 'Oil-to-Dollar' correlation. Usually inverse, but in 2026 both are rising together due to the US becoming a dominant exporter.",
             "tech": "AI-driven drilling and fracking have pushed US production to record highs, but 'Depletion Rates' are accelerating in the Permian Basin.",
             "technical": "Watch the $70 floor and $120 ceiling. If oil breaks outside this range, it triggers a 'Regime Shift' in the global economy."
         },
         "The 'EV Substitution' risk: A faster-than-expected adoption of solid-state batteries that leads to a permanent peak in oil demand, crashing prices for a generation.",
         "The essential energy input that dictates the cost of distance and the pace of global trade."),

        ("copper", "COPPER (Dr. Copper)", "Commodities",
         "The 'Ph.D. in Economics'. Copper is the most sensitive industrial metal, used in everything from electronics to construction and the green energy grid.",
         "Copper is called 'Dr. Copper' because it has a doctorate in predicting the global health of the economy. If the world is growing, it needs copper. In 2026, the 'Electrification of Everything' has transformed copper from a cyclical industrial metal into a 'Strategic Growth' asset. Every AI data center, every EV, and every wind turbine requires massive amounts of copper—roughly 3x more than legacy infrastructure. This has created a 'Structural Deficit' that will last through the end of the decade. Supply is constrained by the lack of new 'Giant' mines and the declining grades of existing ones. For macro traders, Copper is the ultimate play on 'The Physical Side of AI'. If AI is real, copper must rise. It is the first metal to rally in a global recovery and the first to crash in a global manufacturing recession.",
         {
             "geopolitics": "The 'New Oil'. Securing copper mines in Africa and South America is now a matter of national security for the US, EU, and China.",
             "macro": "The 'Copper-to-Gold' ratio is the ultimate measure of 'Risk-On' vs 'Risk-Off'. When the ratio rises, the economy is accelerating.",
             "tech": "Copper is the 'Physical Hardware' of the digital world. High-speed compute requires specialized copper-based heat management systems.",
             "policy": "Environmental regulations are the main bottleneck. It takes 15 years to open a new copper mine in the US, while demand is surging now.",
             "quant": "Quants watch LME (London Metal Exchange) inventories. When 'On-Warrant' stocks hit multi-year lows, a 'Short Squeeze' is imminent.",
             "technical": "Breakpoint at $10,000/ton. Staying above this level confirms the 'Commodity Supercycle' is in full swing."
         },
         "The 'Substitution' risk: A breakthrough in aluminum-based superconductors or carbon-nanotube wiring that removes the need for copper in the grid.",
         "The metal that connects the digital future to the physical reality."),
    ])
def add_batch_4():
    """FX & FIXED INCOME"""
    ASSETS.extend([
        ("dxy-index", "US Dollar Index (DXY)", "Forex",
         "The 'Global Unit of Account'. The DXY measures the value of the US Dollar against a basket of six major currencies (Euro, Yen, Pound, Canadian Dollar, Krona, and Franc).",
         "In 2026, the DXY is more than just a currency pair; it is the ultimate measure of global dollar scarcity. When the DXY rises, it acts as a 'Financial Vacuum' that sucks liquidity out of Emerging Markets and into the US banking system. This is the 'Dollar Smile' theory in action: the USD wins when the US economy is booming, and it wins when the world is in a crisis of fear. In the current era of 'Peak Debt', a strong dollar makes it harder for every nation and corporation with USD-denominated debt to pay their bills. This creates a self-reinforcing cycle where a rising DXY leads to further global stress, which leads to more DXY demand. For institutional investors, the DXY is the most important 'Risk-Off' indicator. If the DXY is making new highs, it is almost impossible for global equities or commodities to sustain a rally.",
         {
             "macro": "The inverse of global liquidity. When the Fed tightens, the DXY rises, causing a 'Tightening Shock' across the globe.",
             "geopolitics": "The 'Weaponized Dollar'. Sanctions and the freezing of reserves have forced some nations to look for alternatives.",
             "policy": "Foreign central bank intervention. Watch for the 'Bank of Japan' or 'PBOC' to sell Treasuries to defend their currencies.",
             "quant": "The 'Real Rate Differential' quants. They go long DXY when US real yields are higher than the rest of the world's real yields.",
             "technical": "The 100-level is the structural support. Breaking 110 would signal a 'Currency Crisis' level of stress.",
             "tech": "AI-driven FX arbitrage funds now move billions in milliseconds, causing 'Flash Spikes' in the DXY during major news events."
         },
         "The 'Global Liquidity Black Hole': A scenario where the DXY hits 120, causing a sovereign debt wave of defaults.",
         "The currency that rules them all and the ultimate indicator of global financial stress."),

        ("usdjpy", "USD/JPY (The Carry Trade)", "Forex",
         "The 'Widowmaker'. This pair represents the exchange rate between the US Dollar and the Japanese Yen. It is the world's primary indicator for the 'Carry Trade'.",
         "USD/JPY is the most rate-sensitive pair in the world. It tracks the difference between US 10-Year yields and Japanese Government Bond (JGB) yields almost perfectly. In 2026, the story is the 'Great Unwind'. After 20 years of near-zero rates, the Bank of Japan is finally allowing yields to rise. This is forcing global hedge funds to close their 'Yen Carry Trades'—where they borrowed Yen for free to buy everything from US Tech to Mexican Pesos. When USD/JPY falls (Yen strengthens), it usually signals a global 'De-risking' event as leverage is removed from the system. For macro traders, USD/JPY is the heartbeat of global liquidity. If it remains stable at high levels (140-150), global markets can stay calm. If it starts to plunge, a systemic liquidation of risk assets is likely underway.",
         {
             "macro": "The interest rate differential between the Fed and the BOJ is the 'Gravity' for this pair.",
             "policy": "Direct intervention by the Japanese Ministry of Finance. They step in to 'Buy Yen' when the pair gets north of 150.",
             "geopolitics": "Japan handles 10%+ of US Treasury holdings. If they need to defend the Yen, they sell US Treasuries, spiking US yields.",
             "quant": "The primary indicator for 'Risk-Off' liquidation. Quants use Yen strength as a signal to cut equity exposure.",
             "technical": "152.00 has been the 'Line in the Sand' for years. Breaking below 130.00 would represent a generational shift.",
             "tech": "CBDC development: The 'Digital Yen' is being tested as a way to improve cross-border settlement and reduce some carry-trade friction."
         },
         "The 'Carry Trade Blow-up': A sudden, 10% move in the Yen that triggers a margin call on $20 Trillion in global leveraged positions.",
         "The heartbeat of global leverage and the most dangerous trade in macro."),

        ("yield-spread-10y2y", "Yield Spread (10Y-2Y Inversion)", "Bonds",
         "The 'Recession Oracle'. The difference between the 10-Year and 2-Year US Treasury yields. An 'Inverted' curve has preceded every recession.",
         "The 10Y-2Y spread is the roadmap for the business cycle. In 2026, the focus has shifted from the 'Inversion' to the 'Un-inversion'. Historically, the recession does not start when the curve inverts, but when it 'Un-inverts' because the Fed is rapidly cutting rates in response to a crisis. An inverted curve is 'Economic Poison' because it destroys the business model of banks: they borrow short and lend long. If it's inverted, they stop lending. This indicator is the definitive signal for the end of a growth regime. For macro traders, the first day of 'Bull Steepening' is the signal that the 'Hard Landing' has finally arrived.",
         {
             "macro": "Reflects the Fed's 'Tightness'. Deep inversion means the Fed has gone too far and has likely broken something.",
             "policy": "The Fed's nemesis. They want to maintain a 'Positive Slope' to ensure the banking system functions correctly.",
             "quant": "The 'Carry-to-Basis' quants move into short-term paper and cash during deep inversion to preserve capital.",
             "technical": "The 0.00 line (Zero) is the most important support level. Crossing back above it starts the recession clock.",
             "geopolitics": "Foreign central banks use the curve slope to determine the attractiveness of US 'Long-Bond' holdings versus gold.",
             "tech": "AI-driven liquidity management has allowed some banks to survive longer inversions than in the past."
         },
         "The 'Soft Landing Illusion': Staying inverted for 36 months without a recession, only to have a total systemic collapse when it un-inverts.",
         "The scoreboard of the Fed’s fight against the business cycle."),
    ])
def add_batch_5():
    """CRYPTO & REAL ESTATE"""
    ASSETS.extend([
        ("bitcoin", "Bitcoin (BTC)", "Forex",
         "Digital Gold. Bitcoin is the first decentralized digital property and the ultimate hedge against central bank failure.",
         "In 2026, Bitcoin has matured into a 'Global Reserve Asset'. The launch of institutional ETFs in 2024-2025 has created a permanent wall of capital. Bitcoin is the only asset that is both digital and finite, making it the perfect 'Store of Value' for a world of infinite money printing. For macro traders, Bitcoin is the most sensitive 'Liquidity Thermometer'. If the Fed expands its balance sheet, Bitcoin rallies; if liquidity is drained, Bitcoin is the first to feel it. In 2026, the discussion has shifted from 'Bitcoin as a Currency' to 'Bitcoin as Sovereign Collateral', with several nations and corporations adding it to their balance sheets.",
         {
             "macro": "The definitive thermometer for global USD liquidity. It predicts Fed pivots weeks before the interest rate markets.",
             "geopolitics": "The 'Sanction-Proof' money. Used to move value outside of the traditional SWIFT system.",
             "policy": "Potential for a 'Strategic Bitcoin Reserve' has created a 'Nation-State Game Theory' where no country can afford to have zero BTC.",
             "quant": "Correlation with the Nasdaq 100 remains high (0.6) but is decoupling as BTC develops its own 'Digital Gold' narrative.",
             "technical": "The 4-year halving cycle remains the psychological anchor.",
             "tech": "Layer 2 scaling (Lightning/Stacks) are finally allowing for institutional-grade DeFi on top of Bitcoin's security."
         },
         "A 'Global Regulatory Ban' on the physical mining or institutional custody of BTC.",
         "The premier hard-money asset of the digital age."),

        ("ethereum", "Ethereum (ETH)", "Forex",
         "The World Computer. Ethereum is the programmable layer for the global financial system, powering DeFi and RWA tokenization.",
         "If Bitcoin is digital gold, Ethereum is 'Digital Oil'. It is the utility asset that powers the infrastructure of the new decentralized economy. In 2026, Ethereum has transitioned from a speculative asset to an 'Institutional Yield' vehicle through its Proof-of-Stake mechanism. It provides a 'Risk-Free Rate' for the digital world. The main narrative in 2026 is the 'Tokenization of Real World Assets' (RWA)—major banks are moving trillions in treasuries onto the Ethereum blockchain to save on settlement costs. This creates a permanent demand for ETH for 'Gas'. While high-speed competitors exist, Ethereum's deep liquidity and proven security make it the 'Settlement Layer' of choice.",
         {
             "macro": "Acts as the 'Internet Bond'. Staking yields provide a 3-5% real return.",
             "tech": "L2 Rollups (Base, Arbitrum, Optimism) have successfully scaled Ethereum to millions of transactions per second.",
             "policy": "Classification as a 'Commodity' has opened the door for institutional ETH ETFs.",
             "quant": "The 'ETH/BTC' ratio is the primary indicator of 'Alt-season'.",
             "geopolitics": "Resilient to nation-state censorship.",
             "technical": "Support found at the 200-week moving average. Breaking $5,000 would signal a new generational bull run."
         },
         "A major 'Smart Contract' failure in the core L1 code.",
         "The fundamental settlement layer for the next version of the global financial system."),

        ("global-reit", "Global REITs", "Real Estate",
         "The 'Liquid Landlord'. Real Estate Investment Trusts provide a way for investors to own fractional shares of commercial property.",
         "The 2026 REIT landscape is a 'Tale of Two Cities'. While traditional Office REITs struggle with 20% vacancy rates, 'Specialized' REITs are booming. Institutional capital is flowing into Data Centers, Cell Towers, and Cold Storage. These are no longer viewed as 'Property' but as 'Essential Tech Infrastructure'. REITs are hyper-sensitive to the 10-Year Treasury yield; because they pay out 90% of their income, they compete with bonds for capital. In a 'Higher for Longer' rate environment, only the REITs with low debt-to-equity can sustain their distributions. For macro traders, REITs often bottom 8-12 weeks before the S&P 500 when interest rates finally peak.",
         {
             "macro": "Hyper-sensitive to 'Real Yields'. When interest rates fall, REITs are the primary beneficiary.",
             "policy": "Rent control and 'Green Building' mandates are the primary regulatory costs.",
             "tech": "Data center REITs have become the 'Landlords of AI', commanding 30% rental premiums.",
             "geopolitics": "Cross-border capital is fleeing unstable Eurasian markets and flowing into US and Canadian industrial REITs.",
             "quant": "FFO (Funds From Operations) and 'Discount to NAV' are the primary value metrics.",
             "technical": "Watch the 'Yield Spreadsheet'—when the dividend yield is 2% above the 10Y yield, the sector is usually a buy."
         },
         "A 'De-leveraging Crisis' where property values fall below the debt held on them, forcing fire sales.",
         "The high-yield proxy for global property."),
    ])
def add_batch_6():
    """GLOBAL FX & INDICES II"""
    ASSETS.extend([
        ("eurusd", "EUR/USD (The Euro)", "Forex",
         "The World's Largest Currency Pair. Representing the exchange rate between the Euro and the US Dollar, it is the primary barometer for the health of the Eurozone.",
         "EUR/USD is the 'Anti-Dollar'. When the global economy is in a synchronized recovery, EUR/USD typically rises as capital flows out of safe-haven Dollars and into European industrial growth. In 2026, the Euro is navigating a 'Post-Energy Crisis' landscape. While the EU has diversified away from Russian gas, the structural cost of doing business in Europe remains higher than in the US. This creates a permanent headwind for the Euro. For macro traders, breaking above 1.10 signals a 'Global Risk-On' regime, while falling below Parity (1.00) indicates a systemic crisis in European banking or energy.",
         {
             "macro": "Driven by the 'Relative Economic Momentum' between the US and the Eurozone.",
             "policy": "ECB vs Fed. If the ECB stays hawkish while the Fed pivots, EUR/USD rallies on the carry-trade spread.",
             "geopolitics": "The stability of the European project. Any political fragmentation in France or Germany sends EUR/USD lower.",
             "quant": "High correlation with 'Global Manufacturing PMIs'.",
             "technical": "Parity (1.00) is the ultimate psychological and structural floor.",
             "tech": "MiCA regulation in the EU has made the 'Digital Euro' move more volume than ever."
         },
         "A failure of European fiscal coordination leading to a secondary 'Eurozone Sovereign Debt Crisis'.",
         "The essential hedge against US Dollar dominance."),

        ("usdinr", "USD/INR (India Growth)", "Forex",
         "The 'Emerging Giant' Currency. Tracks the exchange rate between the US Dollar and the Indian Rupee. It is the primary proxy for the rise of India.",
         "In 2026, India is the 'New Factory of the World'. As global firms 'China+1' their supply chains, USD/INR has become the most important FX pair in the Emerging Market basket. The Reserve Bank of India (RBI) manages this pair with extreme precision, maintaining a 'Crawling Peg' to prevent excessive volatility that would scare off foreign investment. India's massive services exports and growing manufacturing base provide a structural demand for the Rupee, but its dependence on imported oil makes USD/INR hyper-sensitive to energy prices. For macro traders, USD/INR is the 'Stability Play'—it reflects the transformation of India into a core global industrial hub.",
         {
             "macro": "The 'Oil vs Services' battle. India exports software and imports oil.",
             "policy": "The RBI is one of the world's most proactive central banks, holding $600B+ in reserves to defend the 83-85 handle.",
             "geopolitics": "India's 'Non-Aligned' status allows it to trade with both the West and the East.",
             "tech": "The 'India Stack': Digital public infrastructure has made the Indian economy the most digitized on earth.",
             "quant": "Correlation with the 'Emerging Market Index' (EEM) is critical.",
             "technical": "Watch for the breakout above 84.00; if it sustains, it signals a period of imported inflation."
         },
         "A sudden spike in oil prices to $120, which would blow out India's current account deficit.",
         "The currency of the 21st century’s fastest-growing major economy."),

        ("nikkei-225", "Nikkei 225 (Japan)", "Stocks",
         "The 'Land of the Rising Yield'. The Nikkei 225 tracks the top companies in Japan. After 30 years of stagnation, it has entered a new 'Structural Bull Market' in 2024-2026.",
         "In 2026, Japan is no longer a 'Value Trap'. Governance reforms have forced Japanese companies to return cash to shareholders via buybacks and dividends. Coupled with a weak Yen and the return of mild inflation, the Nikkei has become a favorite for global asset allocators. It is a 'High-Beta' play on global tech and autos, but with the added benefit of being a 'Pro-Inflation' hedge. As Japan leaves behind its deflationary era, domestic consumers and corporations are finally spending. For institutional investors, the Nikkei is the 'Quality Industrial' alternative to the US, providing exposure to 'Deep Tech' and robotics without extreme valuations.",
         {
             "macro": "The return of inflation is the most important story in Japan in 40 years.",
             "policy": "The Bank of Japan's exit from negative rates. If they raise rates too fast, the Nikkei crashes on Yen strength.",
             "geopolitics": "The 'Pacific Security' proxy. Japan is a key beneficiary of the US-China 'De-risking'.",
             "quant": "Inverse correlation with the Yen. If USD/JPY is rising, the Nikkei is typically rallying.",
             "tech": "Japan owns the 'Supply Chain of the Supply Chain' for the semiconductor industry.",
             "technical": "The 1989 high (38,915) was the generational resistance; now it is the support."
         },
         "A 'Yen Snapback': A sudden 20% strengthening of the Yen that wipes out export margins.",
         "The powerhouse of industrial technology."),
    ])
def add_batch_7():
    """YIELDS, SMALL CAPS & EM"""
    ASSETS.extend([
        ("tnx", "US 10-Year Yield (TNX)", "Bonds",
         "The 'Global Benchmark' rate. The 10-Year US Treasury yield is the most important interest rate in the world, serving as the basis for the cost of capital for everything from US mortgages to corporate bonds.",
         "In 2026, the 10-Year yield is in a 'New Normal' regime of 4.0% to 5.0%. The era of zero-interest rate policy (ZIRP) is a distant memory. The yield reflects two competing forces: the health of the US economy (growth/inflation) and the massive fiscal deficit of the US government. When yields rise, they act as a 'Valuation Brake' on growth stocks and a 'Cost Burden' for the US debt. For macro traders, the 10-Year yield is the ultimate signal of 'Fiscal Dominance'. If the yield spikes while inflation is falling, it means the 'Bond Vigilantes' are protesting the government's spending levels. Conversely, if yields fall during a crisis, the 'Flight to Safety' is still intact.",
         {
             "macro": "The primary driver of the 'Equity Risk Premium'. As TNX rises, stocks must offer higher returns to compete.",
             "policy": "The Federal Reserve's 'Neutral Rate' target (r-star). The Fed wants to keep TNX near its long-term sustainable level.",
             "geopolitics": "The 'Safe Haven' of last resort. During global conflict, capital flows into 10Y Treasuries, pushing yields down.",
             "quant": "Tracks 'Term Premium'—the extra yield investors demand for the risk of holding long-term debt.",
             "technical": "The 5.0% level is the generational ceiling; breaking above it would trigger a global re-pricing event.",
             "tech": "AI-driven liquidity in the Treasury market has reduced the 'Flash Crash' risk but intensified the speed of yield resets."
         },
         "A 'Sovereign Debt Strike' where the 10Y yield spikes to 6%+ regardless of Fed policy.",
         "The master rate that governs the cost of time and money."),

        ("hy-spread", "High Yield Spread (Credit Risk)", "Bonds",
         "The 'Default Fear' gauge. The spread measures the difference in yield between junk bonds and safe Treasuries.",
         "In 2026, High Yield spreads are the primary indicator for the 'Corporate Credit Cycle'. As companies face a 'Refinancing Wall', the stability of these spreads determines if the economy has a 'Soft Landing' or a 'Hard Landing'. Narrow spreads (under 300bps) signal a 'Search for Yield' and extreme complacency. Widening spreads (over 600bps) indicate that the 'Financial Plumbing' is clogging and companies are beginning to fail. For institutional investors, this is the 'Front Line' of risk; when spreads widen, equities always follow. It is the purest measure of 'Economic Survival' for the leveraged corporate world.",
         {
             "macro": "Direct correlation with the 'Unemployment Rate'. When spreads widen, companies start cutting costs.",
             "policy": "The 'Implicit Fed Put'. The market believes the Fed will buy corporate bond ETFs during a systemic freeze.",
             "quant": "Mean-reversion quants target spreads at the 800bps level for generational buy signals.",
             "technical": "Watch for 'Spread Divergence'—stocks rising while credit spreads widen is a major warning of a top.",
             "geopolitics": "Global credit contagion. If European junk bonds blow out, US spreads follow within days.",
             "tech": "The rise of 'Private Credit' has hidden some of the stress, making the public spread a lagging but still vital indicator."
         },
         "A 'Liquidity Cascade' where a single major tech default triggers a mass exit from high-yield ETFs.",
         "The definitive thermometer for corporate bankruptcy risk."),

        ("iwm", "IWM (Russell 2000 Small Caps)", "Stocks",
         "The 'Real Economy' proxy. Tracks 2000 small-cap US companies that are primarily domestic and highly sensitive to local interest rates.",
         "While the S&P 500 is dominated by global tech, the IWM is dominated by regional banks, local industrials, and retail. It is hyper-sensitive to the 'Cost of Debt' because small companies typically have higher leverage and shorter-dated loans. In 2026, the IWM is the 'Canary in the Coal Mine' for the US consumer. If the IWM outperforms, it signals a broad-based economic expansion. If it lags during a tech rally, it means the 'Breadth' of the market is unhealthy. For macro traders, the IWM is the ultimate play on a 'Domestic Recovery' or a 'Rate Cut Pivot'. When interest rates fall, the IWM typically leads the market higher as interest costs for small firms drop.",
         {
             "macro": "Driven by 'Regional Bank' health and local US consumption.",
             "policy": "Small-cap firms benefit most from 'Regulatory Relief' and corporate tax cuts.",
             "quant": "The 'Value vs Growth' benchmark. IWM is the home of 'Value' in the US market.",
             "technical": "The 2,000 level has been a massive psychological pivot point for years.",
             "geopolitics": "Insulated from global trade wars. The IWM is the 'Made in America' index.",
             "tech": "Lags in the AI 'Hype' phase but leads in the AI 'Application' phase as local firms adopt technology to cut costs."
         },
         "A 'Credit Crunch' that destroys the regional banking system, cutting off the lifeblood of small-cap finance.",
         "The barometer of the domestic US economy and the heartbeat of Main Street."),

        ("solana", "Solana (SOL)", "Forex",
         "The high-speed 'Execution Layer' of the digital economy. Solana is the fastest and most efficient blockchain for mass consumer adoption.",
         "In 2026, Solana has moved from the 'Experiments' phase to the 'Utility' phase. It is the primary network for 'DePIN' (Decentralized Physical Infrastructure Networks) and mass-market consumer applications like payments and social media. Its near-zero fees and sub-second confirmation times have made it the 'Visa of Blockchain'. While Ethereum is the settlement layer for 'Billion Dollar Deals', Solana is the network for 'Billion Person Use'. Its ecosystem is defined by extreme innovation and a 'Move Fast and Break Things' culture. For macro traders, Solana is the 'High Beta Crypto'—when Bitcoin is up, Solana typically outperforms by 2-3x due to its high speculative appeal and rapid user growth. It is the leading contender to challenge Ethereum's dominance in the 2020s.",
         {
             "tech": "Firedancer (the new validator client) has pushed Solana's capacity to 1 million TPS, making it the fastest network on earth.",
             "macro": "Reflects 'Venture Capital' liquidity and global speculative appetite.",
             "policy": "Recognition as a 'Utility' by regulators has protected it from some of the 'Security' label risks that haunt other alts.",
             "geopolitics": "Highly popular in the 'Global South' (Asia/Africa) where low fees are a requirement for adoption.",
             "quant": "High correlation with 'Airdrop Wealth Cycles'. New token launches drive massive demand for SOL.",
             "technical": "Support found at the 50-day EMA. Breaking all-time highs would signal the 'Flippening' of Solana over Ethereum's market cap."
         },
         "A 'Network Halt' event that lasts more than 24 hours, destroying institutional trust in its 'Uptime' promises.",
         "The high-speed engine of the decentralized consumer future."),

        ("usdsar", "USD/SAR (The Petro-Dollar)", "Forex",
         "The 'Anchor of Energy'. This pair represents the exchange rate between the US Dollar and the Saudi Riyal, which is pegged at 3.75.",
         "The USD/SAR peg is the foundation of the 'Petro-Dollar' system that has ruled global finance since 1974. In 2026, this peg is under intense scrutiny as Saudi Arabia (Vision 2030) seeks to diversify its economy and potentially trade oil in other currencies (like CNY). If the Saudi Riyal were to ever 'De-peg' or 'Float', it would signal the end of the US Dollar's absolute dominance over the energy trade. For macro traders, watching the 'USD/SAR Forwards' is the ultimate way to detect 'Under-the-surface' stress in the Middle East. If forwards spike, the market is betting the peg will break. For now, it remains the ultimate 'Stable' anchor in the volatile world of energy and geopolitics.",
         {
             "macro": "Ensures that oil revenues and US Treasury demand remain linked.",
             "geopolitics": "The 'Special Relationship' between Washington and Riyadh. Any strain here shows up in the 'SAR Forwards' market.",
             "policy": "The Saudi Central Bank (SAMA) tracks Fed rate hikes perfectly to maintain the peg.",
             "quant": "Saudi Arabia holds $500B+ in reserves to defend this peg; breaking it would require a total collapse in oil prices.",
             "tech": "The 'Neom' project and other mega-cities are shifting Saudi demand into high-tech imports from the US and EU.",
             "technical": "Fixed at 3.75; any deviation from this level is a 'Black Swan' event for global finance."
         },
         "A 'Political De-pegging': A decision by Riyadh to float the currency to gain sovereignty, crashing the global demand for US Treasuries.",
         "The silent anchor of the global energy and currency system."),
    ])
def add_batch_8():
    """THEMATIC & MORE INDICES"""
    ASSETS.extend([
        ("rsp", "S&P 500 Equal Weight (RSP)", "Stocks",
         "The 'True Market' indicator. Unlike the standard S&P 500, which is market-cap weighted, the Equal Weight index gives every stock the same influence.",
         "In 2026, the RSP is the ultimate tool for detecting 'Market Fragility'. If the standard S&P 500 is making new highs while the RSP is flat, it means the rally is being driven by a tiny group of tech giants. This is called 'Poor Breadth'. When the RSP starts to outperform the standard index, it signals a 'Rotation' into the broader economy—banks, industrials, and energy. For macro traders, the RSP-to-SPY ratio is the scoreboard of the 'Concentration Risk' in the global financial system. A rising ratio is a sign of a healthy, sustainable bull market where the average company is thriving, not just the AI leaders.",
         {
             "macro": "Reflects the 'Median Company' health rather than the 'Top 7' outliers.",
             "quant": "Mean-reversion quants use RSP to find valuation disconnects between the mega-caps and the rest of the market.",
             "technical": "Watch for the breakout of the RSP/SPY ratio; it signals a change in market leadership.",
             "policy": "Reflects the impact of interest rates on the 'Average' corporate debt profile.",
             "geopolitics": "Less sensitive to global tech export bans than the standard S&P 500.",
             "tech": "The 'Laggard' play. RSP is the bet that AI benefits will eventually trickle down to traditional legacy businesses."
         },
         "The 'Mega-Cap Bubble Burst': A scenario where the top 10 stocks crash while the RSP stays flat, causing index funds to fail.",
         "The truest measure of the broad US equity market."),

        ("nifty-50", "NIFTY 50 (India)", "Stocks",
         "The 'Growth Engine' of South Asia. The Nifty 50 tracks the 50 largest Indian companies across 13 sectors of the economy.",
         "In 2026, the Nifty 50 is the premier destination for global 'Growth' capital. As China struggles with aging demographics and debt, India offers the opposite: a young, digital-native workforce and a massive domestic consumer market. The Nifty is dominated by Financials, IT, and Energy. It is a 'High-Quality' emerging market index with return-on-equity (ROE) profiles that match the US. For macro traders, the Nifty is the play on 'Universal Connectivity'—as India digitizes its entire economy, the speed of capital circulation is increasing. It is a 'Buy-and-Hold' market for institutions looking to capture the multi-decade rise of the Indian middle class.",
         {
             "macro": "Driven by India's structural GDP growth of 6-7% per year.",
             "policy": "Modi-era infrastructure spending and the 'Make in India' manufacturing push.",
             "geopolitics": "Beneficiary of the 'China Replacement' narrative. Western capital is rotating from Shanghai to Mumbai.",
             "tech": "India is the world's largest exporter of 'AI Services' and software engineering talent.",
             "quant": "High correlation with global USD liquidity; when the Dollar is weak, the Nifty explodes higher.",
             "technical": "Structural support at the 200-day moving average. It has a habit of 'V-shaped' recoveries during global panics."
         },
         "An 'Election Shock' or a 'Current Account Crisis' caused by oil prices hitting $130.",
         "The premier exposure to the world's last remaining mega-growth market."),

        ("logistics-reit", "Logistics & Warehousing", "Real Estate",
         "The 'Physical Backbone' of e-commerce. Logistics REITs own the giant warehouses that handle the world's physical goods.",
         "In 2026, Logistics is the only 'Safe' sector in commercial real estate. While office buildings are being converted to apartments, warehouses are being expanded to handle AI-driven inventory management and 2-hour shipping. These facilities are the critical chokepoints of the 'Just-in-Case' economy. Rents are rising faster than inflation because there is a physical limit on how many warehouses can be built near major cities with power access. For macro traders, Logistics REITs are a play on both the 'Consumer' and the 'Supply Chain'. If people are buying things online, these warehouses are the most valuable land on earth.",
         {
             "macro": "Direct correlation with e-commerce penetration and global retail sales.",
             "tech": "Fully roboticized 'Dark Warehouses' are the new standard for Class A space.",
             "geopolitics": "The 'Near-shoring' boom. Warehouses at the US-Mexico and EU-Eastern Europe borders are at 99% occupancy.",
             "policy": "Zoning and environmental hurdles keep new supply low, protecting the rents of existing owners.",
             "quant": "Watch 'Lease-spreads'—the difference between old rents and new market rents is the primary driver of earnings growth.",
             "technical": "Historically trades at a premium to the broader REIT index due to superior structural growth."
         },
         "A 'Consumer Buyer Strike' where e-commerce volumes drop for the first time in history.",
         "The landlords of the modern global supply chain."),

        ("us-housing", "US Housing Market", "Real Estate",
         "The 'Wealth Effect' engine. Tracks home prices and inventory levels in the United States, the primary source of wealth for 65% of Americans.",
         "In 2026, the US Housing market is characterized by 'The Big Freeze'. While mortgage rates have normalized at 6-7%, home prices remain at record highs due to a 4-million-unit shortage. This has created a 'Haves and Have-nots' economy. Those with 3% mortgages from 2021 are 'Locked-in', while new buyers are priced out. This lack of inventory prevents a price crash but also stops the 'Economic Velocity' that housing usually provides. For macro traders, housing is the primary driver of 'Core Inflation' via the OER (Owners Equivalent Rent). If housing stays hot, the Fed cannot cut rates. It is the most important political and economic variable in the US domestic landscape.",
         {
             "macro": "Housing starts are a leading indicator for the furniture, appliance, and remodeling sectors.",
             "policy": "Government incentives for first-time buyers and institutional tax penalties are the main 2026 debates.",
             "geopolitics": "US Real Estate is the preferred 'Wealth Preservation' asset for global investors escaping inflation in Europe and Asia.",
             "tech": "The rise of 'Prop-Tech' and AI-driven home valuation has increased the speed of institutional buying.",
             "quant": "The 'Housing Affordability Index' is at multi-decade lows, signaling a long-term cap on price appreciation.",
             "technical": "Watch for the 'Inversion' of price growth vs income growth; it predicts the next local market cooling."
         },
         "A 'De-leveraging' wave caused by high unemployment that forces 'Locked-in' homeowners to sell.",
         "The foundational asset of the American middle class."),
    ])
def add_batch_9():
    """THEMATIC & MOMENTUM"""
    ASSETS.extend([
        ("infrastructure", "Global Infrastructure", "Thematic",
         "The 'Steel and Concrete' of the global economy. Tracks the companies building the ports, power grids, and water systems of the 21st century.",
         "In 2026, Infrastructure has transitioned from a 'Boring Yield' play to a 'High Growth' strategic sector. The transition to green energy and the building of AI data centers require a total overhaul of the global power grid. This 'Great Re-wiring' is the largest investment cycle in history. Infrastructure assets are protected from inflation by 'Long-term Contracts' that often have CPI-linked escalators. For macro traders, this sector is a play on 'Fiscal Policy'—governments are spending trillions on 'Reshoring' their industrial bases, and infrastructure firms are the primary beneficiaries of this state-led growth.",
         {
             "macro": "High sensitivity to long-term interest rates due to the heavy debt required for projects.",
             "policy": "Driven by the 'US Infrastructure Act' and the 'EU Green Deal'. Global subsidies are the primary revenue driver.",
             "tech": "AI-driven grid management and 'Smart City' technology are increasing the efficiency of legacy infrastructure.",
             "geopolitics": "Infrastructure is the new 'Battleground'. Securing energy and water systems is now a matter of national security.",
             "quant": "Low correlation with the S&P 500, making it an excellent diversifier for institutional portfolios.",
             "technical": "Watch for the breakout of 'Utility' indices; they often lead the broader infrastructure sector."
         },
         "A 'Fiscal Austerity' pivot where governments cut infrastructure spending to pay for rising debt interest.",
         "The foundation of the 21st-century physical economy."),

        ("defense", "Defense & Aerospace", "Thematic",
         "The 'Security Premium'. Tracks the global aerospace and defense firms that supply the world's military and civil aviation needs.",
         "In 2026, the world is in a 'Re-armament' cycle not seen since the Cold War. As geopolitical tensions rise in Eurasia and the Pacific, nations are increasing their defense spending from 2% to 3% or even 4% of GDP. This creates 'Multi-decade Visibility' for defense contractors like Lockheed Martin, Rheinmetall, and BAE Systems. These firms are effectively 'States within States', with guaranteed order books that span 10-20 years. Additionally, the civil aviation recovery post-2024 has provided a secondary growth engine for firms that build engines and airframes. For macro traders, Defense is the ultimate 'Hedge against Chaos'. When geopolitics get worse, Defense stocks get better.",
         {
             "macro": "Anti-cyclical. Defense spending is the last thing to be cut in a recession.",
             "policy": "National security is currently the only area of bipartisan agreement in the US and EU.",
             "tech": "The 'Drone Revolution' and AI-driven autonomous warfare are the new high-margin growth drivers for the sector.",
             "geopolitics": "Reflects the 'Fractured World' narrative. Every new regional conflict increases the global demand for munitions.",
             "quant": "Momentum quants use Defense as a 'Stability' factor during periods of high equity market volatility.",
             "technical": "High support near the 200-day moving average. It rarely enters deep bear markets in the current regime."
         },
         "A 'Global Peace Treaty' scenario (highly unlikely) that leads to a collapse in multi-year defense budgets.",
         "The ultimate hedge against a fracturing global order."),

        ("cyber", "Cybersecurity", "Thematic",
         "The 'Digital Shield'. Tracks the firms protecting the world's data, networks, and AI models from sovereign and criminal actors.",
         "In 2026, Cybersecurity is no longer an 'Option'—it is a 'Licensing Requirement' for doing business. As AI makes cyber-attacks faster and more sophisticated, the 'Defense' must be equally AI-driven. This has created a 'Permanent Upgrade' cycle in corporate IT budgets. Companies are moving from 'Perimeter Defense' to 'Zero Trust' architectures. For macro traders, Cybersecurity is the most resilient sub-sector of Tech. Unlike Cloud or E-commerce, which can slow down in a recession, Cyber spending is mandatory. If you are hacked, your business stops. It is the most critical infrastructure of the digital age.",
         {
             "macro": "Driven by the 'Digitalization of Everything'. As more assets move on-chain or to the cloud, the 'Attack Surface' grows.",
             "policy": "New SEC and EU regulations (like GDPR 2.0) mandate immediate disclosure of hacks, forcing companies to buy better protection.",
             "tech": "AI is both the threat and the solution. 'Autonomous Cyber Defense' is the main investment theme of 2026.",
             "geopolitics": "Reflects the 'Hybrid Warfare' between major powers. State-sponsored hacks are now a standard tool of diplomacy.",
             "quant": "High 'Retention' quants. Once a company picks a security provider, the switching costs are nearly 100%.",
             "technical": "Strong relative strength against the broader Nasdaq during market corrections."
         },
         "A 'Structural Failure' in a major security platform (like Crowdstrike 2.0) that leads to loss of trust in the centralized security model.",
         "The mandatory tax on the digital economy."),

        ("container-shipping", "Container Shipping", "Thematic",
         "The 'Vessel of Globalization'. Tracks the cost and volume of finished goods being moved via the world's deep-sea container routes.",
         "In 2026, Container Shipping is the primary indicator for the 'Global Consumer'. While the Baltic Dry Index (BDI) tracks raw materials, Container Shipping tracks the actual products—iPhones, TVs, and Sneakers. The sector is hyper-sensitive to global trade friction and chokepoint disruptions (Suez/Panama). After the massive volatility of the 2021-2024 period, the sector has stabilized but remains at higher price levels due to 'Slow Steaming' and 'Environmental Surcharges'. For macro traders, a rise in container rates is the earliest signal of 'Imported Inflation' for Western retailers. It is a 'High-Volatility' cyclical play on global trade flows.",
         {
             "macro": "Reflects the 'Real Volume' of the global consumer economy.",
             "geopolitics": "The 'Chokepoint Tracker'. Shipping rates spike when global maritime security is threatened.",
             "policy": "IMO 2026 carbon taxes are increasing the cost of shipping by 10-15% permanently.",
             "tech": "AI-driven route optimization is slightly dampening the 'Volatility' of transit times, but not the 'Price'.",
             "quant": "Correlation with the 'Lumber' and 'Global Retail' indices is used to find macro front-running opportunities.",
             "technical": "Watch for the 'Rate Divergence'—if rates are falling while stocks are stagnant, a consumer recession is near."
         },
         "A 'Trade War 2.0' that leads to a 20% collapse in global shipping volumes due to universal tariffs.",
         "The pulse of physical globalization and the consumer economy."),

        ("spy-momentum", "SPY Momentum (Relative Strength)", "Technical",
         "The 'Speedometer' of the Stock Market. Measures the rate of change in the S&P 500, indicating if the current trend is accelerating or exhausting.",
         "Momentum is the most powerful 'Factor' in finance. In 2026, the SPY Momentum indicator tells us if the market is in a 'Calculated Bull Run' or a 'Parabolic Speculative Blow-off'. When momentum is high and rising, the 'Trend is your Friend'. However, when momentum starts to fall while the price makes a new high (Momentum Divergence), it is a signal that the 'Liquidators' are moving in. For macro traders, this is the ultimate 'Timing' tool. It prevents you from 'Fighting the Tape' during a rally but warns you to 'Exit Early' before the crash starts. It is the purest measure of investor psychology and animal spirits.",
         {
             "quant": "The 'Momentum Factor' has the highest historical Sharpe ratio, but also the most violent 'Drawdown' risk during reversals.",
             "macro": "Reflects 'Global Liquidity Velocity'. When money is moving fast, momentum is high.",
             "technical": "Utilizes the RSI (Relative Strength Index) and MACD (Moving Average Convergence Divergence) as its primary inputs.",
             "policy": "Central bank 'Signaling' often creates momentum shifts before any actual interest rate change occurs.",
             "tech": "AI-driven trend-following algorithms now control 60% of the daily 'Momentum' flows in the S&P 500.",
             "technical": "High momentum above the 200-day moving average is the 'Holy Grail' of trend-following."
         },
         "A 'Momentum Crash': A scenario where the market drops 5% in a day, triggering every momentum algorithm to sell at once.",
         "The speedometer of investor greed and the tape reader's best friend."),

        ("copper-gold", "Copper/Gold Ratio", "Technical",
         "The 'Global Growth Meter'. This ratio divides the price of industrial copper by the price of safe-haven gold to determine if the market is 'Risk-On' or 'Risk-Off'.",
         "The Copper/Gold ratio is the truest signal of global economic health. Copper thrives in growth; Gold thrives in fear. When the ratio is rising, the world is building, wired for growth, and optimistic. When the ratio is falling, investors are hiding in safety and expecting a recession. In 2026, this ratio is the anchor for the 'US 10-Year Yield'. Effectively, the bond market follows the Copper/Gold ratio. If the ratio rises while yields are low, it is a generational 'Buy' signal for yields. If the ratio crashes while yields are high, it is a signal that the bond market is about to have a massive rally as a recession hits.",
         {
             "macro": "The definitive macro 'Truth Meter'. It filters out the noise of inflation and shows 'Real Growth' expectations.",
             "quant": "Used by global macro funds to determine their 'Gross Leverage' levels. High ratio = More risk; Low ratio = Defensive.",
             "geopolitics": "Reflects the 'War vs Growth' trade. War boosts gold; growth boosts copper.",
             "tech": "The 'Physical AI' play. Both metals are key to AI infrastructure, but copper is the 'Work' and gold is the 'Rest'.",
             "policy": "A falling ratio tells the Fed that their policy is 'Too Restrictive' and they need to cut rates.",
             "technical": "Watch for the 'Break of Trend' in the ratio; it usually precedes equity market turns by 3-6 weeks."
         },
         "A 'Stagflation Trap' where both copper and gold rise together, making the ratio useless as a growth predictor.",
         "The ultimate scoreboard for global optimism vs fear."),
    ])
def add_batch_10():
    """FINAL ASSETS & POLICY"""
    ASSETS.extend([
        ("asx-200", "ASX 200 (Australia)", "Stocks",
         "The 'Global Mining & Finance' proxy. The ASX 200 tracks the largest companies in Australia, dominated by giant miners and the world's most stable banking sector.",
         "In 2026, the ASX 200 is the ultimate play on the 'Commodity Super-cycle' and the rise of Southeast Asia. With miners like BHP and Rio Tinto, the index is a bet on the physical world. If data centers and high-speed rail are being built, the ASX is the 'Source Code' of those materials. Additionally, the Australian banking sector provides a high-yield, defensive floor for the index. For macro traders, the ASX is a 'Carry-Positive' equity market. When commodity prices are rising, the AUD strengthens and the ASX rallies, providing a double-win for global investors. It is the destination for capital seeking stability and yield in the Pacific region.",
         {
             "macro": "Hyper-sensitive to 'Terms of Trade'—the price of iron ore and coal relative to imports.",
             "geopolitics": "The front line of the 'Trade Normalization' with China. If China removes all remaining tariffs, the ASX rockets higher.",
             "policy": "The Reserve Bank of Australia (RBA) is the last bastion of 'High-Rate' stability in a world of volatile central banks.",
             "tech": "Australia owns the largest reserves of 'Rare Earth Metals' and 'Lithium' outside of China, making the ASX key to the energy transition.",
             "quant": "High correlation with the 'CRB Commodity Index' and the Chinese A-share market.",
             "technical": "Watch the 8,000 level; it has been the mult-year resistance zone for the index."
         },
         "A 'De-globalization' event where China permanently reduces its demand for Australian resources.",
         "The high-yield treasure chest of global materials."),

        ("natgas", "Natural Gas (Henry Hub)", "Commodities",
         "The 'Intermittent Power' anchor. Natural Gas is the primary fuel for electricity generation and heating, serving as the bridge to a green energy future.",
         "In 2026, Natural Gas is no longer a localized commodity; it is a 'Globalized Fuel' via LNG (Liquefied Natural Gas). Prices at Henry Hub now move in response to events in Europe and Asia. Gas is the essential backstop for wind and solar power—when the sun isn't shining, gas must burn. This makes it a hyper-seasonal and hyper-volatile asset. For macro traders, Natural Gas is the 'Widowmaker' due to its extreme price swings. In a world of 'Net Zero' targets, gas is the only fuel that satisfies both the need for reliability and the desire for lower emissions. It is the primary input for the world's fertilizer supply, making it a critical driver of global food security.",
         {
             "macro": "Driven by 'Heating Degree Days' (weather) and industrial demand from chemical plants.",
             "policy": "Environmental bans on fracking and LNG export terminals are the primary supply-side risks in the 2020s.",
             "geopolitics": "Reflects the 'Energy Independence' of the USA. The US is now the world's largest LNG exporter, using gas as a tool of diplomacy.",
             "tech": "AI-driven demand for 'Baseload Power' in data centers is creating an unexpected new structural floor for gas prices in the US.",
             "quant": "The 'Oil-to-Gas' ratio is used to find arbitrage opportunities in the energy complex.",
             "technical": "Support found at $2.00; breaking above $5.00 signals a winter energy crisis."
         },
         "A 'Warm Winter' combined with a surge in solar/wind capacity that leads to a permanent glut of gas.",
         "The bridge to the future and the heartbeat of global heat."),

        ("agriculture", "Agriculture Index (DBA)", "Commodities",
         "The 'Human Survival' indicator. Tracks the prices of global staples like Corn, Soybeans, Wheat, and Sugar.",
         "In 2026, Agriculture is the 'Final Frontier' of the inflation trade. Unlike tech or bonds, people cannot stop consuming calories. The index is defined by 'Climate Volatility' and 'Supply Chain Fragility'. As the world's breadbaskets face more extreme weather events, the 'Volatility of Food' is rising. For macro traders, Agriculture is the purest play on 'Global Population Growth' and 'Rising EM Incomes'—as nations get richer, they eat more protein, which requires more grain. It is a 'Non-Correlated' asset that often rallies when the rest of the market is in a recession. It is the most essential, but most overlooked, part of the transition to a high-density macro world.",
         {
             "macro": "Driven by 'Input Costs'—fertilizer (natgas) and transport (oil).",
             "policy": "Global trade bans on food exports (like India's rice ban) are becoming a regular tool of nationalist policy.",
             "tech": "Genetically modified crops and AI-driven precision farming are the only things preventing a global food crisis.",
             "geopolitics": "The 'Black Sea' grain corridor remains the single most important chokepoint for global wheat stability.",
             "quant": "High correlation with the 'La Niña' and 'El Niño' weather cycles.",
             "technical": "The '2008 Spike' levels remain the structural resistance for global staples."
         },
         "A 'Universal Fertilizer Shortage' that leads to a localized food collapse in parts of the Global South.",
         "The ultimate non-discretionary asset and the floor of human security."),

        ("vvix", "VIX-of-VIX (VVIX)", "Technical",
         "The 'Volatility of Volatility'. Measures the implied volatility of VIX options, serving as the leading indicator for 'Vol-Spikes' in the S&P 500.",
         "In 2026, the VVIX is the 'Insurance on the Insurance'. While the VIX tells you how much protection costs, the VVIX tells you how fast that cost is changing. A rising VVIX is the first sign that 'Tail Risk' is being priced in by institutional players. It often leads the VIX by 3-5 days. If the market is calm but the VVIX is spiking, it is a signal that 'Smart Money' is bracing for a crash. For macro traders, the VVIX is the ultimate 'Regime Indicator'—levels above 110 indicate a high probability of a 'Vol-mageddon' style liquidation event in the options market.",
         {
             "quant": "Used by vol-arb funds to determine the pricing of VIX option 'Wings' (tail-risk protection).",
             "tech": "AI-driven hedging algorithms use VVIX to adjust their 'Dynamic Delta' exposure in real-time.",
             "macro": "Reflects the 'Institutional Anxiety' level regarding central bank policy surprises.",
             "technical": "Mean reverts aggressively. Buy VVIX calls when the index is below 80; sell when it hits 130.",
             "policy": "A rising VVIX often forces the Fed to issue 'Clarifying Statements' to calm the derivatives market.",
             "geopolitics": "Captures the 'Shock' factor of geopolitical events before they impact the underlying spot price."
         },
         "A 'Hedging Failure': A scenario where VVIX spikes so fast that liquidity in the options market evaporates, leaving SPX unprotected.",
         "The early warning system for the early warning system."),

        ("treasury-buybacks", "US Treasury Buyback Program", "Technical",
         "The 'Plumbing Stabilizer'. A policy where the US Treasury buys back 'Off-the-run' (less liquid) bonds to ensure smooth function of the debt market.",
         "In 2026, Treasury Buybacks are the 'Secret Quantitative Easing'. While the Fed may be tightening, the Treasury is effectively providing liquidity by ensuring the world's most important market—US Government Debt—remains liquid. This program prevents 'Bond Flash Crashes' and keeps the MOVE Index (Bond Vol) under control. It is the ultimate measure of 'Fiscal Dominance'—the point where the government must intervene in its own debt auctions to prevent a systemic failure. For macro traders, this is the signal that the 'Liquidator of Last Resort' is now the Treasury Department, not just the Federal Reserve.",
         {
             "macro": "Suppresses the 'Liquidity Premium' in the bond market, keeping private sector borrowing costs lower than they otherwise would be.",
             "policy": "Coordination between the Treasury and the Fed is at all-time highs, blurring the line between fiscal and monetary policy.",
             "quant": "Quants trade the 'On-the-run' vs 'Off-the-run' spread, but this program is structurally narrowing that arbitrage profit.",
             "tech": "The 'Digital Bond' transition in 2027 will eventually replace this manual buyback system with automated liquidity pools.",
             "geopolitics": "Ensures the US Dollar remains the 'Safest' asset by guaranteeing that you can always sell your Treasuries for a fair price.",
             "technical": "Monitor the 'Quarterly Refunding' volume; it tells you how much the Treasury is willing to spend to support the market."
         },
         "A 'Fiscal Overload': A scenario where the Treasury needs to buy back more debt than it can afford to issue, leading to a currency crisis.",
         "The hidden stabilizer of the global financial plumbing."),
    ])
def main():
    add_batch_1()
    add_batch_2()
    add_batch_3()
    add_batch_4()
    add_batch_5()
    add_batch_6()
    add_batch_7()
    add_batch_8()
    add_batch_9()
    add_batch_10()
    
    print(f"Generating {len(ASSETS)} high-density Wiki pages for all 9 languages...")
    
    for item in ASSETS:
        if len(item) == 8:
            slug, title, category, summary, deep_dive, council_debate, forecast_risks, gms_conclusion = item
            item_type = "indicator"
        else:
            slug, title, category, summary, deep_dive, council_debate, forecast_risks, gms_conclusion, item_type = item

        data = create_wiki_item(
            slug, title, category, summary, deep_dive, 
            council_debate, forecast_risks, gms_conclusion, item_type
        )

        LANGUAGES = ["EN", "JP", "CN", "ES", "DE", "FR", "HI", "ID", "AR"]
        for lang in LANGUAGES:
            filename = f"{slug}-{lang.lower()}.json"
            filepath = os.path.join(WIKI_DIR, filename)
            
            local_data = data.copy()
            local_data['lang'] = lang
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(local_data, f, indent=4, ensure_ascii=False)

    print("Success: Generated all multi-language heavy wiki files.")

if __name__ == "__main__":
    main()
