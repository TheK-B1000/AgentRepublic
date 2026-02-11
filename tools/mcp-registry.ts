// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — MCP Tool Registry
// "The Universal Remote" — strict tool lookup, schema validation, contracts.
// Hallucinated tool names are caught here.
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolContract, ToolResult, ValidationResult } from '../foundation/types.js';
import { SchemaValidator } from '../foundation/schema-validator.js';

// ─── Registry ────────────────────────────────────────────────────────────

export class ToolRegistry {
    private readonly tools = new Map<string, ToolContract>();
    private readonly validator = new SchemaValidator();

    /**
     * Register a tool contract. Rejects duplicates.
     */
    register(contract: ToolContract): void {
        if (this.tools.has(contract.name)) {
            throw new Error(`Tool "${contract.name}" is already registered. Use a unique name.`);
        }
        this.tools.set(contract.name, contract);
    }

    /**
     * Register multiple tool contracts at once.
     */
    registerAll(contracts: ToolContract[]): void {
        for (const contract of contracts) {
            this.register(contract);
        }
    }

    /**
     * Get a tool contract by name. Returns undefined for unknown tools.
     */
    get(name: string): ToolContract | undefined {
        return this.tools.get(name);
    }

    /**
     * Get a tool contract by name. Throws for unknown tools.
     * Use this on the hot path to catch hallucinated tool names.
     */
    getOrThrow(name: string): ToolContract {
        const contract = this.tools.get(name);
        if (!contract) {
            const available = this.list().join(', ');
            throw new Error(
                `Tool "${name}" not found in registry. Available tools: ${available}`,
            );
        }
        return contract;
    }

    /**
     * List all registered tool names.
     */
    list(): string[] {
        return [...this.tools.keys()];
    }

    /**
     * List all registered tool contracts.
     */
    listContracts(): ToolContract[] {
        return [...this.tools.values()];
    }

    /**
     * Validate tool input arguments against the tool's schema.
     */
    validateInput(toolName: string, args: Record<string, unknown>): ValidationResult {
        const contract = this.getOrThrow(toolName);
        return this.validator.validateToolInput(contract, args);
    }

    /**
     * Validate tool output against the tool's output schema.
     */
    validateOutput(toolName: string, output: unknown): ValidationResult {
        const contract = this.getOrThrow(toolName);
        return this.validator.validateToolOutput(contract, output);
    }

    /**
     * Check if a tool has side effects.
     */
    hasSideEffects(toolName: string): boolean {
        return this.getOrThrow(toolName).sideEffects;
    }

    /**
     * Check if a tool is idempotent.
     */
    isIdempotent(toolName: string): boolean {
        return this.getOrThrow(toolName).idempotent;
    }

    /**
     * Check if a tool requires human approval.
     */
    requiresApproval(toolName: string): boolean {
        return this.getOrThrow(toolName).requiresApproval ?? false;
    }

    /**
     * Get the count of registered tools.
     */
    get size(): number {
        return this.tools.size;
    }

    /**
     * Generate a tool inventory string for LLM context.
     */
    toInventoryString(): string {
        return this.listContracts()
            .map((t) => {
                const flags = [
                    t.sideEffects ? 'side-effects' : 'read-only',
                    t.idempotent ? 'idempotent' : 'non-idempotent',
                    t.requiresApproval ? 'REQUIRES-APPROVAL' : '',
                    t.rateLimit ? `rate-limit:${t.rateLimit}` : '',
                ].filter(Boolean).join(', ');

                return `- ${t.name}: ${t.description ?? 'No description'} [${flags}]`;
            })
            .join('\n');
    }
}

/**
 * Create a pre-populated registry with all Republic tools.
 */
export function createDefaultRegistry(): ToolRegistry {
    const registry = new ToolRegistry();

    // Import and register all tools
    const allContracts = getAllToolContracts();
    registry.registerAll(allContracts);

    return registry;
}

/**
 * Collect all tool contracts from individual tool modules.
 */
function getAllToolContracts(): ToolContract[] {
    // Statically defined to avoid dynamic imports
    return [
        openUrlContract,
        clickContract,
        typeContract,
        screenshotContract,
        extractTextContract,
        runCodeContract,
        readFileContract,
        writeFileContract,
        publishDeployContract,
    ];
}

// ─── Tool Contracts (inline for registry auto-population) ────────────────

export const openUrlContract: ToolContract = {
    name: 'open_url',
    description: 'Navigate browser to URL. Waits for network idle.',
    inputSchema: {
        type: 'object',
        properties: {
            url: { type: 'string', format: 'uri' },
            wait_for: {
                type: 'string',
                enum: ['networkidle', 'domcontentloaded', 'load', 'selector'],
                default: 'networkidle',
            },
            wait_selector: { type: 'string', description: 'CSS selector to wait for (if wait_for=selector)' },
            timeout_ms: { type: 'integer', default: 30000, minimum: 1000, maximum: 120000 },
        },
        required: ['url'],
    },
    outputSchema: {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            final_url: { type: 'string' },
            status_code: { type: 'integer' },
            title: { type: 'string' },
        },
    },
    sideEffects: false,
    idempotent: true,
};

export const clickContract: ToolContract = {
    name: 'click',
    description: 'Click an element identified by CSS selector.',
    inputSchema: {
        type: 'object',
        properties: {
            selector: { type: 'string' },
            timeout_ms: { type: 'integer', default: 5000 },
            force: { type: 'boolean', default: false },
        },
        required: ['selector'],
    },
    sideEffects: true,
    idempotent: false,
};

export const typeContract: ToolContract = {
    name: 'type',
    description: 'Type text into an input element.',
    inputSchema: {
        type: 'object',
        properties: {
            selector: { type: 'string' },
            text: { type: 'string', maxLength: 10000 },
            clear_first: { type: 'boolean', default: true },
            delay_ms: { type: 'integer', default: 50, description: 'Per-keystroke delay' },
        },
        required: ['selector', 'text'],
    },
    sideEffects: true,
    idempotent: true,
    idempotencyNote: 'Idempotent when clear_first=true',
};

export const screenshotContract: ToolContract = {
    name: 'screenshot',
    description: 'Capture a screenshot of the current page or a specific element.',
    inputSchema: {
        type: 'object',
        properties: {
            full_page: { type: 'boolean', default: false },
            selector: { type: 'string', description: 'Screenshot specific element' },
            format: { type: 'string', enum: ['png', 'jpeg'], default: 'png' },
        },
    },
    sideEffects: false,
    idempotent: true,
    rateLimit: '10/min',
};

export const extractTextContract: ToolContract = {
    name: 'extract_text',
    description: 'Extract text content from a page element.',
    inputSchema: {
        type: 'object',
        properties: {
            selector: { type: 'string', default: 'body' },
            max_chars: { type: 'integer', default: 50000 },
        },
    },
    outputSchema: {
        type: 'object',
        properties: {
            text: { type: 'string' },
            selector: { type: 'string' },
            char_count: { type: 'integer' },
        },
    },
    sideEffects: false,
    idempotent: true,
};

export const runCodeContract: ToolContract = {
    name: 'run_code',
    description: 'Execute code in a sandboxed environment.',
    inputSchema: {
        type: 'object',
        properties: {
            language: { type: 'string', enum: ['javascript', 'python', 'bash'] },
            code: { type: 'string', maxLength: 50000 },
            timeout_ms: { type: 'integer', default: 30000, maximum: 300000 },
            sandbox: { type: 'boolean', default: true },
        },
        required: ['language', 'code'],
    },
    sideEffects: true,
    idempotent: false,
    safety: 'MUST run in sandboxed environment. No network access unless explicitly granted.',
};

export const readFileContract: ToolContract = {
    name: 'read_file',
    description: 'Read file contents within the agent workspace.',
    inputSchema: {
        type: 'object',
        properties: {
            path: { type: 'string', pattern: '^[a-zA-Z0-9_./-]+$' },
            encoding: { type: 'string', default: 'utf-8' },
        },
        required: ['path'],
    },
    outputSchema: {
        type: 'object',
        properties: {
            content: { type: 'string' },
            size_bytes: { type: 'integer' },
            encoding: { type: 'string' },
        },
    },
    sideEffects: false,
    idempotent: true,
};

export const writeFileContract: ToolContract = {
    name: 'write_file',
    description: 'Write content to a file within the agent workspace.',
    inputSchema: {
        type: 'object',
        properties: {
            path: { type: 'string', pattern: '^[a-zA-Z0-9_./-]+$' },
            content: { type: 'string' },
            encoding: { type: 'string', default: 'utf-8' },
        },
        required: ['path', 'content'],
    },
    sideEffects: true,
    idempotent: true,
};

export const publishDeployContract: ToolContract = {
    name: 'publish_deploy',
    description: 'Deploy an artifact to staging or production. Requires human approval.',
    inputSchema: {
        type: 'object',
        properties: {
            artifact_ref: { type: 'string', description: 'SHA or version from artifact registry' },
            target: { type: 'string', enum: ['staging', 'production'] },
            canary_percent: { type: 'integer', default: 10, minimum: 0, maximum: 100 },
        },
        required: ['artifact_ref', 'target'],
    },
    sideEffects: true,
    idempotent: false,
    requiresApproval: true,
    approvalRoles: ['release_manager', 'human_operator'],
};
