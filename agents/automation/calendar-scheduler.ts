// Agent Republic — Automation: Calendar Scheduler (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const CALENDAR_SCHEDULER_MANIFEST: AgentManifest = {
    agentId: 'automation.calendar_scheduler',
    version: '0.1.0',
    district: 'automation',
    description: 'Books meetings based on availability.',
    capabilities: ['read_file', 'write_file', 'run_code'],
    deniedCapabilities: ['publish_deploy'],
    maxSteps: 15,
    toolTimeoutMs: 10000,
    costBudgetUsd: 0.50,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 4000, notebookLmEnabled: false },
    owner: 'automation_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...CALENDAR_SCHEDULER_MANIFEST }; }
