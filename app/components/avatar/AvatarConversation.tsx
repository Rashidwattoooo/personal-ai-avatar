'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { ConversationState, MicrophoneStatus } from '@/app/types';

interface AvatarConversationProps {
  conversationUrl: string;
  conversationId?: string;
  isMicMuted?: boolean;
  onStateChange: (state: ConversationState) => void;
  onError: (error: string) => void;
  onLeave: () => void;
}

export const AvatarConversation: React.FC<AvatarConversationProps> = ({
  conversationUrl,
  conversationId,
  isMicMuted = false,
  onStateChange,
  onError,
  onLeave,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const callFrameRef = useRef<DailyCall | null>(null);
  const isMicMutedRef = useRef(isMicMuted);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  // Sync mic mute state to Daily call
  useEffect(() => {
    if (callFrameRef.current) {
      try {
        callFrameRef.current.setLocalAudio(!isMicMuted);
      } catch (err) {
        console.warn('Failed to update local audio track:', err);
      }
    }
  }, [isMicMuted]);

  useEffect(() => {
    let callInstance: DailyCall | null = null;
    let isMounted = true;

    async function initCall() {
      if (!containerRef.current || !conversationUrl) return;

      try {
        onStateChange('connecting');

        // Create Daily iframe inside the container
        callInstance = DailyIframe.createFrame(containerRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '1.25rem',
            backgroundColor: '#020617',
          },
          showLeaveButton: false,
          showFullscreenButton: true,
          showUserNameChangeUI: false,
        });

        callFrameRef.current = callInstance;

        // Daily event handlers
        callInstance
          .on('joining-meeting', () => {
            if (isMounted) onStateChange('connecting');
          })
          .on('joined-meeting', () => {
            if (isMounted) {
              onStateChange('connected');
              // Ensure mic state is respected upon joining
              callInstance?.setLocalAudio(!isMicMutedRef.current);
            }
          })
          .on('active-speaker-change', (evt) => {
            if (!isMounted || !evt) return;
            const peerId = evt.activeSpeaker?.peerId;
            if (peerId) {
              const participants = callInstance?.participants();
              const activePerson = participants ? participants[peerId] : null;
              if (activePerson && !activePerson.local) {
                onStateChange('speaking');
              } else if (activePerson && activePerson.local) {
                onStateChange('listening');
              }
            } else {
              onStateChange('connected');
            }
          })
          .on('participant-updated', (evt) => {
            if (!isMounted || !evt) return;
            const participant = evt.participant as (typeof evt.participant & { speaking?: boolean });
            if (participant && !participant.local && participant.speaking) {
              onStateChange('speaking');
            }
          })
          .on('error', (err) => {
            console.error('Daily WebRTC error:', err);
            if (isMounted) {
              onError(err?.errorMsg || 'A WebRTC media streaming error occurred.');
            }
          })
          .on('left-meeting', () => {
            if (isMounted) {
              onStateChange('ended');
              onLeave();
            }
          });

        // Join the Tavus conversation room
        await callInstance.join({
          url: conversationUrl,
          audioSource: true,
          videoSource: false, // User video can be passed via camera or kept in local vision preview
        });
      } catch (error: unknown) {
        console.warn('Daily frame creation encountered an issue, trying direct embed fallback:', error);
        if (isMounted) {
          setUseIframeFallback(true);
          onStateChange('connected');
        }
      }
    }

    initCall();

    return () => {
      isMounted = false;
      if (callInstance) {
        try {
          callInstance.destroy();
        } catch (e) {
          console.warn('Error destroying Daily call frame:', e);
        }
        callFrameRef.current = null;
      }
    };
  }, [conversationUrl, onError, onLeave, onStateChange]);

  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl bg-slate-950">
      {useIframeFallback ? (
        <iframe
          src={conversationUrl}
          allow="camera; microphone; autoplay; display-capture; fullscreen"
          className="w-full h-full border-0 rounded-2xl md:rounded-3xl bg-slate-950"
          title="Tavus AI Avatar Session"
        />
      ) : (
        <div ref={containerRef} className="w-full h-full relative" />
      )}
    </div>
  );
};
