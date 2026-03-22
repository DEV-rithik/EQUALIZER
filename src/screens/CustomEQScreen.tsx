import React, { useState, useCallback } from 'react';
import type { EQGains } from '../types';
import { EQ_BANDS } from '../types';
import {
  initializeSystemEQ,
  applySystemEQ,
} from '../services/systemEQPlugin';

interface CustomEQScreenProps {
  onBack: () => void;
}

function formatFreq(hz: number): string {
  if (hz >= 1000) return `${hz / 1000}k`;
  return `${hz}`;
}

function getDefaultGains(): EQGains {
  const gains = {} as EQGains;
  for (const band of EQ_BANDS) gains[band] = 0;
  return gains;
}

export function CustomEQScreen({ onBack }: CustomEQScreenProps) {
  const [gains, setGains] = useState<EQGains>(getDefaultGains());
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleBandChange = useCallback((band: typeof EQ_BANDS[number], value: number) => {
    setGains(prev => ({
      ...prev,
      [band]: Math.round(value * 10) / 10,
    }));
    setApplied(false);
  }, []);

  const handleReset = useCallback(() => {
    setGains(getDefaultGains());
    setApplied(false);
  }, []);

  const handleApply = useCallback(async () => {
    setIsApplying(true);
    try {
      await initializeSystemEQ();
      await applySystemEQ(gains);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    } catch (err) {
      console.error('Failed to apply EQ:', err);
    }
    setIsApplying(false);
  }, [gains]);

  return (
    <div className="min-h-screen bg-background text-on-background font-body antialiased">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back_ios_new</span>
          </button>
          <h1 className="font-headline font-bold tracking-tight text-zinc-900 text-xl">Equalizer</h1>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-full transition-colors active:scale-95"
        >
          Reset
        </button>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto space-y-8">
        {/* Title Section */}
        <section>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1 block">Manual Tuning</span>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Custom EQ</h2>
          <p className="text-on-surface-variant mt-1">Set your preferred equalizer settings</p>
        </section>

        {/* Vertical Sliders — Stitch style */}
        <section className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Frequency Bands</h3>
              <p className="text-on-surface-variant">10-Band Precision Control</p>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">±12dB</span>
          </div>

          <div className="flex justify-between items-center h-[300px] overflow-x-auto hide-scrollbar gap-2 md:gap-0">
            {EQ_BANDS.map(band => {
              const gain = gains[band];
              return (
                <div key={band} className="flex flex-col items-center gap-24 h-full min-w-[60px]">
                  <span className={`text-[10px] font-bold ${gain > 0 ? 'text-primary' : gain < 0 ? 'text-on-surface-variant' : 'text-on-surface-variant'}`}>
                    {gain > 0 ? '+' : ''}{gain.toFixed(1)}
                  </span>
                  <div className="relative h-full flex items-center justify-center">
                    <input
                      className="vertical-range"
                      type="range"
                      min={-12}
                      max={12}
                      step={0.5}
                      value={gain}
                      onChange={(e) => handleBandChange(band, parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-on-surface">{formatFreq(band)}</span>
                    <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Hz</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          disabled={isApplying}
          className={`
            w-full h-14 rounded-full font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3
            ${applied
              ? 'bg-primary/10 text-primary'
              : 'bg-primary-gradient text-white shadow-primary/20 hover:opacity-90 active:scale-95'
            }
            ${isApplying ? 'opacity-50' : ''}
          `}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {applied ? 'check_circle' : 'graphic_eq'}
          </span>
          {isApplying ? 'Applying...' : applied ? 'Applied to System!' : 'Apply to System EQ'}
        </button>

        {/* Preset Quick Actions */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { name: 'Flat', gains: getDefaultGains() },
            { name: 'Bass Boost', gains: makeBassBoost() },
            { name: 'Vocal', gains: makeVocalPreset() },
          ].map(preset => (
            <button
              key={preset.name}
              onClick={() => { setGains(preset.gains); setApplied(false); }}
              className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/15 text-center hover:bg-surface-container-high transition-colors active:scale-[0.98]"
            >
              <p className="text-sm font-bold text-on-surface">{preset.name}</p>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

function makeBassBoost(): EQGains {
  return {
    31: 6, 62: 5, 125: 4, 250: 2, 500: 0,
    1000: 0, 2000: 0, 4000: 1, 8000: 2, 16000: 3,
  } as EQGains;
}

function makeVocalPreset(): EQGains {
  return {
    31: -2, 62: -1, 125: 0, 250: 2, 500: 4,
    1000: 5, 2000: 4, 4000: 3, 8000: 1, 16000: 0,
  } as EQGains;
}
