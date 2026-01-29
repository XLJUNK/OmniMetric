
const cleanLocalizedTitle = (text, lang) => {
    if (lang === 'EN') return text;

    // Check if text has parentheses
    const match = text.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
        const part1 = match[1];
        const part2 = match[2];

        // Heuristic: If one part has non-ASCII (likely localized) and the other is ASCII (English)
        const isPart1ASCII = /^[\x00-\x7F]*$/.test(part1);
        const isPart2ASCII = /^[\x00-\x7F]*$/.test(part2);

        if (!isPart1ASCII && isPart2ASCII) return part1.trim(); // "Localized (English)" -> "Localized"
        if (isPart1ASCII && !isPart2ASCII) return part2.trim(); // "English (Localized)" -> "Localized"
    }

    return text;
};

// Test Cases
const cases = [
    { text: "Net Liquidity (净流动性)", lang: "CN", expected: "净流动性" },
    { text: "市场宽度 (Market Breadth)", lang: "CN", expected: "市场宽度" },
    { text: "Trend & Momentum (趋势与动量)", lang: "CN", expected: "趋势与动量" },
    { text: "Net Liquidity", lang: "CN", expected: "Net Liquidity" }, // No parens, no change
    { text: "Moving Average (移动平均线 SMA/EMA)", lang: "CN", expected: "移动平均线 SMA/EMA" } // Complex parens
];

cases.forEach(c => {
    const result = cleanLocalizedTitle(c.text, c.lang);
    const pass = result === c.expected;
    console.log(`[${pass ? 'PASS' : 'FAIL'}] "${c.text}" -> "${result}" (Expected: "${c.expected}")`);
});
