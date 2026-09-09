'use client';

import React from 'react';
import {
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Cpu,
  Zap,
} from 'lucide-react';
import { Button } from './ui/Button';
import { ConversationState, ConfigStatusResponse } from '@/app/types';

interface DemoControlsProps {
  conversationState: ConversationState;
  isMicMuted: boolean;
  onToggleMic: () => void;
  onStartCall: () => void;
  onEndCall: () => void;
  configStatus: ConfigStatusResponse | null;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  conversationState,
  isMicMuted,
  onToggleMic,
  onStartCall,
  onEndCall,
  configStatus,
}) => {
  const isCallActive =
    conversationState === 'connecting' ||
    conversationState === 'connected' ||
    conversationState === 'speaking' ||
    conversationState === 'listening';

  const isLoading =
    conversationState === 'initializing' || conversationState === 'requesting-permissions';

  return (
    <div className="w-full space-y-4">
      {/* Session Controls bar */}
      <div className="card-glow rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white tracking-tight">Session Controls</div>
          <div className="text-[11px] text-[#8892a4] mt-0.5">
            {isCallActive ? 'Live conversation in progress' : 'Avatar ready to connect'}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isCallActive ? (
            <>
              <Button
                variant={isMicMuted ? 'danger' : 'outline'}
                size="md"
                onClick={onToggleMic}
                leftIcon={isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              >
                {isMicMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={onEndCall}
                leftIcon={<PhoneOff className="w-4 h-4" />}
              >
                End Call
              </Button>
            </>
          ) : (
            <Button
              variant="neon"
              size="md"
              onClick={onStartCall}
              isLoading={isLoading}
              leftIcon={<PhoneCall className="w-4 h-4" />}
              className="uppercase tracking-wider"
            >
              Start Conversation
            </Button>
          )}
        </div>
      </div>

      {/* Two-column panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Capabilities */}
        <div className="card-glow rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-brand-cyan" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-white">Capabilities</span>
          </div>
          <ul className="space-y-3">
            {[
              { label: 'Listen (Voice Input)',          color: 'text-brand-cyan',   status: 'Active' },
              { label: 'Speak (Neural TTS)',             color: 'text-brand-cyan',   status: 'Active' },
              { label: 'Knowledge Base (RAG)',           color: 'text-brand-violet', status: configStatus?.hasDocumentIds ? `${configStatus.documentCount} Doc(s)` : 'Enabled' },
              { label: 'Camera Vision (Preview & Cues)', color: 'text-brand-cyan',   status: 'Ready'  },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#8892a4]">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.color}`} />
                  {item.label}
                </span>
                <span className={`font-semibold font-mono text-[11px] ${item.color}`}>{item.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Config Diagnostics */}
        <div className="card-glow rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-violet" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white">Diagnostics</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border ${
              configStatus?.isConfigured
                ? 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/5'
                : 'text-amber-400 border-amber-500/30 bg-amber-500/5'
            }`}>
              {configStatus?.isConfigured ? 'Ready' : 'Setup Needed'}
            </span>
          </div>
          <ul className="space-y-2.5 text-xs">
            {[
              { label: 'Frontend & WebRTC',   ok: true                              },
              { label: 'Tavus API Key',        ok: configStatus?.hasApiKey           },
              { label: 'Persona / PAL ID',     ok: configStatus?.hasPersonaId        },
              { label: 'Replica (Avatar)',      ok: configStatus?.hasReplicaId        },
              { label: 'RAG Knowledge Docs',   ok: configStatus?.hasDocumentIds, optional: true },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between">
                <span className="text-[#8892a4]">{item.label}</span>
                {item.ok ? (
                  <span className="flex items-center gap-1 text-brand-cyan font-semibold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> OK
                  </span>
                ) : item.optional ? (
                  <span className="text-[#8892a4] font-mono">Optional</span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                    <AlertCircle className="w-3.5 h-3.5" /> .env.local
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
