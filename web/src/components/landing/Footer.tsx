import { Github, MessageSquare } from 'lucide-react';

const columns = [
    {
        title: 'Discover',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Charter', href: '/charter' },
            { label: 'Architecture', href: '/architecture' },
            { label: 'Roadmap', href: '/roadmap' },
        ],
    },
    {
        title: 'Build',
        links: [
            { label: 'Get Started', href: '/get-started' },
            { label: 'Documentation', href: '/docs' },
            { label: 'Agent Templates', href: '/templates' },
            { label: 'MCP Contracts', href: '/mcp' },
        ],
    },
    {
        title: 'Govern',
        links: [
            { label: 'Constitution', href: '/constitution' },
            { label: 'Districts', href: '/districts' },
            { label: 'Eval Framework', href: '/evals' },
            { label: 'Security', href: '/security' },
        ],
    },
    {
        title: 'Community',
        links: [
            { label: 'Changelog', href: '/changelog' },
            { label: 'Contributing', href: '/contributing' },
            { label: 'Discussion', href: 'https://github.com/TheK-B1000/AgentRepublic/discussions' },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-white/[0.04] bg-[#08090C]">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-black text-sm">
                                AR
                            </div>
                            <span className="text-white font-bold text-lg tracking-tight">Agent Republic</span>
                        </div>
                        <p className="text-xs text-foreground/40 leading-relaxed mb-4">
                            The operating system for AI agent fleets. Deterministic runs, full observability, governed by design.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/TheK-B1000/AgentRepublic"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/30 hover:text-foreground/60 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-foreground/30 hover:text-foreground/60 transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-foreground/50 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-foreground/30">
                        © {new Date().getFullYear()} Agent Republic. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-foreground/30">
                        <a href="/privacy" className="hover:text-foreground/50 transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-foreground/50 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
