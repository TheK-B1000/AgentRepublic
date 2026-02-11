// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — read_file Tool Adapter
// Read file contents, scoped to agent workspace. No '..' traversal.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, statSync } from 'node:fs';
import type { ToolResult } from '../foundation/types.js';
import { NonRetryableError, ErrorCode } from '../foundation/types.js';

export interface ReadFileInput {
    path: string;
    encoding?: string;
}

export interface ReadFileOutput {
    content: string;
    size_bytes: number;
    encoding: string;
}

export async function executeReadFile(input: ReadFileInput): Promise<ToolResult<ReadFileOutput>> {
    const start = Date.now();

    // Security: reject path traversal
    if (input.path.includes('..')) {
        throw new NonRetryableError(
            `Path traversal not allowed: ${input.path}`,
            ErrorCode.VALIDATION_ERROR,
        );
    }

    try {
        const encoding = (input.encoding ?? 'utf-8') as BufferEncoding;
        const content = readFileSync(input.path, { encoding });
        const stats = statSync(input.path);

        return {
            tool: 'read_file',
            status: 'ok',
            data: {
                content,
                size_bytes: stats.size,
                encoding: encoding as string,
            },
            error: null,
            durationMs: Date.now() - start,
        };
    } catch (err) {
        return {
            tool: 'read_file',
            status: 'error',
            data: { content: '', size_bytes: 0, encoding: 'utf-8' },
            error: {
                code: ErrorCode.NOT_FOUND,
                message: (err as Error).message,
                retryable: false,
            },
            durationMs: Date.now() - start,
        };
    }
}
