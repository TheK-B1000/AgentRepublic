// Agent Republic — Ops: Incident Responder (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const INCIDENT_RESPONDER_MANIFEST: AgentManifest = {
    agentId: 'operations.incident_responder',
    version: '0.1.0',
    district: 'operations',
    description: 'Executes runbook steps for known incident types.',
    capabilities: ['run_code', 'read_file', 'write_file'],
    deniedCapabilities: ['publish_deploy'],
    maxSteps: 20,
    toolTimeoutMs: 15000,
    costBudgetUsd: 1.00,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 6000, notebookLmEnabled: false },
    owner: 'ops_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...INCIDENT_RESPONDER_MANIFEST }; }
