import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Abhishek Singh | AI Engineer & Generative AI Specialist',
  description: 'Full-Stack AI Engineer specialized in scalable GenAI solutions, intelligent automation, and enterprise AI governance. 7+ years building production-grade AI systems.',
  keywords: ['AI Engineer', 'Generative AI', 'Machine Learning', 'Python', 'LLM', 'Deep Learning'],
  authors: [{ name: 'Abhishek Singh' }],
  openGraph: {
    title: 'Abhishek Singh | AI Engineer',
    description: 'Building the future with Generative AI & intelligent automation.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Abhishek Singh - AI Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhishek Singh | AI Engineer',
    description: 'Building the future with Generative AI & intelligent automation.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
