import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'ar-announcement-dismissed';

export function AnnouncementBar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (!dismissed) setVisible(true);
    }, []);

    const dismiss = () => {
        setVisible(false);
        localStorage.setItem(STORAGE_KEY, 'true');
    };

    if (!visible) return null;

    return (
        <div className="relative z-50 flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-cyan-500/15 border-b border-sky-300/20 px-4 py-2 text-sm">
            <span className="inline-flex items-center gap-2 text-sky-100">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                <span className="font-medium">New: Walrus-inspired landing refresh</span>
                <span className="hidden sm:inline text-slate-300/80">— clearer hierarchy, cleaner spacing, better readability</span>
            </span>
            <a
                href="/dashboard"
                className="group inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 font-medium transition-colors"
            >
                Read more
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
                onClick={dismiss}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-foreground/40 hover:text-foreground/70 transition-colors"
                aria-label="Dismiss announcement"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
