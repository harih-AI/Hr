// ============================================
// LLM CLIENT - OPENROUTER (GEMINI 2.0 FLASH)
// ============================================

import axios from 'axios';
import type { LLMRequest, LLMResponse } from '../core/types.js';

export class LLMClient {
    private baseUrl: string;
    private apiKey: string;
    private model: string;
    private timeout: number;

    constructor(
        baseUrl: string = 'https://openrouter.ai/api/v1',
        model: string = 'google/gemini-2.0-flash-001',
        timeout: number = 300000 // 5 minutes
    ) {
        this.baseUrl = baseUrl;
        this.apiKey = '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';
        this.model = model;
        this.timeout = timeout;
    }

    /**
     * Generate a response from the LLM
     */
    async generate(request: LLMRequest): Promise<LLMResponse> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: request.systemPrompt },
                        { role: 'user', content: request.userPrompt }
                    ],
                    temperature: request.temperature ?? 0.3,
                    max_tokens: request.maxTokens ?? 2000,
                },
                {
                    timeout: this.timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'TalentScout AI'
                    },
                }
            );

            if (!response.data.choices || response.data.choices.length === 0) {
                throw new Error('No response from Gemini via OpenRouter');
            }

            const content = response.data.choices[0].message.content;

            return {
                content: content,
                usage: {
                    promptTokens: response.data.usage?.prompt_tokens || 0,
                    completionTokens: response.data.usage?.completion_tokens || 0,
                    totalTokens: response.data.usage?.total_tokens || 0,
                },
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message || 'Unknown error';
            throw new Error(`LLM Generation Failed (OpenRouter): ${errorMsg}`);
        }
    }

    /**
     * Generate structured JSON response
     */
    async generateJSON<T>(request: LLMRequest): Promise<T> {
        try {
            // Add JSON formatting instructions
            const enhancedRequest: LLMRequest = {
                ...request,
                userPrompt: `${request.userPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations. Just pure JSON.`,
            };

            const response = await this.generate(enhancedRequest);

            // Clean the response
            let cleanedContent = response.content.trim();

            // Remove markdown code blocks if present
            cleanedContent = cleanedContent.replace(/```json\n?/g, '');
            cleanedContent = cleanedContent.replace(/```\n?/g, '');

            // Remove any thinking/preamble text (e.g., from reasoning models)
            const firstBrace = cleanedContent.indexOf('{');
            const lastBrace = cleanedContent.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                cleanedContent = cleanedContent.substring(firstBrace, lastBrace + 1);
            }

            // Try to parse JSON
            try {
                return JSON.parse(cleanedContent);
            } catch (parseError) {
                throw new Error(`Failed to parse JSON response: ${cleanedContent.substring(0, 100)}...`);
            }
        } catch (error: any) {
            throw new Error(
                `LLM JSON Generation Failed: ${error.message || 'Unknown error'}`
            );
        }
    }

    /**
     * Health Check
     */
    async healthCheck(): Promise<boolean> {
        try {
            // Simple ping to models endpoint
            const response = await axios.get(`${this.baseUrl}/models`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` },
                timeout: 5000,
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get available models
     */
    async getModels(): Promise<string[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/models`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            return response.data.data.map((m: any) => m.id);
        } catch (error) {
            return [this.model];
        }
    }
}
