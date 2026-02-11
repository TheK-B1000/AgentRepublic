// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Live Tool Executor
// Routes execute() calls to real tool adapter functions.
// Bridges the ToolExecutor interface to the actual implementations.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult, ToolContract } from '../foundation/types.js';
import { ErrorCode } from '../foundation/types.js';
import type { ToolExecutor } from '../foundation/runtime.js';
import { ToolRegistry, createDefaultRegistry } from './mcp-registry.js';

// Import adapter functions
import { executeOpenUrl } from './open-url.js';
import { executeScreenshot } from './screenshot.js';
import { executeReadFile } from './read-file.js';
import { executeWriteFile } from './write-file.js';
import { executeClick } from './click.js';
import { executeType } from './type.js';
import { executeExtractText } from './extract-text.js';
import { executeRunCode } from './run-code.js';
import { executePublishDeploy } from './publish-deploy.js';

// ─── Adapter Map ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdapterFn = (input: any) => Promise<ToolResult<any>>;

const ADAPTER_MAP: Record<string, AdapterFn> = {
    open_url: executeOpenUrl,
    click: executeClick,
    type: executeType,
    screenshot: executeScreenshot,
    extract_text: executeExtractText,
    run_code: executeRunCode,
    read_file: executeReadFile,
    write_file: executeWriteFile,
    publish_deploy: executePublishDeploy,
};

// ─── Live Tool Executor ──────────────────────────────────────────────────

export class LiveToolExecutor implements ToolExecutor {
    private readonly registry: ToolRegistry;

    constructor(registry?: ToolRegistry) {
        this.registry = registry ?? createDefaultRegistry();
    }

    async execute(
        toolName: string,
        args: Record<string, unknown>,
        timeoutMs: number,
    ): Promise<ToolResult> {
        // Validate tool exists in registry
        this.registry.getOrThrow(toolName);

        const adapter = ADAPTER_MAP[toolName];
        if (!adapter) {
            return {
                tool: toolName,
                status: 'error',
                data: null,
                error: {
                    code: ErrorCode.TOOL_ERROR,
                    message: `No adapter implementation for tool "${toolName}"`,
                    retryable: false,
                },
                durationMs: 0,
            };
        }

        // Execute with timeout using Promise.race
        const timeoutPromise = new Promise<ToolResult>((_, reject) => {
            setTimeout(() => reject(new Error(`Tool "${toolName}" timed out after ${timeoutMs}ms`)), timeoutMs);
        });

        try {
            return await Promise.race([adapter(args), timeoutPromise]);
        } catch (err) {
            const message = (err as Error).message;
            return {
                tool: toolName,
                status: 'error',
                data: null,
                error: {
                    code: message.includes('timed out') ? ErrorCode.TIMEOUT : ErrorCode.TOOL_ERROR,
                    message,
                    retryable: message.includes('timed out'),
                },
                durationMs: 0,
            };
        }
    }

    getContract(toolName: string): ToolContract | undefined {
        return this.registry.get(toolName);
    }

    listTools(): string[] {
        return this.registry.list();
    }
}
