import React from 'react';

export interface StatusBadgeProps {
  status: 'online' | 'connected' | 'listening' | 'speaking' | 'connecting' | 'demo' | 'offline' | 'error';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const cfg = {
    online:     { dot: 'bg-brand-cyan pulse-cyan', ring: 'bg-brand-cyan/60', badge: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/8',         text: 'Online'   },
    connected:  { dot: 'bg-emerald-500 pulse-cyan', ring: 'bg-emerald-500/60', badge: 'border-emerald-500/30 text-emerald-600 bg-emerald-500/8',    text: 'Connected' },
    speaking:   { dot: 'bg-brand-violet', ring: 'bg-brand-violet/60', badge: 'border-brand-violet/40 text-brand-violet bg-brand-violet/8',          text: 'Speaking' },
    listening:  { dot: 'bg-brand-cyan', ring: 'bg-brand-cyan/60', badge: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/8',                   text: 'Listening' },
    connecting: { dot: 'bg-amber-500', ring: 'bg-amber-500/60', badge: 'border-amber-500/30 text-amber-600 bg-amber-500/8',                        text: 'Connecting...' },
    demo:       { dot: 'bg-brand-cyan', ring: 'bg-brand-cyan/50', badge: 'border-brand-cyan/25 text-brand-cyan bg-brand-cyan/8',                   text: 'Demo Mode' },
    offline:    { dot: 'bg-slate-400', ring: 'transparent', badge: 'border-slate-300 text-slate-500 bg-slate-100',                                text: 'Offline' },
    error:      { dot: 'bg-rose-500', ring: 'bg-rose-500/50', badge: 'border-rose-500/30 text-rose-600 bg-rose-500/8',                            text: 'Error' },
  }[status] ?? { dot: 'bg-slate-400', ring: 'transparent', badge: 'border-slate-300 text-slate-500 bg-slate-100', text: 'Unknown' };

  const sz = size === 'sm' ? 'text-[11px] px-2.5 py-1 gap-1.5' : 'text-xs px-3 py-1.5 gap-2';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border backdrop-blur-sm ${cfg.badge} ${sz}`}>
      <span className="relative flex h-2 w-2">
        {cfg.ring !== 'transparent' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-70 ${cfg.ring}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
      </span>
      {label ?? cfg.text}
    </span>
  );
};
