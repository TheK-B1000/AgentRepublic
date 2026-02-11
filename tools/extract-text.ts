// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — extract_text Tool Adapter
// Extract text content from page elements.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult } from '../foundation/types.js';

export interface ExtractTextInput {
    selector?: string;
    max_chars?: number;
}

export interface ExtractTextOutput {
    text: string;
    selector: string;
    char_count: number;
}

export async function executeExtractText(input: ExtractTextInput): Promise<ToolResult<ExtractTextOutput>> {
    const start = Date.now();

    // TODO: Replace with Playwright text extraction
    const selector = input.selector ?? 'body';
    const output: ExtractTextOutput = {
        text: `[Mock extracted text from ${selector}]`,
        selector,
        char_count: 0,
    };

    return {
        tool: 'extract_text',
        status: 'ok',
        data: output,
        error: null,
        durationMs: Date.now() - start,
        idempotencyKey: `ext_${selector}`,
    };
}
