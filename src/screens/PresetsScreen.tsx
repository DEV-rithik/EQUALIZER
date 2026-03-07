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
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-white">Saved Presets</h2>
        <p className="text-xs text-white/40 mt-0.5">{presets.length} preset{presets.length !== 1 ? 's' : ''} saved</p>
      </div>
      <PresetList presets={presets} onLoad={onLoad} onRefresh={handleRefresh} />
    </div>
  );
}
