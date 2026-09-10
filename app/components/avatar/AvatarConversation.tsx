'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import DailyIframe, { DailyCall, DailyEventObjectTrack } from '@daily-co/daily-js';
import { ConversationState } from '@/app/types';

interface AvatarConversationProps {
  conversationUrl: string;
  conversationId?: string;
  isMicMuted?: boolean;
  cameraStream?: MediaStream | null;
  onStateChange: (state: ConversationState) => void;
  onError: (error: string) => void;
  onLeave: () => void;
}

export const AvatarConversation: React.FC<AvatarConversationProps> = ({
  conversationUrl,
  conversationId,
  isMicMuted = false,
  cameraStream = null,
  onStateChange,
  onError,
  onLeave,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callObjectRef = useRef<DailyCall | null>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  // Keep the latest callbacks/state in refs so the join effect can depend ONLY on
  // conversationUrl. Otherwise a parent re-render (which happens on every state
  // change during a call) would recreate these functions, re-run the effect, and
  // tear down + rebuild the live WebRTC connection — causing the "blinking" and
  // the conversation being ended mid-join.
  const onStateChangeRef = useRef(onStateChange);
  const onErrorRef = useRef(onError);
  const onLeaveRef = useRef(onLeave);
  const isMicMutedRef = useRef(isMicMuted);
  const cameraStreamRef = useRef(cameraStream);

  useEffect(() => { onStateChangeRef.current = onStateChange; }, [onStateChange]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { onLeaveRef.current = onLeave; }, [onLeave]);
  useEffect(() => { isMicMutedRef.current = isMicMuted; }, [isMicMuted]);
  useEffect(() => { cameraStreamRef.current = cameraStream; }, [cameraStream]);

  // Acquire the mic ourselves and hand the real track to Daily AFTER the room is
  // joined. This guarantees the mic is published (so the avatar can hear the user)
  // without Daily's own acquisition blocking the room join.
  const enableMicrophone = useCallback(async (call: DailyCall) => {
    if (isMicMutedRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const track = stream.getAudioTracks()[0];
      if (!track) return;
      await call.setInputDevicesAsync({ audioSource: track });
      call.setLocalAudio(true);
    } catch (err) {
      console.warn('Could not enable microphone for the conversation:', err);
    }
  }, []);

  // Publish the user's camera to the room so Tavus's perception layer can SEE the
  // visitor (gestures, objects, etc.). Runs after join and whenever the camera
  // stream changes; if none was captured, acquire one directly.
  const enableCamera = useCallback(async (call: DailyCall, stream: MediaStream | null) => {
    try {
      let track = stream?.getVideoTracks?.()[0] ?? null;
      if (!track) {
        const fresh = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        track = fresh.getVideoTracks()[0] ?? null;
      }
      if (!track) return;
      await call.setInputDevicesAsync({ videoSource: track });
      call.setLocalVideo(true);
    } catch (err) {
      console.warn('Could not publish camera for the conversation:', err);
    }
  }, []);

  // Sync mic mute state to the live Daily call
  useEffect(() => {
    const call = callObjectRef.current;
    if (!call) return;
    try {
      if (isMicMuted) {
        call.setLocalAudio(false);
      } else if (!call.localAudio()) {
        // Unmuting but no mic track yet — acquire and publish it now.
        void enableMicrophone(call);
      } else {
        call.setLocalAudio(true);
      }
    } catch (err) {
      console.warn('Failed to update local audio track:', err);
    }
  }, [isMicMuted, enableMicrophone]);

  const attachTrack = useCallback((evt: DailyEventObjectTrack) => {
    if (!evt?.participant || evt.participant.local) return; // only the remote avatar's media
    const track = evt.track;
    if (!track) return;

    if (track.kind === 'video' && videoRef.current) {
      videoRef.current.srcObject = new MediaStream([track]);
    }
    if (track.kind === 'audio' && audioRef.current) {
      audioRef.current.srcObject = new MediaStream([track]);
      audioRef.current.play?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!conversationUrl) return;

    let isTearingDown = false;

    // Daily only allows ONE call object at a time. Destroy any leftover instance
    // (e.g. from a StrictMode re-mount or a previous session) before creating a new one.
    const existing = DailyIframe.getCallInstance();
    if (existing) {
      try { existing.destroy(); } catch { /* ignore */ }
    }

    let callInstance: DailyCall;
    try {
      callInstance = DailyIframe.createCallObject();
    } catch (error) {
      console.warn('Daily call object creation failed, using iframe fallback:', error);
      setUseIframeFallback(true);
      onStateChangeRef.current('connected');
      return;
    }

    callObjectRef.current = callInstance;

    callInstance
      .on('joining-meeting', () => {
        if (!isTearingDown) onStateChangeRef.current('connecting');
      })
      .on('joined-meeting', () => {
        if (isTearingDown) return;
        onStateChangeRef.current('connected');
        // Enable the mic AFTER joining so room negotiation is never blocked on
        // mic acquisition (blocking on it here is what made the join hang).
        void enableMicrophone(callInstance);
        // Publish the camera so Tavus's perception layer can see the visitor.
        void enableCamera(callInstance, cameraStreamRef.current);
        // Attach any avatar tracks already present at join time
        const participants = callInstance.participants();
        Object.values(participants).forEach((p) => {
          if (p.local) return;
          const v = p.tracks?.video?.persistentTrack;
          const a = p.tracks?.audio?.persistentTrack;
          if (v && videoRef.current) videoRef.current.srcObject = new MediaStream([v]);
          if (a && audioRef.current) {
            audioRef.current.srcObject = new MediaStream([a]);
            audioRef.current.play?.().catch(() => {});
          }
        });
      })
      .on('participant-joined', (evt) => {
        // Defensive: the moment the avatar (remote) joins, we're live.
        if (!isTearingDown && evt && !evt.participant?.local) {
          onStateChangeRef.current('connected');
        }
      })
      .on('track-started', (evt) => {
        if (isTearingDown || !evt) return;
        if (!evt.participant?.local) onStateChangeRef.current('connected');
        attachTrack(evt);
      })
      .on('active-speaker-change', (evt) => {
        if (isTearingDown || !evt) return;
        const peerId = evt.activeSpeaker?.peerId;
        if (peerId) {
          const participants = callInstance.participants();
          const activePerson = participants ? participants[peerId] : null;
          if (activePerson && !activePerson.local) {
            onStateChangeRef.current('speaking');
          } else if (activePerson && activePerson.local) {
            onStateChangeRef.current('listening');
          }
        } else {
          onStateChangeRef.current('connected');
        }
      })
      .on('participant-updated', (evt) => {
        if (isTearingDown || !evt) return;
        const participant = evt.participant as (typeof evt.participant & { speaking?: boolean });
        if (participant && !participant.local && participant.speaking) {
          onStateChangeRef.current('speaking');
        }
      })
      .on('error', (err) => {
        console.error('Daily WebRTC error:', err);
        if (!isTearingDown) {
          onErrorRef.current(err?.errorMsg || 'A WebRTC media streaming error occurred.');
        }
      })
      .on('left-meeting', () => {
        // Only treat this as a real user-initiated leave — not the cleanup destroy
        // that React runs on unmount (which would wrongly end the conversation).
        if (!isTearingDown) {
          onStateChangeRef.current('ended');
          onLeaveRef.current();
        }
      });

    callInstance
      .join({ url: conversationUrl, audioSource: false, videoSource: false })
      .catch((error: unknown) => {
        console.warn('Daily join failed, using iframe fallback:', error);
        if (!isTearingDown) {
          setUseIframeFallback(true);
          onStateChangeRef.current('connected');
        }
      });

    return () => {
      isTearingDown = true;
      try {
        callInstance.destroy();
      } catch (e) {
        console.warn('Error destroying Daily call object:', e);
      }
      if (callObjectRef.current === callInstance) {
        callObjectRef.current = null;
      }
    };
  }, [conversationUrl, attachTrack, enableMicrophone, enableCamera]);

  // Re-publish (or stop) the camera when the user's camera stream changes mid-call.
  useEffect(() => {
    const call = callObjectRef.current;
    if (!call) return;
    const track = cameraStream?.getVideoTracks?.()[0] ?? null;
    try {
      if (track) {
        void enableCamera(call, cameraStream);
      } else {
        call.setLocalVideo(false);
      }
    } catch (err) {
      console.warn('Failed to update camera track:', err);
    }
  }, [cameraStream, enableCamera]);

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
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-2xl md:rounded-3xl bg-slate-950"
          />
          <audio ref={audioRef} autoPlay />
        </>
      )}
    </div>
  );
};
