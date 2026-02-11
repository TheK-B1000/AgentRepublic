import { useState } from 'react';

// Simplified node positions for a connected graph look
const nodes = [
    // Central Government
    { id: 'gov', x: 400, y: 300, r: 40, label: 'Government', type: 'core' },
    // Districts
    { id: 'dev', x: 250, y: 150, r: 25, label: 'Workshop', type: 'district' },
    { id: 'ops', x: 550, y: 150, r: 25, label: 'Ops', type: 'district' },
    { id: 'sec', x: 250, y: 450, r: 25, label: 'Security', type: 'district' },
    { id: 'res', x: 550, y: 450, r: 25, label: 'Research', type: 'district' },
    // Satellites
    { id: 'ml', x: 400, y: 100, r: 15, label: 'Foundry', type: 'satellite' },
    { id: 'qa', x: 150, y: 300, r: 15, label: 'QA', type: 'satellite' },
    { id: 'auto', x: 650, y: 300, r: 15, label: 'Auto', type: 'satellite' },
];

// Connections between nodes
const links = [
    ['gov', 'dev'], ['gov', 'ops'], ['gov', 'sec'], ['gov', 'res'],
    ['dev', 'ml'], ['dev', 'qa'],
    ['ops', 'auto'], ['ops', 'ml'],
    ['sec', 'qa'], ['sec', 'res'],
];

export function ArchitectureDiagram() {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <section className="py-24 border-t border-white/[0.04] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Side */}
                    <div>
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-3">
                            Topology
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6">
                            A living network of <br />
                            specialized agents
                        </h2>
                        <p className="text-foreground/60 text-lg leading-relaxed mb-8">
                            The Republic isn't just a list of scripts. It's a connected graph where High Council agents orchestrate district specialists, who in turn command sub-agents.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs ring-1 ring-amber-500/20">1</div>
                                <div>
                                    <h4 className="font-semibold text-white">Central Government</h4>
                                    <p className="text-sm text-foreground/50">Constitutional guardrails & resource allocation.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs ring-1 ring-cyan-500/20">2</div>
                                <div>
                                    <h4 className="font-semibold text-white">Districts</h4>
                                    <p className="text-sm text-foreground/50">Specialized stacks for Dev, Ops, Research, Security.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs ring-1 ring-purple-500/20">3</div>
                                <div>
                                    <h4 className="font-semibold text-white">Satellites</h4>
                                    <p className="text-sm text-foreground/50">Task-specific runners (browsers, interpreters, shells).</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Diagram Side */}
                    <div className="relative aspect-square max-w-lg mx-auto lg:ml-auto">
                        <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
                            <defs>
                                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Links */}
                            {links.map(([sourceId, targetId]) => {
                                const s = nodes.find(n => n.id === sourceId)!;
                                const t = nodes.find(n => n.id === targetId)!;
                                return (
                                    <line
                                        key={`${sourceId}-${targetId}`}
                                        x1={s.x} y1={s.y}
                                        x2={t.x} y2={t.y}
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="2"
                                    />
                                );
                            })}

                            {/* Nodes */}
                            {nodes.map((node) => {
                                const isHovered = hovered === node.id;
                                const isCore = node.type === 'core';
                                const color = isCore ? '#F59E0B' : node.type === 'district' ? '#00D4FF' : '#A855F7';

                                return (
                                    <g
                                        key={node.id}
                                        onMouseEnter={() => setHovered(node.id)}
                                        onMouseLeave={() => setHovered(null)}
                                        className="cursor-pointer transition-all duration-300"
                                        style={{ transformOrigin: `${node.x}px ${node.y}px`, transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
                                    >
                                        {/* Pulse effect for core */}
                                        {isCore && (
                                            <circle cx={node.x} cy={node.y} r={node.r * 1.5} fill={color} opacity="0.1">
                                                <animate attributeName="r" values={`${node.r};${node.r * 1.8};${node.r}`} dur="3s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" values="0.1;0;0.1" dur="3s" repeatCount="indefinite" />
                                            </circle>
                                        )}

                                        {/* Main Circle */}
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={node.r}
                                            fill="#0A0B0F"
                                            stroke={color}
                                            strokeWidth={isHovered ? 3 : 1.5}
                                            filter={isHovered ? 'url(#glow)' : undefined}
                                        />

                                        {/* Icon/Label */}
                                        <text
                                            x={node.x}
                                            y={node.y}
                                            fill="white"
                                            fontSize={isCore ? 14 : 12}
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            pointerEvents="none"
                                        >
                                            {node.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
