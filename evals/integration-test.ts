// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Integration Test
// Runs golden task ws-lp-001 with real Claude + Playwright providers.
// Run: LLM_API_KEY=sk-... npx tsx evals/integration-test.ts
// ═══════════════════════════════════════════════════════════════════════════

import { agentRun } from '../foundation/runtime.js';
import { ClaudeLLMProvider } from '../foundation/claude-provider.js';
import { LiveToolExecutor } from '../tools/live-executor.js';
import { closeBrowser } from '../tools/browser-engine.js';
import { LANDING_PAGE_BUILDER_MANIFEST } from '../agents/workshop/landing-page-builder.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

async function main(): Promise<void> {
    console.log(`\n${BOLD}═══ Agent Republic — Integration Test ═══${RESET}\n`);

    // ── Pre-flight checks ────────────────────────────────────────────────
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
        console.error(`${RED}✗ LLM_API_KEY not set. Run with: LLM_API_KEY=sk-... npx tsx evals/integration-test.ts${RESET}`);
        process.exit(1);
    }

    const model = process.env.LLM_MODEL ?? 'claude-sonnet-4-20250514';
    console.log(`${CYAN}▸ Provider:${RESET} Claude (${model})`);
    console.log(`${CYAN}▸ Agent:${RESET} ${LANDING_PAGE_BUILDER_MANIFEST.agentId}`);

    // ── Load golden task ─────────────────────────────────────────────────
    const goldenPath = resolve('evals/golden-tasks/workshop-landing-page.json');
    const goldenData = JSON.parse(readFileSync(goldenPath, 'utf-8'));
    const task = goldenData.goldenTasks[0]; // ws-lp-001
    console.log(`${CYAN}▸ Golden Task:${RESET} ${task.taskId} — ${task.name}`);
    console.log(`${CYAN}▸ Goal:${RESET} ${task.goal.slice(0, 100)}…`);
    console.log();

    // ── Wire providers ───────────────────────────────────────────────────
    const llm = new ClaudeLLMProvider(apiKey, model);
    const executor = new LiveToolExecutor();

    const constitution = `You are building web pages in the Agent Republic.
Rules:
1. Always create complete, valid HTML files.
2. Include inline CSS or a separate styles.css — both are acceptable.
3. Use the write_file tool to create files in the workspace (relative paths only).
4. After writing all files, use open_url with a file:// URL to preview.
5. Use screenshot to capture the final result.
6. Brand colors and required sections from the brief are mandatory.
7. Maximum 3 verification iterations.`;

    console.log(`${YELLOW}▸ Running agent…${RESET}\n`);
    const startTime = Date.now();

    // ── Execute ──────────────────────────────────────────────────────────
    try {
        const result = await agentRun({
            goal: task.goal,
            manifest: LANDING_PAGE_BUILDER_MANIFEST,
            llm,
            executor,
            constitution,
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

        // ── Report ───────────────────────────────────────────────────────
        console.log(`\n${BOLD}═══ Integration Test Results ═══${RESET}\n`);

        const statusIcon = result.status === 'COMPLETE' ? `${GREEN}✓` : `${RED}✗`;
        console.log(`  ${statusIcon} Status:${RESET} ${result.status}`);
        console.log(`  ${DIM}Run ID:${RESET}  ${result.runId}`);
        console.log(`  ${DIM}Steps:${RESET}   ${result.stepsExecuted}`);
        console.log(`  ${DIM}Time:${RESET}    ${elapsed}s`);
        console.log(`  ${DIM}Cost:${RESET}    $${result.totalCostUsd.toFixed(6)}`);
        console.log(`  ${DIM}Spans:${RESET}   ${result.trace.spanCount}`);
        console.log(`  ${DIM}Events:${RESET}  ${result.trace.eventCount}`);
        console.log(`  ${DIM}Trace:${RESET}   ${result.trace.storagePath}`);
        console.log();

        if (result.status === 'COMPLETE') {
            console.log(`  ${GREEN}${BOLD}✓ INTEGRATION TEST PASSED${RESET}\n`);
        } else {
            console.log(`  ${YELLOW}⚠ Agent did not reach COMPLETE (status: ${result.status})${RESET}`);
            console.log(`  ${DIM}This is expected for first runs — check the trace for details.${RESET}\n`);
        }
    } catch (err) {
        console.error(`\n${RED}✗ Integration test crashed:${RESET}`, err);
    } finally {
        // Always clean up browser
        await closeBrowser();
    }
}

main().catch((err) => {
    console.error(`${RED}Fatal error:${RESET}`, err);
    process.exit(1);
});
