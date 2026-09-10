import React from 'react';
import { Camera, Mic, ShieldCheck, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface CameraPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermissions: () => void;
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
  isOpen,
  onClose,
  onRequestPermissions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-up">
      <div className="relative w-full max-w-md rounded-3xl border border-surface-border card-glow p-6 shadow-card-glow">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-cyan/20 to-brand-violet/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-neon-cyan">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-ink tracking-tight">Media Permissions</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan uppercase">Combined</span>
            </div>
            <p className="text-xs text-ink-muted">One-step Microphone &amp; Camera Access</p>
          </div>
        </div>

        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Your browser will request access to both your <span className="text-ink font-semibold">Microphone</span> and <span className="text-brand-cyan font-semibold">Camera</span> in a single prompt for full voice dialogue and visual context.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-subtle border border-surface-border">
            <Mic className="w-5 h-5 text-brand-cyan mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-ink">Microphone (Voice Conversation)</div>
              <div className="text-[11px] text-ink-muted mt-0.5">Enables low-latency two-way conversational voice with live lip-sync.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-subtle border border-surface-border">
            <Camera className="w-5 h-5 text-brand-violet mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-ink">Camera (Vision Preview &amp; Cues)</div>
              <div className="text-[11px] text-ink-muted mt-0.5">Launches your camera preview immediately alongside the avatar.</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>Dismiss</Button>
          <Button
            variant="neon"
            size="sm"
            onClick={() => {
              onClose();
              onRequestPermissions();
            }}
            rightIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Allow Both &amp; Start
          </Button>
        </div>
      </div>
    </div>
  );
};
