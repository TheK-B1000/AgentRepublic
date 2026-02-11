// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Core Runtime (Plan → Execute → Verify)
// "A chatbot hopes. An agent verifies."
//
// This is the heart of every citizen in the Republic. Every agent execution
// follows the deterministic state machine: INIT → PLANNING → EXECUTING →
// VERIFYING → COMPLETE | FAILED | ESCALATED.
// ═══════════════════════════════════════════════════════════════════════════

import type {
    AgentConfig,
    AgentManifest,
    AgentState,
    PlanResult,
    PlanAction,
    VerificationResult,
    ToolResult,
    RunResult,
    ToolContract,
    CostLedger,
    CostEntry,
} from './types.js';
import { TERMINAL_STATES, RetryableError, ErrorCode } from './types.js';
import { Trace, generateRunId, openTrace } from './trace.js';
import { Scratchpad } from './scratchpad.js';
import { PermissionChecker } from './permissions.js';
import { SchemaValidator, formatValidationErrors } from './schema-validator.js';
import { withRetry } from './retry.js';
import { loadConfig, ConfigAccessor } from './config.js';

// ─── LLM Provider Interface (stubbed for mock mode) ─────────────────────

export interface LLMProvider {
    plan(goal: string, scratchpad: string, tools: string[], constitution: string): Promise<PlanResult>;
    verify(goal: string, action: PlanAction, result: ToolResult, scratchpad: string): Promise<VerificationResult>;
}

/**
 * Mock LLM provider for development and testing.
 * Always plans the first available tool, always passes verification.
 */
export class MockLLMProvider implements LLMProvider {
    private callCount = 0;

    async plan(goal: string, _scratchpad: string, tools: string[]): Promise<PlanResult> {
        this.callCount++;

        // Mock: after 3 plan calls, declare the goal complete
        if (this.callCount > 3) {
            return {
                nextAction: { tool: 'noop', args: {} },
                goalComplete: true,
                confidence: 0.95,
                reasoning: `Mock: goal "${goal}" marked complete after ${this.callCount} iterations.`,
            };
        }

        // Mock: use the first tool in the list
        const toolName = tools[0] ?? 'write_file';
        return {
            nextAction: {
                tool: toolName,
                args: { mock: true, iteration: this.callCount },
                reasoning: `Mock plan: using tool ${toolName}`,
            },
            goalComplete: false,
            confidence: 0.8,
            reasoning: `Mock planning step ${this.callCount}`,
        };
    }

    async verify(
        _goal: string,
        _action: PlanAction,
        _result: ToolResult,
        _scratchpad: string,
    ): Promise<VerificationResult> {
        return {
            passed: true,
            goalComplete: this.callCount > 3,
            reason: 'Mock verification: passed.',
            confidence: 0.9,
        };
    }
}

// ─── Tool Executor Interface ─────────────────────────────────────────────

export interface ToolExecutor {
    execute(toolName: string, args: Record<string, unknown>, timeoutMs: number): Promise<ToolResult>;
    getContract(toolName: string): ToolContract | undefined;
    listTools(): string[];
}

/**
 * Mock tool executor for development and testing.
 */
export class MockToolExecutor implements ToolExecutor {
    execute(toolName: string, args: Record<string, unknown>): Promise<ToolResult> {
        return Promise.resolve({
            tool: toolName,
            status: 'ok' as const,
            data: { mock: true, args },
            error: null,
            durationMs: Math.floor(Math.random() * 500) + 100,
        });
    }

    getContract(toolName: string): ToolContract | undefined {
        // Return a basic contract for any tool name (testing only)
        return {
            name: toolName,
            inputSchema: { type: 'object', properties: {}, additionalProperties: true },
            sideEffects: false,
            idempotent: true,
        };
    }

    listTools(): string[] {
        return ['write_file', 'read_file', 'open_url', 'click', 'type', 'screenshot', 'extract_text', 'run_code'];
    }
}

// ─── Core Agent Run ──────────────────────────────────────────────────────

export interface AgentRunOptions {
    goal: string;
    manifest: AgentManifest;
    llm?: LLMProvider;
    executor?: ToolExecutor;
    constitution?: string;
    context?: string;
}

/**
 * Execute an agent run following the deterministic P/E/V state machine.
 *
 * State transitions:
 *   INIT → PLANNING → EXECUTING → VERIFYING → (loop or terminal)
 *
 * Terminal states: COMPLETE, FAILED, ESCALATED
 */
export async function agentRun(options: AgentRunOptions): Promise<RunResult> {
    const {
        goal,
        manifest,
        llm = new MockLLMProvider(),
        executor = new MockToolExecutor(),
        constitution = 'Default Republic Constitution',
        context = '',
    } = options;

    const config = new ConfigAccessor(loadConfig());
    const runId = generateRunId();
    const trace = openTrace(runId, config.getTraceStoragePath());
    const scratchpad = new Scratchpad(manifest.memoryConfig.scratchpadMaxTokens);
    const permissions = new PermissionChecker(manifest);
    const validator = new SchemaValidator();
    const startTime = Date.now();

    // Cost tracking
    const costLedger: CostLedger = { runId, entries: [], totalUsd: 0 };

    // ─── Protocol Zero: Initialization ───────────────────────────────────

    trace.addEvent('protocol_zero', { agentId: manifest.agentId, goal });

    // Validate permissions
    const tools = executor.listTools().filter((t) => permissions.allows(t).allowed);
    scratchpad.init(goal, context, tools);

    trace.addEvent('init_complete', {
        toolCount: tools.length,
        maxSteps: manifest.maxSteps,
        costBudget: manifest.costBudgetUsd,
    });

    // ─── State Machine ──────────────────────────────────────────────────

    let state: AgentState = 'PLANNING';
    let stepCount = 0;
    let currentPlan: PlanResult | null = null;
    let lastAction: PlanAction | null = null;
    let lastResult: ToolResult | null = null;

    while (!TERMINAL_STATES.has(state)) {
        // ── Guard: max steps ────────────────────────────────────────────
        if (stepCount >= manifest.maxSteps) {
            state = 'ESCALATED';
            trace.addEvent('max_steps_exceeded', { stepCount, maxSteps: manifest.maxSteps });
            break;
        }

        // ── Guard: cost budget ──────────────────────────────────────────
        if (costLedger.totalUsd > manifest.costBudgetUsd) {
            state = 'ESCALATED';
            trace.addEvent('cost_budget_exceeded', {
                totalCost: costLedger.totalUsd,
                budget: manifest.costBudgetUsd,
            });
            break;
        }

        // ── PLANNING ────────────────────────────────────────────────────
        if (state === 'PLANNING') {
            const planStart = Date.now();
            try {
                currentPlan = await llm.plan(
                    goal,
                    scratchpad.current(),
                    tools,
                    constitution,
                );

                trace.addSpan({
                    agentId: manifest.agentId,
                    action: 'plan',
                    input: { goal, scratchpadLength: scratchpad.length },
                    output: {
                        tool: currentPlan.nextAction.tool,
                        goalComplete: currentPlan.goalComplete,
                        confidence: currentPlan.confidence,
                    },
                    durationMs: Date.now() - planStart,
                    tokenUsage: { input: 0, output: 0 }, // Real values from LLM provider
                    costUsd: 0,
                    status: 'OK',
                });

                // If the planner says the goal is complete, we're done
                if (currentPlan.goalComplete) {
                    state = 'COMPLETE';
                    trace.addEvent('goal_complete', { reasoning: currentPlan.reasoning });
                    break;
                }

                state = 'EXECUTING';
            } catch (err) {
                trace.addEvent('plan_error', { error: (err as Error).message });
                state = 'FAILED';
                break;
            }
        }

        // ── EXECUTING ───────────────────────────────────────────────────
        else if (state === 'EXECUTING' && currentPlan) {
            lastAction = currentPlan.nextAction;

            // Guardrail: permission check
            const permResult = permissions.allows(lastAction.tool);
            if (!permResult.allowed) {
                state = 'ESCALATED';
                trace.addEvent('permission_denied', {
                    tool: lastAction.tool,
                    reason: permResult.reason,
                });
                scratchpad.add('error', `Permission denied: ${permResult.reason}`);
                break;
            }

            // Guardrail: HITL approval required
            if (permResult.requiresApproval) {
                state = 'ESCALATED';
                trace.addEvent('hitl_required', {
                    tool: lastAction.tool,
                    reason: permResult.reason,
                });
                scratchpad.add('note', `Human approval required for: ${lastAction.tool}`);
                break;
            }

            // Guardrail: schema validation
            const contract = executor.getContract(lastAction.tool);
            if (contract) {
                const validation = validator.validateToolInput(contract, lastAction.args);
                if (!validation.ok) {
                    scratchpad.add('error', `Schema validation failed for ${lastAction.tool}: ${formatValidationErrors(validation)}`);
                    trace.addEvent('schema_validation_failed', {
                        tool: lastAction.tool,
                        errors: validation.errors,
                    });
                    state = 'PLANNING'; // Re-plan with error context
                    stepCount++;
                    continue;
                }
            }

            // Execute with retry + backoff
            const execStart = Date.now();
            const retryResult = await withRetry(
                () => executor.execute(lastAction!.tool, lastAction!.args, manifest.toolTimeoutMs),
                { maxAttempts: 3, baseDelayMs: 1000 },
                (event) => {
                    trace.addEvent('retry', {
                        tool: lastAction!.tool,
                        attempt: event.attempt,
                        delayMs: event.delayMs,
                        error: event.error,
                    });
                },
            );

            if (!retryResult.success) {
                state = 'FAILED';
                trace.addEvent('tool_exhausted_retries', {
                    tool: lastAction.tool,
                    attempts: retryResult.attempts,
                    lastError: retryResult.lastError?.message,
                });
                scratchpad.add('error', `Tool ${lastAction.tool} failed after ${retryResult.attempts} attempts`);
                break;
            }

            lastResult = retryResult.result!;
            const execDuration = Date.now() - execStart;

            trace.addSpan({
                agentId: manifest.agentId,
                action: 'tool_call',
                tool: lastAction.tool,
                input: lastAction.args,
                output: lastResult.data as Record<string, unknown>,
                durationMs: execDuration,
                tokenUsage: { input: 0, output: 0 },
                costUsd: 0,
                status: lastResult.status === 'ok' ? 'OK' : 'ERROR',
            });

            scratchpad.add('action', `Executed ${lastAction.tool}`);
            scratchpad.add('result', `Result: ${JSON.stringify(lastResult.data).slice(0, 500)}`);

            state = 'VERIFYING';
        }

        // ── VERIFYING ───────────────────────────────────────────────────
        else if (state === 'VERIFYING' && lastAction && lastResult) {
            const verifyStart = Date.now();
            try {
                const verification = await llm.verify(
                    goal,
                    lastAction,
                    lastResult,
                    scratchpad.current(),
                );

                trace.addSpan({
                    agentId: manifest.agentId,
                    action: 'verify',
                    input: { tool: lastAction.tool },
                    output: {
                        passed: verification.passed,
                        goalComplete: verification.goalComplete,
                        confidence: verification.confidence,
                    },
                    durationMs: Date.now() - verifyStart,
                    tokenUsage: { input: 0, output: 0 },
                    costUsd: 0,
                    status: verification.passed ? 'OK' : 'ERROR',
                });

                if (verification.passed) {
                    if (verification.goalComplete) {
                        state = 'COMPLETE';
                    } else {
                        state = 'PLANNING';
                    }
                } else {
                    scratchpad.add('verification', `Failed: ${verification.reason}`);
                    state = 'PLANNING'; // Re-plan with failure context
                }
            } catch (err) {
                trace.addEvent('verify_error', { error: (err as Error).message });
                state = 'FAILED';
                break;
            }
        }

        // ── Safety: unexpected state ────────────────────────────────────
        else {
            trace.addEvent('unexpected_state', { state });
            state = 'FAILED';
            break;
        }

        stepCount++;
    }

    // ─── Finalize ────────────────────────────────────────────────────────

    const durationMs = Date.now() - startTime;
    trace.close(state);
    const traceSummary = trace.summary();

    return {
        runId,
        status: state,
        agentId: manifest.agentId,
        stepsExecuted: stepCount,
        totalCostUsd: costLedger.totalUsd,
        durationMs,
        trace: {
            runId,
            spanCount: traceSummary.spanCount,
            eventCount: traceSummary.eventCount,
            storagePath: traceSummary.storagePath,
        },
    };
}
