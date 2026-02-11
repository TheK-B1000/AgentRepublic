// Agent Republic — Foundry: Model Registrar (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const MODEL_REGISTRAR_MANIFEST: AgentManifest = {
    agentId: 'foundry.model_registrar',
    version: '0.1.0',
    district: 'foundry',
    description: 'Registers model artifacts with metadata, tags, and eval scores.',
    capabilities: ['read_file', 'write_file'],
    deniedCapabilities: ['run_code', 'open_url', 'publish_deploy'],
    maxSteps: 10,
    toolTimeoutMs: 10000,
    costBudgetUsd: 0.50,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 4000, notebookLmEnabled: false },
    owner: 'foundry_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...MODEL_REGISTRAR_MANIFEST }; }
