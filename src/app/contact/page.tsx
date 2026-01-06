import PageWrapper from '@/components/PageWrapper';
import { Mail, Linkedin, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <PageWrapper className="page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '5rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', lineHeight: 1 }}>
                Let's work <br />
                <span className="text-gradient">together.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', marginBottom: '3rem', maxWidth: '500px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={24} color="var(--accent-secondary)" /> Based in Bengaluru, India. <br />
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                    href="mailto:official.singh11@gmail.com"
                    className="glass"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1.5rem 3rem',
                        fontSize: '1.2rem',
                        borderRadius: '9999px',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Mail size={24} />
                    Email Me
                </a>

                <a
                    href="https://linkedin.com/in/itsabhisheksingh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1.5rem 3rem',
                        fontSize: '1.2rem',
                        borderRadius: '9999px',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Linkedin size={24} />
                    LinkedIn
                </a>
            </div>

            <div style={{ marginTop: '3rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} />
                <p>+91 9889426699</p>
            </div>
        </PageWrapper>
    );
}
