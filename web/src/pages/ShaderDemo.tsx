import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function ShaderDemo() {
    return (
        <div className="relative flex w-full h-screen flex-col items-center justify-center overflow-hidden">
            <WebGLShader />
            <div className="relative border border-[#27272a] p-2 w-full mx-auto max-w-3xl">
                <main className="relative border border-[#27272a] py-10 overflow-hidden">
                    <h1 className="mb-3 text-white text-center text-7xl font-extrabold tracking-tighter md:text-[clamp(2rem,8vw,7rem)]">
                        Agent Republic
                    </h1>
                    <p className="text-white/60 px-6 text-center text-xs md:text-sm lg:text-lg">
                        Autonomous AI agents. Orchestrated intelligence. Limitless possibilities.
                    </p>
                    <div className="my-8 flex items-center justify-center gap-1">
                        <span className="relative flex h-3 w-3 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        <p className="text-xs text-green-500">System Online</p>
                    </div>
                    <div className="flex justify-center">
                        <LiquidButton className="text-white border rounded-full" size={"xl"}>
                            Enter Mission Control
                        </LiquidButton>
                    </div>
                </main>
            </div>
        </div>
    );
}
