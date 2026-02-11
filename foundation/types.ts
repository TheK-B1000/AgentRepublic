// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Shared Type Definitions
// The foundational types every citizen of the Republic depends on.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Agent States ────────────────────────────────────────────────────────

export type AgentState =
    | 'INIT'
    | 'PLANNING'
    | 'EXECUTING'
    | 'VERIFYING'
    | 'COMPLETE'
    | 'FAILED'
    | 'ESCALATED';

export const TERMINAL_STATES: ReadonlySet<AgentState> = new Set([
    'COMPLETE',
    'FAILED',
    'ESCALATED',
]);

// ─── Error Taxonomy (Section 9) ──────────────────────────────────────────

export enum ErrorCode {
    TOOL_ERROR = 'TOOL_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTH_REQUIRED = 'AUTH_REQUIRED',
    RATE_LIMITED = 'RATE_LIMITED',
    NOT_FOUND = 'NOT_FOUND',
    TIMEOUT = 'TIMEOUT',
    CONFLICT = 'CONFLICT',
}

export const RETRYABLE_ERRORS: ReadonlySet<ErrorCode> = new Set([
    ErrorCode.TOOL_ERROR,
    ErrorCode.RATE_LIMITED,
    ErrorCode.TIMEOUT,
]);

export class RetryableError extends Error {
    constructor(
        message: string,
        public readonly code: ErrorCode,
        public readonly retryAfterMs?: number,
    ) {
        super(message);
        this.name = 'RetryableError';
    }
}

export class NonRetryableError extends Error {
    constructor(
        message: string,
        public readonly code: ErrorCode,
    ) {
        super(message);
        this.name = 'NonRetryableError';
    }
}

// ─── Tool Contracts (MCP — Section 9) ────────────────────────────────────

export interface ToolContract {
    name: string;
    description?: string;
    inputSchema: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
    sideEffects: boolean;
    idempotent: boolean;
    idempotencyNote?: string;
    rateLimit?: string;
    requiresApproval?: boolean;
    approvalRoles?: string[];
    safety?: string;
}

export interface ToolResult<T = unknown> {
    tool: string;
    status: 'ok' | 'error';
    data: T;
    error: ToolError | null;
    durationMs: number;
    idempotencyKey?: string;
}

export interface ToolError {
    code: ErrorCode;
    message: string;
    retryable: boolean;
    retryAfterMs?: number;
}

// ─── Validation ──────────────────────────────────────────────────────────

export interface ValidationResult {
    ok: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    path: string;
    message: string;
    keyword: string;
}

// ─── Trace Spans (Section 7) ─────────────────────────────────────────────

export interface TraceSpan {
    runId: string;
    spanId: string;
    parentSpanId?: string;
    agentId: string;
    action: 'plan' | 'execute' | 'verify' | 'tool_call' | 'event';
    tool?: string;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
    durationMs: number;
    tokenUsage: { input: number; output: number };
    costUsd: number;
    timestamp: string;
    status: 'OK' | 'ERROR' | 'RETRY' | 'ESCALATED';
}

export interface TraceEvent {
    runId: string;
    eventType: string;
    data: Record<string, unknown>;
    timestamp: string;
}

// ─── Agent Configuration & Manifest (Section 8) ─────────────────────────

export interface AgentManifest {
    agentId: string;
    version: string;
    district: string;
    description: string;
    capabilities: string[];
    deniedCapabilities: string[];
    maxSteps: number;
    toolTimeoutMs: number;
    costBudgetUsd: number;
    hitlActions: string[];
    memoryConfig: MemoryConfig;
    evalSuite?: string;
    owner: string;
    created: string;
}

export interface MemoryConfig {
    scratchpadMaxTokens: number;
    ragCollection?: string;
    notebookLmEnabled: boolean;
}

export interface AgentConfig {
    agentId: string;
    manifest: AgentManifest;
    maxSteps: number;
    toolTimeoutMs: number;
    costBudgetUsd: number;
}

// ─── Run Results ─────────────────────────────────────────────────────────

export interface RunResult {
    runId: string;
    status: AgentState;
    agentId: string;
    stepsExecuted: number;
    totalCostUsd: number;
    durationMs: number;
    trace: TraceReference;
    output?: unknown;
    error?: string;
}

export interface TraceReference {
    runId: string;
    spanCount: number;
    eventCount: number;
    storagePath: string;
}

// ─── Planner / Executor / Verifier Interfaces ────────────────────────────

export interface PlanAction {
    tool: string;
    args: Record<string, unknown>;
    reasoning?: string;
}

export interface PlanResult {
    nextAction: PlanAction;
    goalComplete: boolean;
    confidence: number;
    reasoning: string;
}

export interface VerificationResult {
    passed: boolean;
    goalComplete: boolean;
    reason: string;
    confidence: number;
}

// ─── Constitution ────────────────────────────────────────────────────────

export interface Constitution {
    articles: ConstitutionArticle[];
    version: string;
    lastUpdated: string;
}

export interface ConstitutionArticle {
    number: number;
    title: string;
    rules: string[];
}

// ─── Retry Configuration ─────────────────────────────────────────────────

export interface RetryOptions {
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    jitter: boolean;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
    jitter: true,
};

// ─── District Config ─────────────────────────────────────────────────────

export interface DistrictConfig {
    districtId: string;
    name: string;
    description: string;
    agents: string[];
    toolAllowlist: string[];
    maxConcurrency: number;
    evalSuite?: string;
}

// ─── Eval Types (Section 13) ─────────────────────────────────────────────

export interface EvalRubric {
    rubricId: string;
    task: string;
    inputs: Record<string, unknown>;
    criteria: EvalCriterion[];
    overallPass: string;
    timeoutSeconds: number;
    costBudgetUsd: number;
}

export interface EvalCriterion {
    name: string;
    weight: number;
    passCondition: string;
    scoring: string;
}

export interface EvalResult {
    rubricId: string;
    passed: boolean;
    overallScore: number;
    criteriaResults: CriterionResult[];
    durationMs: number;
    costUsd: number;
}

export interface CriterionResult {
    name: string;
    passed: boolean;
    score: number;
    details: string;
}

// ─── Cost Ledger ─────────────────────────────────────────────────────────

export interface CostLedger {
    runId: string;
    entries: CostEntry[];
    totalUsd: number;
}

export interface CostEntry {
    spanId: string;
    category: 'llm_tokens' | 'tool_call' | 'infrastructure';
    amountUsd: number;
    description: string;
    timestamp: string;
}
