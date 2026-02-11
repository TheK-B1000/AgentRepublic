// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Workshop: Component Library Manager
// Maintains a versioned library of reusable UI components.
// STATUS: Stub — full implementation deferred to Phase 2.
// ═══════════════════════════════════════════════════════════════════════════

import type { AgentManifest } from '../../foundation/types.js';

export const COMPONENT_LIBRARY_MANAGER_MANIFEST: AgentManifest = {
    agentId: 'workshop.component_library_manager',
    version: '0.1.0',
    district: 'workshop',
    description: 'Maintains a versioned library of UI components.',
    capabilities: ['read_file', 'write_file', 'run_code'],
    deniedCapabilities: ['publish_deploy', 'open_url'],
    maxSteps: 20,
    toolTimeoutMs: 10000,
    costBudgetUsd: 1.00,
    hitlActions: [],
    memoryConfig: {
        scratchpadMaxTokens: 6000,
        ragCollection: 'workshop_components',
        notebookLmEnabled: false,
    },
    evalSuite: 'workshop.components.golden_v1',
    owner: 'workshop_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest {
    return { ...COMPONENT_LIBRARY_MANAGER_MANIFEST };
}
