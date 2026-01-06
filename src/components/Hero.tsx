'use client';

import { motion } from 'framer-motion';
import GlowingOrb from '@/components/GlowingOrb';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <GlowingOrb />
            <div className={styles.content}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.9] }}
                >
                    Abhishek<br />
                    <span className="text-gradient">Singh</span>
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    AI Engineer | Generative AI Specialist | Deep Learning
                </motion.p>
            </div>
        </section>
    );
}
