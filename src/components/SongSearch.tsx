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
        if (selectedTrack) return;
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
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
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
                    placeholder="Search track, artist, or genre..."
                    className="w-full bg-[#0c0b0a] border border-white/[0.06] rounded-xl py-4 pl-12 pr-12 text-sm text-stone-100 placeholder-stone-700 outline-none focus:ring-1 focus:ring-amber-600/50 transition-all duration-300"
                />
                {/* Loading / Clear indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                        <svg className="w-4 h-4 text-amber-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                        </svg>
                    ) : selectedTrack ? (
                        <button onClick={handleClear} className="text-stone-500 hover:text-stone-300 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : value.length > 0 ? (
                        <span className="text-[10px] text-stone-600 font-medium">iTunes</span>
                    ) : null}
                </div>
            </div>

            {/* Hint */}
            <p className="text-[11px] text-stone-600 mt-1.5 pl-1">
                {selectedTrack
                    ? `🍎 Found on iTunes • ${selectedTrack.primaryGenreName}`
                    : 'Searches Apple Music catalog — any song, any artist'
                }
            </p>

            {/* Dropdown results */}
            {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-[#1c1917]/95 backdrop-blur-xl border border-amber-900/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
                    {results.map((track) => (
                        <button
                            key={track.trackId}
                            onClick={() => handleSelect(track)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left"
                        >
                            <img
                                src={track.artworkUrl100}
                                alt=""
                                className="w-10 h-10 rounded-lg shadow-md shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-stone-100 font-medium truncate">{track.trackName}</p>
                                <p className="text-xs text-stone-500 truncate">{track.artistName} • {track.primaryGenreName}</p>
                            </div>
                            <span className="text-[10px] text-stone-600 shrink-0">🍎</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
