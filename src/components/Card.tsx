import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

export function Card({ children, className = '', glowing = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
        ${glowing ? 'shadow-lg shadow-warm-500/20 border-warm-500/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
