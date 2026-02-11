// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Permission Checker
// "Least privilege, always." — Article IV
// ═══════════════════════════════════════════════════════════════════════════

import type { AgentManifest } from './types.js';

// ─── Permission Results ──────────────────────────────────────────────────

export interface PermissionCheckResult {
    allowed: boolean;
    reason?: string;
    requiresApproval: boolean;
}

// ─── Permission Checker ──────────────────────────────────────────────────

export class PermissionChecker {
    private readonly capabilities: ReadonlySet<string>;
    private readonly deniedCapabilities: ReadonlySet<string>;
    private readonly hitlActions: ReadonlySet<string>;
    private readonly costBudgetUsd: number;

    constructor(manifest: AgentManifest) {
        this.capabilities = new Set(manifest.capabilities);
        this.deniedCapabilities = new Set(manifest.deniedCapabilities);
        this.hitlActions = new Set(manifest.hitlActions);
        this.costBudgetUsd = manifest.costBudgetUsd;
    }

    /**
     * Check if the agent is allowed to invoke a specific tool.
     */
    allows(toolName: string, _args?: Record<string, unknown>): PermissionCheckResult {
        // Explicit deny takes precedence
        if (this.deniedCapabilities.has(toolName)) {
            return {
                allowed: false,
                reason: `Tool "${toolName}" is explicitly denied in agent manifest.`,
                requiresApproval: false,
            };
        }

        // Must be in capabilities allowlist
        if (!this.capabilities.has(toolName)) {
            return {
                allowed: false,
                reason: `Tool "${toolName}" is not in the agent's capabilities list.`,
                requiresApproval: false,
            };
        }

        // Check if HITL approval is required
        if (this.hitlActions.has(toolName)) {
            return {
                allowed: true,
                requiresApproval: true,
                reason: `Tool "${toolName}" requires human approval before execution.`,
            };
        }

        return { allowed: true, requiresApproval: false };
    }

    /**
     * Check if the agent's cost budget would be exceeded.
     */
    allowsCost(currentCostUsd: number, additionalCostUsd: number): PermissionCheckResult {
        const projected = currentCostUsd + additionalCostUsd;
        if (projected > this.costBudgetUsd) {
            return {
                allowed: false,
                reason: `Cost budget exceeded: $${projected.toFixed(2)} > $${this.costBudgetUsd.toFixed(2)}`,
                requiresApproval: false,
            };
        }
        return { allowed: true, requiresApproval: false };
    }

    /**
     * Check if a tool requires human-in-the-loop approval.
     */
    requiresApproval(toolName: string): boolean {
        return this.hitlActions.has(toolName);
    }

    /**
     * Get the full list of allowed capabilities.
     */
    getCapabilities(): string[] {
        return [...this.capabilities];
    }

    /**
     * Get the cost budget.
     */
    getCostBudget(): number {
        return this.costBudgetUsd;
    }
}

/**
 * Validate an agent manifest's permission configuration.
 * Returns a list of warnings (e.g., denied caps not in caps list).
 */
export function validateManifestPermissions(manifest: AgentManifest): string[] {
    const warnings: string[] = [];
    const caps = new Set(manifest.capabilities);

    // Check for denied capabilities that aren't even in the allowed list (redundant)
    for (const denied of manifest.deniedCapabilities) {
        if (caps.has(denied)) {
            warnings.push(
                `Warning: "${denied}" is both in capabilities and deniedCapabilities. Deny takes precedence.`,
            );
        }
    }

    // Check that HITL actions are actually in capabilities
    for (const hitl of manifest.hitlActions) {
        if (!caps.has(hitl)) {
            warnings.push(
                `Warning: HITL action "${hitl}" is not in the capabilities list — it can never be invoked.`,
            );
        }
    }

    return warnings;
}
