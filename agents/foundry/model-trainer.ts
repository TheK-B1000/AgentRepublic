// Agent Republic — Foundry: Model Trainer (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const MODEL_TRAINER_MANIFEST: AgentManifest = {
    agentId: 'foundry.model_trainer',
    version: '0.1.0',
    district: 'foundry',
    description: 'Configures and launches training runs (fine-tuning, LoRA).',
    capabilities: ['run_code', 'read_file', 'write_file'],
    deniedCapabilities: ['open_url', 'publish_deploy'],
    maxSteps: 25,
    toolTimeoutMs: 300000,
    costBudgetUsd: 5.00,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 8000, notebookLmEnabled: false },
    owner: 'foundry_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...MODEL_TRAINER_MANIFEST }; }
