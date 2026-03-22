import React, { useState, useEffect, useCallback } from 'react';
import type { EQGains, EQRecommendation, EQFeedbackRating } from '../types';
import { EQ_BANDS } from '../types';
import {
  initializeSystemEQ,
  applySystemEQ,
  enableSystemEQ,
  getSystemEQStatus,
  releaseSystemEQ,
  getCurrentAppliedEQ,
} from '../services/systemEQPlugin';
import { EQFeedbackComponent } from '../components/EQFeedback';

interface LiveEQScreenProps {
  lastAppliedEQ?: EQRecommendation | null;
  songTitle?: string;
  iemModel?: string;
  onBack: () => void;
  onFeedback?: (rating: EQFeedbackRating) => void;
}

function formatFreq(hz: number): string {
  if (hz >= 1000) return `${hz / 1000}k`;
  return `${hz}`;
}

export function LiveEQScreen({ lastAppliedEQ, songTitle, iemModel, onBack, onFeedback }: LiveEQScreenProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceBands, setDeviceBands] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [appliedGains, setAppliedGains] = useState<EQGains | null>(null);
  const [manualGains, setManualGains] = useState<EQGains | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = useCallback(async () => {
    const status = await getSystemEQStatus();
    setIsInitialized(status.initialized);
    setIsEnabled(status.enabled);
    setDeviceBands(status.numBands);
    const current = getCurrentAppliedEQ();
    if (current) setAppliedGains(current);
  }, []);

  const handleToggleEQ = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isInitialized) {
        const result = await initializeSystemEQ();
        if (!result.success) {
          setError(result.error || 'Failed to initialize system EQ.');
          setIsLoading(false);
          return;
        }
        setIsInitialized(true);
        setDeviceBands(result.numBands);
        setIsEnabled(true);

        if (lastAppliedEQ) {
          await applySystemEQ(lastAppliedEQ.gains);
          setAppliedGains(lastAppliedEQ.gains);
        }
      } else if (isEnabled) {
        await enableSystemEQ(false);
        setIsEnabled(false);
      } else {
        await enableSystemEQ(true);
        setIsEnabled(true);
        if (appliedGains) {
          await applySystemEQ(appliedGains);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
    }

    setIsLoading(false);
  }, [isInitialized, isEnabled, lastAppliedEQ, appliedGains]);

  const handleApplyCurrentEQ = useCallback(async () => {
    if (!lastAppliedEQ || !isEnabled) return;
    setIsLoading(true);
    const success = await applySystemEQ(lastAppliedEQ.gains);
    if (success) {
      setAppliedGains(lastAppliedEQ.gains);
      setManualGains(null);
    }
    setIsLoading(false);
  }, [lastAppliedEQ, isEnabled]);

  const handleBandChange = useCallback(async (band: typeof EQ_BANDS[number], value: number) => {
    const newGains = { ...(manualGains || appliedGains || getDefaultGains()) };
    newGains[band] = Math.round(value * 10) / 10;
    setManualGains(newGains);

    if (isEnabled) {
      await applySystemEQ(newGains);
      setAppliedGains(newGains);
    }
  }, [manualGains, appliedGains, isEnabled]);

  const handleRelease = useCallback(async () => {
    await releaseSystemEQ();
    setIsInitialized(false);
    setIsEnabled(false);
    setAppliedGains(null);
    setManualGains(null);
  }, []);

  const displayGains = manualGains || appliedGains || lastAppliedEQ?.gains || null;

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
        <button className="text-zinc-400 hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
        {/* Hero: Currently Playing */}
        <section className="mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl shrink-0 bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
          </div>
          <div className="text-center md:text-left">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Now Tuning</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-on-surface mb-2">{songTitle || 'Custom EQ'}</h2>
            {iemModel && <p className="text-on-surface-variant text-lg font-medium">{iemModel}</p>}
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={handleToggleEQ}
                disabled={isLoading}
                className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg active:scale-95 transition-transform ${
                  isEnabled
                    ? 'bg-primary-gradient text-white shadow-primary/20'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant/15'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span className="material-symbols-outlined text-sm">{isEnabled ? 'stop' : 'play_arrow'}</span>
                {isLoading ? '...' : isEnabled ? 'Stop EQ' : 'Start EQ'}
              </button>
              <button
                onClick={handleRelease}
                className="px-6 py-3 bg-surface-container-lowest text-on-surface rounded-full font-semibold border border-outline-variant/15 active:scale-95 transition-transform"
              >
                Reset EQ
              </button>
            </div>
          </div>
        </section>

        {/* EQ Sliders — vertical bands like Stitch */}
        <section className="bg-surface-container-low rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Live Spectrum</h3>
              <p className="text-on-surface-variant">10-Band Precision Control</p>
            </div>
            {isEnabled && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live</span>
              </div>
            )}
          </div>

          {/* Vertical Sliders */}
          <div className="flex justify-between items-center h-[300px] overflow-x-auto hide-scrollbar gap-2 md:gap-0">
            {EQ_BANDS.map(band => {
              const gain = displayGains ? displayGains[band] : 0;
              return (
                <div key={band} className="flex flex-col items-center gap-24 h-full min-w-[60px]">
                  <span className="text-[10px] font-bold text-on-surface-variant">+12dB</span>
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

        {error && (
          <div className="p-4 rounded-xl bg-error-container border border-error/20 mb-6">
            <p className="text-sm text-on-error-container">⚠️ {error}</p>
          </div>
        )}

        {/* Bento Grid: Feedback & Smart Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Smart Feedback — Rate EQ (one-time) */}
          {onFeedback && (
            <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 flex flex-col justify-between">
              <EQFeedbackComponent onFeedback={onFeedback} />
            </div>
          )}

          {/* AI Analysis card */}
          <div className="bg-primary text-white rounded-xl p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">AI Analysis</span>
              <h4 className="text-3xl font-bold mt-2">
                {(lastAppliedEQ as any)?.mlConfidence !== undefined
                  ? `${Math.round(((lastAppliedEQ as any).mlConfidence ?? 0) * 100)}%`
                  : '—'}
              </h4>
              <p className="text-sm opacity-90 mt-1">Clarity Match for your Genre</p>
            </div>
            <div className="relative z-10 mt-8">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${Math.round(((lastAppliedEQ as any)?.mlConfidence ?? 0.5) * 100)}%` }}></div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>

        {/* Re-apply / Apply buttons */}
        {lastAppliedEQ && isEnabled && (
          <button
            onClick={handleApplyCurrentEQ}
            disabled={isLoading}
            className="w-full py-4 mt-6 rounded-full text-sm font-bold bg-surface-container-lowest text-on-surface border border-outline-variant/15 hover:bg-surface-container-high active:scale-95 transition-all"
          >
            🔄 Re-apply Last Analysis EQ
          </button>
        )}
      </main>
    </div>
  );
}

function getDefaultGains(): EQGains {
  const gains = {} as EQGains;
  for (const band of EQ_BANDS) gains[band] = 0;
  return gains;
}


