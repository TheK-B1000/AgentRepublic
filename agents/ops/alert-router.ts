// Agent Republic — Ops: Alert Router (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const ALERT_ROUTER_MANIFEST: AgentManifest = {
    agentId: 'operations.alert_router',
    version: '0.1.0',
    district: 'operations',
    description: 'Receives alerts, triages severity, routes to the right handler.',
    capabilities: ['read_file', 'write_file', 'run_code'],
    deniedCapabilities: ['publish_deploy', 'open_url'],
    maxSteps: 10,
    toolTimeoutMs: 5000,
    costBudgetUsd: 0.25,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 4000, notebookLmEnabled: false },
    owner: 'ops_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...ALERT_ROUTER_MANIFEST }; }
