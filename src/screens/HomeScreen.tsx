import React, { useState, useRef } from 'react';
import type { AnalysisInput, ListenerPreference, IEMProfile } from '../types';
import type { iTunesTrack } from '../services/iTunesService';
import { SongSearch } from '../components/SongSearch';
import { PreferenceSelector } from '../components/PreferenceSelector';
import { Card } from '../components/Card';

interface HomeScreenProps {
  onAnalyze: (input: AnalysisInput) => void;
  isAnalyzing: boolean;
  userIEM: IEMProfile | null;
  onEditIEM: () => void;
}

export function HomeScreen({ onAnalyze, isAnalyzing, userIEM, onEditIEM }: HomeScreenProps) {
  const [songTitle, setSongTitle] = useState('');
  const [preference, setPreference] = useState<ListenerPreference>('balanced');
  const [audioFile, setAudioFile] = useState<File | undefined>();
  const [selectedTrack, setSelectedTrack] = useState<iTunesTrack | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!songTitle.trim() || !userIEM) return;
    onAnalyze({
      songTitle,
      iemModel: `${userIEM.brand} ${userIEM.model}`,
      preference,
      audioFile,
      iTunesTrack: selectedTrack ?? undefined,
    });
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

  function handleTrackSelect(track: iTunesTrack | null) {
    setSelectedTrack(track);
    if (track) setAudioFile(undefined);
  }

  const canSubmit = songTitle.trim() && userIEM && !isAnalyzing;

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

      {/* Your IEM Card */}
      {userIEM && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warm-500/15 border border-warm-400/25 flex items-center justify-center">
                <span className="text-lg">🎧</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{userIEM.brand} {userIEM.model}</p>
                <p className="text-xs text-warm-300/80">{userIEM.tuningSignature}</p>
              </div>
            </div>
            <button
              onClick={onEditIEM}
              className="text-xs text-warm-400 hover:text-warm-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-warm-400 transition-all duration-500" style={{ width: `${userIEM.bassLevel * 100}%` }} />
              </div>
              <p className="text-[10px] text-white/40 mt-1">Bass</p>
            </div>
            <div className="text-center">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-green-400 transition-all duration-500" style={{ width: `${userIEM.midLevel * 100}%` }} />
              </div>
              <p className="text-[10px] text-white/40 mt-1">Mids</p>
            </div>
            <div className="text-center">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-cyan-400 transition-all duration-500" style={{ width: `${userIEM.trebleLevel * 100}%` }} />
              </div>
              <p className="text-[10px] text-white/40 mt-1">Treble</p>
            </div>
          </div>
        </Card>
      )}

      {/* Form */}
      <Card className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Song search with iTunes */}
          <SongSearch
            value={songTitle}
            onChange={setSongTitle}
            onTrackSelect={handleTrackSelect}
          />

          {/* File upload — only show when no iTunes track selected */}
          {!selectedTrack && (
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
                    <p className="text-xs text-white/25 mt-0.5">Or search above to auto-analyze from the internet</p>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Selected track preview */}
          {selectedTrack && (
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10 animate-fade-in">
              <img
                src={selectedTrack.artworkUrl100}
                alt=""
                className="w-12 h-12 rounded-lg shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{selectedTrack.trackName}</p>
                <p className="text-xs text-white/40 truncate">{selectedTrack.artistName} • {selectedTrack.collectionName}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 font-medium shrink-0">
                🍎 iTunes
              </span>
            </div>
          )}

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
                {selectedTrack ? 'Analyzing from iTunes...' : 'Analyzing...'}
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
          <li>• Search any song — analyzes real audio from iTunes previews</li>
          <li>• Or type song titles / artist names for instant heuristic matching</li>
          <li>• Rate results to help the ML model learn your preferences</li>
          <li>• Check the 🧠 Insights tab to see what the model has learned</li>
        </ul>
      </Card>
    </div>
  );
}
