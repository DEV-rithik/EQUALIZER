import React, { useState, useRef } from 'react';
import type { AnalysisInput, ListenerPreference, IEMProfile } from '../types';
import type { iTunesTrack } from '../services/iTunesService';
import { SongSearch } from '../components/SongSearch';
import { PreferenceSelector } from '../components/PreferenceSelector';

interface HomeScreenProps {
  onAnalyze: (input: AnalysisInput) => void;
  isAnalyzing: boolean;
  userIEM: IEMProfile | null;
  onEditIEM: () => void;
  onOpenEqualizer: () => void;
  onOpenPresets: () => void;
}

export function HomeScreen({ onAnalyze, isAnalyzing, userIEM, onEditIEM, onOpenEqualizer, onOpenPresets }: HomeScreenProps) {
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
    <div className="space-y-12 animate-fade-in">
      {/* Search & Quick Access */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Home</h2>
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">library_music</span>
            <span className="text-sm font-medium">Saved Presets</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Song Search */}
          <SongSearch
            value={songTitle}
            onChange={setSongTitle}
            onTrackSelect={handleTrackSelect}
          />

          {/* File upload — only when no iTunes track */}
          {!selectedTrack && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-outline-variant rounded-xl h-28 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-all duration-300 group"
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
                  <p className="text-sm text-primary font-medium">🎵 {audioFile.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Tap to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">cloud_upload</span>
                  <p className="text-sm text-on-surface font-medium mt-1">Upload audio file</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">WAV, FLAC, MP3 (Up to 50MB)</p>
                </div>
              )}
            </button>
          )}

          {/* Selected track preview */}
          {selectedTrack && (
            <div className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3 animate-fade-in">
              <img
                src={selectedTrack.artworkUrl100}
                alt=""
                className="w-12 h-12 rounded-lg shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface font-medium truncate">{selectedTrack.trackName}</p>
                <p className="text-xs text-on-surface-variant truncate">{selectedTrack.artistName} • {selectedTrack.collectionName}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold shrink-0">
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
              w-full h-14 rounded-full font-bold text-lg tracking-wide
              transition-all duration-300 flex items-center justify-center gap-3
              ${canSubmit
                ? 'bg-primary-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              }
            `}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                {selectedTrack ? 'Analyzing from iTunes...' : 'Analyzing...'}
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
                Analyze & Generate EQ
              </>
            )}
          </button>
        </form>
      </section>

      {/* Now Connected — IEM Card (editorial style) */}
      {userIEM && (
        <section className="space-y-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary block">Now Connected</span>
          <div className="relative rounded-xl overflow-hidden shadow-2xl group cursor-pointer bg-inverse-surface" onClick={onEditIEM}>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <p className="text-inverse-on-surface/70 font-medium text-sm">{userIEM.tuningSignature}</p>
                <h3 className="text-white text-3xl font-extrabold tracking-tighter">{userIEM.brand} {userIEM.model}</h3>
              </div>
              <div className="flex items-center gap-6 py-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Signature</span>
                  <span className="text-zinc-100 font-medium">{userIEM.tuningSignature}</span>
                </div>
                <div className="w-px h-8 bg-zinc-700"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">State</span>
                  <span className="text-rose-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contextual Quick Stats (Bento Style) */}
      <section className="grid grid-cols-2 gap-4">
        <button
          onClick={onOpenEqualizer}
          className="bg-surface-container-low p-6 rounded-lg space-y-2 text-left hover:bg-surface-container-high transition-colors active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-primary">equalizer</span>
          <p className="text-sm font-semibold text-on-surface">Equalizer</p>
          <p className="text-xs text-on-surface-variant">Custom EQ settings</p>
        </button>
        <div className="bg-surface-container-low p-6 rounded-lg space-y-2">
          <span className="material-symbols-outlined text-primary">hearing</span>
          <p className="text-sm font-semibold text-on-surface">Sound Profile</p>
          <p className="text-xs text-on-surface-variant">{userIEM ? `${userIEM.brand} ${userIEM.model}` : 'Not set'}</p>
        </div>
      </section>
    </div>
  );
}
