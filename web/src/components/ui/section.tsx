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
                "relative py-16 sm:py-24 lg:py-32 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}
