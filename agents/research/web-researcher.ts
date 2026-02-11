// Agent Republic — Research: Web Researcher (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const WEB_RESEARCHER_MANIFEST: AgentManifest = {
    agentId: 'research.web_researcher',
    version: '0.1.0',
    district: 'research',
    description: 'Browses, extracts, and synthesizes information with citations.',
    capabilities: ['open_url', 'extract_text', 'screenshot', 'read_file', 'write_file'],
    deniedCapabilities: ['publish_deploy'],
    maxSteps: 30,
    toolTimeoutMs: 15000,
    costBudgetUsd: 2.00,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 8000, ragCollection: 'research_knowledge', notebookLmEnabled: true },
    owner: 'research_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...WEB_RESEARCHER_MANIFEST }; }
