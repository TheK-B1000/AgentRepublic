// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — publish_deploy Tool Adapter
// Gated deployment. REQUIRES human approval (Article VII).
// ═══════════════════════════════════════════════════════════════════════════

import type { ToolResult } from '../foundation/types.js';
import { NonRetryableError, ErrorCode } from '../foundation/types.js';

export interface PublishDeployInput {
    artifact_ref: string;
    target: 'staging' | 'production';
    canary_percent?: number;
}

export interface PublishDeployOutput {
    success: boolean;
    deployment_url: string;
    artifact_ref: string;
    target: string;
    canary_percent: number;
}

export async function executePublishDeploy(
    input: PublishDeployInput,
    approved: boolean = false,
): Promise<ToolResult<PublishDeployOutput>> {
    const start = Date.now();

    // Article VII: human approval required
    if (!approved) {
        throw new NonRetryableError(
            'publish_deploy requires human approval before execution. Escalating.',
            ErrorCode.AUTH_REQUIRED,
        );
    }

    // TODO: Replace with actual deployment logic (Vercel, Railway, etc.)
    const canary = input.canary_percent ?? 10;
    const output: PublishDeployOutput = {
        success: true,
        deployment_url: `https://${input.target}.example.com/${input.artifact_ref}`,
        artifact_ref: input.artifact_ref,
        target: input.target,
        canary_percent: canary,
    };

    return {
        tool: 'publish_deploy',
        status: 'ok',
        data: output,
        error: null,
        durationMs: Date.now() - start,
    };
}
