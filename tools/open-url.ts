// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — open_url Tool Adapter
// Navigate browser to URL. The first step of the Five-Step Browser Cycle.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult } from '../foundation/types.js';
import { RetryableError, ErrorCode } from '../foundation/types.js';
import { getPage } from './browser-engine.js';

export interface OpenUrlInput {
    url: string;
    wait_for?: 'networkidle' | 'domcontentloaded' | 'load' | 'selector';
    wait_selector?: string;
    timeout_ms?: number;
}

export interface OpenUrlOutput {
    success: boolean;
    final_url: string;
    status_code: number;
    title: string;
}

/**
 * Navigate to a URL using Playwright.
 */
export async function executeOpenUrl(input: OpenUrlInput): Promise<ToolResult<OpenUrlOutput>> {
    const start = Date.now();
    const timeout = input.timeout_ms ?? 30000;

    try {
        const page = await getPage();

        // Map wait_for to Playwright waitUntil
        const waitUntilMap: Record<string, 'networkidle' | 'domcontentloaded' | 'load'> = {
            networkidle: 'networkidle',
            domcontentloaded: 'domcontentloaded',
            load: 'load',
        };
        const rawWait = input.wait_for ?? 'load';
        const waitUntil = waitUntilMap[rawWait] ?? 'load';

        const response = await page.goto(input.url, {
            waitUntil,
            timeout,
        });

        // If wait_for=selector, wait for a specific CSS selector
        if (input.wait_for === 'selector' && input.wait_selector) {
            await page.waitForSelector(input.wait_selector, { timeout: timeout / 2 });
        }

        const title = await page.title();
        const finalUrl = page.url();
        const statusCode = response?.status() ?? 0;

        const output: OpenUrlOutput = {
            success: true,
            final_url: finalUrl,
            status_code: statusCode,
            title,
        };

        return {
            tool: 'open_url',
            status: 'ok',
            data: output,
            error: null,
            durationMs: Date.now() - start,
        };
    } catch (err) {
        const message = (err as Error).message;

        // Timeout errors are retryable
        if (message.includes('Timeout') || message.includes('timeout')) {
            throw new RetryableError(`Navigation timeout: ${message}`, ErrorCode.TIMEOUT);
        }

        return {
            tool: 'open_url',
            status: 'error',
            data: {
                success: false,
                final_url: input.url,
                status_code: 0,
                title: '',
            },
            error: {
                code: ErrorCode.TOOL_ERROR,
                message,
                retryable: false,
            },
            durationMs: Date.now() - start,
        };
    }
}
