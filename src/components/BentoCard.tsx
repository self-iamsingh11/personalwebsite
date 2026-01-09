'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SpotlightCard from './SpotlightCard';
import styles from './BentoCard.module.css';

export type BentoCardSize = '1x1' | '1x2' | '2x1' | '2x2';

interface BentoCardProps {
    children: React.ReactNode;
    size?: BentoCardSize;
    className?: string;
    spotlightColor?: string;
    delay?: number;
}

const sizeMap: Record<BentoCardSize, { colSpan: number; rowSpan: number }> = {
    '1x1': { colSpan: 1, rowSpan: 1 },
    '1x2': { colSpan: 1, rowSpan: 2 },
    '2x1': { colSpan: 2, rowSpan: 1 },
    '2x2': { colSpan: 2, rowSpan: 2 },
};

export default function BentoCard({
    children,
    size = '1x1',
    className = '',
    spotlightColor,
    delay = 0,
}: BentoCardProps) {
    const { colSpan, rowSpan } = sizeMap[size];

    return (
        <motion.div
            className={`${styles.wrapper} ${styles[`size${size.replace('x', '')}`]} ${className}`}
            style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.6, 0.01, 0.05, 0.9]
            }}
            whileHover={{
                y: -5,
                transition: { duration: 0.2, ease: 'easeOut' }
            }}
        >
            <SpotlightCard
                className={styles.card}
                spotlightColor={spotlightColor}
            >
                <div className={styles.content}>
                    {children}
                </div>
            </SpotlightCard>
        </motion.div>
    );
}
