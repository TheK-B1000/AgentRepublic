import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Clock, Activity } from 'lucide-react';
import clsx from 'clsx';

export interface TraceLog {
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'success';
    agentId: string;
    message: string;
    metadata?: Record<string, unknown>;
}

interface TraceFeedProps {
    logs: TraceLog[];
}

export function TraceFeed({ logs }: TraceFeedProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-[rgba(11,12,21,0.5)] backdrop-blur-md border border-[var(--glass-border)] rounded-xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Live Agent Trace</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-[var(--color-success)] animate-pulse" />
                    <span className="text-xs font-mono text-[var(--color-success)] border border-[rgba(0,255,157,0.2)] px-2 py-0.5 rounded-full bg-[rgba(0,255,157,0.05)]">
                        Active
                    </span>
                </div>
            </div>

            {/* Log Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={clsx(
                                "p-3 rounded-lg border-l-2 backdrop-blur-sm",
                                log.level === 'info' && "bg-[rgba(0,194,255,0.05)] border-[var(--color-info)]",
                                log.level === 'success' && "bg-[rgba(0,255,157,0.05)] border-[var(--color-success)]",
                                log.level === 'warning' && "bg-[rgba(255,184,0,0.05)] border-[var(--color-warning)]",
                                log.level === 'error' && "bg-[rgba(255,0,85,0.05)] border-[var(--color-error)]"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-[10px] text-[var(--text-tertiary)] mt-0.5 flex-shrink-0 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {log.timestamp}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={clsx(
                                            "text-xs font-bold uppercase tracking-wider",
                                            log.level === 'info' && "text-[var(--color-info)]",
                                            log.level === 'success' && "text-[var(--color-success)]",
                                            log.level === 'warning' && "text-[var(--color-warning)]",
                                            log.level === 'error' && "text-[var(--color-error)]"
                                        )}>
                                            {log.agentId}
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-primary)] break-words leading-relaxed">
                                        {log.message}
                                    </p>

                                    {log.metadata && (
                                        <div className="mt-2 p-2 bg-[rgba(0,0,0,0.3)] rounded border border-[rgba(255,255,255,0.05)] text-[11px] text-[var(--text-secondary)] whitespace-pre-wrap">
                                            {JSON.stringify(log.metadata, null, 2)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
