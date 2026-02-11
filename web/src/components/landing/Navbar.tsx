import { useState, useEffect } from 'react';
import { Container } from '../ui/container';
import {
    ChevronDown,
    Menu,
    X,
    Compass,
    BookOpen,
    Github,
    FileCode2,
    Shield,
    Scale,
    FlaskConical,
    Lock,
    MessageSquare,
    Newspaper,
    Users,
    Rocket,
    Map,
    ScrollText,
    Star,
} from 'lucide-react';

interface DropdownItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    desc: string;
}

interface DropdownMenu {
    label: string;
    items: DropdownItem[];
}

const menus: DropdownMenu[] = [
    {
        label: 'Discover',
        items: [
            { label: 'About the Republic', href: '/about', icon: <Compass className="w-4 h-4" />, desc: 'What we\'re building & why' },
            { label: 'The Charter', href: '/charter', icon: <ScrollText className="w-4 h-4" />, desc: 'Core principles & handbook' },
            { label: 'Architecture', href: '/architecture', icon: <Map className="w-4 h-4" />, desc: 'How it all fits together' },
            { label: 'Roadmap', href: '/roadmap', icon: <Rocket className="w-4 h-4" />, desc: 'What\'s next' },
        ],
    },
    {
        label: 'Build',
        items: [
            { label: 'Get Started', href: '/get-started', icon: <BookOpen className="w-4 h-4" />, desc: 'Quickstart in 5 min' },
            { label: 'Documentation', href: '/docs', icon: <FileCode2 className="w-4 h-4" />, desc: 'Full API & guides' },
            { label: 'GitHub', href: 'https://github.com/TheK-B1000/AgentRepublic', icon: <Github className="w-4 h-4" />, desc: 'Source code & issues' },
            { label: 'Agent Templates', href: '/templates', icon: <FlaskConical className="w-4 h-4" />, desc: 'Pre-built agent blueprints' },
        ],
    },
    {
        label: 'Govern',
        items: [
            { label: 'Constitution', href: '/constitution', icon: <Scale className="w-4 h-4" />, desc: 'Rules agents live by' },
            { label: 'District Specs', href: '/districts', icon: <Shield className="w-4 h-4" />, desc: 'Domain-specific mandates' },
            { label: 'Eval Framework', href: '/evals', icon: <FlaskConical className="w-4 h-4" />, desc: 'Testing & validation' },
            { label: 'Security', href: '/security', icon: <Lock className="w-4 h-4" />, desc: 'Safety & access control' },
        ],
    },
    {
        label: 'Community',
        items: [
            { label: 'Discord', href: '#', icon: <MessageSquare className="w-4 h-4" />, desc: 'Join the conversation' },
            { label: 'Changelog', href: '/changelog', icon: <Newspaper className="w-4 h-4" />, desc: 'What\'s new' },
            { label: 'Contributing', href: '/contributing', icon: <Users className="w-4 h-4" />, desc: 'Help build the Republic' },
        ],
    },
];

export function Navbar() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
                ? 'bg-[#0A0B0F]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20'
                : 'bg-transparent'
                }`}
        >
            <Container className="flex items-center justify-between h-16">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
                        AR
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight hidden sm:block group-hover:text-amber-400 transition-colors">
                        Agent Republic
                    </span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-1">
                    {menus.map((menu) => (
                        <div
                            key={menu.label}
                            className="relative"
                            onMouseEnter={() => setOpenMenu(menu.label)}
                            onMouseLeave={() => setOpenMenu(null)}
                        >
                            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-white transition-colors rounded-md group">
                                {menu.label}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === menu.label ? 'rotate-180 text-amber-400' : 'text-foreground/40 group-hover:text-amber-400'}`} />
                            </button>

                            {/* Dropdown */}
                            {openMenu === menu.label && (
                                <div className="absolute top-full left-0 pt-2">
                                    <div className="w-72 bg-[#111318] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {menu.items.map((item) => (
                                            <a
                                                key={item.label}
                                                href={item.href}
                                                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
                                            >
                                                <div className="mt-0.5 text-foreground/40 group-hover:text-amber-400 transition-colors">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white group-hover:text-amber-100 transition-colors">{item.label}</div>
                                                    <div className="text-xs text-foreground/50">{item.desc}</div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                    <a
                        href="https://github.com/TheK-B1000/AgentRepublic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70 border border-white/[0.1] rounded-lg hover:border-white/20 hover:text-white transition-all hover:bg-white/[0.03]"
                    >
                        <Star className="w-4 h-4" />
                        Star
                    </a>
                    <a
                        href="/get-started"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-foreground/70 hover:text-white"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </Container>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden bg-[#111318] border-t border-white/[0.06] px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {menus.map((menu) => (
                        <div key={menu.label}>
                            <div className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-2">
                                {menu.label}
                            </div>
                            <div className="space-y-1">
                                {menu.items.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <span className="text-foreground/40">{item.icon}</span>
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-white/[0.06] space-y-2">
                        <a href="https://github.com/TheK-B1000/AgentRepublic" className="block w-full text-center px-4 py-2 text-sm font-medium border border-white/[0.1] rounded-lg text-foreground/70">
                            Star on GitHub
                        </a>
                        <a href="/get-started" className="block w-full text-center px-4 py-2 text-sm font-semibold bg-amber-500 text-black rounded-lg">
                            Get Started
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
