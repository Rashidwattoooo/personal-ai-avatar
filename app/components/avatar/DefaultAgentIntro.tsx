'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Sparkles, MessageSquare, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface DefaultAgentIntroProps {
  onStartConversation: () => void;
  isLoading?: boolean;
}

const INTRO_TEXT =
  "Hello! I am your Personal AI Avatar Assistant. I am equipped with real-time conversational voice, enterprise RAG knowledge retrieval, and camera vision. Ask me anything, explore our capabilities, or let me assist with your workflow.";

export const DefaultAgentIntro: React.FC<DefaultAgentIntroProps> = ({
  onStartConversation,
  isLoading = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPlayedVoice, setHasPlayedVoice] = useState(false);
  const [speechBlocked, setSpeechBlocked] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Typewriter effect for intro dialogue
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      index++;
      if (index <= INTRO_TEXT.length) {
        setDisplayedText(INTRO_TEXT.slice(0, index));
      } else {
        clearInterval(timer);
      }
    }, 24);

    return () => clearInterval(timer);
  }, []);

  // Voice speech synthesis function
  const speakIntro = (forcePlay: boolean = false) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(INTRO_TEXT);
    utterance.rate = 1.02;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setHasPlayedVoice(true);
      setSpeechBlocked(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or autoplay blocked:', e);
      setIsSpeaking(false);
      setSpeechBlocked(true);
    };

    utteranceRef.current = utterance;

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeechBlocked(true);
    }
  };

  // Attempt voice intro on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakIntro();
    }, 600);

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopVoice = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center p-6 sm:p-10 gap-8 animate-fade-in">
      {/* Left: Animated AI Avatar Character */}
      <div className="relative flex flex-col items-center shrink-0">
        {/* Glowing concentric orbital rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-brand-cyan/20 animate-[spin_24s_linear_infinite]" />
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-brand-violet/30 animate-[spin_16s_linear_infinite_reverse]" />
          {isSpeaking && (
            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-brand-cyan/40 animate-ping opacity-60" />
          )}

          {/* Avatar Portrait Frame */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-brand-cyan/50 shadow-neon-cyan p-1 bg-gradient-to-tr from-brand-cyan/30 via-brand-violet/30 to-brand-cyan/30 group">
            <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-950">
              <Image
                src="/images/avatar-agent.jpg"
                alt="AI Avatar Persona"
                fill
                priority
                className="object-cover object-top scale-105 transition-transform duration-700 group-hover:scale-110"
              />
              {/* Subtle ambient scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Speaking Status Pill */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-brand-cyan/40 text-[10px] font-bold text-brand-cyan shadow-sm whitespace-nowrap">
              <span className={`w-1.5 h-1.5 rounded-full bg-brand-cyan ${isSpeaking ? 'pulse-cyan' : ''}`} />
              <span>{isSpeaking ? 'Speaking' : 'Agent Ready'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Voice Waveform indicator under portrait */}
        <div className="flex items-center gap-1 h-5 mt-4 px-3 py-1 rounded-full bg-black/50 border border-white/10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-gradient-to-t from-brand-cyan to-brand-violet transition-all duration-200 ${
                isSpeaking ? `wave${(i % 4) + 1}` : 'h-1.5 opacity-40'
              }`}
              style={{ height: isSpeaking ? undefined : '6px' }}
            />
          ))}
          <span className="text-[10px] font-mono text-[#8892a4] ml-1.5">
            {isSpeaking ? 'AUDIO ON' : 'AI VOICE'}
          </span>
        </div>
      </div>

      {/* Right: Dialogue Box & Action Controls */}
      <div className="flex-1 max-w-lg flex flex-col items-center md:items-start text-center md:text-left z-10">
        {/* Agent Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Aria · Personal AI Assistant</span>
        </div>

        {/* Intro Dialogue Bubble */}
        <div className="relative p-4 sm:p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/10 backdrop-blur-xl shadow-card-glow text-left mb-4 w-full">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <MessageSquare className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Introduction</span>
            </div>

            {/* Audio Voice Control Buttons */}
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <button
                  onClick={stopVoice}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[10px] font-semibold text-rose-300 transition-colors"
                  title="Pause Voice"
                >
                  <VolumeX className="w-3 h-3" />
                  Mute
                </button>
              ) : (
                <button
                  onClick={() => speakIntro(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 text-[10px] font-semibold text-brand-cyan transition-colors"
                  title="Replay Spoken Intro"
                >
                  <Volume2 className="w-3 h-3" />
                  {hasPlayedVoice ? 'Replay' : 'Play Voice'}
                </button>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal min-h-[58px]">
            {displayedText}
            {displayedText.length < INTRO_TEXT.length && (
              <span className="inline-block w-1.5 h-3.5 bg-brand-cyan ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Quick Start Conversation CTA */}
        <div className="flex flex-wrap items-center gap-3 w-full justify-center md:justify-start">
          <Button
            variant="neon"
            size="md"
            onClick={onStartConversation}
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="uppercase tracking-wider shadow-neon-cyan"
          >
            Start Live Conversation
          </Button>

          {!isSpeaking && (
            <Button
              variant="outline"
              size="md"
              onClick={() => speakIntro(true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Replay Intro
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
