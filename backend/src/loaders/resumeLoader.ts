// ============================================
// RESUME LOADER - PDF & TEXT PARSING
// ============================================

import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { Logger } from '../utils/logger.js';

export class ResumeLoader {
    private logger: Logger;

    constructor() {
        this.logger = new Logger('ResumeLoader');
    }

    /**
     * Load resume from file path
     */
    async loadResume(filePath: string): Promise<{ content: string }> {
        try {
            this.logger.info(`Loading resume from: ${filePath}`);

            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            const ext = path.extname(filePath).toLowerCase();

            let content: string;

            switch (ext) {
                case '.pdf':
                    content = await this.loadPDF(filePath);
                    break;
                case '.txt':
                    content = await this.loadText(filePath);
                    break;
                default:
                    throw new Error(
                        `Unsupported file format: ${ext}. Supported: .pdf, .txt`
                    );
            }

            this.logger.info(`Resume loaded successfully (${content.length} chars)`);

            return { content };
        } catch (error: any) {
            this.logger.error('Failed to load resume', error);
            throw error;
        }
    }

    /**
     * Load PDF file
     */
    private async loadPDF(filePath: string): Promise<string> {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } catch (error: any) {
            throw new Error(`PDF parsing failed: ${error.message}`);
        }
    }

    /**
     * Load text file
     */
    private async loadText(filePath: string): Promise<string> {
        try {
            return fs.readFileSync(filePath, 'utf-8');
        } catch (error: any) {
            throw new Error(`Text file reading failed: ${error.message}`);
        }
    }

    /**
     * Load resume from raw text
     */
    async loadFromText(text: string): Promise<{ content: string }> {
        this.logger.info('Loading resume from raw text');
        return { content: text };
    }
}
