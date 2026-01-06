'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

interface PageWrapperProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export default function PageWrapper({
    children,
    className,
    ...props
}: PageWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.9] }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
