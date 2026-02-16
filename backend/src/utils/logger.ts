// ============================================
// LOGGER UTILITY
// ============================================

export class Logger {
    private context: string;

    constructor(context: string = 'TalentScout') {
        this.context = context;
    }

    info(message: string, data?: any) {
        console.log(`[${this.timestamp()}] [${this.context}] INFO: ${message}`);
        if (data) console.log(JSON.stringify(data, null, 2));
    }

    error(message: string, error?: any) {
        console.error(`[${this.timestamp()}] [${this.context}] ERROR: ${message}`);
        if (error) {
            console.error(error.stack || error.message || error);
        }
    }

    warn(message: string, data?: any) {
        console.warn(`[${this.timestamp()}] [${this.context}] WARN: ${message}`);
        if (data) console.log(JSON.stringify(data, null, 2));
    }

    debug(message: string, data?: any) {
        console.debug(`[${this.timestamp()}] [${this.context}] DEBUG: ${message}`);
        if (data) console.log(JSON.stringify(data, null, 2));
    }

    private timestamp(): string {
        return new Date().toISOString();
    }
}
