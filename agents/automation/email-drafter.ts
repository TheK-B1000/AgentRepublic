// Agent Republic — Automation: Email Drafter (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const EMAIL_DRAFTER_MANIFEST: AgentManifest = {
    agentId: 'automation.email_drafter',
    version: '0.1.0',
    district: 'automation',
    description: 'Composes emails from templates and context.',
    capabilities: ['read_file', 'write_file'],
    deniedCapabilities: ['publish_deploy', 'open_url'],
    maxSteps: 10,
    toolTimeoutMs: 10000,
    costBudgetUsd: 0.50,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 4000, notebookLmEnabled: false },
    owner: 'automation_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...EMAIL_DRAFTER_MANIFEST }; }
