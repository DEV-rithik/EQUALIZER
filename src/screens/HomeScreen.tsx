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
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Active Hardware — compact IEM badge */}
      {userIEM && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Active Hardware</span>
              <h2 className="text-lg font-extrabold text-stone-100 mt-1">{userIEM.brand} {userIEM.model}</h2>
              <p className="text-xs text-stone-500 mt-0.5">{userIEM.tuningSignature}</p>
            </div>
            <button
              onClick={onEditIEM}
              className="text-xs text-amber-500 hover:text-amber-400 transition-colors px-3 py-2 rounded-lg bg-[#292524] hover:bg-[#44403c]"
            >
              Change
            </button>
          </div>
        </Card>
      )}

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <SongSearch
          value={songTitle}
          onChange={setSongTitle}
          onTrackSelect={handleTrackSelect}
        />

        {/* File upload — only when no iTunes track */}
        {!selectedTrack && (
          <Card className="p-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-white/[0.06] rounded-xl h-32 flex flex-col items-center justify-center gap-2 hover:border-amber-600/30 hover:bg-amber-900/[0.03] transition-all duration-300 group"
            >
              <input
                ref={fileRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {audioFile ? (
                <div className="text-center">
                  <p className="text-sm text-amber-400 font-medium">🎵 {audioFile.name}</p>
                  <p className="text-xs text-stone-600 mt-0.5">Tap to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#292524] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <span className="text-amber-500 text-sm">☁️</span>
                  </div>
                  <p className="text-sm text-stone-300 font-medium">Upload audio file</p>
                  <p className="text-xs text-stone-600 mt-0.5">WAV, FLAC, MP3 (Up to 50MB)</p>
                </div>
              )}
            </button>
          </Card>
        )}

        {/* Selected track preview */}
        {selectedTrack && (
          <div className="flex items-center gap-3 bg-[#1c1917] rounded-xl p-3 border border-amber-900/15 animate-fade-in">
            <img
              src={selectedTrack.artworkUrl100}
              alt=""
              className="w-12 h-12 rounded-lg shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-stone-100 font-medium truncate">{selectedTrack.trackName}</p>
              <p className="text-xs text-stone-500 truncate">{selectedTrack.artistName} • {selectedTrack.collectionName}</p>
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
            w-full py-5 rounded-2xl font-extrabold text-sm tracking-wide
            transition-all duration-300 relative overflow-hidden
            ${canSubmit
              ? 'bg-velvet-gradient text-white shadow-[0_20px_40px_rgba(217,119,6,0.15)] hover:scale-[1.01] active:scale-95'
              : 'bg-[#292524] text-stone-600 cursor-not-allowed'
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
    </div>
  );
}
