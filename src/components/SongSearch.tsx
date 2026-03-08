import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchSongs, getHighResArtwork, type iTunesTrack } from '../services/iTunesService';

interface SongSearchProps {
    value: string;
    onChange: (value: string) => void;
    onTrackSelect: (track: iTunesTrack | null) => void;
}

export function SongSearch({ value, onChange, onTrackSelect }: SongSearchProps) {
    const [results, setResults] = useState<iTunesTrack[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<iTunesTrack | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    const doSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        setIsSearching(true);
        const tracks = await searchSongs(query);
        setResults(tracks);
        setShowDropdown(tracks.length > 0);
        setIsSearching(false);
    }, []);

    useEffect(() => {
        if (selectedTrack) return; // Don't search when we just selected
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 350);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [value, doSearch, selectedTrack]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function handleSelect(track: iTunesTrack) {
        setSelectedTrack(track);
        onChange(`${track.trackName} — ${track.artistName}`);
        onTrackSelect(track);
        setShowDropdown(false);
    }

    function handleClear() {
        setSelectedTrack(null);
        onChange('');
        onTrackSelect(null);
        setResults([]);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedTrack(null);
        onTrackSelect(null);
        onChange(e.target.value);
    }

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-xs font-semibold text-white/60 mb-1.5 tracking-wide">
                Song Title or Artist
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                    {selectedTrack ? (
                        <img
                            src={selectedTrack.artworkUrl100}
                            alt=""
                            className="w-5 h-5 rounded-sm"
                        />
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => results.length > 0 && !selectedTrack && setShowDropdown(true)}
                    placeholder="Search any song on the internet..."
                    className="w-full bg-white/5 border border-white/12 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-white/30 outline-none focus:border-warm-400/50 focus:bg-white/8 transition-all duration-200"
                />
                {/* Loading / Clear indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                        <svg className="w-4 h-4 text-warm-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                        </svg>
                    ) : selectedTrack ? (
                        <button onClick={handleClear} className="text-white/30 hover:text-white/60 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : value.length > 0 ? (
                        <span className="text-[10px] text-white/20 font-medium">iTunes</span>
                    ) : null}
                </div>
            </div>

            {/* Hint */}
            <p className="text-[11px] text-white/25 mt-1.5 pl-1">
                {selectedTrack
                    ? `🍎 Found on iTunes • ${selectedTrack.primaryGenreName}`
                    : 'Searches Apple Music catalog — any song, any artist'
                }
            </p>

            {/* Dropdown results */}
            {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-[#1a1828]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
                    {results.map((track) => (
                        <button
                            key={track.trackId}
                            onClick={() => handleSelect(track)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/8 transition-colors text-left"
                        >
                            <img
                                src={track.artworkUrl100}
                                alt=""
                                className="w-10 h-10 rounded-lg shadow-md shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-white font-medium truncate">{track.trackName}</p>
                                <p className="text-xs text-white/40 truncate">{track.artistName} • {track.primaryGenreName}</p>
                            </div>
                            <span className="text-[10px] text-white/20 shrink-0">🍎</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
