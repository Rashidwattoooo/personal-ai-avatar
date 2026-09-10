'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AvatarStage } from './components/avatar/AvatarStage';
import { AvatarStatus } from './components/avatar/AvatarStatus';
import { DemoControls } from './components/DemoControls';
import { CameraPermissionModal } from './components/camera/CameraPermission';
import { ConversationState, ConfigStatusResponse, CameraStatus } from './types';

export default function Home() {
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [missingConfig, setMissingConfig] = useState<string[]>([]);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [configStatus, setConfigStatus] = useState<ConfigStatusResponse | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // Combined camera & mic media state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('off');

  const fetchConfigStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setConfigStatus(data.config);
        if (data.missingConfig) setMissingConfig(data.missingConfig);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchConfigStatus();
  }, [fetchConfigStatus]);

  // Unified start conversation handler requesting both Mic & Camera simultaneously
  const handleStartConversation = async () => {
    try {
      setErrorMessage(null);
      setConversationState('initializing');

      let userCombinedStream: MediaStream | null = null;
      let camState: CameraStatus = 'off';

      // 1. Single combined prompt for both Microphone and Camera
      if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          userCombinedStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user',
            },
          });
          camState = 'active';
        } catch (mediaErr: unknown) {
          console.warn('Combined media prompt issue, trying audio-only fallback:', mediaErr);
          // If camera was declined or unavailable, attempt audio-only so the conversation still works
          try {
            const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioOnlyStream.getTracks().forEach((t) => t.stop());
            camState = 'denied';
          } catch (audioErr: unknown) {
            setConversationState('error');
            setErrorMessage(
              'Microphone access is required to talk with your AI assistant. Please allow permissions in your browser address bar and try again.'
            );
            return;
          }
        }
      }

      // 2. Set up video stream in preview if camera was granted
      if (userCombinedStream) {
        const videoTracks = userCombinedStream.getVideoTracks();
        if (videoTracks.length > 0) {
          const videoOnlyStream = new MediaStream(videoTracks);
          setCameraStream(videoOnlyStream);
          setCameraStatus('active');
        } else {
          setCameraStatus(camState);
        }
        // Release audio track from test stream so WebRTC client takes clean ownership
        userCombinedStream.getAudioTracks().forEach((t) => t.stop());
      } else {
        setCameraStatus(camState);
      }

      // 3. Call secure backend endpoint to create Tavus CVI conversation
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setConversationState('error');
        setErrorMessage(data.details || data.error || 'Failed to start avatar session.');
        if (data.missingConfig) setMissingConfig(data.missingConfig);
        return;
      }

      setConversationUrl(data.conversationUrl);
      setConversationId(data.conversationId);
      setConversationState('connecting');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error occurred.';
      setConversationState('error');
      setErrorMessage(msg);
    }
  };

  // Toggle camera stream on/off during or outside call
  const handleToggleCamera = async () => {
    if (cameraStatus === 'active' && cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraStatus('off');
    } else {
      try {
        setCameraStatus('requesting');
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        setCameraStream(newStream);
        setCameraStatus('active');
      } catch (err: unknown) {
        console.warn('Could not start camera:', err);
        setCameraStatus('denied');
      }
    }
  };

  // Standalone combined permission request for the device box
  const handleRequestCombinedMedia = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      setCameraStatus('requesting');
      const combined = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      const videoTracks = combined.getVideoTracks();
      if (videoTracks.length > 0) {
        setCameraStream(new MediaStream(videoTracks));
        setCameraStatus('active');
      }
    } catch (err: unknown) {
      console.warn('Combined permission request:', err);
      setCameraStatus('denied');
    }
  };

  const handleEndConversation = async () => {
    if (conversationId) {
      try {
        await fetch(`/api/conversation?conversationId=${conversationId}`, { method: 'DELETE' });
      } catch {
        // silent
      }
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraStatus('off');
    }
    setConversationState('ended');
    setConversationUrl(null);
    setConversationId(null);
    setTimeout(() => setConversationState('idle'), 400);
  };

  const handleReset = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraStatus('off');
    }
    setConversationState('idle');
    setConversationUrl(null);
    setConversationId(null);
    setErrorMessage(null);
  };

  const isCallActive =
    conversationState === 'connecting' ||
    conversationState === 'connected' ||
    conversationState === 'speaking' ||
    conversationState === 'listening';

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* ── Global background ── */}
      <div className="fixed inset-0 dot-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />

      {/* Ambient orbs — fixed in viewport */}
      <div className="orb orb-cyan fixed w-[600px] h-[600px] -top-64 -left-64 opacity-20 pointer-events-none" />
      <div className="orb orb-violet fixed w-[500px] h-[500px] -bottom-40 -right-40 opacity-20 pointer-events-none" />

      {/* ── HEADER ── */}
      <Header isConfigured={configStatus?.isConfigured ?? false} />

      {/* ── MAIN ── */}
      <main className="relative z-10 flex-1 pt-[4.5rem] flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center gap-6">
          {/* Hero section — visible when not in active call */}
          {!isCallActive && conversationState !== 'error' && (
            <Hero
              onStart={handleStartConversation}
              isLoading={conversationState === 'initializing'}
              isConfigured={configStatus?.isConfigured}
            />
          )}

          {/* Active session layout */}
          <div className="w-full space-y-4">
            {/* Status bar — only visible during call */}
            {isCallActive && (
              <AvatarStatus
                conversationState={conversationState}
                micStatus={isMicMuted ? 'muted' : 'active'}
                hasRagKnowledge={configStatus?.hasDocumentIds}
              />
            )}

            {/* Avatar Stage */}
            <AvatarStage
              conversationState={conversationState}
              conversationUrl={conversationUrl}
              conversationId={conversationId}
              errorMessage={errorMessage}
              missingConfig={missingConfig}
              isMicMuted={isMicMuted}
              cameraStream={cameraStream}
              cameraStatus={cameraStatus}
              onToggleCamera={handleToggleCamera}
              onToggleMic={() => setIsMicMuted((p) => !p)}
              onRequestCombinedPermissions={handleRequestCombinedMedia}
              onStateChange={setConversationState}
              onError={(err) => {
                setConversationState('error');
                setErrorMessage(err);
              }}
              onLeave={handleEndConversation}
              onRetry={handleStartConversation}
              onReset={handleReset}
            />

            {/* Session Controls */}
            <DemoControls
              conversationState={conversationState}
              isMicMuted={isMicMuted}
              onToggleMic={() => setIsMicMuted((p) => !p)}
              onStartCall={handleStartConversation}
              onEndCall={handleEndConversation}
            />
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-surface-border bg-surface-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Image
                src="/images/brands/agentix-logo.png"
                alt="Agentix System"
                width={150}
                height={41}
                className="h-8 w-auto object-contain mb-4"
              />
              <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
                Custom AI automation agents for sales, support, and operations — keeping your business running 24/7 with minimal human intervention.
              </p>
            </div>

            {/* Agentix services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Agentix System</h4>
              <ul className="space-y-2.5 text-sm text-ink-muted">
                <li>AI Automation Agents</li>
                <li>Sales &amp; Support Automation</li>
                <li>Workflow &amp; Ops Integration</li>
                <li>
                  <a href="https://agentixsystem.com" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline font-medium">
                    agentixsystem.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Sham Marianas services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Sham Marianas</h4>
              <ul className="space-y-2.5 text-sm text-ink-muted">
                <li>Branding &amp; Brand Design</li>
                <li>UI / UX Design</li>
                <li>Advertising &amp; Creative</li>
                <li>
                  <a href="https://shammarianas.com" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline font-medium">
                    shammarianas.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Assistant / capabilities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">AI Assistant</h4>
              <ul className="space-y-2.5 text-sm text-ink-muted">
                <li>Real-time voice conversation</li>
                <li>RAG knowledge on both brands</li>
                <li>Live camera vision &amp; cues</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
            <span>© {new Date().getFullYear()} Agentix System · In partnership with Sham Marianas F.Z.C, Dubai</span>
            <span className="text-[11px]">
              Powered by <span className="text-brand-cyan font-medium">Tavus CVI</span> &amp; RAG Architecture
            </span>
          </div>
        </div>
      </footer>

      {/* Permission modal */}
      <CameraPermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onRequestPermissions={handleStartConversation}
      />
    </div>
  );
}
