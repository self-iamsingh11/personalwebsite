'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Briefcase, ExternalLink, Github } from 'lucide-react';
import styles from './BentoBlocks.module.css';

// Profile Introduction Block
export function ProfileBlock() {
    return (
        <div className={styles.profileBlock}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    <span className={styles.avatarInitials}>AS</span>
                </div>
                <div className={styles.profileInfo}>
                    <h3 className={styles.profileName}>Abhishek Singh</h3>
                    <p className={styles.profileRole}>AI Engineer @ IBM WatsonX</p>
                </div>
            </div>
            <p className={styles.profileBio}>
                Full-Stack AI Engineer specialized in scalable GenAI solutions, intelligent automation,
                and enterprise AI governance. 7+ years building production-grade AI systems.
            </p>
        </div>
    );
}

// Location Block with stylized map
export function LocationBlock() {
    return (
        <div className={styles.locationBlock}>
            <div className={styles.mapVisual}>
                <div className={styles.mapGradient} />
                <div className={styles.locationPin}>
                    <MapPin size={20} />
                </div>
                <motion.div
                    className={styles.pingRing}
                    animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
            <div className={styles.locationInfo}>
                <span className={styles.locationLabel}>Based in</span>
                <span className={styles.locationCity}>India</span>
            </div>
        </div>
    );
}

// Current Status Block
export function StatusBlock() {
    return (
        <div className={styles.statusBlock}>
            <div className={styles.statusIndicator}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>Currently</span>
            </div>
            <p className={styles.statusContent}>Building GenAI solutions at IBM WatsonX</p>
            <div className={styles.statusMeta}>
                <Calendar size={14} />
                <span>Since 2024</span>
            </div>
        </div>
    );
}

// Experience Highlight Block
export function ExperienceBlock() {
    const experiences = [
        { role: 'AI Engineer', company: 'IBM (WatsonX)', period: '2024 - Present' },
        { role: 'AI/ML Engineer', company: 'Dell Technologies', period: '2017 - 2024' },
    ];

    return (
        <div className={styles.experienceBlock}>
            <div className={styles.blockHeader}>
                <Briefcase size={18} />
                <h4>Experience</h4>
            </div>
            <div className={styles.experienceList}>
                {experiences.map((exp, index) => (
                    <div key={index} className={styles.experienceItem}>
                        <div className={styles.expMain}>
                            <span className={styles.expRole}>{exp.role}</span>
                            <span className={styles.expCompany}>{exp.company}</span>
                        </div>
                        <span className={styles.expPeriod}>{exp.period}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Featured Project Block
interface ProjectBlockProps {
    title: string;
    description: string;
    tags: string[];
    href?: string;
    githubHref?: string;
}

export function ProjectBlock({ title, description, tags, href, githubHref }: ProjectBlockProps) {
    return (
        <div className={styles.projectBlock}>
            <div className={styles.projectContent}>
                <h4 className={styles.projectTitle}>{title}</h4>
                <p className={styles.projectDesc}>{description}</p>
                <div className={styles.projectTags}>
                    {tags.map((tag) => (
                        <span key={tag} className={styles.projectTag}>{tag}</span>
                    ))}
                </div>
            </div>
            <div className={styles.projectLinks}>
                {href && (
                    <a href={href} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} />
                        <span>View</span>
                    </a>
                )}
                {githubHref && (
                    <a href={githubHref} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                        <Github size={16} />
                        <span>Code</span>
                    </a>
                )}
            </div>
        </div>
    );
}

// Connect Block
export function ConnectBlock() {
    return (
        <div className={styles.connectBlock}>
            <h4 className={styles.connectTitle}>Let's Build Together</h4>
            <p className={styles.connectText}>
                Open to discussing AI solutions, collaborations, or just geeking out about the latest in GenAI.
            </p>
            <a href="mailto:hello@iamsingh11.com" className={styles.connectEmail}>
                hello@iamsingh11.com
            </a>
        </div>
    );
}
