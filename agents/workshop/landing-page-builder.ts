// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Workshop: Landing Page Builder
// First citizen of the Republic. Builds responsive landing pages from briefs.
// ═══════════════════════════════════════════════════════════════════════════

import type { AgentManifest, RunResult } from '../../foundation/types.js';
import { agentRun } from '../../foundation/runtime.js';
import type { AgentRunOptions } from '../../foundation/runtime.js';

// ─── Manifest (Section 8 spec) ───────────────────────────────────────────

export const LANDING_PAGE_BUILDER_MANIFEST: AgentManifest = {
    agentId: 'workshop.landing_page_builder',
    version: '1.0.0',
    district: 'workshop',
    description: 'Builds responsive landing pages from a design brief.',
    capabilities: [
        'open_url', 'click', 'type', 'screenshot',
        'extract_text', 'run_code', 'write_file', 'read_file',
    ],
    deniedCapabilities: ['publish_deploy'],
    maxSteps: 30,
    toolTimeoutMs: 15000,
    costBudgetUsd: 2.00,
    hitlActions: ['publish_deploy'],
    memoryConfig: {
        scratchpadMaxTokens: 8000,
        ragCollection: 'workshop_knowledge',
        notebookLmEnabled: false,
    },
    evalSuite: 'workshop.landing_page.golden_v3',
    owner: 'workshop_lead',
    created: '2025-07-01T00:00:00Z',
};

// ─── Design Brief Interface ─────────────────────────────────────────────

export interface DesignBrief {
    title: string;
    description: string;
    brandColors: string[];
    requiredSections: string[];
    targetAudience?: string;
    tone?: string;
    references?: string[];
}

// ─── Builder Runner ──────────────────────────────────────────────────────

/**
 * Run the landing page builder agent with a design brief.
 *
 * Workflow:
 * 1. INIT: Protocol Zero
 * 2. PLANNING: Read brief, plan page structure (HTML/CSS/JS sections)
 * 3. EXECUTING: write_file for index.html, styles.css, script.js
 * 4. VERIFYING: open_url on local preview → screenshot → compare to brief
 * 5. Loop until visual QA passes (max 3 iterations)
 */
export async function buildLandingPage(brief: DesignBrief): Promise<RunResult> {
    const goal = [
        `Build a responsive landing page: "${brief.title}"`,
        `Description: ${brief.description}`,
        `Brand colors: ${brief.brandColors.join(', ')}`,
        `Required sections: ${brief.requiredSections.join(', ')}`,
        brief.targetAudience ? `Target audience: ${brief.targetAudience}` : '',
        brief.tone ? `Tone: ${brief.tone}` : '',
    ].filter(Boolean).join('\n');

    const context = brief.references
        ? `Reference designs: ${brief.references.join(', ')}`
        : '';

    return agentRun({
        goal,
        manifest: LANDING_PAGE_BUILDER_MANIFEST,
        context,
    });
}

/**
 * Get the manifest for registration with the Chancellor.
 */
export function getManifest(): AgentManifest {
    return { ...LANDING_PAGE_BUILDER_MANIFEST };
}
