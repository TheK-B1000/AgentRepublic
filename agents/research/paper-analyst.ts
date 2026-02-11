// Agent Republic — Research: Paper Analyst (Stub)
import type { AgentManifest } from '../../foundation/types.js';

export const PAPER_ANALYST_MANIFEST: AgentManifest = {
    agentId: 'research.paper_analyst',
    version: '0.1.0',
    district: 'research',
    description: 'Reads PDFs, extracts key findings, builds structured summaries.',
    capabilities: ['read_file', 'write_file', 'extract_text'],
    deniedCapabilities: ['publish_deploy', 'open_url'],
    maxSteps: 20,
    toolTimeoutMs: 30000,
    costBudgetUsd: 1.00,
    hitlActions: [],
    memoryConfig: { scratchpadMaxTokens: 8000, notebookLmEnabled: true },
    owner: 'research_lead',
    created: '2025-07-01T00:00:00Z',
};

export function getManifest(): AgentManifest { return { ...PAPER_ANALYST_MANIFEST }; }
