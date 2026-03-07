import React from 'react';
import type { EQGains } from '../types';
import { EQ_BANDS } from '../types';

interface EQBandGridProps {
  gains: EQGains;
}

function formatFreq(hz: number): string {
  if (hz >= 1000) return `${hz / 1000}k`;
  return `${hz}`;
}

function gainColor(gain: number): string {
  if (gain > 3) return 'text-orange-400';
  if (gain > 1) return 'text-warm-300';
  if (gain < -3) return 'text-blue-400';
  if (gain < -1) return 'text-blue-300';
  return 'text-white/60';
}

export function EQBandGrid({ gains }: EQBandGridProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {EQ_BANDS.map(band => {
        const gain = gains[band];
        const pct = ((gain + 6) / 12) * 100; // 0-100% mapped from -6..+6
        return (
          <div key={band} className="flex flex-col items-center gap-1">
            {/* Mini bar */}
            <div className="relative w-5 h-14 rounded-full bg-white/8 overflow-hidden">
              {/* Zero line */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20" />
              {/* Fill */}
              <div
                className={`
                  absolute left-0 right-0 rounded-full transition-all duration-500
                  ${gain >= 0 ? 'bg-warm-400' : 'bg-blue-400'}
                `}
                style={{
                  height: `${Math.abs(gain) / 6 * 48}%`,
                  bottom: gain >= 0 ? '50%' : 'auto',
                  top: gain < 0 ? '50%' : 'auto',
                }}
              />
            </div>
            <span className={`text-[9px] font-mono font-semibold ${gainColor(gain)}`}>
              {gain > 0 ? '+' : ''}{gain.toFixed(1)}
            </span>
            <span className="text-[8px] text-white/30">{formatFreq(band)}</span>
          </div>
        );
      })}
    </div>
  );
}
