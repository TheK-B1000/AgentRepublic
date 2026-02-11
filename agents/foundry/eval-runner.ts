// Agent Republic — Foundry: Eval Runner (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const EVAL_RUNNER_MANIFEST: AgentManifest = {
    agentId: 'foundry.eval_runner',
    version: '0.1.0',
    district: 'foundry',
    description: 'Runs slice evaluations on trained models.',
    capabilities: ['run_code', 'read_file', 'write_file'],
    deniedCapabilities: ['open_url', 'publish_deploy'],
    maxSteps: 20,
    toolTimeoutMs: 60000,
    costBudgetUsd: 1.00,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 6000, notebookLmEnabled: false },
    owner: 'foundry_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...EVAL_RUNNER_MANIFEST }; }
