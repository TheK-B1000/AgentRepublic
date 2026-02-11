// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Claude LLM Provider
// Real Anthropic API integration with token counting + cost tracking.
// ═══════════════════════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider } from './runtime.js';
import type { PlanResult, PlanAction, VerificationResult, ToolResult } from './types.js';

// ─── Pricing (per million tokens) ────────────────────────────────────────

const PRICING: Record<string, { inputPer1M: number; outputPer1M: number }> = {
    'claude-sonnet-4-20250514': { inputPer1M: 3.0, outputPer1M: 15.0 },
    'claude-3-5-sonnet-20241022': { inputPer1M: 3.0, outputPer1M: 15.0 },
    'claude-3-5-haiku-20241022': { inputPer1M: 0.80, outputPer1M: 4.0 },
    'claude-3-opus-20240229': { inputPer1M: 15.0, outputPer1M: 75.0 },
};

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = PRICING[model] ?? { inputPer1M: 3.0, outputPer1M: 15.0 };
    return (inputTokens * pricing.inputPer1M + outputTokens * pricing.outputPer1M) / 1_000_000;
}

// ─── System Prompts ──────────────────────────────────────────────────────

const PLAN_SYSTEM = `You are a planning module inside the Agent Republic runtime.
Given a GOAL, SCRATCHPAD (working memory), available TOOLS, and CONSTITUTION, decide the next action.

Respond with EXACTLY this JSON format, no markdown fences:
{
  "nextAction": {
    "tool": "<tool_name>",
    "args": { <tool_arguments> },
    "reasoning": "<why this tool and these args>"
  },
  "goalComplete": false,
  "confidence": 0.8,
  "reasoning": "<overall reasoning>"
}

Rules:
- If the goal is fully achieved, set goalComplete=true and tool="noop" with empty args.
- Only use tools from the TOOLS list. Never hallucinate tool names.
- Use write_file to create HTML/CSS/JS files in the workspace.
- Use open_url with a file:// URL to preview local files.
- Use screenshot to capture visual state for verification.
- Keep args minimal and well-typed.`;

const VERIFY_SYSTEM = `You are a verification module inside the Agent Republic runtime.
Given a GOAL, the ACTION that was just taken, its RESULT, and the SCRATCHPAD, verify the outcome.

Respond with EXACTLY this JSON format, no markdown fences:
{
  "passed": true,
  "goalComplete": false,
  "reason": "<what you verified and why it passed/failed>",
  "confidence": 0.85
}

Rules:
- passed=true means the action produced a valid result toward the goal.
- goalComplete=true means ALL parts of the goal are now satisfied.
- Be rigorous. Check that required sections, colors, and structure are present.`;

// ─── Claude LLM Provider ────────────────────────────────────────────────

export class ClaudeLLMProvider implements LLMProvider {
    private readonly client: Anthropic;
    private readonly model: string;

    constructor(apiKey: string, model = 'claude-sonnet-4-20250514') {
        this.client = new Anthropic({ apiKey });
        this.model = model;
    }

    async plan(
        goal: string,
        scratchpad: string,
        tools: string[],
        constitution: string,
    ): Promise<PlanResult> {
        const userMessage = [
            `## GOAL\n${goal}`,
            `## SCRATCHPAD\n${scratchpad}`,
            `## AVAILABLE TOOLS\n${tools.join(', ')}`,
            `## CONSTITUTION\n${constitution}`,
        ].join('\n\n');

        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 2048,
            system: PLAN_SYSTEM,
            messages: [{ role: 'user', content: userMessage }],
        });

        const text = response.content
            .filter((block): block is Anthropic.TextBlock => block.type === 'text')
            .map((block) => block.text)
            .join('');

        const inputTokens = response.usage.input_tokens;
        const outputTokens = response.usage.output_tokens;
        const costUsd = calculateCost(this.model, inputTokens, outputTokens);

        console.log(`  [Claude:plan] ${inputTokens} in / ${outputTokens} out — $${costUsd.toFixed(6)}`);

        // Parse JSON from response (handle potential markdown fences)
        const parsed = parseJSON<PlanResult>(text, 'plan');

        return {
            ...parsed,
            tokenUsage: { input: inputTokens, output: outputTokens },
            costUsd,
        };
    }

    async verify(
        goal: string,
        action: PlanAction,
        result: ToolResult,
        scratchpad: string,
    ): Promise<VerificationResult> {
        const userMessage = [
            `## GOAL\n${goal}`,
            `## ACTION TAKEN\nTool: ${action.tool}\nArgs: ${JSON.stringify(action.args)}\nReasoning: ${action.reasoning ?? 'none'}`,
            `## RESULT\nStatus: ${result.status}\nData: ${JSON.stringify(result.data).slice(0, 2000)}`,
            `## SCRATCHPAD\n${scratchpad}`,
        ].join('\n\n');

        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 1024,
            system: VERIFY_SYSTEM,
            messages: [{ role: 'user', content: userMessage }],
        });

        const text = response.content
            .filter((block): block is Anthropic.TextBlock => block.type === 'text')
            .map((block) => block.text)
            .join('');

        const inputTokens = response.usage.input_tokens;
        const outputTokens = response.usage.output_tokens;
        const costUsd = calculateCost(this.model, inputTokens, outputTokens);

        console.log(`  [Claude:verify] ${inputTokens} in / ${outputTokens} out — $${costUsd.toFixed(6)}`);

        const parsed = parseJSON<VerificationResult>(text, 'verify');

        return {
            ...parsed,
            tokenUsage: { input: inputTokens, output: outputTokens },
            costUsd,
        };
    }
}

// ─── JSON Parsing ────────────────────────────────────────────────────────

function parseJSON<T>(text: string, label: string): T {
    // Strip markdown fences if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    try {
        return JSON.parse(cleaned) as T;
    } catch {
        console.error(`[Claude:${label}] Failed to parse JSON:\n${text}`);
        throw new Error(`Claude ${label} returned invalid JSON. Raw: ${text.slice(0, 300)}`);
    }
}
