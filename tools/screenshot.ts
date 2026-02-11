// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — screenshot Tool Adapter
// Capture page screenshots using Playwright. Rate limited: 10/min.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult } from '../foundation/types.js';
import { ErrorCode } from '../foundation/types.js';
import { getPage } from './browser-engine.js';
import { mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

export interface ScreenshotInput {
    full_page?: boolean;
    selector?: string;
    format?: 'png' | 'jpeg';
}

export interface ScreenshotOutput {
    success: boolean;
    path: string;
    format: string;
    size_bytes: number;
}

export async function executeScreenshot(input: ScreenshotInput): Promise<ToolResult<ScreenshotOutput>> {
    const start = Date.now();
    const format = input.format ?? 'png';
    const screenshotDir = './screenshots';
    mkdirSync(screenshotDir, { recursive: true });

    const filename = `capture_${Date.now()}.${format}`;
    const filePath = join(screenshotDir, filename);

    try {
        const page = await getPage();

        if (input.selector) {
            // Screenshot a specific element
            const element = await page.$(input.selector);
            if (!element) {
                return {
                    tool: 'screenshot',
                    status: 'error',
                    data: { success: false, path: '', format, size_bytes: 0 },
                    error: {
                        code: ErrorCode.NOT_FOUND,
                        message: `Selector "${input.selector}" not found on page`,
                        retryable: false,
                    },
                    durationMs: Date.now() - start,
                };
            }
            await element.screenshot({ path: filePath, type: format });
        } else {
            // Screenshot full page or viewport
            await page.screenshot({
                path: filePath,
                type: format,
                fullPage: input.full_page ?? false,
            });
        }

        const stats = statSync(filePath);

        return {
            tool: 'screenshot',
            status: 'ok',
            data: {
                success: true,
                path: filePath,
                format,
                size_bytes: stats.size,
            },
            error: null,
            durationMs: Date.now() - start,
        };
    } catch (err) {
        return {
            tool: 'screenshot',
            status: 'error',
            data: { success: false, path: '', format, size_bytes: 0 },
            error: {
                code: ErrorCode.TOOL_ERROR,
                message: (err as Error).message,
                retryable: false,
            },
            durationMs: Date.now() - start,
        };
    }
}
