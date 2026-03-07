import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({ label, hint, icon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-warm-200">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full rounded-xl bg-white/8 border border-white/15 
            text-white placeholder-white/30
            px-4 py-3 ${icon ? 'pl-10' : ''}
            focus:outline-none focus:border-warm-400/60 focus:bg-white/12
            transition-all duration-200
            text-sm
            ${className}
          `}
        />
      </div>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
}
