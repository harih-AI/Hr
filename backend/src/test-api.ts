
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

async function testApi() {
    console.log('🚀 Testing TalentScout AI API...');

    // 1. Health Check
    try {
        console.log('\n📡 Checking Health Endpoint (GET /health)...');
        const healthRes = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health Status:', healthRes.data);
    } catch (error: any) {
        console.error('❌ Health check failed:', error.message);
        console.log('Make sure the server is running with `npm run dev` in another terminal.');
        process.exit(1);
    }

    // 2. Info Endpoint
    try {
        console.log('\nℹ️  checking Info Endpoint (GET /api/info)...');
        const infoRes = await axios.get(`${BASE_URL}/api/info`);
        console.log('✅ System Info:', infoRes.data.name, infoRes.data.version);
    } catch (error: any) {
        console.error('❌ Info check failed:', error.message);
    }

    // 3. Evaluate Endpoint
    try {
        console.log('\n🧠 Testing Evaluation Endpoint (POST /api/evaluate)...');

        // Read sample files
        // We are in src/, so we go up one level to examples/
        const resumePath = path.join(__dirname, '../examples/sample-resume.txt');
        const jdPath = path.join(__dirname, '../examples/sample-job.txt');

        console.log(`   Reading resume from: ${resumePath}`);
        const resume = fs.readFileSync(resumePath, 'utf-8');

        console.log(`   Reading job description from: ${jdPath}`);
        const jobDescription = fs.readFileSync(jdPath, 'utf-8');

        console.log('   Sending request (this may take a minute)...');
        const startTime = Date.now();

        const evalRes = await axios.post(`${BASE_URL}/api/evaluate`, {
            resume,
            jobDescription,
            conductInterview: false // Start with analysis only for speed
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Evaluation Successful (${duration}s)!`);

        const report = evalRes.data.report;
        if (!report) {
            console.error('❌ No report found in response:', evalRes.data);
            return;
        }

        console.log('\n📊 RESPONSE SUMMARY:');
        console.log(`   Candidate: ${report.candidateProfile?.name || 'N/A'}`);
        console.log(`   Match Score: ${report.matchScore}/100`);
        console.log(`   Recommendation: ${String(report.finalRecommendation || 'N/A').toUpperCase()}`);
        console.log(`   Explanation: ${report.explanation?.[0] || 'No explanation provided'}`);

    } catch (error: any) {
        if (error.response) {
            console.error('❌ Evaluation failed with status:', error.response.status);
            console.error('   Error data:', error.response.data);
        } else {
            console.error('❌ Evaluation failed:', error.message);
        }
    }
}

testApi();
