import PageWrapper from '@/components/PageWrapper';
import InteractiveGrid from '@/components/InteractiveGrid';

export default function Playground() {
    return (
        <PageWrapper className="page-container">
            <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', marginBottom: '2rem' }}>
                Interactive <span className="text-gradient">Playground</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '4rem' }}>
                Experimental web apps, visualizations, and interactive components.
            </p>

            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
                    Gravity Grid
                </h2>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '21px', padding: '1px' }}>
                    <InteractiveGrid />
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Move your cursor over the grid to disrupt the field.
                </p>
            </div>
        </PageWrapper>
    );
}
