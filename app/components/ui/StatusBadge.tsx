import React from 'react';

export interface StatusBadgeProps {
  status: 'online' | 'connected' | 'listening' | 'speaking' | 'connecting' | 'demo' | 'offline' | 'error';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const cfg = {
    online:     { dot: 'bg-brand-cyan pulse-cyan', ring: 'bg-brand-cyan/60', badge: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5',         text: 'Online'   },
    connected:  { dot: 'bg-emerald-400 pulse-cyan', ring: 'bg-emerald-400/60', badge: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/5',     text: 'Connected' },
    speaking:   { dot: 'bg-brand-violet', ring: 'bg-brand-violet/60', badge: 'border-brand-violet/40 text-purple-300 bg-brand-violet/5',            text: 'Speaking' },
    listening:  { dot: 'bg-brand-cyan', ring: 'bg-brand-cyan/60', badge: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5',                   text: 'Listening' },
    connecting: { dot: 'bg-amber-400', ring: 'bg-amber-400/60', badge: 'border-amber-500/30 text-amber-300 bg-amber-500/5',                        text: 'Connecting...' },
    demo:       { dot: 'bg-brand-cyan', ring: 'bg-brand-cyan/50', badge: 'border-brand-cyan/25 text-brand-cyan bg-brand-cyan/5',                   text: 'Demo Mode' },
    offline:    { dot: 'bg-slate-500', ring: 'transparent', badge: 'border-slate-700 text-slate-500 bg-slate-800/40',                             text: 'Offline' },
    error:      { dot: 'bg-rose-500', ring: 'bg-rose-500/50', badge: 'border-rose-500/30 text-rose-300 bg-rose-500/5',                            text: 'Error' },
  }[status] ?? { dot: 'bg-slate-500', ring: 'transparent', badge: 'border-slate-700 text-slate-500 bg-slate-800/40', text: 'Unknown' };

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
