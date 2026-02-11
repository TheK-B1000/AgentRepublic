import { ArrowRight, Play } from 'lucide-react';
import { Container } from '../ui/container';
import { Section } from '../ui/section';

export function Hero() {
    return (
        <Section className="pt-32 pb-16 lg:pt-48 lg:pb-32">
            {/* Background glow effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <Container>
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text Content */}
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium text-amber-200/90 tracking-wide">v0.2.0 — Production Ready</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-fluid-h1 font-extrabold tracking-tight mb-6">
                            <span className="text-white">The Operating System</span>
                            <br />
                            <span className="text-gradient">for AI Agent Fleets</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-fluid-p text-foreground/70 mb-10 max-w-lg leading-relaxed">
                            Turn probabilistic chats into{' '}
                            <strong className="text-white font-semibold">deterministic runs</strong>.
                            Build, govern, and scale production-grade agent systems
                            with full observability and safety.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href="/get-started"
                                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.6)] hover:-translate-y-0.5"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="/docs"
                                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium text-foreground/80 border border-white/[0.08] rounded-xl hover:border-white/20 hover:text-white transition-all hover:bg-white/[0.04]"
                            >
                                <Play className="w-4 h-4" />
                                Read Docs
                            </a>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-8 mt-16 pt-8 border-t border-white/[0.06]">
                            <div>
                                <div className="text-2xl font-bold text-white">55</div>
                                <div className="text-xs text-foreground/50 mt-1 font-medium uppercase tracking-wider">Sources</div>
                            </div>
                            <div className="w-px h-10 bg-white/[0.06]" />
                            <div>
                                <div className="text-2xl font-bold text-white">7</div>
                                <div className="text-xs text-foreground/50 mt-1 font-medium uppercase tracking-wider">Districts</div>
                            </div>
                            <div className="w-px h-10 bg-white/[0.06]" />
                            <div>
                                <div className="text-2xl font-bold text-emerald-400">0</div>
                                <div className="text-xs text-foreground/50 mt-1 font-medium uppercase tracking-wider">Errors</div>
                            </div>
                            <div className="w-px h-10 bg-white/[0.06]" />
                            <div>
                                <div className="text-2xl font-bold text-white">25/25</div>
                                <div className="text-xs text-foreground/50 mt-1 font-medium uppercase tracking-wider">Passing</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative hidden lg:block">
                        {/* Glowing border frame */}
                        <div className="relative rounded-2xl border border-white/[0.08] bg-[#0A0B0F]/80 backdrop-blur-xl p-1 glow-amber shadow-2xl">
                            <div className="rounded-xl overflow-hidden bg-[#0A0B0F]">
                                {/* Code block – signature trace span */}
                                <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto">
                                    <div className="flex items-center gap-2 mb-6 border-b border-white/[0.06] pb-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                                        </div>
                                        <span className="ml-2 text-foreground/40 text-[11px]">trace-span.jsonl</span>
                                    </div>
                                    <pre className="text-foreground/80">
                                        <span className="text-foreground/30">{'{'}</span>
                                        <div className="pl-4">
                                            <span className="text-cyan-400">"trace_id"</span>: <span className="text-amber-300">"trc_8a92b1..."</span>,
                                            <span className="text-cyan-400">"agent"</span>: <span className="text-amber-300">"landing-page-builder"</span>,
                                            <span className="text-cyan-400">"span"</span>: <span className="text-foreground/30">{'{'}</span>
                                            <div className="pl-4">
                                                <span className="text-cyan-400">"op"</span>: <span className="text-amber-300">"tool.execute"</span>,
                                                <span className="text-cyan-400">"confidence"</span>: <span className="text-emerald-400">0.998</span>,
                                                <span className="text-cyan-400">"cost"</span>: <span className="text-emerald-400">0.0042</span>
                                            </div>
                                            <span className="text-foreground/30">{'}'}</span>,
                                            <span className="text-cyan-400">"output"</span>: <span className="text-foreground/30 text-wrap">"Layout engine upgrade complete. User satisfaction projected > 95%."</span>
                                        </div>
                                        <span className="text-foreground/30">{'}'}</span>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Floating accent badges */}
                        <div className="absolute -top-6 -right-6 px-4 py-2 rounded-xl bg-[#0A0B0F] border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-xl flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            System Healthy
                        </div>
                        <div className="absolute -bottom-4 -left-8 px-4 py-2 rounded-xl bg-[#0A0B0F] border border-amber-500/20 text-amber-400 text-xs font-mono font-medium shadow-xl">
                            $0.004/run
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
