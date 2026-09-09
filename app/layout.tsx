import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personal AI Avatar | Real-Time Conversational Intelligence',
  description:
    'Meet your Personal AI Avatar — a photorealistic digital human powered by real-time voice, RAG knowledge retrieval, and multimodal camera vision.',
  keywords: ['AI Avatar', 'Conversational AI', 'Digital Human', 'RAG', 'Tavus CVI', 'AI Assistant'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050508] text-[#f0f4ff] antialiased overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
