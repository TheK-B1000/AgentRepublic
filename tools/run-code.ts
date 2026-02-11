// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — run_code Tool Adapter
// Sandboxed code execution. MUST run in sandbox. No network by default.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult } from '../foundation/types.js';

export interface RunCodeInput {
    language: 'javascript' | 'python' | 'bash';
    code: string;
    timeout_ms?: number;
    sandbox?: boolean;
}

export interface RunCodeOutput {
    stdout: string;
    stderr: string;
    exit_code: number;
    execution_time_ms: number;
}

export async function executeRunCode(input: RunCodeInput): Promise<ToolResult<RunCodeOutput>> {
    const start = Date.now();

    // TODO: Replace with actual sandboxed execution
    // In production: Docker container, Firecracker VM, or Deno isolate
    const output: RunCodeOutput = {
        stdout: `[Mock ${input.language} execution output]`,
        stderr: '',
        exit_code: 0,
        execution_time_ms: Date.now() - start,
    };

    return {
        tool: 'run_code',
        status: 'ok',
        data: output,
        error: null,
        durationMs: Date.now() - start,
    };
}
