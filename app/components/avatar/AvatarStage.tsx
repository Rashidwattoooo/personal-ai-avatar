'use client';

import React from 'react';
import { ConversationState } from '@/app/types';
import { AvatarConversation } from './AvatarConversation';
import { CameraPreview } from '../camera/CameraPreview';
import { LoadingScreen } from '../ui/LoadingScreen';
import { ErrorState } from '../ui/ErrorState';
import { DefaultAgentIntro } from './DefaultAgentIntro';

interface AvatarStageProps {
  conversationState: ConversationState;
  conversationUrl: string | null;
  conversationId: string | null;
  errorMessage: string | null;
  missingConfig?: string[];
  isMicMuted: boolean;
  cameraStream?: MediaStream | null;
  cameraStatus?: import('@/app/types').CameraStatus;
  onToggleCamera?: () => void;
  onToggleMic?: () => void;
  onRequestCombinedPermissions?: () => void;
  onStateChange: (state: ConversationState) => void;
  onError: (error: string) => void;
  onLeave: () => void;
  onRetry: () => void;
  onReset: () => void;
}

export const AvatarStage: React.FC<AvatarStageProps> = ({
  conversationState,
  conversationUrl,
  conversationId,
  errorMessage,
  missingConfig,
  isMicMuted,
  cameraStream,
  cameraStatus,
  onToggleCamera,
  onToggleMic,
  onRequestCombinedPermissions,
  onStateChange,
  onError,
  onLeave,
  onRetry,
  onReset,
}) => {
  const isCallActive =
    conversationState === 'connecting' ||
    conversationState === 'connected' ||
    conversationState === 'speaking' ||
    conversationState === 'listening';

  return (
    <div
      className="relative w-full rounded-3xl border border-surface-border overflow-hidden bg-surface-subtle shadow-card-glow"
      style={{ minHeight: '520px', aspectRatio: '16/9', maxHeight: '640px' }}
    >
      {/* Background ambient orbs */}
      <div className="absolute inset-0 dot-grid-bg opacity-70 pointer-events-none" />
      <div className="orb orb-cyan   w-80 h-80 -top-20   -left-20 opacity-40"  />
      <div className="orb orb-violet w-72 h-72  bottom-0 -right-10 opacity-40" />

      {/* Top badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-cyan/25 bg-white/80 backdrop-blur-md text-xs font-semibold text-brand-cyan tracking-wide shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan pulse-cyan" />
          Agentix AI Assistant
        </div>
      </div>

      {/* Realtime label */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-surface-border text-[11px] font-semibold text-ink-muted tracking-widest uppercase pointer-events-none shadow-sm">
        Realtime CVI
      </div>

      {/* Tavus WebRTC stream */}
      {conversationUrl && isCallActive && (
        <div className="absolute inset-0">
          <AvatarConversation
            conversationUrl={conversationUrl}
            conversationId={conversationId || undefined}
            isMicMuted={isMicMuted}
            cameraStream={cameraStream}
            onStateChange={onStateChange}
            onError={onError}
            onLeave={onLeave}
          />
        </div>
      )}

      {/* Overlay states */}
      {(conversationState === 'initializing' || conversationState === 'connecting') && (
        <LoadingScreen onCancel={onReset} />
      )}
      {conversationState === 'error' && (
        <ErrorState
          title="Session Error"
          message={errorMessage || 'Unable to establish avatar connection.'}
          missingConfig={missingConfig}
          onRetry={onRetry}
          onReset={onReset}
        />
      )}

      {/* On-screen AI Avatar Agent with Default Introduction */}
      {!isCallActive && conversationState !== 'error' && conversationState !== 'initializing' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <DefaultAgentIntro
            onStartConversation={onRetry}
            isLoading={conversationState === 'initializing'}
          />
        </div>
      )}

      {/* Floating Unified Camera & Microphone Device Box */}
      <div className="absolute bottom-4 right-4 z-20">
        <CameraPreview
          stream={cameraStream}
          status={cameraStatus}
          isMicMuted={isMicMuted}
          onToggleCamera={onToggleCamera}
          onToggleMic={onToggleMic}
          onRequestCombinedPermissions={onRequestCombinedPermissions}
        />
      </div>
    </div>
  );
};
