// Agent Republic — Research: Citation Verifier (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const CITATION_VERIFIER_MANIFEST: AgentManifest = {
    agentId: 'research.citation_verifier',
    version: '0.1.0',
    district: 'research',
    description: 'Checks that all citations resolve and accurately represent the source.',
    capabilities: ['open_url', 'extract_text', 'read_file'],
    deniedCapabilities: ['write_file', 'publish_deploy'],
    maxSteps: 25,
    toolTimeoutMs: 15000,
    costBudgetUsd: 1.00,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 6000, notebookLmEnabled: false },
    owner: 'research_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...CITATION_VERIFIER_MANIFEST }; }
