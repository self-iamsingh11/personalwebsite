import PageWrapper from '@/components/PageWrapper';
import styles from './Hobbies.module.css';

const hobbies = [
    { id: 1, label: 'Street Photography', tag: 'Photography', size: 'itemLarge' },
    { id: 2, label: 'Synthesizers', tag: 'Music', size: 'itemTall' },
    { id: 3, label: 'Sci-Fi Novels', tag: 'Reading', size: '' },
    { id: 4, label: 'Pixel Art', tag: 'Design', size: '' },
    { id: 5, label: 'Hiking Trails', tag: 'Travel', size: 'itemWide' },
    { id: 6, label: 'Mechanical Keyboards', tag: 'Tech', size: '' },
    { id: 7, label: 'Espresso', tag: 'Lifestyle', size: '' },
];

export default function Hobbies() {
    return (
        <PageWrapper className="page-container">
            <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', marginBottom: '2rem' }}>
                Beyond the <span className="text-gradient">Code</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '4rem' }}>
                Exploring photography, travel, and other passions that fuel my creativity.
            </p>

            <div className={styles.grid}>
                {hobbies.map((hobby) => (
                    <div key={hobby.id} className={`${styles.item} ${hobby.size ? styles[hobby.size as keyof typeof styles] : ''}`}>
                        <div className={styles.content}>
                            <span className={styles.tag}>{hobby.tag}</span>
                            <h3 className={styles.label}>{hobby.label}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </PageWrapper>
    );
}
