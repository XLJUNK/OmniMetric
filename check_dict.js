
const { DICTIONARY } = require('./frontend/data/dictionary.ts');

const langs = ['EN', 'JP', 'CN', 'ES', 'HI', 'ID', 'AR', 'DE', 'FR'];

console.log("Checking Dictionary Structure:");
langs.forEach(lang => {
    const entry = DICTIONARY[lang];
    if (!entry) {
        console.log(`${lang}: MISSING`);
    } else {
        const keys = Object.keys(entry);
        const hasLabels = keys.includes('labels');
        console.log(`${lang}: ${hasLabels ? 'OK' : 'MISSING LABELS'} (Keys: ${keys.join(', ')})`);
    }
});

// Check for top-level keys that shouldn't be there
const topKeys = Object.keys(DICTIONARY);
const unexpected = topKeys.filter(k => !langs.includes(k));
if (unexpected.length > 0) {
    console.log("Unexpected top-level keys:", unexpected);
}
