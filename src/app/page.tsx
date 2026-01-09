import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import BentoCard from '@/components/BentoCard';
import TechStack from '@/components/TechStack';
import {
  ProfileBlock,
  LocationBlock,
  StatusBlock,
  ExperienceBlock,
  ProjectBlock,
  ConnectBlock,
} from '@/components/BentoBlocks';

export default function Home() {
  return (
    <main>
      <Hero />

      <section id="bento-section">
        <BentoGrid>
          {/* Row 1: Profile (2x1), Location (1x1), Status (1x1) */}
          <BentoCard size="2x1" delay={0}>
            <ProfileBlock />
          </BentoCard>

          <BentoCard size="1x1" delay={0.1} spotlightColor="rgba(45, 212, 191, 0.15)">
            <LocationBlock />
          </BentoCard>

          {/* Row 2: Status (1x1), Tech Stack (1x2), Experience (1x2) */}
          <BentoCard size="1x1" delay={0.15}>
            <StatusBlock />
          </BentoCard>

          <BentoCard size="1x2" delay={0.2} spotlightColor="rgba(45, 212, 191, 0.1)">
            <TechStack />
          </BentoCard>

          <BentoCard size="1x2" delay={0.25}>
            <ExperienceBlock />
          </BentoCard>

          {/* Row 3: Featured Projects */}
          <BentoCard size="2x1" delay={0.3}>
            <ProjectBlock
              title="Enterprise GenAI Platform"
              description="End-to-end generative AI solution for customer support automation, handling 10K+ queries daily with 95% resolution rate."
              tags={['LangChain', 'LLMs', 'Python', 'FastAPI', 'Vector DB']}
            />
          </BentoCard>

          <BentoCard size="1x1" delay={0.35} spotlightColor="rgba(124, 58, 237, 0.2)">
            <ConnectBlock />
          </BentoCard>
        </BentoGrid>
      </section>
    </main>
  );
}
