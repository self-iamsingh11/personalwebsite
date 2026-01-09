'use client';

import React from 'react';
import styles from './BentoGrid.module.css';

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export default function BentoGrid({ children, className = '' }: BentoGridProps) {
    return (
        <section className={`${styles.container} ${className}`}>
            <div className={styles.grid}>
                {children}
            </div>
        </section>
    );
}
