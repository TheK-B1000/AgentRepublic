import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    className = ''
}: FadeInProps) {
    const initialAnimation = direction === 'none'
        ? { opacity: 1, y: 0, x: 0 }
        : {
            opacity: 0,
            y: direction === 'up' ? 24 : direction === 'down' ? -24 : 0,
            x: direction === 'left' ? 24 : direction === 'right' ? -24 : 0,
        };

    return (
        <motion.div
            initial={initialAnimation}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.4, 0.25, 1] as const,
            }}
            className={`w-full ${className}`}
        >
            {children}
        </motion.div>
    );
}
