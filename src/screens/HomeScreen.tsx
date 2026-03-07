import React, { useState, useRef } from 'react';
import type { AnalysisInput, ListenerPreference } from '../types';
import { Input } from '../components/Input';
import { PreferenceSelector } from '../components/PreferenceSelector';
import { Card } from '../components/Card';

interface HomeScreenProps {
  onAnalyze: (input: AnalysisInput) => void;
  isAnalyzing: boolean;
}

export function HomeScreen({ onAnalyze, isAnalyzing }: HomeScreenProps) {
  const [songTitle, setSongTitle] = useState('');
  const [iemModel, setIemModel] = useState('');
  const [preference, setPreference] = useState<ListenerPreference>('balanced');
  const [audioFile, setAudioFile] = useState<File | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!songTitle.trim() || !iemModel.trim()) return;
    onAnalyze({ songTitle, iemModel, preference, audioFile });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      if (!songTitle.trim()) {
        setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  }

  const canSubmit = songTitle.trim() && iemModel.trim() && !isAnalyzing;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Hero */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warm-500/15 border border-warm-400/25 mb-3 animate-float">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">EQUALIZER</h1>
        <p className="text-sm text-white/40 mt-1">AI-powered IEM tuning for your music</p>
      </div>

      {/* Form */}
      <Card className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Song input */}
          <Input
            label="Song Title or Artist"
            placeholder="e.g. Blinding Lights, Bohemian Rhapsody"
            value={songTitle}
            onChange={e => setSongTitle(e.target.value)}
            hint="Song titles, artist names, or genre keywords all work"
            icon={
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            }
          />

          {/* File upload */}
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-white/15 py-4 px-4 text-center hover:border-warm-400/40 hover:bg-warm-500/5 transition-all duration-200"
            >
              <input
                ref={fileRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {audioFile ? (
                <div>
                  <p className="text-sm text-warm-300">🎵 {audioFile.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">Tap to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-white/40">Upload audio file (optional)</p>
                  <p className="text-xs text-white/25 mt-0.5">Analyzes real audio spectrum for best results</p>
                </div>
              )}
            </button>
          </div>

          {/* IEM input */}
          <Input
            label="IEM Model"
            placeholder="e.g. Moondrop Aria, KZ ZSN Pro"
            value={iemModel}
            onChange={e => setIemModel(e.target.value)}
            hint="Brand + model name for best results"
            icon={
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18.5a3.5 3.5 0 1 0 7 0V4a3.5 3.5 0 0 1 7 0" />
              </svg>
            }
          />

          {/* Preference */}
          <PreferenceSelector value={preference} onChange={setPreference} />

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`
              w-full py-4 rounded-2xl font-semibold text-sm tracking-wide
              transition-all duration-300 relative overflow-hidden
              ${canSubmit
                ? 'bg-gradient-to-r from-warm-600 to-warm-400 text-white shadow-lg shadow-warm-500/30 hover:shadow-warm-500/50 active:scale-[0.98]'
                : 'bg-white/8 text-white/30 cursor-not-allowed'
              }
            `}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze & Generate EQ'
            )}
          </button>
        </form>
      </Card>

      {/* Quick tips */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-warm-300 mb-2">💡 Tips</p>
        <ul className="text-xs text-white/40 space-y-1">
          <li>• Enter any song title — 100+ popular songs auto-detected</li>
          <li>• Upload audio for real spectral analysis (bass/treble/vocals)</li>
          <li>• 100+ IEM models recognized, or type any brand name</li>
          <li>• Save presets to revisit your EQ settings</li>
        </ul>
      </Card>
    </div>
  );
}
