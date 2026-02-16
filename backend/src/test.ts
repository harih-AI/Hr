// ============================================
// TEST SCRIPT - TALENTSCOUT AI
// ============================================

import { TalentScoutOrchestrator } from './core/orchestrator.js';
import { readFileSync } from 'fs';
import { Logger } from './utils/logger.js';

const logger = new Logger('TestScript');

async function testTalentScout() {
    try {
        logger.info('=== TalentScout AI Test ===');

        // Initialize orchestrator
        const orchestrator = new TalentScoutOrchestrator();

        // Check Ollama connection
        logger.info('Checking Ollama connection...');
        const isHealthy = await orchestrator.healthCheck();
        if (!isHealthy) {
            logger.error('Ollama is not running! Please start Ollama first.');
            logger.info('Run: ollama serve');
            process.exit(1);
        }
        logger.info('✅ Ollama connected');

        // Load sample data
        logger.info('Loading sample resume and job description...');
        const resume = readFileSync('./examples/sample-resume.txt', 'utf-8');
        const jobDescription = readFileSync('./examples/sample-job.txt', 'utf-8');

        // Run evaluation
        logger.info('Starting candidate evaluation...');
        const report = await orchestrator.evaluateCandidate(
            resume,
            jobDescription,
            false // Set to true to include interview planning
        );

        // Display results
        logger.info('\n=== EVALUATION REPORT ===\n');

        console.log('📋 CANDIDATE PROFILE:');
        console.log(`   Name: ${report.candidateProfile.name}`);
        console.log(`   Email: ${report.candidateProfile.email}`);
        console.log(`   Experience: ${report.candidateProfile.totalYearsOfExperience} years`);
        console.log(`   Technical Skills: ${report.candidateProfile.skills.technical.join(', ')}`);
        console.log('');

        console.log('💼 JOB PROFILE:');
        console.log(`   Title: ${report.jobProfile.title}`);
        console.log(`   Mandatory Skills: ${report.jobProfile.mandatorySkills.join(', ')}`);
        console.log(`   Experience Required: ${report.jobProfile.experienceRequired.min}-${report.jobProfile.experienceRequired.max} years`);
        console.log('');

        console.log('📊 MATCH ANALYSIS:');
        console.log(`   Overall Score: ${report.matchScore}/100`);
        console.log(`   Skill Match: ${report.detailedAnalysis.matchAnalysis.skillMatch.score}/100`);
        console.log(`   Experience Match: ${report.detailedAnalysis.matchAnalysis.experienceMatch.score}/100`);
        console.log(`   Matched Skills: ${report.detailedAnalysis.matchAnalysis.skillMatch.matched.join(', ')}`);
        console.log(`   Missing Skills: ${report.detailedAnalysis.matchAnalysis.skillMatch.missing.join(', ')}`);
        console.log('');

        console.log('⚖️ BIAS CHECK:');
        console.log(`   Status: ${report.biasCheck.status.toUpperCase()}`);
        console.log(`   Fairness Score: ${report.biasCheck.fairnessScore}/100`);
        console.log(`   Warnings: ${report.biasCheck.warnings.length > 0 ? report.biasCheck.warnings.join(', ') : 'None'}`);
        console.log('');

        console.log('🎯 FINAL DECISION:');
        console.log(`   Recommendation: ${report.finalRecommendation.toUpperCase()}`);
        console.log(`   Confidence: ${report.confidence}%`);
        console.log(`   Risk Level: ${report.riskLevel.toUpperCase()}`);
        console.log('');

        console.log('💡 EXPLANATION:');
        report.explanation.forEach((reason: string, index: number) => {
            console.log(`   ${index + 1}. ${reason}`);
        });
        console.log('');

        console.log('✅ STRENGTHS:');
        report.detailedAnalysis.matchAnalysis.strengths.forEach((strength: string) => {
            console.log(`   ✓ ${strength}`);
        });
        console.log('');

        console.log('⚠️ GAPS:');
        report.detailedAnalysis.matchAnalysis.gaps.forEach((gap: string) => {
            console.log(`   ✗ ${gap}`);
        });
        console.log('');

        // Save report to file
        const reportPath = './examples/evaluation-report.json';
        const fs = await import('fs');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        logger.info(`Full report saved to: ${reportPath}`);

        logger.info('\n=== Test Complete ===');
    } catch (error) {
        logger.error('Test failed', error);
        process.exit(1);
    }
}

// Run test
testTalentScout();
