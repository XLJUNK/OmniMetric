export const SECTOR_CONFIG: Record<string, string[]> = {
    STOCKS: ["SPY", "QQQ", "IWM", "US_10Y_YIELD", "US_02Y_YIELD", "VIX", "MOVE", "HY_SPREAD", "NFCI", "YIELD_SPREAD", "BREAKEVEN_INFLATION", "REAL_INTEREST_RATE", "DXY", "NET_LIQUIDITY", "BREADTH"],
    CURRENCIES: ["DXY", "EURUSD", "USDJPY", "GBPUSD", "AUDUSD", "USDCAD", "USDCNY", "BTC", "ETH", "SOL", "CRYPTO_SENTIMENT"],
    COMMODITIES: ["GOLD", "SILVER", "OIL", "NATGAS", "COPPER", "AGRI", "BALTIC", "COPPER_GOLD"]
};

export const SECTOR_LABELS: Record<string, Record<string, string>> = {
    STOCKS: { EN: "Equities & Yields", JP: "株・債券利回り", CN: "股票与收益率", ES: "Acciones" },
    CURRENCIES: {
        EN: "Currencies (Forex & Crypto)",
        JP: "通貨（為替・暗号資産）",
        CN: "货币（外汇・加密货币）",
        ES: "Currencies"
    },
    COMMODITIES: { EN: "Commodities", JP: "商品市場", CN: "大宗商品", ES: "Materias Primas" }
};
