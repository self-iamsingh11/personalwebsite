import PageWrapper from '@/components/PageWrapper';
import ProjectCard from '@/components/ProjectCard';

export default function Projects() {
    const projects = [
        {
            category: "Generative AI App",
            title: "SWU (University) Platform",
            description: "Engineered a conversational AI platform by fine-tuning a Llama 2 405B model. Impact: 40% reduction in support queries, response time cut to seconds."
        },
        {
            category: "Generative AI App",
            title: "NewsCorp Content Pipeline",
            description: "Architected a pipeline deploying Llama 2 80B vision model to analyze social trends. Impact: Boosted user engagement by over 25%."
        },
        {
            category: "Generative AI App",
            title: "Karnataka Bank Chatbot",
            description: "Spearheaded an enterprise-grade customer support chatbot handling 10k+ daily interactions. Impact: 30% decrease in call volume."
        },
        {
            category: "Agentic AI",
            title: "ESSEL Group HR Workflow",
            description: "Designed an end-to-end 'no-touch' HR onboarding workflow using agentic AI. Impact: Reduced cycle time from 7 days to <8 hours."
        },
        {
            category: "Agentic AI",
            title: "ONGC RFP Analyzer",
            description: "Developed a GenAI tool to automate parsing and analysis of complex RFPs. Impact: Reduced initial review time by 90%."
        },
        {
            category: "Process Automation",
            title: "Adani Financials Verification",
            description: "Built an AI-driven verification system for accounting standards. Impact: Automated review of 5,000+ documents."
        },
        {
            category: "AI Systems",
            title: "Airtel Incident Management",
            description: "Pioneered a GenAI incident management system for autonomous diagnosis. Impact: Slashed average resolution time by 60%."
        },
        {
            category: "AI Systems",
            title: "UoA Student Support",
            description: "Architected a centralized student support/grievance system using GenAI. Impact: Improved administrative efficiency by >50%."
        },
        {
            category: "AI Governance",
            title: "HDFC & Suncorp Framework",
            description: "Devised comprehensive AI Governance frameworks for risk management and ethics. Impact: Ensured 100% compliance."
        }
    ];

    return (
        <PageWrapper className="page-container">
            <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', marginBottom: '2rem' }}>
                Selected <span className="text-gradient">Projects</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
                A collection of enterprise solutions involved in delivering value through AI.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', marginTop: '4rem' }}>
                {projects.map((p, i) => (
                    <ProjectCard
                        key={i}
                        category={p.category}
                        title={p.title}
                        description={p.description}
                    />
                ))}
            </div>
        </PageWrapper>
    );
}
