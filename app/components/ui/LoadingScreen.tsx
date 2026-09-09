import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  title?: string;
  message?: string;
  onCancel?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = 'Initializing Avatar Session',
  message = 'Securing realtime WebRTC channel and activating neural voice pipeline...',
  onCancel,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 rounded-3xl overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050508]/90 backdrop-blur-2xl" />

      {/* Ambient orbs */}
      <div className="orb orb-cyan  w-64 h-64 top-0   left-1/4  opacity-50 animate-[float_8s_ease-in-out_infinite]" />
      <div className="orb orb-violet w-48 h-48 bottom-8 right-1/4 opacity-40 animate-[float_10s_ease-in-out_infinite_2s]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Pulsing Logo Rings */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-32 h-32 rounded-full border border-brand-cyan/20 animate-[spin_8s_linear_infinite]" />
          <div className="absolute w-24 h-24 rounded-full border border-brand-violet/30 animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute w-20 h-20 rounded-full bg-brand-cyan/5 animate-pulse-slow" />
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-cyan/80 to-brand-violet/80 flex items-center justify-center shadow-neon-cyan border border-white/10">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="10" r="5" fill="white" fillOpacity="0.9"/>
              <path d="M4 24c0-5.52 4.48-10 10-10s10 4.48 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
            </svg>
          </div>
        </div>

        {/* Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan pulse-cyan" />
          Tavus CVI · Live Session
        </div>

        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-[#8892a4] max-w-xs mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
          <span className="text-xs text-[#8892a4]">Negotiating peer stream...</span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="ml-2 text-xs text-[#8892a4] hover:text-white underline underline-offset-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
