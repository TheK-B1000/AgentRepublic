// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — write_file Tool Adapter
// Write content to file, scoped to workspace. No '..' traversal. Idempotent.
// ═══════════════════════════════════════════════════════════════════════════

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { ToolResult } from '../foundation/types.js';
import { NonRetryableError, ErrorCode } from '../foundation/types.js';

export interface WriteFileInput {
    path: string;
    content: string;
    encoding?: string;
}

export interface WriteFileOutput {
    success: boolean;
    path: string;
    size_bytes: number;
}

export async function executeWriteFile(input: WriteFileInput): Promise<ToolResult<WriteFileOutput>> {
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

        // Ensure parent directory exists
        mkdirSync(dirname(input.path), { recursive: true });
        writeFileSync(input.path, input.content, { encoding });

        const sizeBytes = Buffer.byteLength(input.content, encoding);

        return {
            tool: 'write_file',
            status: 'ok',
            data: {
                success: true,
                path: input.path,
                size_bytes: sizeBytes,
            },
            error: null,
            durationMs: Date.now() - start,
        };
    } catch (err) {
        return {
            tool: 'write_file',
            status: 'error',
            data: { success: false, path: input.path, size_bytes: 0 },
            error: {
                code: ErrorCode.TOOL_ERROR,
                message: (err as Error).message,
                retryable: true,
            },
            durationMs: Date.now() - start,
        };
    }
}
