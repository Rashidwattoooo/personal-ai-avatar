import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agentix System | AI Automation Agent',
  description:
    'Meet the Agentix System AI avatar — a photorealistic digital human that explains our AI automation and Sham Marianas creative services, powered by real-time voice and RAG knowledge.',
  keywords: ['Agentix System', 'AI Automation', 'AI Agents', 'Sham Marianas', 'Conversational AI', 'Digital Human', 'RAG'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink antialiased overflow-x-hidden selection:bg-brand-cyan/20 selection:text-brand-cyan">
        {children}
      </body>
    </html>
  );
}
