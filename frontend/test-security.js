/**
 * Test script for security headers and input validation
 * Run with: node test-security.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

const tests = [
    {
        name: 'Security Headers - /api/signal',
        path: '/api/signal',
        checkHeaders: true
    },
    {
        name: 'Security Headers - /api/news',
        path: '/api/news?lang=EN',
        checkHeaders: true
    },
    {
        name: 'Input Validation - Valid Language',
        path: '/api/news?lang=JP',
        expectedStatus: 200
    },
    {
        name: 'Input Validation - Invalid Language',
        path: '/api/news?lang=INVALID',
        expectedStatus: 400
    },
    {
        name: 'Security Headers - /api/health',
        path: '/api/health',
        checkHeaders: true
    }
];

const REQUIRED_HEADERS = [
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'referrer-policy'
];

function testEndpoint(test) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${test.path}`;

        http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const result = {
                    name: test.name,
                    passed: true,
                    errors: []
                };

                // Check status code if specified
                if (test.expectedStatus && res.statusCode !== test.expectedStatus) {
                    result.passed = false;
                    result.errors.push(`Expected status ${test.expectedStatus}, got ${res.statusCode}`);
                }

                // Check security headers if specified
                if (test.checkHeaders) {
                    REQUIRED_HEADERS.forEach(header => {
                        if (!res.headers[header]) {
                            result.passed = false;
                            result.errors.push(`Missing header: ${header}`);
                        }
                    });
                }

                resolve(result);
            });
        }).on('error', (err) => {
            resolve({
                name: test.name,
                passed: false,
                errors: [`Request failed: ${err.message}`]
            });
        });
    });
}

async function runTests() {
    console.log('\\n=== Security Headers & Input Validation Tests ===\\n');
    console.log('Make sure the dev server is running: npm run dev\\n');

    const results = [];

    for (const test of tests) {
        const result = await testEndpoint(test);
        results.push(result);

        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status}: ${result.name}`);

        if (!result.passed) {
            result.errors.forEach(err => {
                console.log(`  ⚠️  ${err}`);
            });
        }
    }

    console.log('\\n=== Summary ===');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`${passed}/${total} tests passed\\n`);

    if (passed === total) {
        console.log('🎉 All tests passed!');
        process.exit(0);
    } else {
        console.log('⚠️  Some tests failed. Please review the output above.');
        process.exit(1);
    }
}

runTests();
