// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Eval Harness
// Runs golden tasks against agents, scores with rubrics, reports results.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import type { EvalRubric, EvalResult, CriterionResult, RunResult, AgentManifest } from '../foundation/types.js';
import { agentRun } from '../foundation/runtime.js';

// ─── Eval Runner ─────────────────────────────────────────────────────────

export interface GoldenTask {
    taskId: string;
    name: string;
    description: string;
    agentId: string;
    goal: string;
    expectedOutcome: string;
    rubricId: string;
    timeoutSeconds: number;
    costBudgetUsd: number;
}

export interface EvalSuiteResult {
    suiteId: string;
    totalTasks: number;
    passed: number;
    failed: number;
    skipped: number;
    tsr: number; // Task Success Rate
    totalDurationMs: number;
    totalCostUsd: number;
    results: TaskEvalResult[];
}

export interface TaskEvalResult {
    taskId: string;
    taskName: string;
    passed: boolean;
    runResult?: RunResult;
    evalResult?: EvalResult;
    error?: string;
}

/**
 * Run an evaluation suite: execute golden tasks and score against rubrics.
 */
export async function runEvalSuite(
    suiteId: string,
    tasks: GoldenTask[],
    rubrics: Map<string, EvalRubric>,
    manifests: Map<string, AgentManifest>,
): Promise<EvalSuiteResult> {
    const startTime = Date.now();
    const results: TaskEvalResult[] = [];

    for (const task of tasks) {
        const manifest = manifests.get(task.agentId);
        if (!manifest) {
            results.push({
                taskId: task.taskId,
                taskName: task.name,
                passed: false,
                error: `Agent manifest not found: ${task.agentId}`,
            });
            continue;
        }

        try {
            // Run the agent
            const runResult = await agentRun({
                goal: task.goal,
                manifest,
            });

            // Score against rubric
            const rubric = rubrics.get(task.rubricId);
            const evalResult = rubric
                ? scoreWithRubric(runResult, rubric)
                : { rubricId: 'none', passed: runResult.status === 'COMPLETE', overallScore: runResult.status === 'COMPLETE' ? 1 : 0, criteriaResults: [], durationMs: 0, costUsd: 0 };

            results.push({
                taskId: task.taskId,
                taskName: task.name,
                passed: evalResult.passed,
                runResult,
                evalResult,
            });
        } catch (err) {
            results.push({
                taskId: task.taskId,
                taskName: task.name,
                passed: false,
                error: (err as Error).message,
            });
        }
    }

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed && !r.error).length;
    const skipped = results.filter((r) => r.error).length;

    return {
        suiteId,
        totalTasks: tasks.length,
        passed,
        failed,
        skipped,
        tsr: tasks.length > 0 ? passed / tasks.length : 0,
        totalDurationMs: Date.now() - startTime,
        totalCostUsd: results.reduce((sum, r) => sum + (r.runResult?.totalCostUsd ?? 0), 0),
        results,
    };
}

/**
 * Score a run result against a rubric.
 */
function scoreWithRubric(runResult: RunResult, rubric: EvalRubric): EvalResult {
    const criteriaResults: CriterionResult[] = rubric.criteria.map((criterion) => {
        // Simplified scoring: pass if the run completed
        const passed = runResult.status === 'COMPLETE';
        return {
            name: criterion.name,
            passed,
            score: passed ? 1 : 0,
            details: passed ? 'Run completed successfully' : `Run ended with status: ${runResult.status}`,
        };
    });

    const weightedScore = criteriaResults.reduce((sum, cr, i) => {
        return sum + cr.score * rubric.criteria[i].weight;
    }, 0);

    return {
        rubricId: rubric.rubricId,
        passed: weightedScore >= 0.85,
        overallScore: weightedScore,
        criteriaResults,
        durationMs: runResult.durationMs,
        costUsd: runResult.totalCostUsd,
    };
}

/**
 * Format eval suite results as a report string.
 */
export function formatEvalReport(result: EvalSuiteResult): string {
    const lines: string[] = [
        `═══ Eval Suite: ${result.suiteId} ═══`,
        `TSR: ${(result.tsr * 100).toFixed(1)}% (${result.passed}/${result.totalTasks} passed)`,
        `Duration: ${result.totalDurationMs}ms | Cost: $${result.totalCostUsd.toFixed(4)}`,
        '',
    ];

    for (const r of result.results) {
        const icon = r.passed ? '✓' : '✗';
        const status = r.error ? `ERROR: ${r.error}` : (r.passed ? 'PASSED' : 'FAILED');
        lines.push(`  ${icon} ${r.taskName}: ${status}`);
    }

    return lines.join('\n');
}
