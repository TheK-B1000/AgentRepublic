// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Workshop: Visual QA Agent
// Screenshots builds, compares to brief, flags deviations.
// STATUS: Stub — full implementation deferred to Phase 2.
// ═══════════════════════════════════════════════════════════════════════════

import type { AgentManifest } from '../../foundation/types.js';

export const VISUAL_QA_AGENT_MANIFEST: AgentManifest = {
    agentId: 'workshop.visual_qa_agent',
    version: '0.1.0',
    district: 'workshop',
    description: 'Screenshots builds, compares to design brief, flags deviations.',
    capabilities: ['open_url', 'screenshot', 'extract_text', 'read_file'],
    deniedCapabilities: ['write_file', 'publish_deploy', 'run_code'],
    maxSteps: 15,
    toolTimeoutMs: 10000,
    costBudgetUsd: 0.50,
    hitlActions: [],
    memoryConfig: {
        scratchpadMaxTokens: 4000,
        ragCollection: 'workshop_qa',
        notebookLmEnabled: false,
    },
    evalSuite: 'workshop.visual_qa.golden_v1',
    owner: 'workshop_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest {
    return { ...VISUAL_QA_AGENT_MANIFEST };
}
