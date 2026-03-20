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
      <div className="border-2 border-dashed border-stone-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#292524] flex items-center justify-center">
          <span className="text-3xl">🎧</span>
        </div>
        <div>
          <p className="text-stone-300 font-bold">No presets yet</p>
          <p className="text-xs text-stone-600 mt-1">Analyze a song and save your EQ!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {presets.map(preset => (
        <Card key={preset.id} className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-stone-100 truncate">{preset.name}</h3>
              <p className="text-xs text-stone-500 mt-0.5 uppercase tracking-widest font-semibold">
                {preset.songProfile.genre} · {preset.iemProfile.brand} {preset.iemProfile.model}
              </p>
            </div>
            <div className="bg-[#292524] p-2 rounded-xl text-amber-500 shrink-0">
              <span className="text-xl">🎧</span>
            </div>
          </div>

          {/* Mini EQ Chart */}
          <div className="h-16 w-full bg-[#0c0b0a] rounded-2xl relative overflow-hidden flex items-end px-3 py-2 border border-stone-800/30 mb-4">
            <div className="absolute inset-0 opacity-5 bg-gradient-to-t from-amber-500 to-transparent" />
            <div className="flex items-end gap-[2px] w-full h-10">
              {Object.values(preset.eqRecommendation.gains).map((gain, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(((gain + 10) / 20) * 100, 5)}%`,
                    background: `rgba(217, 119, 6, ${0.3 + ((gain + 10) / 20) * 0.6})`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onLoad(preset)}
              className="flex-1 bg-velvet-gradient text-white py-3 rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-amber-900/20 active:scale-95 transition-transform"
            >
              Load
            </button>
            <button
              onClick={() => handleDelete(preset.id)}
              className="bg-[#292524] hover:bg-red-950/30 hover:text-red-400 text-stone-500 px-4 rounded-2xl transition-all duration-300"
            >
              ✕
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
