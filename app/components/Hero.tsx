'use client';

import React from 'react';
import { Bot, Palette, Sparkles, ArrowRight } from 'lucide-react';
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
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/8 text-brand-cyan text-xs sm:text-sm font-semibold tracking-wide mb-8">
        <span className="w-2 h-2 rounded-full bg-brand-cyan pulse-cyan" />
        Now supporting end-to-end automation
      </div>

      {/* Main headline — Agentix style */}
      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-ink leading-[1.08] tracking-tight mb-6">
        Turn your business <br />
        processes into <br />
        <span className="gradient-text">
          intelligent systems.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-xl text-ink-muted max-w-2xl mb-10 leading-relaxed font-normal">
        Meet the Agentix System AI avatar — a photorealistic digital assistant that talks you through our AI automation agents and Sham Marianas creative services in real time, with voice and grounded knowledge.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
        <Button
          variant="neon"
          size="lg"
          onClick={onStart}
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="w-full sm:w-auto tracking-wide text-sm px-10 py-4"
        >
          Start Conversation
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full sm:w-auto tracking-wide text-sm"
        >
          See Capabilities
        </Button>
      </div>

      {/* 3 feature cards row */}
      <div id="features" className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {[
          {
            icon: <Bot className="w-5 h-5 text-brand-cyan" />,
            title: 'AI Automation',
            desc: 'Agentix System builds AI agents for sales, support & operations that run 24/7 with minimal human input.',
            border: 'hover:border-brand-cyan/50',
          },
          {
            icon: <Palette className="w-5 h-5 text-brand-blue" />,
            title: 'Creative & Branding',
            desc: 'Sham Marianas delivers advertising, design, and brand campaigns that scale your business.',
            border: 'hover:border-brand-blue/50',
          },
          {
            icon: <Sparkles className="w-5 h-5 text-brand-purple" />,
            title: 'Real-Time AI Avatar',
            desc: 'A digital human with live voice and RAG knowledge about both companies and their services.',
            border: 'hover:border-brand-purple/50',
          },
        ].map((f) => (
          <div
            key={f.title}
            className={`relative card-glow p-5 rounded-2xl transition-all duration-300 ${f.border} hover:shadow-neon-cyan text-left group cursor-default`}
          >
            <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            <div className="text-sm font-bold text-ink mb-1">{f.title}</div>
            <div className="text-xs text-ink-muted leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
