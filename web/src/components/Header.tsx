import { Search, Bell, User } from 'lucide-react';
import { Menu } from 'lucide-react';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen?: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
    return (
        <header className="h-16 border-b border-[var(--glass-border)] bg-[rgba(11,12,21,0.5)] backdrop-blur flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Toggle (only visible if setSidebarOpen is provided, though usually handled by layout) */}
                {setSidebarOpen && (
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-[var(--text-secondary)]">
                        <Menu className="w-5 h-5" />
                    </button>
                )}

                {/* Search Bar */}
                <div className="relative max-w-md w-full hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
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
