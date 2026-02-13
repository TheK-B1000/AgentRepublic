import { ArrowRight, Play } from 'lucide-react';
import { Container } from '../ui/container';
import { Section } from '../ui/section';

export function Hero() {
    return (
        <Section className="pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-12 left-[12%] w-[32rem] h-[32rem] bg-sky-400/15 rounded-full blur-[140px]" />
                <div className="absolute top-20 right-[5%] w-[24rem] h-[24rem] bg-indigo-400/20 rounded-full blur-[120px]" />
            </div>

            <Container>
                <div className="grid grid-cols-1 gap-10 items-center justify-items-center">
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-300/30 bg-sky-400/10 mb-7 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                            <span className="text-xs font-medium text-sky-100/95 tracking-wide">Now live — secure autonomous infrastructure</span>
                        </div>

                        <h1 className="text-fluid-h1 font-extrabold tracking-tight mb-5">
                            Build AI systems with
                            <br />
                            <span className="text-gradient">clarity, control, and speed.</span>
                        </h1>

                        <p className="text-fluid-p text-slate-300 mb-9 max-w-2xl leading-relaxed mx-auto">
                            Agent Republic gives teams a shared control plane for agents,
                            traces, and safeguards—so you can ship production workflows
                            without fragile glue code.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-sky-300 text-slate-950 rounded-xl hover:bg-sky-200 transition-all shadow-[0_0_30px_-8px_rgba(125,211,252,0.7)]"
                            >
                                Start Building
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="/traces"
                                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-slate-100 border border-slate-300/20 rounded-xl hover:border-sky-200/50 transition-all hover:bg-slate-100/5"
                            >
                                <Play className="w-4 h-4" />
                                View Traces
                            </a>
                        </div>

                        <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-slate-300/15">
                            <div>
                                <div className="text-2xl font-bold text-white">99.95%</div>
                                <div className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">Uptime</div>
                            </div>
                            <div className="w-px h-10 bg-slate-400/20" />
                            <div>
                                <div className="text-2xl font-bold text-white">55+</div>
                                <div className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">Agent Sources</div>
                            </div>
                            <div className="w-px h-10 bg-slate-400/20" />
                            <div>
                                <div className="text-2xl font-bold text-white">7</div>
                                <div className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">Districts</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full max-w-4xl min-h-[420px]">
                        <div className="absolute inset-0 rounded-3xl border border-slate-300/10 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10" />
                        <div className="relative w-full h-full rounded-3xl border border-slate-300/20 bg-slate-950/80 backdrop-blur-xl p-1.5 shadow-2xl shadow-sky-500/10">
                            <div className="rounded-2xl overflow-hidden bg-[#020617] h-full flex flex-col">
                                <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-slate-200 flex-1">
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-500/20 pb-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-300/60" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-300/70" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300/70" />
                                        <span className="ml-2 text-slate-400">runbook.trace</span>
                                    </div>
                                    <pre className="whitespace-pre-wrap text-[11px] leading-5">{`pipeline.execute({
  workspace: "agent-republic",
  guards: ["identity", "policy", "eval"],
  runbook: "customer-support-v3"
})

✓ input normalized
✓ tools scoped
✓ trace sealed
✓ deployment approved`}</pre>
                                </div>
                                <div className="grid grid-cols-3 gap-3 p-4 border-t border-slate-500/20 bg-slate-900/50">
                                    <div className="rounded-lg border border-slate-300/20 bg-slate-800/70 p-3">
                                        <div className="text-[10px] text-slate-400 uppercase">Latency</div>
                                        <div className="text-sm font-semibold text-cyan-300">142ms</div>
                                    </div>
                                    <div className="rounded-lg border border-slate-300/20 bg-slate-800/70 p-3">
                                        <div className="text-[10px] text-slate-400 uppercase">Guards</div>
                                        <div className="text-sm font-semibold text-emerald-300">3/3 pass</div>
                                    </div>
                                    <div className="rounded-lg border border-slate-300/20 bg-slate-800/70 p-3">
                                        <div className="text-[10px] text-slate-400 uppercase">Status</div>
                                        <div className="text-sm font-semibold text-sky-300">Live</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
