import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div
            className={cn(
                "mx-auto w-full max-w-[1480px] px-5 sm:px-6 lg:px-10 xl:px-12 relative text-center",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
