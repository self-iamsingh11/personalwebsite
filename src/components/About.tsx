'use client';

import { motion } from 'framer-motion';
import styles from './About.module.css';

export default function About() {
    return (
        <section className={styles.container}>
            <motion.div
                className={styles.content}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <h2 className={styles.heading}>
                    About <span className="text-gradient">Me</span>
                </h2>
                <p className={styles.text}>
                    I'm a passionate developer with a keen eye for design. I craft digital experiences that are not only functional but also visually stunning.
                    With a background in engineering and a love for aesthetics, I bridge the gap between technical complexity and intuitive design.
                </p>
                <p className={styles.text}>
                    When I'm not coding, you can find me exploring new technologies, contributing to open source, or capturing moments through my camera lens.
                </p>
            </motion.div>
        </section>
    );
}
