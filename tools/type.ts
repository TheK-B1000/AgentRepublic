// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — type Tool Adapter
// Type text into an input element. Idempotent when clear_first=true.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult } from '../foundation/types.js';

export interface TypeInput {
    selector: string;
    text: string;
    clear_first?: boolean;
    delay_ms?: number;
}

export interface TypeOutput {
    success: boolean;
    chars_typed: number;
    selector_used: string;
}

export async function executeType(input: TypeInput): Promise<ToolResult<TypeOutput>> {
    const start = Date.now();

    // TODO: Replace with Playwright type
    const output: TypeOutput = {
        success: true,
        chars_typed: input.text.length,
        selector_used: input.selector,
    };

    return {
        tool: 'type',
        status: 'ok',
        data: output,
        error: null,
        durationMs: Date.now() - start,
    };
}
