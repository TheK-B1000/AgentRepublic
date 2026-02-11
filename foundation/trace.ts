// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Trace Pipeline
// Black box recorder: every action is logged, every run is traceable.
// "If it isn't traced, it didn't happen." — Article I
// ═══════════════════════════════════════════════════════════════════════════

import { randomUUID } from 'node:crypto';
import { mkdirSync, appendFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { TraceSpan, TraceEvent, AgentState } from './types.js';

// ─── Run ID Generation (UUIDv7-style, time-ordered) ─────────────────────

/**
 * Generates a time-ordered run ID.
 * Uses crypto.randomUUID with a timestamp prefix for ordering.
 */
export function generateRunId(): string {
    const timestamp = Date.now().toString(36).padStart(9, '0');
    const random = randomUUID().split('-').slice(1).join('');
    return `run_${timestamp}_${random}`;
}

/**
 * Generates a span ID (shorter, for internal use).
 */
export function generateSpanId(): string {
    return `span_${randomUUID().split('-')[0]}`;
}

// ─── Trace Class ─────────────────────────────────────────────────────────

export class Trace {
    private readonly spans: TraceSpan[] = [];
    private readonly events: TraceEvent[] = [];
    private readonly startTime: number;
    private readonly filePath: string;
    private closed = false;

    constructor(
        public readonly runId: string,
        storagePath: string,
    ) {
        this.startTime = Date.now();

        // Ensure trace directory exists
        const dateDir = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const traceDir = join(storagePath, dateDir);
        mkdirSync(traceDir, { recursive: true });
        this.filePath = join(traceDir, `${runId}.jsonl`);

        // Write header
        this._appendLine({
            type: 'trace_start',
            runId: this.runId,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Add a structured span to the trace.
     */
    addSpan(span: Omit<TraceSpan, 'runId' | 'spanId' | 'timestamp'>): TraceSpan {
        this._assertOpen();
        const fullSpan: TraceSpan = {
            ...span,
            runId: this.runId,
            spanId: generateSpanId(),
            timestamp: new Date().toISOString(),
        };
        this.spans.push(fullSpan);
        this._appendLine({ type: 'span', ...fullSpan });
        return fullSpan;
    }

    /**
     * Add a trace event (non-span, e.g., state transition or retry).
     */
    addEvent(eventType: string, data: Record<string, unknown> = {}): TraceEvent {
        this._assertOpen();
        const event: TraceEvent = {
            runId: this.runId,
            eventType,
            data,
            timestamp: new Date().toISOString(),
        };
        this.events.push(event);
        this._appendLine({ type: 'event', ...event });
        return event;
    }

    /**
     * Close the trace with a terminal status.
     */
    close(finalStatus: AgentState): void {
        this._assertOpen();
        this.closed = true;
        const durationMs = Date.now() - this.startTime;
        this._appendLine({
            type: 'trace_end',
            runId: this.runId,
            finalStatus,
            durationMs,
            spanCount: this.spans.length,
            eventCount: this.events.length,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Get trace summary statistics.
     */
    summary(): { spanCount: number; eventCount: number; durationMs: number; storagePath: string } {
        return {
            spanCount: this.spans.length,
            eventCount: this.events.length,
            durationMs: Date.now() - this.startTime,
            storagePath: this.filePath,
        };
    }

    /**
     * Get all spans (for replay or inspection).
     */
    getSpans(): ReadonlyArray<TraceSpan> {
        return [...this.spans];
    }

    /**
     * Get all events.
     */
    getEvents(): ReadonlyArray<TraceEvent> {
        return [...this.events];
    }

    /**
     * Check if the trace is still open.
     */
    isOpen(): boolean {
        return !this.closed;
    }

    // ─── Private ───────────────────────────────────────────────────────────

    private _assertOpen(): void {
        if (this.closed) {
            throw new Error(`Trace ${this.runId} is already closed. Cannot add more data.`);
        }
    }

    private _appendLine(data: Record<string, unknown>): void {
        try {
            mkdirSync(dirname(this.filePath), { recursive: true });
            appendFileSync(this.filePath, JSON.stringify(data) + '\n', 'utf-8');
        } catch (err) {
            // Trace failures must not crash the agent — log to stderr instead
            console.error(`[TRACE ERROR] Failed to write span to ${this.filePath}:`, err);
        }
    }
}

/**
 * Open a fresh trace for a new run.
 */
export function openTrace(runId: string, storagePath: string = './traces'): Trace {
    return new Trace(runId, storagePath);
}
