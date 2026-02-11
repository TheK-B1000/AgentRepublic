// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Chancellor (Global Orchestrator)
// Receives goals → decomposes → dispatches to districts → monitors.
// "The Chancellor arbitrates ties." — Article VIII
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { AgentManifest, DistrictConfig, RunResult } from '../foundation/types.js';
import { agentRun } from '../foundation/runtime.js';
import type { AgentRunOptions } from '../foundation/runtime.js';
import { generateRunId } from '../foundation/trace.js';

// ─── Task Assignment ─────────────────────────────────────────────────────

export interface TaskAssignment {
    taskId: string;
    districtId: string;
    agentId: string;
    goal: string;
    deadline?: string;
    costBudgetUsd: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

// ─── Chancellor ──────────────────────────────────────────────────────────

export class Chancellor {
    private readonly districts = new Map<string, DistrictConfig>();
    private readonly agents = new Map<string, AgentManifest>();
    private readonly activeRuns = new Map<string, RunResult>();

    /**
     * Register a district configuration.
     */
    registerDistrict(config: DistrictConfig): void {
        this.districts.set(config.districtId, config);
    }

    /**
     * Register an agent manifest.
     */
    registerAgent(manifest: AgentManifest): void {
        this.agents.set(manifest.agentId, manifest);
    }

    /**
     * Load district configs from YAML files.
     */
    loadDistrictConfigs(configDir: string): void {
        const districtIds = [
            'workshop', 'foundry', 'research',
            'automation', 'qa-safety', 'operations', 'identity',
        ];

        for (const id of districtIds) {
            try {
                const filePath = join(configDir, `${id}.config.yaml`);
                const raw = readFileSync(filePath, 'utf-8');
                const config = parseYaml(raw) as DistrictConfig;
                this.registerDistrict(config);
            } catch {
                // District config not found — skip (it may not be built yet)
            }
        }
    }

    /**
     * Decompose a high-level goal into task assignments.
     * In production, this would use an LLM to plan the decomposition.
     */
    async decompose(goal: string): Promise<TaskAssignment[]> {
        // Simple heuristic: route to workshop for web tasks, research for queries
        const taskId = generateRunId();
        const lowerGoal = goal.toLowerCase();

        let districtId = 'workshop';
        let agentId = 'workshop.landing_page_builder';

        if (lowerGoal.includes('research') || lowerGoal.includes('search') || lowerGoal.includes('find')) {
            districtId = 'research';
            agentId = 'research.web_researcher';
        } else if (lowerGoal.includes('model') || lowerGoal.includes('train')) {
            districtId = 'foundry';
            agentId = 'foundry.model_trainer';
        } else if (lowerGoal.includes('email') || lowerGoal.includes('schedule') || lowerGoal.includes('automate')) {
            districtId = 'automation';
            agentId = 'automation.email_drafter';
        }

        return [{
            taskId,
            districtId,
            agentId,
            goal,
            costBudgetUsd: 2.0,
            priority: 'medium',
        }];
    }

    /**
     * Dispatch a task assignment to the appropriate agent.
     */
    async dispatch(assignment: TaskAssignment): Promise<RunResult> {
        const manifest = this.agents.get(assignment.agentId);
        if (!manifest) {
            throw new Error(
                `Agent "${assignment.agentId}" not registered. Available: ${[...this.agents.keys()].join(', ')}`,
            );
        }

        const result = await agentRun({
            goal: assignment.goal,
            manifest,
        });

        this.activeRuns.set(result.runId, result);
        return result;
    }

    /**
     * Get the status of an active run.
     */
    getRunStatus(runId: string): RunResult | undefined {
        return this.activeRuns.get(runId);
    }

    /**
     * List all registered districts.
     */
    listDistricts(): DistrictConfig[] {
        return [...this.districts.values()];
    }

    /**
     * List all registered agents.
     */
    listAgents(): AgentManifest[] {
        return [...this.agents.values()];
    }
}
