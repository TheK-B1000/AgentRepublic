// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — screenshot Tool Adapter
// Capture page screenshots. Rate limited: 10/min.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult } from '../foundation/types.js';

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

    // TODO: Replace with Playwright screenshot
    const format = input.format ?? 'png';
    const output: ScreenshotOutput = {
        success: true,
        path: `screenshots/capture_${Date.now()}.${format}`,
        format,
        size_bytes: 0,
    };

    return {
        tool: 'screenshot',
        status: 'ok',
        data: output,
        error: null,
        durationMs: Date.now() - start,
    };
}
