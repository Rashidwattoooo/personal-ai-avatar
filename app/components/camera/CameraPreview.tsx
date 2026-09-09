'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Eye,
  RefreshCw,
  X,
} from 'lucide-react';
import { CameraStatus, MicrophoneStatus } from '@/app/types';

interface CameraPreviewProps {
  stream?: MediaStream | null;
  status?: CameraStatus;
  isMicMuted?: boolean;
  micStatus?: MicrophoneStatus;
  onToggleCamera?: () => void;
  onToggleMic?: () => void;
  onRequestCombinedPermissions?: () => void;
  onVisionFrameCapture?: (videoElement: HTMLVideoElement) => void;
  className?: string;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  stream: externalStream,
  status: externalStatus,
  isMicMuted = false,
  onToggleCamera,
  onToggleMic,
  onRequestCombinedPermissions,
  onVisionFrameCapture,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const internalStreamRef = useRef<MediaStream | null>(null);
  const [internalStatus, setInternalStatus] = useState<CameraStatus>('off');
  const [showPreviewBubble, setShowPreviewBubble] = useState(true);

  const activeStatus = externalStatus !== undefined ? externalStatus : internalStatus;
  const activeStream = externalStream !== undefined ? externalStream : internalStreamRef.current;
  const isCameraActive = activeStatus === 'active';
  const isMicActive = !isMicMuted;

  // Sync stream to video element
  useEffect(() => {
    if (videoRef.current) {
      if (activeStream && activeStream.getVideoTracks().length > 0 && isCameraActive) {
        videoRef.current.srcObject = activeStream;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [activeStream, isCameraActive]);

  const handleCameraClick = useCallback(async () => {
    if (onToggleCamera) {
      onToggleCamera();
      return;
    }
    if (isCameraActive) {
      if (internalStreamRef.current) {
        internalStreamRef.current.getTracks().forEach((t) => t.stop());
        internalStreamRef.current = null;
      }
      setInternalStatus('off');
    } else {
      try {
        setInternalStatus('requesting');
        const s = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        internalStreamRef.current = s;
        setInternalStatus('active');
        setShowPreviewBubble(true);
      } catch {
        setInternalStatus('denied');
      }
    }
  }, [isCameraActive, onToggleCamera]);

  useEffect(() => {
    if (isCameraActive) {
      setShowPreviewBubble(true);
    }
  }, [isCameraActive]);

  useEffect(() => {
    if (isCameraActive && videoRef.current && onVisionFrameCapture) {
      const iv = setInterval(() => {
        if (videoRef.current && isCameraActive) onVisionFrameCapture(videoRef.current);
      }, 1000);
      return () => clearInterval(iv);
    }
  }, [isCameraActive, onVisionFrameCapture]);

  return (
    <div className={`relative flex flex-col items-end gap-3 select-none ${className}`}>
      {/* Pop-up Video Bubble when Camera is Active */}
      {isCameraActive && showPreviewBubble && (
        <div className="relative w-48 sm:w-56 aspect-video rounded-2xl overflow-hidden border border-brand-cyan/40 bg-[#050508] shadow-neon-cyan backdrop-blur-xl animate-fade-in">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
          {/* Top badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-brand-cyan/30 text-[10px] text-brand-cyan font-semibold">
            <Eye className="w-3 h-3" />
            Live Camera
          </div>
          {/* Close / Hide bubble button */}
          <button
            onClick={() => setShowPreviewBubble(false)}
            className="absolute top-2 right-2 p-1 rounded-md bg-black/60 hover:bg-black/90 text-[#8892a4] hover:text-white transition-colors"
            title="Minimize Preview Bubble"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Minimal Icon Control Pill */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#08080f]/90 border border-white/10 backdrop-blur-xl shadow-card-glow">
        {/* Camera Icon Button */}
        <div className="relative group">
          <button
            onClick={handleCameraClick}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isCameraActive
                ? 'bg-brand-cyan/20 border border-brand-cyan text-brand-cyan shadow-neon-cyan'
                : 'bg-white/5 border border-white/10 text-[#8892a4] hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
            title={isCameraActive ? 'Turn Off Camera' : 'Enable Camera'}
            aria-label={isCameraActive ? 'Turn Off Camera' : 'Enable Camera'}
          >
            {activeStatus === 'requesting' ? (
              <RefreshCw className="w-5 h-5 animate-spin text-brand-cyan" />
            ) : isCameraActive ? (
              <Camera className="w-5 h-5" />
            ) : (
              <CameraOff className="w-5 h-5" />
            )}
          </button>
          {/* Tooltip */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#050508] border border-white/10 text-[10px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isCameraActive ? 'Camera On' : 'Camera Off'}
          </span>
        </div>

        {/* Microphone Icon Button */}
        <div className="relative group">
          <button
            onClick={onToggleMic}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isMicActive
                ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-rose-500/20 border border-rose-500/60 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            }`}
            title={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
            aria-label={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicActive ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>
          {/* Tooltip */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#050508] border border-white/10 text-[10px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isMicActive ? 'Mic Active' : 'Mic Muted'}
          </span>
        </div>

        {/* Device Status Dot Indicator */}
        <div className="flex flex-col gap-1 pl-1 pr-0.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isCameraActive ? 'bg-brand-cyan pulse-cyan' : 'bg-[#3a3a50]'
            }`}
            title={isCameraActive ? 'Camera Active' : 'Camera Inactive'}
          />
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isMicActive ? 'bg-emerald-400' : 'bg-rose-500'
            }`}
            title={isMicActive ? 'Microphone Active' : 'Microphone Muted'}
          />
        </div>
      </div>
    </div>
  );
};
