import React from 'react';
import type { ListenerPreference } from '../types';

interface PreferenceSelectorProps {
  value: ListenerPreference;
  onChange: (v: ListenerPreference) => void;
}

const PREFERENCES: { value: ListenerPreference; label: string; icon: string }[] = [
  { value: 'balanced', label: 'Balanced', icon: 'tune' },
  { value: 'bass', label: 'Bass', icon: 'graphic_eq' },
  { value: 'vocals', label: 'Vocals', icon: 'mic' },
  { value: 'sparkle', label: 'Sparkle', icon: 'auto_awesome' },
];

export function PreferenceSelector({ value, onChange }: PreferenceSelectorProps) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant block">Listening Preference</span>
      <div className="grid grid-cols-4 gap-2">
        {PREFERENCES.map(pref => (
          <button
            key={pref.value}
            type="button"
            onClick={() => onChange(pref.value)}
            className={`
              flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-all duration-200
              ${value === pref.value
                ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }
            `}
          >
            <span className="material-symbols-outlined text-lg"
              style={value === pref.value ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >{pref.icon}</span>
            <span className="text-[10px] font-bold tracking-wide">{pref.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
