export const SECTOR_CONFIG: Record<string, string[]> = {
    STOCKS: ["VIX", "SPY", "TNX", "QQQ", "IWM", "RSP", "SPY_MOMENTUM", "BREADTH"],
    CRYPTO: ["BTC", "ETH", "SOL"],
    FOREX: ["DXY", "USDJPY", "EURUSD"],
    COMMODITIES: ["GOLD", "COPPER", "OIL", "NATGAS", "COPPER_GOLD"]
};

export const SECTOR_LABELS: Record<string, Record<string, string>> = {
    STOCKS: { EN: "Equities", JP: "株式市場", CN: "股票市场", ES: "Acciones" },
    CRYPTO: { EN: "Crypto Assets", JP: "暗号資産", CN: "加密资产", ES: "Criptoactivos" },
    FOREX: { EN: "Forex & Rates", JP: "為替・金利", CN: "外汇与利率", ES: "Divisas" },
    COMMODITIES: { EN: "Commodities", JP: "商品市場", CN: "大宗商品", ES: "Materias Primas" }
};
