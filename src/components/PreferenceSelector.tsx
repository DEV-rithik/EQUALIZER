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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-stone-400 px-1">Sonic Profile</label>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex flex-col items-center gap-1.5 rounded-xl px-3 py-3.5 text-center
              transition-all duration-300 active:scale-95
              ${value === opt.value
                ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                : 'bg-[#292524] text-stone-400 hover:text-amber-400'
              }
            `}
          >
            <span className="text-lg">{opt.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
