import { useState, useEffect } from 'react';
import { Command, Gavel, Activity } from 'lucide-react';
import { TraceFeed, type TraceLog } from './TraceFeed';

export function MissionControl() {
    const [logs, setLogs] = useState<TraceLog[]>([]);

    // Poll live logs from API
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/traces'); // Use full URL for dev, relative for prod if proxied
                // In Vite dev, we set up a proxy, but let's be robust.
                // Actually server.ts runs on 3001. Vite runs on 5173.
                // The vite.config.ts has a proxy for /api -> http://localhost:3001
                // So /api/traces should work if proxy is set up.
                // Just in case, try relative first.

                if (!res.ok) return;
                const data = await res.json();

                // The server returns raw JSONL lines. We need to adapt them.
                const adaptedLogs: TraceLog[] = data.map((item: any, idx: number) => ({
                    id: item.spanId || item.runId || idx.toString(),
                    timestamp: new Date(item.timestamp || Date.now()).toLocaleTimeString(),
                    level: item.status === 'ERROR' ? 'error' : 'info',
                    agentId: item.agentId || 'SYSTEM',
                    message: item.action ? `${item.action} ${item.tool || ''}` : (item.eventType || 'unknown'),
                    metadata: item.input || item.output || item.data
                }));
                setLogs(adaptedLogs);
            } catch (err) {
                console.error('Failed to fetch traces:', err);
            }
        };

        fetchLogs(); // Initial fetch
        const timer = setInterval(fetchLogs, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Main Trace Feed */}
            <div className="lg:col-span-2 h-full flex flex-col gap-4 min-h-[500px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white tracking-tight">Active Operations</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--bg-surface)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--color-primary)] transition-colors">
                            Filter
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-[rgba(0,240,255,0.1)] border border-[var(--color-primary)] text-[var(--color-primary)]">
                            Live View
                        </button>
                    </div>
                </div>
                <div className="flex-1 min-h-0 bg-[var(--bg-surface)] rounded-xl border border-[var(--glass-border)] overflow-hidden">
                    <TraceFeed logs={logs} />
                </div>
            </div>

            {/* Side Widgets */}
            <div className="space-y-6">
                {/* Status Card */}
                <div className="glass-panel p-5">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">Fabric Health</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white">CPU Load</span>
                            <span className="text-xs font-mono text-[var(--color-success)]">12%</span>
                        </div>
                        <div className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                            <div className="h-full w-[12%] bg-[var(--color-success)]" />
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-white">Token Rate</span>
                            <span className="text-xs font-mono text-[var(--color-primary)]">450 t/s</span>
                        </div>
                        <div className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                            <div className="h-full w-[45%] bg-[var(--color-primary)]" />
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-white">Error Rate</span>
                            <span className="text-xs font-mono text-[var(--text-secondary)]">0.01%</span>
                        </div>
                        <div className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                            <div className="h-full w-[2%] bg-[var(--color-error)]" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-5">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 rounded bg-[var(--bg-surface)] border border-[var(--glass-border)] hover:border-[var(--color-primary)] transition-colors flex flex-col items-center gap-2 group">
                            <Command className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--color-primary)]" />
                            <span className="text-xs text-[var(--text-primary)]">New Task</span>
                        </button>
                        <button className="p-3 rounded bg-[var(--bg-surface)] border border-[var(--glass-border)] hover:border-[var(--color-secondary)] transition-colors flex flex-col items-center gap-2 group">
                            <Gavel className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--color-secondary)]" />
                            <span className="text-xs text-[var(--text-primary)]">Audit Log</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
