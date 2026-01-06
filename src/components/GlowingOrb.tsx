'use client';

import { motion } from 'framer-motion';
import styles from './GlowingOrb.module.css';

export default function GlowingOrb() {
    return (
        <div className={styles.container}>
            <motion.div
                className={styles.orb}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className={`${styles.orb} ${styles.orbSecondary}`}
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.6, 0.3],
                    x: [-50, 50, -50],
                    y: [-20, 20, -20],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
}
