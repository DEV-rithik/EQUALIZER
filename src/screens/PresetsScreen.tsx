import React, { useState, useEffect } from 'react';
import type { Preset } from '../types';
import { loadPresets } from '../utils/storage';

interface PresetsScreenProps {
  onLoad: (preset: Preset) => void;
}

export function PresetsScreen({ onLoad }: PresetsScreenProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const filtered = presets.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.songTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Editorial Header */}
      <section>
        <p className="text-primary font-bold tracking-[0.05em] text-[0.75rem] uppercase mb-2">Your Library</p>
        <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface leading-tight">Saved Presets</h2>
      </section>

      {/* Search */}
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/40 transition-all text-on-surface placeholder:text-on-surface-variant/60"
          placeholder="Search your presets..."
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Preset Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10">
          {filtered.map((preset, index) => (
            <div
              key={preset.id}
              onClick={() => onLoad(preset)}
              className={`group cursor-pointer active:scale-[0.98] transition-all ${
                index === 0 ? 'col-span-2' : ''
              }`}
            >
              {/* Card with gradient or color */}
              <div className={`${
                index === 0
                  ? 'relative aspect-[21/9] rounded-xl overflow-hidden mb-4 bg-primary shadow-lg shadow-primary/10'
                  : 'aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container-low transition-transform group-hover:-translate-y-1'
              }`}>
                {index === 0 ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-container/80"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>equalizer</span>
                        <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase">Latest Preset</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white tracking-tight">{preset.songTitle}</h3>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container-low to-surface-container-high">
                    <span className="material-symbols-outlined text-primary text-5xl opacity-30" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
                  </div>
                )}
              </div>

              <div className="px-1">
                {index !== 0 && (
                  <h4 className="font-bold text-lg text-on-surface tracking-tight">{preset.songTitle}</h4>
                )}
                <p className="text-on-surface-variant text-sm">{preset.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="material-symbols-outlined text-on-surface-variant text-5xl opacity-30">library_music</span>
          <p className="text-on-surface-variant text-sm">
            {searchQuery ? 'No presets match your search' : 'No saved presets yet. Analyze a song to get started!'}
          </p>
        </div>
      )}
    </div>
  );
}
