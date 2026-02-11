// Agent Republic — Ops: Cost Tracker (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const COST_TRACKER_MANIFEST: AgentManifest = {
    agentId: 'operations.cost_tracker',
    version: '0.1.0',
    district: 'operations',
    description: 'Aggregates per-run costs, flags budget overruns.',
    capabilities: ['read_file', 'write_file'],
    deniedCapabilities: ['publish_deploy', 'open_url', 'run_code'],
    maxSteps: 10,
    toolTimeoutMs: 5000,
    costBudgetUsd: 0.25,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 4000, notebookLmEnabled: false },
    owner: 'ops_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...COST_TRACKER_MANIFEST }; }
