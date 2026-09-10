'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, MessageSquare, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface DefaultAgentIntroProps {
  onStartConversation: () => void;
  isLoading?: boolean;
}

const INTRO_TEXT =
  "Hi, I'm Aria, your AI assistant from Agentix System. We build custom AI automation agents for sales, support, and operations that keep your business running twenty-four seven. We also partner with Sham Marianas, a Dubai based creative agency for advertising, branding, and design. Ask me anything about our AI agents, integrations, or creative services.";

const INTRO_VIDEO_SRC = '/videos/avatar-intro.mp4';

export const DefaultAgentIntro: React.FC<DefaultAgentIntroProps> = ({
  onStartConversation,
  isLoading = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const typewriterTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasPlayedRef = useRef(false);

  const runTypewriter = () => {
    let index = 0;
    setDisplayedText('');
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    typewriterTimerRef.current = setInterval(() => {
      index++;
      if (index <= INTRO_TEXT.length) {
        setDisplayedText(INTRO_TEXT.slice(0, index));
      } else if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
    }, 24);
  };

  // Play the avatar video with sound. Browsers may block autoplay-with-audio until
  // a user gesture — if so, fall back to muted playback and surface an unmute prompt.
  const playIntroVideo = async (fromStart = true) => {
    const video = videoRef.current;
    if (!video) return;
    if (fromStart) video.currentTime = 0;

    video.muted = false;
    try {
      await video.play();
      setIsMuted(false);
      setNeedsUnmute(false);
    } catch {
      // Autoplay with sound blocked — play muted and ask the user to unmute.
      try {
        video.muted = true;
        await video.play();
        setIsMuted(true);
        setNeedsUnmute(true);
      } catch {
        /* nothing more we can do until a user gesture */
      }
    }
  };

  // Play the intro when the section is in view; pause the video when it scrolls
  // out of view, and resume when it comes back.
  useEffect(() => {
    const node = sectionRef.current;

    const start = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      runTypewriter();
      void playIntroVideo(true);
    };

    if (!node || typeof IntersectionObserver === 'undefined') {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasPlayedRef.current) {
            start();
          } else {
            // Coming back into view — resume if it hadn't finished.
            const video = videoRef.current;
            if (video && video.paused && !video.ended) video.play().catch(() => {});
          }
        } else {
          // Scrolled out of view — stop the video.
          const video = videoRef.current;
          if (video && !video.paused) video.pause();
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    };
  }, []);

  const replayIntro = () => {
    runTypewriter();
    void playIntroVideo(true);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
      setNeedsUnmute(false);
      // If it was paused/ended, restart so the user actually hears it.
      if (video.paused || video.ended) void playIntroVideo(true);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-full flex flex-col md:flex-row items-center justify-center p-6 sm:p-10 gap-8 animate-fade-in"
    >
      {/* Left: Real AI Avatar Video Character */}
      <div className="relative flex flex-col items-center shrink-0">
        {/* Glowing concentric orbital rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-[22rem] md:h-[22rem] rounded-full border border-brand-cyan/20 animate-[spin_24s_linear_infinite]" />
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full border border-brand-violet/30 animate-[spin_16s_linear_infinite_reverse]" />
          {isSpeaking && (
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border-2 border-brand-cyan/40 animate-ping opacity-60" />
          )}

          {/* Avatar Video Frame */}
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-3xl overflow-hidden border-2 border-brand-cyan/50 shadow-neon-cyan p-1 bg-gradient-to-tr from-brand-cyan/30 via-brand-violet/30 to-brand-cyan/30 group">
            <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-950">
              <video
                ref={videoRef}
                src={INTRO_VIDEO_SRC}
                playsInline
                preload="auto"
                onPlaying={() => setIsSpeaking(true)}
                onPause={() => setIsSpeaking(false)}
                onEnded={() => setIsSpeaking(false)}
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle ambient scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/60 via-transparent to-transparent pointer-events-none" />

              {/* Tap-to-hear overlay if autoplay-with-sound was blocked */}
              {needsUnmute && (
                <button
                  onClick={toggleMute}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 backdrop-blur-[2px] text-white transition-opacity hover:bg-black/55"
                  title="Tap to hear the avatar"
                >
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-cyan/90 shadow-neon-cyan">
                    <Volume2 className="w-5 h-5 text-[#0f0f0f]" />
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide">Tap to hear</span>
                </button>
              )}
            </div>

            {/* Speaking Status Pill */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-brand-cyan/40 text-[10px] font-bold text-brand-cyan shadow-sm whitespace-nowrap">
              <span className={`w-1.5 h-1.5 rounded-full bg-brand-cyan ${isSpeaking ? 'pulse-cyan' : ''}`} />
              <span>{isSpeaking ? 'Speaking' : 'Agent Ready'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Voice Waveform indicator under portrait */}
        <div className="flex items-center gap-1 h-5 mt-4 px-3 py-1 rounded-full bg-white border border-surface-border shadow-sm">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-gradient-to-t from-brand-cyan to-brand-violet transition-all duration-200 ${
                isSpeaking && !isMuted ? `wave${(i % 4) + 1}` : 'h-1.5 opacity-40'
              }`}
              style={{ height: isSpeaking && !isMuted ? undefined : '6px' }}
            />
          ))}
          <span className="text-[10px] font-mono text-ink-muted ml-1.5">
            {isSpeaking && !isMuted ? 'AUDIO ON' : 'AI VOICE'}
          </span>
        </div>
      </div>

      {/* Right: Dialogue Box & Action Controls */}
      <div className="flex-1 max-w-lg flex flex-col items-center md:items-start text-center md:text-left z-10">
        {/* Agent Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Aria · Agentix Assistant</span>
        </div>

        {/* Intro Dialogue Bubble */}
        <div className="relative p-4 sm:p-5 rounded-2xl bg-white border border-surface-border shadow-card-glow text-left mb-4 w-full">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-surface-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <MessageSquare className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Introduction</span>
            </div>

            {/* Audio Control Button */}
            <div className="flex items-center gap-2">
              {isSpeaking && !isMuted ? (
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[10px] font-semibold text-rose-600 transition-colors"
                  title="Mute Voice"
                >
                  <VolumeX className="w-3 h-3" />
                  Mute
                </button>
              ) : (
                <button
                  onClick={isMuted ? toggleMute : replayIntro}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 text-[10px] font-semibold text-brand-cyan transition-colors"
                  title="Play Avatar Voice"
                >
                  <Volume2 className="w-3 h-3" />
                  {isMuted ? 'Unmute' : 'Play Voice'}
                </button>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ink leading-relaxed font-normal min-h-[58px]">
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

          <Button
            variant="outline"
            size="md"
            onClick={replayIntro}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Replay Intro
          </Button>
        </div>
      </div>
    </div>
  );
};
