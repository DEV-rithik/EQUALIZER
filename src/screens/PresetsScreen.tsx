import React, { useState, useEffect } from 'react';
import type { Preset } from '../types';
import { loadPresets } from '../utils/storage';
import { PresetList } from '../components/PresetList';

interface PresetsScreenProps {
  onLoad: (preset: Preset) => void;
}

export function PresetsScreen({ onLoad }: PresetsScreenProps) {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  function handleRefresh() {
    setPresets(loadPresets());
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-1 block">Vault</span>
        <h2 className="text-2xl font-extrabold text-stone-100 tracking-tight">Saved Presets</h2>
        <p className="text-xs text-stone-500 mt-1">{presets.length} preset{presets.length !== 1 ? 's' : ''} saved</p>
      </div>
      <PresetList presets={presets} onLoad={onLoad} onRefresh={handleRefresh} />
    </div>
  );
}
