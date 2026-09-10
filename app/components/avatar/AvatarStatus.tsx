import React from 'react';
import { Mic, MicOff, BookOpen } from 'lucide-react';
import { ConversationState, MicrophoneStatus } from '@/app/types';
import { StatusBadge } from '../ui/StatusBadge';

interface AvatarStatusProps {
  conversationState: ConversationState;
  micStatus: MicrophoneStatus;
  hasRagKnowledge?: boolean;
}

export const AvatarStatus: React.FC<AvatarStatusProps> = ({
  conversationState,
  micStatus,
  hasRagKnowledge = true,
}) => {
  const getBadge = (): React.ComponentProps<typeof StatusBadge>['status'] => {
    if (conversationState === 'connected')  return 'connected';
    if (conversationState === 'speaking')   return 'speaking';
    if (conversationState === 'listening')  return 'listening';
    if (conversationState === 'connecting' || conversationState === 'initializing') return 'connecting';
    return 'online';
  };

  const isSpeaking  = conversationState === 'speaking';
  const isListening = conversationState === 'listening';

  return (
    <div className="card-glow rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
      {/* Left: Avatar Identity */}
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-violet flex items-center justify-center shadow-neon-cyan">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="3.5" fill="white" fillOpacity="0.95"/>
            <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
          </svg>
          {/* Speaking indicator dot */}
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-violet opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-violet border-2 border-white" />
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-ink tracking-tight">Personal AI Assistant</span>
            <StatusBadge status={getBadge()} size="sm" />
          </div>
          <p className="text-[11px] text-ink-muted">
            {isSpeaking  ? 'Generating real-time response...' :
             isListening ? 'Listening to your voice...' :
             'Realtime CVI session active'}
          </p>
        </div>
      </div>

      {/* Right: Controls / Indicators */}
      <div className="flex items-center gap-3">
        {/* Waveform bars */}
        {(isSpeaking || isListening) && (
          <div className="hidden sm:flex items-end gap-[3px] h-6 px-3 py-1 rounded-lg bg-brand-cyan/5 border border-brand-cyan/20">
            {[1,2,3,4,5].map((i) => (
              <div
                key={i}
                className={`w-[3px] rounded-full bg-gradient-to-t from-brand-cyan to-brand-violet wave${Math.min(i,4)}`}
                style={{ height: isSpeaking ? `${[14,20,16,22,12][i-1]}px` : `${[8,12,6,10,7][i-1]}px` }}
              />
            ))}
          </div>
        )}

        {/* Mic status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
          micStatus === 'muted'
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
            : 'bg-brand-cyan/5 border-brand-cyan/20 text-brand-cyan'
        }`}>
          {micStatus === 'muted'
            ? <><MicOff className="w-3.5 h-3.5" /> Muted</>
            : <><Mic className="w-3.5 h-3.5" /> Mic Active</>
          }
        </div>

        {/* RAG badge */}
        {hasRagKnowledge && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-violet/10 border border-brand-violet/30 text-brand-violet text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-brand-violet" />
            RAG On
          </div>
        )}
      </div>
    </div>
  );
};
