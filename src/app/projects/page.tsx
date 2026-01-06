import PageWrapper from '@/components/PageWrapper';
import ProjectCard from '@/components/ProjectCard';

export default function Projects() {
    return (
        <PageWrapper className="page-container">
            <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', marginBottom: '2rem' }}>
                Selected <span className="text-gradient">Projects</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
                A collection of my recent work, experiments, and open source contributions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', marginTop: '4rem' }}>
                <ProjectCard
                    category="Web Development"
                    title="E-Commerce Redesign"
                    description="A complete overhaul of a fashion retailer's online presence, featuring 3D product previews and AI recommendations."
                />
                <ProjectCard
                    category="System Design"
                    title="Cloud Infrastructure"
                    description="Scalable microservices architecture handling millions of requests with 99.99% uptime."
                />
                <ProjectCard
                    category="Open Source"
                    title="Animation Library"
                    description="A lightweight physics-based animation library for React, starred by over 5k developers on GitHub."
                />
                <ProjectCard
                    category="AI / ML"
                    title="Generative Art Bot"
                    description="Discord bot effectively creating unique art pieces based on sentiment analysis of chat logs."
                />
            </div>
        </PageWrapper>
    );
}
