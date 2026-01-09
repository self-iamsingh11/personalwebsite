'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GlowingOrb from '@/components/GlowingOrb';
import MagneticButton from '@/components/MagneticButton';
import styles from './Hero.module.css';

export default function Hero() {
    const scrollToContent = () => {
        const bentoSection = document.getElementById('bento-section');
        if (bentoSection) {
            bentoSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className={styles.hero}>
            <GlowingOrb />
            <div className={styles.content}>
                <motion.div
                    className={styles.badge}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className={styles.badgeText}>Available for new opportunities</span>
                </motion.div>

                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.9] }}
                >
                    Hi, I'm <span className="text-gradient-accent">Abhishek</span>
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    AI Engineer specializing in <strong>Generative AI</strong> & <strong>Scalable ML Systems</strong>
                </motion.p>

                <motion.p
                    className={styles.valueProposition}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    Building production-grade AI solutions that reduce latency by 30%<br />
                    and automate enterprise workflows at scale.
                </motion.p>

                <motion.div
                    className={styles.ctaGroup}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <MagneticButton
                        variant="primary"
                        href="#contact"
                    >
                        Let's Connect
                    </MagneticButton>
                    <MagneticButton
                        variant="secondary"
                        href="#bento-section"
                        onClick={scrollToContent}
                    >
                        Explore Work
                    </MagneticButton>
                </motion.div>
            </div>

            <motion.button
                className={styles.scrollIndicator}
                onClick={scrollToContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{
                    opacity: { delay: 1.2, duration: 0.6 },
                    y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                aria-label="Scroll to content"
            >
                <ArrowDown size={24} strokeWidth={1.5} />
            </motion.button>
        </section>
    );
}
