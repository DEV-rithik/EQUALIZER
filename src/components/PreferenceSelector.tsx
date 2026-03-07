import React from 'react';
import type { ListenerPreference } from '../types';

interface PreferenceSelectorProps {
  value: ListenerPreference;
  onChange: (v: ListenerPreference) => void;
}

const OPTIONS: { value: ListenerPreference; label: string; icon: string; desc: string }[] = [
  { value: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Neutral, reference-class' },
  { value: 'bass', label: 'Bass', icon: '🔊', desc: 'Deep, punchy low-end' },
  { value: 'vocals', label: 'Vocals', icon: '🎤', desc: 'Forward, clear vocals' },
  { value: 'sparkle', label: 'Sparkle', icon: '✨', desc: 'Bright, airy highs' },
];

export function PreferenceSelector({ value, onChange }: PreferenceSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-warm-200">Listener Preference</label>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex items-center gap-2 rounded-xl px-3 py-2.5 text-left
              border transition-all duration-200
              ${value === opt.value
                ? 'bg-warm-500/25 border-warm-400/60 text-warm-200'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
              }
            `}
          >
            <span className="text-lg">{opt.icon}</span>
            <div>
              <div className="text-xs font-semibold leading-tight">{opt.label}</div>
              <div className="text-[10px] opacity-60 leading-tight">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
