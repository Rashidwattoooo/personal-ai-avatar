'use client';

import React from 'react';
import { StatusBadge } from './ui/StatusBadge';

interface HeaderProps {
  isConfigured?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConfigured = true }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between" style={{ height: '4.5rem' }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Logo mark — circuit-node icon */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-violet flex items-center justify-center shadow-neon-cyan shrink-0">
            {/* Abstract avatar head */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="7" r="3.5" fill="white" fillOpacity="0.95"/>
              <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9"/>
            </svg>
            <div className="absolute inset-0 rounded-xl shimmer" />
          </div>

          <div>
            <div className="font-bold text-white text-base tracking-tight leading-none">
              AI Avatar
            </div>
            <div className="text-[10px] font-medium text-[#8892a4] tracking-widest uppercase leading-none mt-0.5">
              Personal Assistant
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex text-xs font-semibold text-[#8892a4] tracking-widest uppercase border border-white/10 bg-white/3 px-3 py-1.5 rounded-lg">
            Live Client Demo
          </span>
          <StatusBadge status={isConfigured ? 'online' : 'demo'} size="sm" />
        </div>
      </div>
    </header>
  );
};
