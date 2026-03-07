import React, { useState } from 'react';
import type { AnalysisResult, VibeModeType, Preset } from '../types';
import { Card } from '../components/Card';
import { EQChart } from '../components/EQChart';
import { EQBandGrid } from '../components/EQBandGrid';
import { savePreset, generatePresetId } from '../utils/storage';

interface ResultsScreenProps {
  result: AnalysisResult;
  songTitle: string;
  iemModel: string;
  preference: string;
  vibeMode: VibeModeType;
  onBack: () => void;
}

function MoodBadge({ mood }: { mood: string }) {
  const colors: Record<string, string> = {
    energetic: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    peaceful: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    intense: 'bg-red-500/20 text-red-300 border-red-500/30',
    melancholic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    uplifting: 'bg-green-500/20 text-green-300 border-green-500/30',
    relaxed: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${colors[mood] ?? 'bg-white/10 text-white/60 border-white/20'}`}>
      {mood}
    </span>
  );
}

function ProgressBar({ value, color = 'bg-warm-400' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

function ConfidencePill({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color = pct > 70 ? 'text-green-400' : pct > 40 ? 'text-yellow-400' : 'text-red-400';
  return (
    <span className={`text-xs font-semibold ${color}`}>{pct}% match</span>
  );
}

export function ResultsScreen({ result, songTitle, vibeMode, onBack }: ResultsScreenProps) {
  const [saved, setSaved] = useState(false);
  const [showAllBands, setShowAllBands] = useState(false);

  const { songProfile: song, iemProfile: iem, eqRecommendation: eq } = result;

  const isEnergetic = vibeMode === 'energetic';

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
    <div className={`flex flex-col gap-4 animate-slide-up transition-colors duration-700`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
        >
          <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-base font-bold text-white">EQ Results</h2>
          <p className="text-xs text-white/40 truncate max-w-[200px]">{songTitle}</p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
            isEnergetic
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
          }`}>
            {isEnergetic ? '⚡ Energetic' : '🌙 Peaceful'}
          </span>
        </div>
      </div>

      {/* Song profile */}
      <Card className="p-4" glowing={isEnergetic}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎵</span>
          <h3 className="text-sm font-semibold text-warm-200">Song Profile</h3>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-white/70 capitalize">{song.genre}</span>
          <MoodBadge mood={song.mood} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/40">Energy</span>
              <span className="text-white/70">{Math.round(song.energy * 100)}%</span>
            </div>
            <ProgressBar value={song.energy} color={isEnergetic ? 'bg-orange-400' : 'bg-blue-400'} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/40">Bass</span>
              <span className="text-white/70">{Math.round(song.bassEmphasis * 100)}%</span>
            </div>
            <ProgressBar value={song.bassEmphasis} color="bg-warm-400" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/40">Vocals</span>
              <span className="text-white/70">{Math.round(song.vocalPresence * 100)}%</span>
            </div>
            <ProgressBar value={song.vocalPresence} color="bg-purple-400" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/40">Treble</span>
              <span className="text-white/70">{Math.round(song.trebleEnergy * 100)}%</span>
            </div>
            <ProgressBar value={song.trebleEnergy} color="bg-cyan-400" />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/8 flex items-center gap-4">
          <span className="text-xs text-white/40">Est. BPM: <span className="text-white/70">{song.bpmEstimate}</span></span>
          <span className="text-xs text-white/40">Rhythm: <span className="text-white/70">{Math.round(song.rhythmIntensity * 100)}%</span></span>
        </div>
      </Card>

      {/* IEM profile */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎧</span>
          <h3 className="text-sm font-semibold text-warm-200">IEM Profile</h3>
          <ConfidencePill confidence={iem.confidence} />
        </div>
        <div className="mb-2">
          <p className="text-sm font-bold text-white">{iem.brand} {iem.model}</p>
          <p className="text-xs text-warm-300/80 mt-0.5">{iem.tuningSignature}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {iem.tonalNotes.map((note, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/50 border border-white/10">
              {note}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <ProgressBar value={iem.bassLevel} color="bg-warm-400" />
            <p className="text-[10px] text-white/40 mt-1">Bass</p>
          </div>
          <div className="text-center">
            <ProgressBar value={iem.midLevel} color="bg-green-400" />
            <p className="text-[10px] text-white/40 mt-1">Mids</p>
          </div>
          <div className="text-center">
            <ProgressBar value={iem.trebleLevel} color="bg-cyan-400" />
            <p className="text-[10px] text-white/40 mt-1">Treble</p>
          </div>
        </div>
      </Card>

      {/* EQ Graph */}
      <Card className="p-4" glowing>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <h3 className="text-sm font-semibold text-warm-200">15-Band EQ</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-white/40">Preamp: </span>
            <span className="text-xs font-mono text-warm-300">
              {eq.preamp.toFixed(1)} dB
            </span>
          </div>
        </div>
        <EQChart gains={eq.gains} vibeMode={vibeMode} />
      </Card>

      {/* Band values */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-warm-200">Band Values</h3>
          <button
            onClick={() => setShowAllBands(!showAllBands)}
            className="text-xs text-warm-400 underline"
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
                  height: `${((gain + 6) / 12) * 100}%`,
                  minHeight: '3px',
                  background: gain >= 0 ? 'rgba(212,131,42,0.7)' : 'rgba(96,165,250,0.7)',
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
          <h3 className="text-sm font-semibold text-warm-200">Why This EQ?</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {eq.reasoning.map((reason, i) => (
            <li key={i} className="text-xs text-white/60 flex gap-2">
              <span className="text-warm-400 shrink-0 mt-0.5">→</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={handleSave}
          className={`
            flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300
            ${saved
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-warm-500/20 text-warm-300 border border-warm-500/30 hover:bg-warm-500/30'
            }
          `}
        >
          {saved ? '✓ Saved!' : '💾 Save Preset'}
        </button>
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl text-sm font-semibold bg-white/8 text-white/60 border border-white/10 hover:bg-white/12 transition-all duration-200"
        >
          ↩ New Analysis
        </button>
      </div>
    </div>
  );
}
