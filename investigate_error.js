
import { DICTIONARY } from './frontend/data/dictionary.js';

console.log('Keys:', Object.keys(DICTIONARY));
console.log('Val of EN:', typeof DICTIONARY.EN);
console.log('Test "JP" in DICTIONARY:', "JP" in DICTIONARY);
try {
    console.log('Test "lang" in "jp":', "lang" in "jp");
} catch (e) {
    console.log('Caught expected error:', e.message);
}
