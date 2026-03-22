import React, { useState } from 'react';
import type { AnalysisResult, VibeModeType, Preset, EQFeedbackRating } from '../types';
import { EQ_BANDS } from '../types';
import { savePreset, generatePresetId } from '../utils/storage';

interface ResultsScreenProps {
  result: AnalysisResult;
  songTitle: string;
  iemModel: string;
  preference: string;
  vibeMode: VibeModeType;
  onBack: () => void;
  onApplySystemEQ?: () => void;
}

export function ResultsScreen({ result, songTitle, vibeMode, onBack, onApplySystemEQ }: ResultsScreenProps) {
  const [saved, setSaved] = useState(false);

  const { songProfile: song, iemProfile: iem, eqRecommendation: eq } = result;

  // Map genre to display text
  const genreDisplay: Record<string, string> = {
    'pop': 'POP', 'rock': 'ROCK', 'electronic': 'ELECTRO', 'jazz': 'JAZZ',
    'classical': 'CLASSICAL', 'hip-hop': 'HIP-HOP', 'r&b': 'R&B', 'metal': 'METAL',
    'folk': 'FOLK', 'ambient': 'AMBIENT', 'unknown': 'GENRE',
  };

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

  // Compute EQ bar heights from gains
  const gainEntries = Object.entries(eq.gains) as [string, number][];
  const maxGain = 10;

  return (
    <div className="min-h-screen bg-background text-on-background pb-8 animate-slide-up">
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
        <button className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <span className="material-symbols-outlined text-zinc-400">settings</span>
        </button>
      </header>

      <main className="pt-24 pb-8 px-6 max-w-2xl mx-auto space-y-10">
        {/* Hero: Album Art & Song Info */}
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            {song.albumArt ? (
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-2xl">
                <img alt="Song Artwork" className="w-full h-full object-cover" src={song.albumArt} />
              </div>
            ) : (
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">{song.title || songTitle}</h2>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold tracking-widest text-primary">
                {genreDisplay[song.genre] || song.genre.toUpperCase()}
              </span>
            </div>
            {song.source === 'itunes' && (
              <p className="text-lg md:text-xl text-on-surface-variant font-medium">{songTitle}</p>
            )}
          </div>
        </section>

        {/* EQ Visualization Section */}
        <section className="bg-surface-container-low rounded-xl p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1 block">Audio Profile</span>
              <h3 className="text-2xl font-bold text-on-surface">Precision Tuning</h3>
            </div>
            <div className="flex gap-2">
              {result.mlEnhanced && (
                <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider">
                  AI Enhanced
                </span>
              )}
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-sm active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
              </button>
            </div>
          </div>

          {/* 10-Band EQ Graph — Stitch bar chart */}
          <div className="relative h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-t border-on-surface"></div>
              <div className="border-t border-on-surface border-dashed"></div>
              <div className="border-t border-on-surface"></div>
              <div className="border-t border-on-surface border-dashed"></div>
              <div className="border-t border-on-surface"></div>
            </div>
            {/* EQ Bars */}
            {gainEntries.map(([band, gain], index) => {
              const normalizedHeight = ((gain + maxGain) / (maxGain * 2)) * 100;
              const opacityStep = 0.2 + (index / gainEntries.length) * 0.8;
              return (
                <div
                  key={band}
                  className="flex-1 bg-primary rounded-t-full eq-bar"
                  style={{
                    height: `${Math.max(normalizedHeight, 5)}%`,
                    opacity: opacityStep,
                  }}
                />
              );
            })}
          </div>

          {/* Frequency Labels */}
          <div className="flex justify-between px-1">
            <span className="text-[10px] font-bold text-on-surface-variant opacity-50">32Hz</span>
            <span className="text-[10px] font-bold text-on-surface-variant opacity-50">1kHz</span>
            <span className="text-[10px] font-bold text-on-surface-variant opacity-50">16kHz</span>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col items-center space-y-4">
          {/* Apply EQ */}
          {onApplySystemEQ && (
            <button
              onClick={onApplySystemEQ}
              className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
              Apply EQ Settings
            </button>
          )}
          <p className="text-xs text-on-surface-variant opacity-70">
            Settings optimized for {iem.brand} {iem.model} IEMs
          </p>

          {/* Save / New Analysis */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleSave}
              className={`
                flex-1 py-3.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
                ${saved
                  ? 'bg-primary/10 text-primary'
                  : 'bg-surface-container-lowest text-on-surface border border-outline-variant/15 active:scale-95'
                }
              `}
            >
              <span className="material-symbols-outlined text-sm">{saved ? 'check_circle' : 'save'}</span>
              {saved ? 'Saved!' : 'Save Preset'}
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3.5 rounded-full text-sm font-bold bg-surface-container-lowest text-on-surface border border-outline-variant/15 active:scale-95 transition-all duration-200"
            >
              ↩ New Analysis
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
