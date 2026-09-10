'use client';

import React from 'react';
import {
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
} from 'lucide-react';
import { Button } from './ui/Button';
import { ConversationState } from '@/app/types';

interface DemoControlsProps {
  conversationState: ConversationState;
  isMicMuted: boolean;
  onToggleMic: () => void;
  onStartCall: () => void;
  onEndCall: () => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  conversationState,
  isMicMuted,
  onToggleMic,
  onStartCall,
  onEndCall,
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
          <div className="text-sm font-bold text-ink tracking-tight">Session Controls</div>
          <div className="text-[11px] text-ink-muted mt-0.5">
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
    </div>
  );
};
