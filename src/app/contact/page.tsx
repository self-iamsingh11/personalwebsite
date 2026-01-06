import PageWrapper from '@/components/PageWrapper';

export default function Contact() {
    return (
        <PageWrapper className="page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '5rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', lineHeight: 1 }}>
                Let's work <br />
                <span className="text-gradient">together.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', marginBottom: '3rem', maxWidth: '500px' }}>
                Have a project in mind? Reach out and let's create something extraordinary.
            </p>

            <a
                href="mailto:contact@example.com"
                className="glass"
                style={{
                    display: 'inline-block',
                    padding: '1.5rem 3rem',
                    fontSize: '1.2rem',
                    borderRadius: '9999px',
                    color: 'var(--text-primary)',
                    transition: 'all 0.3s ease',
                    marginRight: 'auto'
                }}
            >
                Get in Touch
            </a>
        </PageWrapper>
    );
}
