import { motion } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
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
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const variants = {
        hidden: {
            opacity: 1,
            y: 0,
            x: 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration,
                delay,
                ease: [0.25, 0.4, 0.25, 1] as const, // Ease out cubic
            },
        },
    };

    return (
        <motion.div
            initial={initial}
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
