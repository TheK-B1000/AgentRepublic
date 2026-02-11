import { Home, Cpu, FlaskConical, Gavel, FileCode, Terminal, Settings } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import clsx from 'clsx'; // Assuming clsx installed or I can just use template literals if not

interface SidebarItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    active: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
    <Link href={href}>
        <a className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
            active
                ? "bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)]"
                : "hover:bg-[rgba(255,255,255,0.03)] border border-transparent"
        )}>
            <Icon className={clsx(
                "w-5 h-5 transition-colors",
                active ? "text-[var(--color-primary)] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" : "text-[var(--text-secondary)] group-hover:text-white"
            )} />
            <span className={clsx(
                "font-medium text-sm tracking-wide",
                active ? "text-white" : "text-[var(--text-secondary)] group-hover:text-white"
            )}>
                {label}
            </span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]" />
            )}
        </a>
    </Link>
);

export function Sidebar() {
    const [location] = useLocation();

    const navItems = [
        { icon: Home, label: 'Mission Control', href: '/' },
        { icon: Gavel, label: 'Chancellor', href: '/chancellor' },
        { icon: Cpu, label: 'Foundry', href: '/foundry' },
        { icon: FlaskConical, label: 'Research', href: '/research' },
        { icon: FileCode, label: 'Workshop', href: '/workshop' },
        { icon: Terminal, label: 'Terminal', href: '/terminal' },
        { icon: Settings, label: 'Settings', href: '/settings' },
    ];

    return (
        <div className="w-64 h-screen flex flex-col border-r border-[var(--glass-border)] bg-[rgba(11,12,21,0.8)] backdrop-blur-xl">
            {/* Brand Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-[var(--color-secondary)] to-[#FF4D00] flex items-center justify-center shadow-[0_0_15px_rgba(255,136,0,0.3)]">
                        <span className="font-bold text-white text-lg">T</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-base tracking-tight">Agent Republic</h1>
                        <p className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-mono">System Online</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <SidebarItem
                        key={item.href}
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                        active={location === item.href}
                    />
                ))}
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-[var(--glass-border)]">
                <div className="glass-panel p-3 flex items-center gap-3 hover:border-[var(--glass-border)] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--glass-border)] flex items-center justify-center">
                        <span className="text-xs font-mono text-[var(--text-secondary)]">KB</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">K-B</p>
                        <p className="text-xs text-[var(--text-tertiary)] truncate">Admin Access</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
