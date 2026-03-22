import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

export function Card({ children, className = '', glowing }: CardProps) {
  return (
    <div className={`
      bg-surface-container-lowest rounded-xl
      ${glowing ? 'ring-1 ring-primary/10 shadow-lg shadow-primary/5' : 'border border-outline-variant/15'}
      ${className}
    `}>
      {children}
    </div>
  );
}
