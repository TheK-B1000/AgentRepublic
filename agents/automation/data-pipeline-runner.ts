// Agent Republic — Automation: Data Pipeline Runner (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const DATA_PIPELINE_RUNNER_MANIFEST: AgentManifest = {
    agentId: 'automation.data_pipeline_runner',
    version: '0.1.0',
    district: 'automation',
    description: 'Executes ETL jobs on schedule.',
    capabilities: ['run_code', 'read_file', 'write_file'],
    deniedCapabilities: ['publish_deploy'],
    maxSteps: 20,
    toolTimeoutMs: 60000,
    costBudgetUsd: 1.00,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 6000, notebookLmEnabled: false },
    owner: 'automation_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...DATA_PIPELINE_RUNNER_MANIFEST }; }
