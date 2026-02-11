// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Scratchpad (Working Memory)
// Rolling buffer of run events, pruned by relevance when approaching limits.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Entry Types ─────────────────────────────────────────────────────────

export interface ScratchpadEntry {
    id: number;
    type: 'init' | 'plan' | 'action' | 'result' | 'verification' | 'error' | 'note';
    content: string;
    timestamp: string;
    tokens: number; // estimated token count
}

// ─── Scratchpad ──────────────────────────────────────────────────────────

export class Scratchpad {
    private entries: ScratchpadEntry[] = [];
    private nextId = 0;
    private readonly maxTokens: number;
    private currentTokens = 0;

    constructor(maxTokens: number = 8000) {
        this.maxTokens = maxTokens;
    }

    /**
     * Initialize the scratchpad with the run's starting context.
     */
    init(goal: string, context: string, tools: string[]): void {
        this.entries = [];
        this.currentTokens = 0;
        this.nextId = 0;

        this.add('init', `Goal: ${goal}`);
        if (context) {
            this.add('init', `Context: ${context}`);
        }
        this.add('init', `Available tools: ${tools.join(', ')}`);
    }

    /**
     * Add a new entry to the scratchpad.
     * Automatically prunes old entries if approaching token limit.
     */
    add(type: ScratchpadEntry['type'], content: string): ScratchpadEntry {
        const tokens = this._estimateTokens(content);

        // Prune if needed before adding
        while (this.currentTokens + tokens > this.maxTokens && this.entries.length > 1) {
            this._pruneOldest();
        }

        const entry: ScratchpadEntry = {
            id: this.nextId++,
            type,
            content,
            timestamp: new Date().toISOString(),
            tokens,
        };

        this.entries.push(entry);
        this.currentTokens += tokens;
        return entry;
    }

    /**
     * Get the current scratchpad contents as a formatted string.
     * This is what gets sent to the LLM planner.
     */
    current(): string {
        if (this.entries.length === 0) return '(empty scratchpad)';

        return this.entries
            .map((e) => `[${e.type.toUpperCase()}] ${e.content}`)
            .join('\n');
    }

    /**
     * Get all entries as structured data.
     */
    getEntries(): ReadonlyArray<ScratchpadEntry> {
        return [...this.entries];
    }

    /**
     * Get current token usage.
     */
    getTokenUsage(): { used: number; max: number; utilization: number } {
        return {
            used: this.currentTokens,
            max: this.maxTokens,
            utilization: this.currentTokens / this.maxTokens,
        };
    }

    /**
     * Manually prune to a target token count.
     */
    prune(targetTokens?: number): number {
        const target = targetTokens ?? Math.floor(this.maxTokens * 0.7);
        let pruned = 0;

        while (this.currentTokens > target && this.entries.length > 1) {
            this._pruneOldest();
            pruned++;
        }

        return pruned;
    }

    /**
     * Get the entry count.
     */
    get length(): number {
        return this.entries.length;
    }

    // ─── Private ───────────────────────────────────────────────────────────

    /**
     * Remove the oldest non-init entry.
     * Init entries are preserved as long as possible (they contain the goal).
     */
    private _pruneOldest(): void {
        // Find the first non-init entry to prune
        const idx = this.entries.findIndex((e) => e.type !== 'init');
        if (idx === -1) {
            // All entries are init — prune the oldest init
            const removed = this.entries.shift();
            if (removed) this.currentTokens -= removed.tokens;
            return;
        }

        const removed = this.entries.splice(idx, 1)[0];
        this.currentTokens -= removed.tokens;
    }

    /**
     * Rough token estimation: ~4 chars per token.
     * Not exact, but good enough for buffer management.
     */
    private _estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }
}
