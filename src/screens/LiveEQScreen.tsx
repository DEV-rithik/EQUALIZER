import React, { useState, useEffect, useCallback } from 'react';
import type { EQGains, EQRecommendation } from '../types';
import { EQ_BANDS } from '../types';
import { Card } from '../components/Card';
import { EQChart } from '../components/EQChart';
import {
  initializeSystemEQ,
  applySystemEQ,
  enableSystemEQ,
  getSystemEQStatus,
  releaseSystemEQ,
  getCurrentAppliedEQ,
} from '../services/systemEQPlugin';

interface LiveEQScreenProps {
  lastAppliedEQ?: EQRecommendation | null;
  songTitle?: string;
  iemModel?: string;
}

function formatFreq(hz: number): string {
  if (hz >= 1000) return `${hz / 1000}k`;
  return `${hz}`;
}

export function LiveEQScreen({ lastAppliedEQ, songTitle, iemModel }: LiveEQScreenProps) {
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
    <div className="flex flex-col gap-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-100">Live System EQ</h1>
          <p className="text-xs text-stone-500 mt-0.5">Apply EQ to all device audio</p>
        </div>
        {isEnabled && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#292524] rounded-full border border-amber-900/20">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_#d97706]" />
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Live</span>
          </div>
        )}
      </div>

      {/* Status Card */}
      <Card className="p-5" glowing={isEnabled}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50' : 'bg-stone-600'}`} />
            <div>
              <span className={`text-sm font-bold ${isEnabled ? 'text-amber-400' : 'text-stone-500'}`}>
                {isEnabled ? 'Engine Active' : 'Engine Inactive'}
              </span>
              {isEnabled && deviceBands > 0 && (
                <p className="text-[10px] text-stone-600">{deviceBands} device bands</p>
              )}
            </div>
          </div>
          <button
            onClick={handleToggleEQ}
            disabled={isLoading}
            className={`
              px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
              ${isLoading ? 'opacity-50 cursor-wait' : ''}
              ${isEnabled
                ? 'bg-velvet-gradient text-white shadow-[0_10px_20px_rgba(217,119,6,0.2)] active:scale-95'
                : 'bg-[#292524] text-stone-300 border border-amber-900/15 hover:bg-[#44403c]'
              }
            `}
          >
            {isLoading ? '...' : isEnabled ? '⏹ Stop' : '▶ Start'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-3">
            <p className="text-xs text-red-300">⚠️ {error}</p>
          </div>
        )}

        {isEnabled && appliedGains && (
          <div className="p-3 rounded-xl bg-[#0c0b0a] border border-amber-900/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🎵</span>
              <span className="text-xs text-stone-300 font-medium">
                {songTitle || 'Custom EQ'} {iemModel ? `• ${iemModel}` : ''}
              </span>
            </div>
            <p className="text-[10px] text-stone-600 ml-7">EQ applied to system audio in real-time</p>
          </div>
        )}
      </Card>

      {/* EQ Visualization */}
      {displayGains && (
        <Card className="p-4" glowing={isEnabled}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📊</span>
            <h3 className="text-sm font-semibold text-amber-400">10-Band EQ</h3>
            {isEnabled && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/20 text-amber-400 border border-amber-900/30 font-bold animate-pulse uppercase tracking-wider">
                Live
              </span>
            )}
          </div>
          <EQChart gains={displayGains} vibeMode={isEnabled ? 'energetic' : 'peaceful'} />
        </Card>
      )}

      {/* Manual Band Sliders */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-base">🎚️</span>
            <h3 className="text-sm font-bold text-stone-100">Fine-Tune Bands</h3>
          </div>
          <span className="text-amber-500/50 text-[10px] font-bold uppercase tracking-widest">±10dB</span>
        </div>
        <div className="flex flex-col gap-3">
          {EQ_BANDS.map(band => {
            const gain = displayGains ? displayGains[band] : 0;
            return (
              <div key={band} className="flex items-center gap-3">
                <span className="text-[10px] text-stone-500 w-10 text-right font-mono">{formatFreq(band)}</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={-10}
                    max={10}
                    step={0.5}
                    value={gain}
                    onChange={(e) => handleBandChange(band, parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="absolute top-1/2 left-1/2 w-px h-3 bg-stone-600 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`text-[10px] font-mono w-12 text-right ${gain > 0 ? 'text-amber-400' : gain < 0 ? 'text-stone-400' : 'text-stone-600'}`}>
                  {gain > 0 ? '+' : ''}{gain.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Apply from Analysis */}
      {lastAppliedEQ && isEnabled && (
        <button
          onClick={handleApplyCurrentEQ}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl text-sm font-bold bg-[#292524] text-amber-400 border border-amber-900/20 hover:bg-[#44403c] transition-all duration-200 active:scale-95"
        >
          🔄 Re-apply Last Analysis EQ
        </button>
      )}

      {/* Release Button */}
      {isInitialized && (
        <button
          onClick={handleRelease}
          className="w-full py-3 rounded-2xl text-xs font-medium bg-[#1c1917] text-stone-600 border border-white/[0.06] hover:text-stone-400 transition-all duration-200 mb-2"
        >
          🗑️ Release System EQ
        </button>
      )}

      {/* Info */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">ℹ️</span>
          <h3 className="text-sm font-semibold text-stone-400">How it works</h3>
        </div>
        <ul className="flex flex-col gap-1.5">
          {[
            ['1.', <span>Tap <strong className="text-stone-300">Start</strong> to activate the system-wide equalizer</span>],
            ['2.', <span>Analyze a song on the Analyze tab to generate an EQ profile</span>],
            ['3.', <span>Tap <strong className="text-stone-300">Apply to System EQ</strong> on the results screen</span>],
            ['4.', <span>Play music in any app — the EQ is applied to all audio!</span>],
          ].map(([num, text], i) => (
            <li key={i} className="text-[11px] text-stone-500 flex gap-2">
              <span className="text-amber-500 shrink-0">{num}</span>
              {text}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function getDefaultGains(): EQGains {
  const gains = {} as EQGains;
  for (const band of EQ_BANDS) gains[band] = 0;
  return gains;
}
