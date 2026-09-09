import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  details?: string;
  onRetry?: () => void;
  onReset?: () => void;
  missingConfig?: string[];
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Connection Error',
  message = 'Unable to establish the realtime avatar session.',
  details,
  onRetry,
  onReset,
  missingConfig,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 rounded-3xl overflow-hidden text-center">
      <div className="absolute inset-0 bg-[#050508]/92 backdrop-blur-2xl" />
      <div className="orb orb-violet w-64 h-64 top-0 right-0 opacity-30" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl border border-rose-500/40 bg-rose-500/10 flex items-center justify-center mb-5 shadow-[0_0_32px_rgba(244,63,94,0.2)]">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/5 text-rose-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
          Session Error
        </div>

        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-[#8892a4] mb-5 leading-relaxed">{message}</p>

        {missingConfig && missingConfig.length > 0 && (
          <div className="w-full mb-5 p-4 rounded-2xl card-glow border-amber-500/25 text-left">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
              Missing Configuration
            </div>
            <ul className="space-y-1.5">
              {missingConfig.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs font-mono text-amber-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[#8892a4] mt-2.5 leading-relaxed">
              Add these values to <code className="text-white bg-white/5 px-1 py-0.5 rounded">.env.local</code> and restart the server.
            </p>
          </div>
        )}

        {details && !missingConfig?.length && (
          <div className="w-full mb-5 p-3 rounded-xl bg-[#0a0a0f] border border-white/5 text-left text-xs font-mono text-[#8892a4] break-words">
            {details}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button variant="neon" size="md" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Retry Connection
            </Button>
          )}
          {onReset && (
            <Button variant="outline" size="md" onClick={onReset} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
