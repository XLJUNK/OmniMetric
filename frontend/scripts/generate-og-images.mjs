/**
 * generate-og-images.mjs
 * Generates unique 1200×630 OG PNG images for each daily archive report.
 * Uses Satori (JSX→SVG) + @resvg/resvg-js (SVG→PNG).
 * Run: node scripts/generate-og-images.mjs
 * Hooked as "prebuild" in package.json.
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ARCHIVE_DIR = path.join(ROOT, 'public', 'data', 'archive');
const OUTPUT_DIR = path.join(ROOT, 'public', 'og');
const BASE_URL = 'https://www.omnimetric.net';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Created public/og/ directory');
}

// Load the Inter font (bundled with Next.js)
const FONT_PATH = path.join(ROOT, 'node_modules', '@next', 'font', 'dist', 'local', 'fonts', 'inter-regular.woff');
let fontData = null;
// Try to load Inter from the filesystem, fall back to a generic sans-serif
const FONT_CANDIDATES = [
    path.join(ROOT, 'node_modules', 'next', 'dist', 'compiled', '@next', 'font', 'dist', 'local', 'fonts', 'inter.woff2'),
    path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'next', 'dist', 'compiled', 'next-server', 'app-page.runtime.dev.js'),
];

// We'll embed a minimal base64 encoded bold Inter subset
// For CI compatibility we just use a system font TTF if available
// First try to find any .ttf / .woff font on the system for satori
function findFont() {
    // Try node_modules paths first
    const candidates = [
        path.join(ROOT, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-400-normal.woff2'),
        path.join(ROOT, 'node_modules', '@fontsource', 'inter', 'files', 'inter-400-normal.woff'),
    ];
    for (const c of candidates) {
        if (fs.existsSync(c)) return fs.readFileSync(c);
    }
    // On Linux (CI), fall back to a system font
    const systemFonts = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/opentype/noto/NotoSans-Regular.ttf',
        '/System/Library/Fonts/SFNSDisplay.otf',
        'C:\\Windows\\Fonts\\arial.ttf',
        'C:\\Windows\\Fonts\\segoeui.ttf',
    ];
    for (const f of systemFonts) {
        if (fs.existsSync(f)) return fs.readFileSync(f);
    }
    return null;
}

fontData = findFont();
if (!fontData) {
    console.warn('⚠️  No font found — OG images will use fallback rendering');
}

// Score color logic matching the site aesthetic
function getScoreColor(score) {
    if (score >= 60) return { text: '#67e8f9', glow: 'rgba(0,242,255,0.8)', label: 'RISK PREFERENCE', labelColor: '#0ea5e9' };
    if (score < 40) return { text: '#f87171', glow: 'rgba(239,68,68,0.8)', label: 'RISK AVOIDANCE', labelColor: '#ef4444' };
    return { text: '#94a3b8', glow: 'rgba(148,163,184,0.6)', label: 'NEUTRAL REGIME', labelColor: '#64748b' };
}

// Build the card JSX object tree (Satori uses plain objects, not JSX)
function buildCard({ date, score, description }) {
    const { text: scoreColor, label, labelColor } = getScoreColor(score);
    const scoreStr = String(Math.round(score));
    // Truncate description
    const desc = description ? description.slice(0, 160) : 'Daily Global Macro Signal analysis report.';

    return {
        type: 'div',
        props: {
            style: {
                width: 1200,
                height: 630,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #020817 0%, #0f172a 60%, #1e293b 100%)',
                padding: '60px 72px',
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
            },
            children: [
                // Top row: Wordmark + date
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 },
                        children: [
                            // Wordmark
                            {
                                type: 'div',
                                props: {
                                    style: { display: 'flex', alignItems: 'center', gap: 14 },
                                    children: [
                                        {
                                            type: 'div',
                                            props: {
                                                style: {
                                                    width: 36, height: 36, borderRadius: 8,
                                                    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                },
                                                children: {
                                                    type: 'span',
                                                    props: { style: { color: 'white', fontSize: 18, fontWeight: 900, letterSpacing: '-1px' }, children: 'O' }
                                                }
                                            }
                                        },
                                        {
                                            type: 'span',
                                            props: {
                                                style: { color: 'white', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' },
                                                children: 'OmniMetric Terminal'
                                            }
                                        }
                                    ]
                                }
                            },
                            // Date badge
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        padding: '8px 18px',
                                        color: '#94a3b8',
                                        fontSize: 14,
                                        fontWeight: 600,
                                        letterSpacing: '0.15em',
                                    },
                                    children: date,
                                }
                            }
                        ]
                    }
                },

                // Center: Big GMS Score
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: { color: '#475569', fontSize: 13, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 },
                                    children: 'GLOBAL MACRO SIGNAL SCORE'
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: { display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 20 },
                                    children: [
                                        {
                                            type: 'span',
                                            props: {
                                                style: {
                                                    fontSize: 140,
                                                    fontWeight: 900,
                                                    color: scoreColor,
                                                    letterSpacing: '-6px',
                                                    lineHeight: 1,
                                                },
                                                children: scoreStr
                                            }
                                        },
                                        {
                                            type: 'div',
                                            props: {
                                                style: { display: 'flex', flexDirection: 'column', gap: 6 },
                                                children: [
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: {
                                                                color: labelColor,
                                                                fontSize: 13,
                                                                fontWeight: 800,
                                                                letterSpacing: '0.2em',
                                                                textTransform: 'uppercase',
                                                                background: `${labelColor}20`,
                                                                border: `1px solid ${labelColor}40`,
                                                                borderRadius: 6,
                                                                padding: '4px 12px',
                                                            },
                                                            children: label
                                                        }
                                                    },
                                                    {
                                                        type: 'span',
                                                        props: {
                                                            style: { color: '#475569', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' },
                                                            children: 'GMS / 100'
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            // Description excerpt
                            {
                                type: 'p',
                                props: {
                                    style: {
                                        color: '#64748b',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        lineHeight: 1.6,
                                        maxWidth: 900,
                                        margin: 0,
                                    },
                                    children: desc
                                }
                            }
                        ]
                    }
                },

                // Bottom bar
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            paddingTop: 20,
                            marginTop: 24,
                        },
                        children: [
                            {
                                type: 'span',
                                props: {
                                    style: { color: '#334155', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' },
                                    children: 'omnimetric.net  ·  Institutional-Grade Macro Analysis'
                                }
                            },
                            {
                                type: 'span',
                                props: {
                                    style: {
                                        color: '#0ea5e9',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                    },
                                    children: 'AI-POWERED · DAILY SIGNAL'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
}

async function generateOgForDate(date, data) {
    const outPath = path.join(OUTPUT_DIR, `${date}.png`);

    // Skip if already generated (incremental builds)
    if (fs.existsSync(outPath)) {
        return { skipped: true };
    }

    const score = data.gms_score ?? 50;
    const description =
        (typeof data.analysis?.content === 'string' ? data.analysis.content : null) ||
        (data.analysis?.reports?.EN ?? null) ||
        null;

    const card = buildCard({ date, score, description });

    const fonts = fontData
        ? [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }]
        : [];

    try {
        const svg = await satori(card, {
            width: 1200,
            height: 630,
            fonts,
        });

        const resvg = new Resvg(svg, {
            fitTo: { mode: 'width', value: 1200 },
        });
        const pngData = resvg.render().asPng();
        fs.writeFileSync(outPath, pngData);
        return { skipped: false };
    } catch (err) {
        console.error(`  ❌ Failed for ${date}:`, err.message);
        return { error: true };
    }
}

async function main() {
    console.log('🖼️  OG Image Generator — Starting...');

    if (!fs.existsSync(ARCHIVE_DIR)) {
        console.log('⚠️  Archive directory not found, skipping OG generation.');
        return;
    }

    const files = fs.readdirSync(ARCHIVE_DIR)
        .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
        .sort()
        .reverse(); // latest first

    if (files.length === 0) {
        console.log('⚠️  No daily archive files found.');
        return;
    }

    console.log(`📂 Found ${files.length} archive files → generating OG images...\n`);

    let generated = 0, skipped = 0, errors = 0;

    for (const file of files) {
        const date = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, file), 'utf8'));
        const result = await generateOgForDate(date, data);
        if (result.skipped) {
            skipped++;
        } else if (result.error) {
            errors++;
        } else {
            generated++;
            console.log(`  ✅ ${date}.png — GMS ${data.gms_score}`);
        }
    }

    console.log(`\n✨ Done: ${generated} generated, ${skipped} skipped, ${errors} errors.`);
}

main().catch(err => {
    console.error('Fatal error in OG generator:', err);
    process.exit(1);
});
