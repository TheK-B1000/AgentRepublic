import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-32 lg:pb-36">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="max-w-xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-xs font-medium text-amber-200/80">v0.2.0 — Production Ready</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
                            <span className="text-white">The Operating System</span>
                            <br />
                            <span className="text-gradient">for AI Agent Fleets</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg sm:text-xl text-foreground/60 leading-relaxed mb-10 max-w-md">
                            Turn probabilistic chats into{' '}
                            <strong className="text-white font-semibold">deterministic runs</strong>.
                            Build, govern, and scale production-grade agent systems
                            with full observability and safety.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href="/get-started"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="/docs"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/70 border border-white/[0.1] rounded-lg hover:border-white/20 hover:text-white transition-all hover:bg-white/[0.03]"
                            >
                                <Play className="w-3.5 h-3.5" />
                                Read Docs
                            </a>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/[0.06]">
                            <div>
                                <div className="text-2xl font-bold text-white">55</div>
                                <div className="text-xs text-foreground/50 mt-0.5">Source Files</div>
                            </div>
                            <div className="w-px h-10 bg-white/[0.06]" />
                            <div>
                                <div className="text-2xl font-bold text-white">7</div>
                                <div className="text-xs text-foreground/50 mt-0.5">Districts</div>
                            </div>
                            <div className="w-px h-10 bg-white/[0.06]" />
                            <div>
                                <div className="text-2xl font-bold text-emerald-400">0</div>
                                <div className="text-xs text-foreground/50 mt-0.5">Errors</div>
                            </div>
                            <div className="w-px h-10 bg-white/[0.06]" />
                            <div>
                                <div className="text-2xl font-bold text-white">25/25</div>
                                <div className="text-xs text-foreground/50 mt-0.5">Tests Pass</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative hidden lg:block">
                        {/* Glowing border frame */}
                        <div className="relative rounded-2xl border border-white/[0.06] bg-[#111318] p-1 glow-amber">
                            <div className="rounded-xl overflow-hidden">
                                {/* Code block – signature trace span */}
                                <div className="bg-[#0D0E12] p-6 font-mono text-xs leading-relaxed">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                                        <span className="ml-2 text-foreground/30 text-[11px]">trace-span.jsonl</span>
                                    </div>
                                    <pre className="text-foreground/70">
                                        <span className="text-foreground/30">{'{'}</span>
                                        <span className="text-cyan-400">"type"</span>: <span className="text-amber-300">"span"</span>,
                                        <span className="text-cyan-400">"agent"</span>: <span className="text-amber-300">"landing-page-builder"</span>,
                                        <span className="text-cyan-400">"action"</span>: <span className="text-amber-300">"plan"</span>,
                                        <span className="text-cyan-400">"output"</span>: <span className="text-foreground/30">{'{'}</span>
                                        <span className="text-cyan-400">"tool"</span>: <span className="text-amber-300">"write_file"</span>,
                                        <span className="text-cyan-400">"confidence"</span>: <span className="text-emerald-400">0.95</span>,
                                        <span className="text-cyan-400">"goalComplete"</span>: <span className="text-emerald-400">false</span>
                                        <span className="text-foreground/30">{'}'}</span>,
                                        <span className="text-cyan-400">"tokenUsage"</span>: <span className="text-foreground/30">{'{'}</span>
                                        <span className="text-cyan-400">"input"</span>: <span className="text-purple-400">1247</span>,
                                        <span className="text-cyan-400">"output"</span>: <span className="text-purple-400">89</span>
                                        <span className="text-foreground/30">{'}'}</span>,
                                        <span className="text-cyan-400">"costUsd"</span>: <span className="text-emerald-400">0.004</span>,
                                        <span className="text-cyan-400">"status"</span>: <span className="text-emerald-400">"OK"</span>
                                        <span className="text-foreground/30">{'}'}</span>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Floating accent badges */}
                        <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                            ✓ Verified
                        </div>
                        <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium font-mono">
                            $0.004/run
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
