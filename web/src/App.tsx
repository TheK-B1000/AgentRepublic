import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TraceFeed, type TraceLog } from './components/TraceFeed';
import ShaderDemo from './pages/ShaderDemo';
import { NotFound } from './components/ui/not-found-2';
import { Route, Switch } from 'wouter';
import { Bell, Command, Search, User, Gavel } from 'lucide-react';
import './index.css';

function Header() {
  return (
    <header className="h-16 border-b border-[var(--glass-border)] bg-[rgba(11,12,21,0.8)] backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search / Command */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input
            type="text"
            placeholder="Search agents, traces, or artifacts..."
            className="w-full bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder-[var(--text-tertiary)]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] bg-[rgba(255,255,255,0.05)] rounded border border-[var(--glass-border)]">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]">
          <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span className="text-xs font-medium text-[var(--color-primary)]">System Optimal</span>
        </div>

        <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-secondary)] border border-[var(--bg-base)]" />
        </button>

        <div className="w-px h-6 bg-[var(--glass-border)]" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] p-[1px]">
            <div className="w-full h-full rounded-full bg-[var(--bg-base)] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MissionControl() {
  const [logs, setLogs] = useState<TraceLog[]>([]);

  // Poll live logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/traces');
        if (!res.ok) return;
        const data = await res.json();
        // Assume data is array of trace events. Map to TraceLog format if needed.
        // The server returns raw JSONL lines. We need to adapt them.
        // Expected format from runtime: { type: 'span'|'event', ... }
        // We'll filter for visual logs. For now, just dumping them.
        const adaptedLogs: TraceLog[] = data.map((item: any, idx: number) => ({
          id: item.spanId || item.runId || idx.toString(),
          timestamp: new Date(item.startTime || Date.now()).toLocaleTimeString(),
          level: item.status === 'ERROR' ? 'error' : 'info',
          agentId: item.agentId || 'SYSTEM',
          message: item.name || item.type,
          metadata: item.input || item.output
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
    <div className="p-6 h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Trace Feed */}
      <div className="lg:col-span-2 h-full flex flex-col gap-4">
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

export default function App() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-void)] text-white font-sans selection:bg-[var(--color-primary)] selection:text-black">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13141F] via-[var(--bg-void)] to-[var(--bg-void)]">
        <Header />
        <Switch>
          <Route path="/" component={MissionControl} />
          <Route path="/demo" component={ShaderDemo} />
          <Route path="/chancellor">
            {() => <div className="p-10 text-2xl text-[var(--text-tertiary)]">Chancellor District: Restricted Access</div>}
          </Route>
          <Route path="/foundry">
            {() => <div className="p-10 text-2xl text-[var(--text-tertiary)]">Foundry District: Restricted Access</div>}
          </Route>
          <Route>
            {() => <NotFound />}
          </Route>
        </Switch>
      </main>
    </div>
  );
}
