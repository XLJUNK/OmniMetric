/**
 * Deployment Guard: verify-env.js
 * Blocks Vercel builds if critical API keys are missing to prevent "Missing Key" errors in production.
 */

const requiredKeys = [
    'FRED_API_KEY',
    'GEMINI_API_KEY',
    'FMP_API_KEY',

];

console.log("--- [DEPLOY GUARD] Checking environment variables... ---");

const missing = requiredKeys.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error("\x1b[31m[CRITICAL ERROR] Missing required environment variables:\x1b[0m");
    missing.forEach(key => console.error(` - ${key}`));
    console.error("\x1b[33mBuild blocked to prevent user-facing technical errors.\x1b[0m");
    process.exit(1);
} else {
    console.log("\x1b[32m[SUCCESS] All critical environment variables present.\x1b[0m");
    process.exit(0);
}
