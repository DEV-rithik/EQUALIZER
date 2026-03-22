import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { iTunesTrack } from '../services/iTunesService';
import { searchSongs } from '../services/iTunesService';

interface SongSearchProps {
  value: string;
  onChange: (v: string) => void;
  onTrackSelect: (track: iTunesTrack | null) => void;
}

export function SongSearch({ value, onChange, onTrackSelect }: SongSearchProps) {
  const [results, setResults] = useState<iTunesTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const tracks = await searchSongs(query);
      setResults(tracks);
      setShowResults(true);
    } catch {
      setResults([]);
    }
    setIsSearching(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value, doSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(track: iTunesTrack) {
    onChange(track.trackName);
    onTrackSelect(track);
    setShowResults(false);
  }

  return (
    <div ref={containerRef} className="relative group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-on-surface-variant">search</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); onTrackSelect(null); }}
        onFocus={() => results.length > 0 && setShowResults(true)}
        className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-14 pr-6 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/60"
        placeholder="Search for a song..."
      />
      {isSearching && (
        <div className="absolute right-5 inset-y-0 flex items-center">
          <span className="material-symbols-outlined text-primary animate-spin text-xl">progress_activity</span>
        </div>
      )}

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/15 max-h-64 overflow-y-auto z-30">
          {results.map((track) => (
            <button
              key={track.trackId}
              onClick={() => handleSelect(track)}
              className="w-full flex items-center gap-3 p-3 hover:bg-surface-container-low transition-colors text-left"
            >
              <img
                src={track.artworkUrl100}
                alt=""
                className="w-10 h-10 rounded-lg shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface font-medium truncate">{track.trackName}</p>
                <p className="text-xs text-on-surface-variant truncate">{track.artistName} • {track.collectionName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
