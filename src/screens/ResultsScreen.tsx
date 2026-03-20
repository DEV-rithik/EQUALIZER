import React, { useState } from 'react';
import type { AnalysisResult, VibeModeType, Preset, EQFeedbackRating } from '../types';
import { Card } from '../components/Card';
import { EQChart } from '../components/EQChart';
import { EQBandGrid } from '../components/EQBandGrid';
import { EQFeedbackComponent } from '../components/EQFeedback';
import { savePreset, generatePresetId } from '../utils/storage';

interface ResultsScreenProps {
  result: AnalysisResult;
  songTitle: string;
  iemModel: string;
  preference: string;
  vibeMode: VibeModeType;
  onBack: () => void;
  onFeedback?: (rating: EQFeedbackRating) => void;
  onApplySystemEQ?: () => void;
}

function MoodBadge({ mood }: { mood: string }) {
  return (
    <span className="text-xs px-2.5 py-0.5 rounded-full border capitalize bg-amber-900/20 text-amber-300 border-amber-900/30">
      {mood}
    </span>
  );
}

function ProgressBar({ value, color = 'bg-amber-500' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 bg-[#292524] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

function ConfidencePill({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color = pct > 70 ? 'text-amber-400' : pct > 40 ? 'text-amber-500/70' : 'text-stone-500';
  return (
    <span className={`text-xs font-semibold ${color}`}>{pct}% match</span>
  );
}

export function ResultsScreen({ result, songTitle, vibeMode, onBack, onFeedback, onApplySystemEQ }: ResultsScreenProps) {
  const [saved, setSaved] = useState(false);
  const [showAllBands, setShowAllBands] = useState(false);
  const [eqApplied, setEqApplied] = useState(false);

  const { songProfile: song, iemProfile: iem, eqRecommendation: eq } = result;

  function handleSave() {
    const preset: Preset = {
      id: generatePresetId(),
      name: `${songTitle} — ${iem.brand} ${iem.model}`,
      createdAt: new Date().toISOString(),
      songProfile: song,
      iemProfile: iem,
      eqRecommendation: eq,
      preference: 'balanced',
      songTitle,
      iemModel: iem.model,
    };
    savePreset(preset);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#292524] border border-white/[0.06] flex items-center justify-center hover:bg-[#44403c] transition-colors"
        >
          <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-base font-bold text-stone-100">EQ Results</h2>
          <p className="text-xs text-stone-500 truncate max-w-[200px]">{songTitle}</p>
        </div>
      </div>

      {/* Song profile */}
      <Card className="p-5" glowing>
        <div className="flex items-center gap-2 mb-3">
          {song.albumArt ? (
            <img src={song.albumArt} alt="" className="w-10 h-10 rounded-lg shadow-lg" />
          ) : (
            <span className="text-base">🎵</span>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-400">Song Profile</h3>
          </div>
          {song.source === 'itunes' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 font-medium">
              🍎 iTunes
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-stone-300 capitalize">{song.genre}</span>
          <MoodBadge mood={song.mood} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-500">Energy</span>
              <span className="text-stone-300">{Math.round(song.energy * 100)}%</span>
            </div>
            <ProgressBar value={song.energy} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-500">Bass</span>
              <span className="text-stone-300">{Math.round(song.bassEmphasis * 100)}%</span>
            </div>
            <ProgressBar value={song.bassEmphasis} color="bg-amber-600" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-500">Vocals</span>
              <span className="text-stone-300">{Math.round(song.vocalPresence * 100)}%</span>
            </div>
            <ProgressBar value={song.vocalPresence} color="bg-amber-400" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-500">Treble</span>
              <span className="text-stone-300">{Math.round(song.trebleEnergy * 100)}%</span>
            </div>
            <ProgressBar value={song.trebleEnergy} color="bg-amber-300" />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-4">
          <span className="text-xs text-stone-500">Est. BPM: <span className="text-stone-300">{song.bpmEstimate}</span></span>
          <span className="text-xs text-stone-500">Rhythm: <span className="text-stone-300">{Math.round(song.rhythmIntensity * 100)}%</span></span>
        </div>
      </Card>

      {/* IEM profile */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎧</span>
          <h3 className="text-sm font-semibold text-amber-400">IEM Profile</h3>
          <ConfidencePill confidence={iem.confidence} />
        </div>
        <div className="mb-2">
          <p className="text-sm font-bold text-stone-100">{iem.brand} {iem.model}</p>
          <p className="text-xs text-amber-500/70 mt-0.5">{iem.tuningSignature}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {iem.tonalNotes.map((note, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#292524] text-stone-400 border border-white/[0.06]">
              {note}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <ProgressBar value={iem.bassLevel} color="bg-amber-500" />
            <p className="text-[10px] text-stone-500 mt-1">Bass</p>
          </div>
          <div className="text-center">
            <ProgressBar value={iem.midLevel} color="bg-amber-400" />
            <p className="text-[10px] text-stone-500 mt-1">Mids</p>
          </div>
          <div className="text-center">
            <ProgressBar value={iem.trebleLevel} color="bg-amber-300" />
            <p className="text-[10px] text-stone-500 mt-1">Treble</p>
          </div>
        </div>
      </Card>

      {/* EQ Graph */}
      <Card className="p-4" glowing>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <h3 className="text-sm font-semibold text-amber-400">10-Band EQ</h3>
            {result.mlEnhanced && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/20 text-amber-300 border border-amber-900/30 font-medium animate-fade-in">
                🧠 AI Enhanced
              </span>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-0.5">
            <div>
              <span className="text-xs text-stone-500">Preamp: </span>
              <span className="text-xs font-mono text-amber-400">
                {eq.preamp.toFixed(1)} dB
              </span>
            </div>
            {result.mlConfidence !== undefined && (
              <span className="text-[10px] text-amber-500/60">
                ML Confidence: {Math.round(result.mlConfidence * 100)}%
              </span>
            )}
          </div>
        </div>
        <EQChart gains={eq.gains} vibeMode={vibeMode} />
      </Card>

      {/* ML Feedback */}
      {onFeedback && (
        <Card className="p-4">
          <EQFeedbackComponent onFeedback={onFeedback} />
        </Card>
      )}

      {/* Band values */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-amber-400">Band Values</h3>
          <button
            onClick={() => setShowAllBands(!showAllBands)}
            className="text-xs text-amber-500 hover:text-amber-400"
          >
            {showAllBands ? 'Hide' : 'Show all'}
          </button>
        </div>
        {showAllBands && <EQBandGrid gains={eq.gains} />}
        {!showAllBands && (
          <div className="flex gap-px h-10 items-end">
            {Object.entries(eq.gains).map(([band, gain]) => (
              <div
                key={band}
                className="flex-1 rounded-t-sm transition-all duration-500"
                style={{
                  height: `${((gain + 10) / 20) * 100}%`,
                  minHeight: '3px',
                  background: `rgba(217, 119, 6, ${0.3 + ((gain + 10) / 20) * 0.5})`,
                }}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Reasoning */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">💡</span>
          <h3 className="text-sm font-semibold text-amber-400">Why This EQ?</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {eq.reasoning.map((reason, i) => (
            <li key={i} className="text-xs text-stone-400 flex gap-2">
              <span className="text-amber-500 shrink-0 mt-0.5">→</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pb-2">
        <button
          onClick={handleSave}
          className={`
            flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300
            ${saved
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-velvet-gradient text-white shadow-lg shadow-amber-900/20 active:scale-95'
            }
          `}
        >
          {saved ? '✓ Saved!' : '💾 Save Preset'}
        </button>
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-[#292524] text-stone-300 border border-white/[0.06] hover:bg-[#44403c] transition-all duration-200"
        >
          ↩ New Analysis
        </button>
      </div>

      {/* Apply to System EQ */}
      {onApplySystemEQ && (
        <div className="pb-4">
          <button
            onClick={() => {
              onApplySystemEQ();
              setEqApplied(true);
              setTimeout(() => setEqApplied(false), 3000);
            }}
            className={`
              w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300
              ${eqApplied
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-[#292524] text-amber-400 border border-amber-900/20 hover:bg-[#44403c]'
              }
            `}
          >
            {eqApplied ? '✓ Applied to System EQ!' : '🔊 Apply to System EQ'}
          </button>
          <p className="text-[10px] text-stone-600 text-center mt-1.5">
            Applies this EQ to all audio playing on your device
          </p>
        </div>
      )}
    </div>
  );
}
