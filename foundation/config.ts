// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Configuration
// Environment + feature flags loader. Fail-fast on missing required vars.
// ═══════════════════════════════════════════════════════════════════════════

export interface RepublicConfig {
    // LLM
    llmProvider: string;
    llmApiKey: string;
    llmModel: string;

    // Trace
    traceStoragePath: string;
    traceFormat: 'jsonl' | 'json';

    // Agent defaults
    defaultMaxSteps: number;
    defaultToolTimeoutMs: number;
    defaultCostBudgetUsd: number;
    defaultScratchpadMaxTokens: number;

    // Browser / Antigravity
    browserHeadless: boolean;
    maxConcurrentSessions: number;
    sessionTimeoutMs: number;
    browserRateLimitPerMin: number;

    // Deploy
    deployTarget: 'staging' | 'production';
    canaryPercent: number;
    canaryDurationMin: number;
}

/**
 * Load config from environment variables with typed defaults.
 * Fails fast on missing required variables (except in mock mode).
 */
export function loadConfig(env: Record<string, string | undefined> = process.env): RepublicConfig {
    const provider = env.LLM_PROVIDER ?? 'mock';

    // Only require API key if not in mock mode
    const apiKey = env.LLM_API_KEY ?? '';
    if (provider !== 'mock' && !apiKey) {
        throw new Error('FATAL: LLM_API_KEY is required when LLM_PROVIDER is not "mock"');
    }

    return {
        llmProvider: provider,
        llmApiKey: apiKey,
        llmModel: env.LLM_MODEL ?? 'gpt-4o',

        traceStoragePath: env.TRACE_STORAGE_PATH ?? './traces',
        traceFormat: (env.TRACE_FORMAT as 'jsonl' | 'json') ?? 'jsonl',

        defaultMaxSteps: parseInt(env.DEFAULT_MAX_STEPS ?? '25', 10),
        defaultToolTimeoutMs: parseInt(env.DEFAULT_TOOL_TIMEOUT_MS ?? '15000', 10),
        defaultCostBudgetUsd: parseFloat(env.DEFAULT_COST_BUDGET_USD ?? '2.00'),
        defaultScratchpadMaxTokens: parseInt(env.DEFAULT_SCRATCHPAD_MAX_TOKENS ?? '8000', 10),

        browserHeadless: env.BROWSER_HEADLESS !== 'false',
        maxConcurrentSessions: parseInt(env.MAX_CONCURRENT_SESSIONS ?? '10', 10),
        sessionTimeoutMs: parseInt(env.SESSION_TIMEOUT_MS ?? '300000', 10),
        browserRateLimitPerMin: parseInt(env.BROWSER_RATE_LIMIT_PER_MIN ?? '60', 10),

        deployTarget: (env.DEPLOY_TARGET as 'staging' | 'production') ?? 'staging',
        canaryPercent: parseInt(env.CANARY_PERCENT ?? '10', 10),
        canaryDurationMin: parseInt(env.CANARY_DURATION_MIN ?? '60', 10),
    };
}

/**
 * Convenience accessors for commonly needed values.
 */
export class ConfigAccessor {
    constructor(private readonly config: RepublicConfig) { }

    getToolTimeout(): number {
        return this.config.defaultToolTimeoutMs;
    }

    getMaxSteps(): number {
        return this.config.defaultMaxSteps;
    }

    getCostBudget(): number {
        return this.config.defaultCostBudgetUsd;
    }

    getTraceStoragePath(): string {
        return this.config.traceStoragePath;
    }

    getTraceFormat(): string {
        return this.config.traceFormat;
    }

    isHeadless(): boolean {
        return this.config.browserHeadless;
    }

    isMockMode(): boolean {
        return this.config.llmProvider === 'mock';
    }

    raw(): RepublicConfig {
        return { ...this.config };
    }
}
