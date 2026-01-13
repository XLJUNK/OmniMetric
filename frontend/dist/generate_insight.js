"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ai_1 = require("ai");
const gateway_1 = require("@ai-sdk/gateway");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Load environment variables strictly before any SDK calls
const envPath = path.resolve(__dirname, '../../.env');
const backendEnvPath = path.resolve(__dirname, '../../backend/.env');
try {
    dotenv.config({ path: envPath });
    dotenv.config({ path: backendEnvPath });
}
catch (e) {
    console.error("DEBUG: Env setup warning", e);
}
const getPrompt = () => {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("Error: No prompt provided.");
        process.exit(1);
    }
    return args[0];
};
async function main() {
    const prompt = getPrompt();
    try {
        // STRICT: Official Vercel AI SDK Pattern with Gateway Helper
        // Uses env: AI_GATEWAY_API_KEY, VERCEL_AI_GATEWAY_SLUG
        const result = await (0, ai_1.generateText)({
            model: (0, gateway_1.gateway)('google/gemini-2.0-flash'), // Automatic routing via official SDK
            prompt: prompt,
        });
        // Output ONLY the raw text for Python to capture
        console.log(JSON.stringify({ text: result.text }));
    }
    catch (error) {
        // Output formatted error for Python to capture if possible, or stdout/stderr
        console.error("AI Generation Failed:", error);
        process.exit(1);
    }
}
main();
