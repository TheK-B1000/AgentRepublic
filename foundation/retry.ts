// ═══════════════════════════════════════════════════════════════════════════
// Agent Republic — Retry + Exponential Backoff
// "Retry is not a bug—it's the architecture."
// ═══════════════════════════════════════════════════════════════════════════

import type { RetryOptions } from './types.js';
import { RetryableError, DEFAULT_RETRY_OPTIONS } from './types.js';

// ─── Retry Result ────────────────────────────────────────────────────────

export interface RetryResult<T> {
    success: boolean;
    result?: T;
    attempts: number;
    totalDelayMs: number;
    lastError?: Error;
}

export interface RetryEvent {
    attempt: number;
    delayMs: number;
    error: string;
    errorCode?: string;
}

// ─── Core Retry Function ─────────────────────────────────────────────────

/**
 * Execute a function with retry + exponential backoff + jitter.
 *
 * Only retries on RetryableError. All other errors propagate immediately.
 * Each retry is reported via the optional `onRetry` callback (for tracing).
 *
 * @param fn — The async function to execute
 * @param options — Retry configuration
 * @param onRetry — Optional callback for each retry (emit trace events)
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {},
    onRetry?: (event: RetryEvent) => void,
): Promise<RetryResult<T>> {
    const opts: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: Error | undefined;
    let totalDelayMs = 0;

    for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
        try {
            const result = await fn();
            return {
                success: true,
                result,
                attempts: attempt + 1,
                totalDelayMs,
            };
        } catch (err) {
            const error = err as Error;
            lastError = error;

            // Only retry on RetryableError — everything else propagates
            if (!(error instanceof RetryableError)) {
                throw error;
            }

            // Last attempt — don't wait, just fail
            if (attempt === opts.maxAttempts - 1) {
                break;
            }

            // Calculate delay: exponential backoff + optional jitter
            let delayMs = opts.baseDelayMs * Math.pow(2, attempt);

            // If the error specifies a retry-after, respect it
            if (error.retryAfterMs) {
                delayMs = Math.max(delayMs, error.retryAfterMs);
            }

            // Add jitter (0–1 second) to prevent thundering herd
            if (opts.jitter) {
                delayMs += Math.random() * 1000;
            }

            // Cap at max delay
            delayMs = Math.min(delayMs, opts.maxDelayMs);
            totalDelayMs += delayMs;

            // Report the retry
            onRetry?.({
                attempt,
                delayMs,
                error: error.message,
                errorCode: error.code,
            });

            // Wait
            await sleep(delayMs);
        }
    }

    return {
        success: false,
        attempts: opts.maxAttempts,
        totalDelayMs,
        lastError,
    };
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a function that wraps any async operation with retry.
 * Useful for pre-configuring retry options.
 */
export function createRetrier(
    options: Partial<RetryOptions> = {},
    onRetry?: (event: RetryEvent) => void,
) {
    return <T>(fn: () => Promise<T>) => withRetry(fn, options, onRetry);
}
