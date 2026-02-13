import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export function Section({ children, className, id, ...props }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "relative w-full py-12 sm:py-16 lg:py-24 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}
