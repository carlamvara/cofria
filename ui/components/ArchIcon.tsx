import React from 'react';

export const ArchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18" />
    <path d="M5 21V10a7 7 0 0 1 14 0v11" />
    <path d="M12 13v8" />
    <path d="M9 21v-3a3 3 0 0 1 6 0v3" />
  </svg>
);
