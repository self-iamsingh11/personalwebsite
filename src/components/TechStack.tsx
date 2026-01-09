'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './TechStack.module.css';

// Tech stack organized by category
const techCategories = [
    {
        name: 'AI & ML',
        items: ['Generative AI', 'LLMs', 'Deep Learning', 'LangChain', 'Vector DB'],
    },
    {
        name: 'Languages',
        items: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
    },
    {
        name: 'Frameworks',
        items: ['React', 'Next.js', 'FastAPI', 'Node.js'],
    },
    {
        name: 'Infrastructure',
        items: ['Docker', 'Kubernetes', 'AWS', 'GCP'],
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    },
};

export default function TechStack() {
    return (
        <div className={styles.container}>
            {techCategories.map((category) => (
                <motion.div
                    key={category.name}
                    className={styles.category}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h4 className={styles.categoryName}>{category.name}</h4>
                    <div className={styles.tags}>
                        {category.items.map((item) => (
                            <motion.span
                                key={item}
                                className={styles.tag}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    borderColor: 'var(--accent-primary)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
