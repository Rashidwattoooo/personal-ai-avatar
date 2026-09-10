'use client';

import React from 'react';
import Image from 'next/image';
import { StatusBadge } from './ui/StatusBadge';

interface HeaderProps {
  isConfigured?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConfigured = true }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between" style={{ height: '4.5rem' }}>
        {/* Agentix System logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/brands/agentix-logo.png"
            alt="Agentix System"
            width={158}
            height={43}
            priority
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex text-xs font-semibold text-ink-muted tracking-widest uppercase border border-surface-border bg-surface-subtle px-3 py-1.5 rounded-lg">
            AI Automation Agent
          </span>
          <StatusBadge status={isConfigured ? 'online' : 'demo'} size="sm" />
        </div>
      </div>
    </header>
  );
};
