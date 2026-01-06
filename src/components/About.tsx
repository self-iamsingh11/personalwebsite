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
                    AI Engineer with 7+ years of experience specializing in Generative AI, Python, and scaling architectures.
                    Proven ability to translate business requirements into secure, high-performance technical solutions in collaborative environments.
                    Expert in building end-to-end GenAI solutions, intelligent automation, and robust AI governance frameworks.
                </p>

                <div className={styles.sectionDivider} />

                <div className={styles.gridSection}>
                    <div className={styles.column}>
                        <h3 className={styles.subheading}>Experience</h3>
                        <div className={styles.experienceItem}>
                            <div className={styles.roleHeader}>
                                <h4>AI Engineer</h4>
                                <span className={styles.period}>2024 - Present</span>
                            </div>
                            <span className={styles.company}>IBM (WatsonX)</span>
                            <p className={styles.experienceDesc}>Building and deploying end-to-end generative AI solutions for enterprise challenges. Focus spans intelligent automation, customer support chatbots, and robust AI governance frameworks.</p>
                        </div>
                        <div className={styles.experienceItem}>
                            <div className={styles.roleHeader}>
                                <h4>AI/ML Engineer</h4>
                                <span className={styles.period}>2017 - 2024</span>
                            </div>
                            <span className={styles.company}>Dell Technologies</span>
                            <p className={styles.experienceDesc}>Architected enterprise-grade solutions with ML/AI, focusing on 'no-touch' workflows and model governance. Delivered intelligent systems enhancing efficiency and compliance.</p>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.subheading}>Skills</h3>
                        <div className={styles.skillsGrid}>
                            <span className={styles.skillTag}>Generative AI</span>
                            <span className={styles.skillTag}>Agentic AI</span>
                            <span className={styles.skillTag}>Llama 2 (80B/405B)</span>
                            <span className={styles.skillTag}>Python</span>
                            <span className={styles.skillTag}>Vector DB</span>
                            <span className={styles.skillTag}>AI Governance</span>
                            <span className={styles.skillTag}>Deep Learning</span>
                            <span className={styles.skillTag}>Scaling Architectures</span>
                        </div>

                        <h3 className={styles.subheading} style={{ marginTop: '2rem' }}>Education</h3>
                        <div className={styles.experienceItem}>
                            <div className={styles.roleHeader}>
                                <h4>B.Tech in Computer Science</h4>
                                <span className={styles.period}>2013 - 2017</span>
                            </div>
                            <span className={styles.company}>University of Petroleum and Energy Studies</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
