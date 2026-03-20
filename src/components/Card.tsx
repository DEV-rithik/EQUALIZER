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
        rounded-2xl border bg-[#1c1917] backdrop-blur-sm
        ${glowing
          ? 'border-amber-600/30 shadow-lg shadow-amber-900/20'
          : 'border-white/[0.06]'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
