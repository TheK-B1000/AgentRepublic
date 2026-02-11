// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Smoke Test
// Validates that all foundation modules load, compose, and run correctly.
// Run: npx tsx foundation/smoke-test.ts
// ═══════════════════════════════════════════════════════════════════════════

import { loadConfig, ConfigAccessor } from './config.js';
import { Trace, openTrace, generateRunId } from './trace.js';
import { SchemaValidator, formatValidationErrors } from './schema-validator.js';
import { withRetry } from './retry.js';
import { PermissionChecker } from './permissions.js';
import { Scratchpad } from './scratchpad.js';
import { agentRun, MockLLMProvider, MockToolExecutor } from './runtime.js';
import type { AgentManifest, ToolContract } from './types.js';
import { RetryableError, ErrorCode } from './types.js';
import { mkdirSync } from 'node:fs';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean): void {
    if (condition) {
        console.log(`  ${GREEN}✓${RESET} ${label}`);
        passed++;
    } else {
        console.log(`  ${RED}✗${RESET} ${label}`);
        failed++;
    }
}

async function main(): Promise<void> {
    console.log(`\n${BOLD}═══ Agent Republic — Smoke Test ═══${RESET}\n`);

    // ── Config ────────────────────────────────────────────────────────────
    console.log(`${YELLOW}▸ Config${RESET}`);
    const config = loadConfig({ LLM_PROVIDER: 'mock' });
    check('loadConfig returns config object', config != null && typeof config === 'object');
    const accessor = new ConfigAccessor(config);
    check('ConfigAccessor.getTraceStoragePath()', accessor.getTraceStoragePath().length > 0);

    // ── Trace ─────────────────────────────────────────────────────────────
    console.log(`\n${YELLOW}▸ Trace${RESET}`);
    const runId = generateRunId();
    check('generateRunId() starts with "run_"', runId.startsWith('run_'));

    // Create temp trace dir
    const traceDir = './traces/smoke';
    mkdirSync(traceDir, { recursive: true });
    const trace = openTrace(runId, traceDir);
    check('openTrace() returns Trace instance', trace instanceof Trace);

    const span = trace.addSpan({
        agentId: 'test_agent',
        action: 'plan',
        input: { test: true },
        output: { result: 'ok' },
        durationMs: 42,
        tokenUsage: { input: 100, output: 50 },
        costUsd: 0.001,
        status: 'OK',
    });
    check('addSpan() returns span with runId', span.runId === runId);

    trace.addEvent('smoke_test', { phase: 'testing' });
    trace.close('COMPLETE');
    const summary = trace.summary();
    check('trace.summary() reports spans and events', summary.spanCount >= 1 && summary.eventCount >= 1);

    // ── Schema Validator ──────────────────────────────────────────────────
    console.log(`\n${YELLOW}▸ Schema Validator${RESET}`);
    const validator = new SchemaValidator();

    const testContract: ToolContract = {
        name: 'test_tool',
        inputSchema: {
            type: 'object',
            properties: { url: { type: 'string' } },
            required: ['url'],
        },
        sideEffects: false,
        idempotent: true,
    };

    const validResult = validator.validateToolInput(testContract, { url: 'https://example.com' });
    check('valid input passes validation', validResult.ok === true);

    const invalidResult = validator.validateToolInput(testContract, { url: 42 });
    check('invalid input fails validation', invalidResult.ok === false);
    check('formatValidationErrors() returns string', formatValidationErrors(invalidResult).length > 0);

    // ── Retry ─────────────────────────────────────────────────────────────
    console.log(`\n${YELLOW}▸ Retry${RESET}`);
    let attempt = 0;
    const retryResult = await withRetry(
        async () => {
            attempt++;
            if (attempt < 3) throw new RetryableError('Transient', ErrorCode.RATE_LIMITED);
            return 'success';
        },
        { maxAttempts: 5, baseDelayMs: 10 },
    );
    check('withRetry succeeds after transient failures', retryResult.success === true);
    check('withRetry reports correct attempt count', retryResult.attempts === 3);

    // Non-retryable error — withRetry rethrows immediately (by design)
    let nonRetryableThrew = false;
    try {
        await withRetry(
            async () => { throw new Error('permanent'); },
            { maxAttempts: 3, baseDelayMs: 10 },
        );
    } catch {
        nonRetryableThrew = true;
    }
    check('withRetry throws on non-retryable error', nonRetryableThrew === true);

    // ── Permissions ───────────────────────────────────────────────────────
    console.log(`\n${YELLOW}▸ Permissions${RESET}`);
    const manifest: AgentManifest = {
        agentId: 'test.smoke_agent',
        version: '1.0.0',
        district: 'test',
        description: 'Smoke test agent',
        capabilities: ['read_file', 'write_file'],
        deniedCapabilities: ['publish_deploy'],
        maxSteps: 10,
        toolTimeoutMs: 5000,
        costBudgetUsd: 1.00,
        hitlActions: ['publish_deploy'],
        memoryConfig: { scratchpadMaxTokens: 4000, notebookLmEnabled: false },
        owner: 'test',
        created: '2025-01-01T00:00:00Z',
    };

    const checker = new PermissionChecker(manifest);
    check('allows() returns true for allowed tool', checker.allows('read_file').allowed === true);
    check('allows() returns false for denied tool', checker.allows('publish_deploy').allowed === false);
    check('allows() returns false for unknown tool', checker.allows('launch_missiles').allowed === false);
    check('allowsCost() within budget', checker.allowsCost(0.50, 0.25).allowed === true);
    check('allowsCost() over budget', checker.allowsCost(0.90, 0.20).allowed === false);

    // ── Scratchpad ────────────────────────────────────────────────────────
    console.log(`\n${YELLOW}▸ Scratchpad${RESET}`);
    const scratchpad = new Scratchpad(1000);
    scratchpad.init('Test goal', 'Test context', ['read_file', 'write_file']);
    check('scratchpad.init() populated', scratchpad.current().includes('Test goal'));
    check('scratchpad.length > 0', scratchpad.length > 0);

    scratchpad.add('action', 'Executed read_file');
    scratchpad.add('result', 'File content: hello world');
    check('scratchpad.add() increases length', scratchpad.length >= 3);

    // ── Runtime (agentRun) ────────────────────────────────────────────────
    console.log(`\n${YELLOW}▸ Runtime (agentRun)${RESET}`);
    const runResult = await agentRun({
        goal: 'Smoke test: verify agent loop',
        manifest,
    });
    check('agentRun() returns RunResult', runResult != null && typeof runResult.runId === 'string');
    check('agentRun() runId starts with "run_"', runResult.runId.startsWith('run_'));
    check('agentRun() reaches terminal state', ['COMPLETE', 'FAILED', 'ESCALATED'].includes(runResult.status));
    check('agentRun() tracked steps', runResult.stepsExecuted >= 0);
    check('agentRun() generated trace', runResult.trace != null);

    // ── Summary ───────────────────────────────────────────────────────────
    console.log(`\n${BOLD}═══ Results ═══${RESET}`);
    console.log(`  ${GREEN}Passed: ${passed}${RESET}`);
    if (failed > 0) console.log(`  ${RED}Failed: ${failed}${RESET}`);
    else console.log(`  ${GREEN}Failed: 0${RESET}`);
    console.log();

    if (failed > 0) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(`${RED}Smoke test crashed:${RESET}`, err);
    process.exit(1);
});
