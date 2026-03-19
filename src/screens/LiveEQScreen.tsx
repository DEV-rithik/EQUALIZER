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

  // Check status on mount
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
        // Initialize first
        const result = await initializeSystemEQ();
        if (!result.success) {
          setError(result.error || 'Failed to initialize system EQ. Some devices may not support this feature.');
          setIsLoading(false);
          return;
        }
        setIsInitialized(true);
        setDeviceBands(result.numBands);
        setIsEnabled(true);

        // Apply last EQ if available
        if (lastAppliedEQ) {
          await applySystemEQ(lastAppliedEQ.gains);
          setAppliedGains(lastAppliedEQ.gains);
        }
      } else if (isEnabled) {
        // Disable
        await enableSystemEQ(false);
        setIsEnabled(false);
      } else {
        // Re-enable
        await enableSystemEQ(true);
        setIsEnabled(true);

        // Re-apply last gains
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
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-xl font-bold text-white mb-1">Live System EQ</h1>
        <p className="text-xs text-white/40">Apply EQ to all audio playing on your device</p>
      </div>

      {/* Status Card */}
      <Card className="p-5" glowing={isEnabled}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-white/20'}`} />
            <div>
              <span className={`text-sm font-bold ${isEnabled ? 'text-green-300' : 'text-white/50'}`}>
                {isEnabled ? 'EQ Active' : 'EQ Inactive'}
              </span>
              {isEnabled && deviceBands > 0 && (
                <p className="text-[10px] text-white/30">{deviceBands} device bands</p>
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
                ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
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

        {/* Currently Applied Info */}
        {isEnabled && appliedGains && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🎵</span>
              <span className="text-xs text-white/70 font-medium">
                {songTitle || 'Custom EQ'} {iemModel ? `• ${iemModel}` : ''}
              </span>
            </div>
            <p className="text-[10px] text-white/30 ml-7">EQ is being applied to system audio in real-time</p>
          </div>
        )}
      </Card>

      {/* EQ Visualization */}
      {displayGains && (
        <Card className="p-4" glowing={isEnabled}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📊</span>
            <h3 className="text-sm font-semibold text-warm-200">10-Band EQ</h3>
            {isEnabled && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 font-medium animate-pulse">
                LIVE
              </span>
            )}
          </div>
          <EQChart gains={displayGains} vibeMode={isEnabled ? 'energetic' : 'peaceful'} />
        </Card>
      )}

      {/* Manual Band Sliders */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">🎚️</span>
          <h3 className="text-sm font-semibold text-warm-200">Fine-Tune Bands</h3>
        </div>
        <div className="flex flex-col gap-3">
          {EQ_BANDS.map(band => {
            const gain = displayGains ? displayGains[band] : 0;
            return (
              <div key={band} className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 w-10 text-right font-mono">{formatFreq(band)}</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={-10}
                    max={10}
                    step={0.5}
                    value={gain}
                    onChange={(e) => handleBandChange(band, parseFloat(e.target.value))}
                    className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warm-400
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-warm-400/30
                      [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  {/* Zero mark */}
                  <div className="absolute top-1/2 left-1/2 w-px h-3 bg-white/20 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`text-[10px] font-mono w-12 text-right ${gain > 0 ? 'text-warm-300' : gain < 0 ? 'text-blue-300' : 'text-white/40'}`}>
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
          className="w-full py-3.5 rounded-2xl text-sm font-semibold bg-warm-500/20 text-warm-300 border border-warm-500/30 hover:bg-warm-500/30 transition-all duration-200"
        >
          🔄 Re-apply Last Analysis EQ
        </button>
      )}

      {/* Release Button */}
      {isInitialized && (
        <button
          onClick={handleRelease}
          className="w-full py-3 rounded-2xl text-xs font-medium bg-white/5 text-white/30 border border-white/8 hover:bg-white/10 transition-all duration-200 mb-4"
        >
          🗑️ Release System EQ
        </button>
      )}

      {/* Info */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">ℹ️</span>
          <h3 className="text-sm font-semibold text-white/60">How it works</h3>
        </div>
        <ul className="flex flex-col gap-1.5">
          <li className="text-[11px] text-white/40 flex gap-2">
            <span className="text-warm-400 shrink-0">1.</span>
            <span>Tap <strong className="text-white/60">Start</strong> to activate the system-wide equalizer</span>
          </li>
          <li className="text-[11px] text-white/40 flex gap-2">
            <span className="text-warm-400 shrink-0">2.</span>
            <span>Analyze a song on the Home tab to generate an EQ profile</span>
          </li>
          <li className="text-[11px] text-white/40 flex gap-2">
            <span className="text-warm-400 shrink-0">3.</span>
            <span>Tap <strong className="text-white/60">Apply to System EQ</strong> on the results screen</span>
          </li>
          <li className="text-[11px] text-white/40 flex gap-2">
            <span className="text-warm-400 shrink-0">4.</span>
            <span>Play music in any app — Spotify, Apple Music, YouTube — the EQ is applied to all audio!</span>
          </li>
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
