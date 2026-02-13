import { Github, MessageSquare } from 'lucide-react';
import { Container } from '../ui/container';

const columns = [
    {
        title: 'Discover',
        links: [
            { label: 'About', href: '#features' },
            { label: 'Charter', href: '#districts' },
            { label: 'Architecture', href: '#architecture' },
            { label: 'Roadmap', href: '#news' },
        ],
    },
    {
        title: 'Build',
        links: [
            { label: 'Get Started', href: '/dashboard' },
            { label: 'Documentation', href: '/traces' },
            { label: 'Agent Templates', href: '/demo' },
            { label: 'MCP Contracts', href: '/demo' },
        ],
    },
    {
        title: 'Govern',
        links: [
            { label: 'Constitution', href: '/dashboard' },
            { label: 'Districts', href: '#districts' },
            { label: 'Eval Framework', href: '/traces' },
            { label: 'Security', href: '/dashboard' },
        ],
    },
    {
        title: 'Community',
        links: [
            { label: 'Changelog', href: '#news' },
            { label: 'Contributing', href: '#community' },
            { label: 'Discussion', href: 'https://github.com/TheK-B1000/AgentRepublic/discussions' },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-white/[0.04] bg-[#08090C] py-16 sm:py-24">
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-16">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/20">
                                AR
                            </div>
                            <span className="text-white font-bold text-lg tracking-tight">Agent Republic</span>
                        </div>
                        <p className="text-sm text-foreground/40 leading-relaxed mb-6 max-w-xs">
                            The operating system for AI agent fleets. Deterministic runs, full observability, governed by design.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/TheK-B1000/AgentRepublic"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/30 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com/TheK-B1000/AgentRepublic/discussions"
                                className="text-foreground/30 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {columns.map((col) => (
                        <div key={col.title} className="col-span-1">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-6">
                                {col.title}
                            </h4>
                            <ul className="space-y-4">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-foreground/50 hover:text-amber-400 transition-colors font-medium"
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
                <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-foreground/30 font-medium">
                        © {new Date().getFullYear()} Agent Republic. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-xs text-foreground/30 font-medium">
                        <a href="#" className="hover:text-foreground/60 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground/60 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Systems Nominal
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
