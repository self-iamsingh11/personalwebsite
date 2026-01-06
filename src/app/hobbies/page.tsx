'use client';

import PageWrapper from '@/components/PageWrapper';
import { Camera, Music, BookOpen, Palette, PenTool, Radio, Coffee } from 'lucide-react';
import styles from './Hobbies.module.css';

const hobbies = [
    { id: 1, label: 'Travelling', tag: 'Adventure', size: 'itemLarge', icon: Camera },
    { id: 2, label: 'Football Fanatic', tag: 'Sports', size: 'itemTall', icon: Radio }, // Used Radio as proxy for stadium/broadcast or choose simpler
    { id: 3, label: 'Reading', tag: 'Leisure', size: '', icon: BookOpen },
    { id: 4, label: 'Painting', tag: 'Art', size: '', icon: Palette },
    { id: 5, label: 'Sketching', tag: 'Art', size: 'itemWide', icon: PenTool },
    { id: 6, label: 'Tech Podcasts', tag: 'Learning', size: '', icon: Radio },
];

export default function Hobbies() {
    return (
        <PageWrapper className="page-container">
            <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', marginBottom: '2rem' }}>
                Beyond the <span className="text-gradient">Code</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '4rem' }}>
                Exploring creativity and life outside of engineering.
            </p>

            <div className={styles.grid}>
                {hobbies.map((hobby) => {
                    const Icon = hobby.icon;
                    return (
                        <div key={hobby.id} className={`${styles.item} ${hobby.size ? styles[hobby.size as keyof typeof styles] : ''}`}>
                            <div className={styles.content}>
                                <div className={styles.iconWrapper}>
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>
                                <span className={styles.tag}>{hobby.tag}</span>
                                <h3 className={styles.label}>{hobby.label}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PageWrapper>
    );
}
