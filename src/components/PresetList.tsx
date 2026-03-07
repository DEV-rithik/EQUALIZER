import React from 'react';
import type { Preset } from '../types';
import { Card } from './Card';
import { deletePreset } from '../utils/storage';

interface PresetListProps {
  presets: Preset[];
  onLoad: (preset: Preset) => void;
  onRefresh: () => void;
}

export function PresetList({ presets, onLoad, onRefresh }: PresetListProps) {
  function handleDelete(id: string) {
    deletePreset(id);
    onRefresh();
  }

  if (presets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl mb-3">🎧</span>
        <p className="text-white/40 text-sm">No saved presets yet.</p>
        <p className="text-white/25 text-xs mt-1">Analyze a song and save your EQ!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {presets.map(preset => (
        <Card key={preset.id} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{preset.name}</p>
              <p className="text-xs text-white/40 mt-0.5">
                {preset.songProfile.genre} · {preset.iemProfile.brand} {preset.iemProfile.model}
              </p>
              <p className="text-xs text-white/25 mt-0.5">
                {new Date(preset.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onLoad(preset)}
                className="text-xs px-3 py-1.5 rounded-lg bg-warm-500/20 text-warm-300 border border-warm-500/30 hover:bg-warm-500/30 transition-colors"
              >
                Load
              </button>
              <button
                onClick={() => handleDelete(preset.id)}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          {/* Mini EQ preview */}
          <div className="flex gap-px mt-3 h-8 items-end">
            {Object.values(preset.eqRecommendation.gains).map((gain, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${((gain + 6) / 12) * 100}%`,
                  minHeight: '2px',
                  background: gain >= 0 ? 'rgba(212,131,42,0.6)' : 'rgba(96,165,250,0.6)',
                }}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
