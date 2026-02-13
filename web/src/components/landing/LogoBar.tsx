import { Section } from '../ui/section';
import { Container } from '../ui/container';

export function LogoBar() {
    return (
        <Section className="border-y border-white/[0.04] py-8 sm:py-10">
            <Container>
                <p className="text-center text-xs font-medium text-foreground/30 uppercase tracking-[0.2em] mb-8">
                    Built with
                </p>
                <div className="edge-fade flex items-center justify-center gap-10 sm:gap-14 flex-wrap">
                    <LogoItem name="TypeScript" icon={<TypeScriptIcon />} />
                    <LogoItem name="React" icon={<ReactIcon />} />
                    <LogoItem name="Playwright" icon={<PlaywrightIcon />} />
                    <LogoItem name="Claude" icon={<ClaudeIcon />} />
                    <LogoItem name="Vercel" icon={<VercelIcon />} />
                    <LogoItem name="MCP" icon={<McpIcon />} />
                </div>
            </Container>
        </Section>
    );
}

function LogoItem({ name, icon }: { name: string; icon: React.ReactNode }) {
    return (
        <div
            className="flex items-center gap-2 text-foreground/25 hover:text-foreground/50 transition-colors duration-300 placeholder-opacity-50 grayscale hover:grayscale-0"
            title={name}
        >
            <div className="w-6 h-6">{icon}</div>
            <span className="text-sm font-medium hidden sm:inline">{name}</span>
        </div>
    );
}

/* -- Icons -- */

function TypeScriptIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.157.53.104.156.252.304.443.444s.42.276.69.399.57.24.904.35a8.478 8.478 0 0 1 1.735.85c.383.264.7.56.95.886.252.326.432.69.54 1.087.107.397.16.838.16 1.321 0 .891-.192 1.627-.576 2.208-.384.58-.92 1.011-1.606 1.292-.686.282-1.492.422-2.418.422-.672 0-1.301-.063-1.889-.19a7.714 7.714 0 0 1-1.544-.5V17.1c.33.218.677.408 1.04.569a5.4 5.4 0 0 0 1.1.381 4.5 4.5 0 0 0 1.078.136c.327 0 .618-.035.871-.106.253-.07.455-.18.607-.328a.771.771 0 0 0 .228-.572c0-.218-.063-.41-.19-.576a2.18 2.18 0 0 0-.566-.47 6.14 6.14 0 0 0-.9-.413 13.016 13.016 0 0 0-1.197-.453 6.2 6.2 0 0 1-1.46-.795 3.656 3.656 0 0 1-.903-.901 3.006 3.006 0 0 1-.441-1.065 5.089 5.089 0 0 1-.118-1.15c0-.82.18-1.518.539-2.091a3.584 3.584 0 0 1 1.498-1.32c.643-.31 1.4-.466 2.27-.466zM6.24 9.75h7.2v2.1H11.1V21H8.58V11.85H6.24z" />
        </svg>
    );
}

function ReactIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.31 0-.592.06-.846.176C4.72 2.13 4.14 3.76 4.14 6.24c0 1.688.332 3.578.96 5.55C2.82 12.93 1.5 14.325 1.5 15.86c0 2.2 2.756 3.735 6.976 4.178 1.434 3.372 3.32 5.462 4.87 5.462.334 0 .642-.082.923-.233 1.563-.84 2.37-3.534 2.37-6.76 0-.824-.07-1.694-.204-2.587C19.66 15.06 22.5 13.387 22.5 11.14c0-2.2-2.57-3.67-6.616-4.188-.154-.914-.344-1.773-.576-2.555-.784-2.636-2.11-4.085-3.43-4.085zM12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
        </svg>
    );
}

function PlaywrightIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z" />
        </svg>
    );
}

function ClaudeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.5 14.5h-7a1 1 0 0 1 0-2h7a1 1 0 0 1 0 2zm0-4h-7a1 1 0 0 1 0-2h7a1 1 0 0 1 0 2zm0-4h-7a1 1 0 0 1 0-2h7a1 1 0 0 1 0 2z" />
        </svg>
    );
}

function VercelIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L24 22H0z" />
        </svg>
    );
}

function McpIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
    );
}
