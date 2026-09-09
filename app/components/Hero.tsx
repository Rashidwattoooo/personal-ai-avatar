'use client';

import React from 'react';
import { Mic, BookOpen, Eye, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

interface HeroProps {
  onStart: () => void;
  isLoading?: boolean;
  isConfigured?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onStart, isLoading = false }) => {
  return (
    <section className="relative w-full flex flex-col items-center text-center pt-12 pb-10 px-4 max-w-5xl mx-auto fade-up">

      {/* Top eyebrow pill */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs sm:text-sm font-semibold tracking-wide mb-8">
        <span className="w-2 h-2 rounded-full bg-brand-cyan pulse-cyan" />
        Realtime CVI &nbsp;·&nbsp; RAG Grounded &nbsp;·&nbsp; Multimodal AI
      </div>

      {/* Main headline — massive Montserrat font matching Agentix style */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6">
        Your Personal <br />
        <span className="gradient-text text-glow-cyan">
          AI Avatar
        </span>
        <br />
        <span className="text-3xl sm:text-5xl md:text-6xl font-bold text-white/70">
          Is&nbsp;Ready&nbsp;to&nbsp;Talk
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-xl text-[#8892a4] max-w-2xl mb-10 leading-relaxed font-normal">
        A photorealistic digital human that listens, speaks, and thinks — powered by enterprise RAG knowledge and live camera vision. No scripts. Pure intelligence.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
        <Button
          variant="neon"
          size="lg"
          onClick={onStart}
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="w-full sm:w-auto uppercase tracking-wider text-sm px-10 py-4"
        >
          Start Conversation
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full sm:w-auto uppercase tracking-wider text-sm"
        >
          See Capabilities
        </Button>
      </div>

      {/* 3 feature pills row */}
      <div id="features" className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {[
          {
            icon: <Mic className="w-5 h-5 text-brand-cyan" />,
            title: 'Voice Interaction',
            desc: 'Ultra-low latency (<800ms) two-way spoken dialogue with neural TTS',
            border: 'hover:border-brand-cyan/50',
            glow: 'hover:shadow-neon-cyan',
          },
          {
            icon: <BookOpen className="w-5 h-5 text-brand-violet" />,
            title: 'RAG Knowledge',
            desc: 'Answers grounded in your private documents via Tavus Knowledge Base',
            border: 'hover:border-brand-violet/50',
            glow: 'hover:shadow-neon-violet',
          },
          {
            icon: <Eye className="w-5 h-5 text-brand-cyan" />,
            title: 'Visual Understanding',
            desc: 'Live camera perception, facial cues, and multimodal context awareness',
            border: 'hover:border-brand-cyan/50',
            glow: 'hover:shadow-neon-cyan',
          },
        ].map((f) => (
          <div
            key={f.title}
            className={`relative card-glow p-5 rounded-2xl transition-all duration-300 ${f.border} ${f.glow} text-left group cursor-default`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0c0c18] border border-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            <div className="text-sm font-bold text-white mb-1">{f.title}</div>
            <div className="text-xs text-[#8892a4] leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
