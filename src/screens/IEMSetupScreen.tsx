import React, { useState } from 'react';
import type { IEMProfile, TuningSignature } from '../types';
import { Card } from '../components/Card';

const TUNING_OPTIONS: TuningSignature[] = [
    'Harman Target', 'V-Shape', 'Sharp V', 'Balanced V', 'Warm Neutral',
    'Bright', 'Dark', 'U-Shape', 'W-Shape', 'Mid-Forward', 'Diffuse Field', 'Bass Boosted',
];

const TUNING_DESCRIPTIONS: Record<TuningSignature, string> = {
    'Harman Target': 'Neutral with slight bass lift — most popular reference',
    'V-Shape': 'Boosted bass + treble, recessed mids — fun signature',
    'Sharp V': 'Extreme V-shape — very scooped mids',
    'Balanced V': 'Gentle bass + treble lift — subtle V',
    'Warm Neutral': 'Slightly warm, smooth — easy listening',
    'Bright': 'Forward treble, lean bass — analytical',
    'Dark': 'Rolled-off treble, warm bass — smooth, thick',
    'U-Shape': 'Sub-bass + upper treble boost — deep and airy',
    'W-Shape': 'Bass + mid + treble peaks — lively and dynamic',
    'Mid-Forward': 'Forward mids — great for vocals',
    'Diffuse Field': 'Flat reference — studio monitoring',
    'Bass Boosted': 'Heavy bass emphasis — bass-head tuning',
};

interface IEMSetupScreenProps {
    onSave: (profile: IEMProfile) => void;
    existingProfile?: IEMProfile | null;
}

export function IEMSetupScreen({ onSave, existingProfile }: IEMSetupScreenProps) {
    const [brand, setBrand] = useState(existingProfile?.brand ?? '');
    const [model, setModel] = useState(existingProfile?.model ?? '');
    const [tuning, setTuning] = useState<TuningSignature>(existingProfile?.tuningSignature ?? 'Harman Target');
    const [bass, setBass] = useState(existingProfile?.bassLevel ?? 0.5);
    const [mid, setMid] = useState(existingProfile?.midLevel ?? 0.5);
    const [treble, setTreble] = useState(existingProfile?.trebleLevel ?? 0.5);

    function handleSave() {
        if (!brand.trim() || !model.trim()) return;
        const profile: IEMProfile = {
            id: `user-${brand.toLowerCase().replace(/\s+/g, '-')}-${model.toLowerCase().replace(/\s+/g, '-')}`,
            brand: brand.trim(),
            model: model.trim(),
            tuningSignature: tuning,
            tonalNotes: [TUNING_DESCRIPTIONS[tuning]],
            bassLevel: bass,
            midLevel: mid,
            trebleLevel: treble,
            confidence: 1,
        };
        onSave(profile);
    }

    const canSave = brand.trim() && model.trim();

    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            {/* Header */}
            <div className="text-center pt-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warm-500/15 border border-warm-400/25 mb-3">
                    <span className="text-3xl">🎧</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Setup Your IEM</h1>
                <p className="text-sm text-white/40 mt-1">Tell us about your earphones for personalized EQ</p>
            </div>

            {/* Brand & Model */}
            <Card className="p-5">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-white/60 mb-1.5 tracking-wide">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                            placeholder="e.g. Moondrop, KZ, Sony..."
                            className="w-full bg-white/5 border border-white/12 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-warm-400/50 focus:bg-white/8 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white/60 mb-1.5 tracking-wide">Model</label>
                        <input
                            type="text"
                            value={model}
                            onChange={e => setModel(e.target.value)}
                            placeholder="e.g. Aria, ZSN Pro, WF-1000XM5..."
                            className="w-full bg-white/5 border border-white/12 rounded-xl py-3 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-warm-400/50 focus:bg-white/8 transition-all duration-200"
                        />
                    </div>
                </div>
            </Card>

            {/* Tuning Signature */}
            <Card className="p-5">
                <label className="block text-xs font-semibold text-white/60 mb-3 tracking-wide">Tuning Signature</label>
                <div className="grid grid-cols-2 gap-2">
                    {TUNING_OPTIONS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTuning(t)}
                            className={`
                text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                ${tuning === t
                                    ? 'bg-warm-500/20 border-warm-400/40 text-warm-200'
                                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                                }
              `}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <p className="text-[11px] text-white/30 mt-2 pl-1">{TUNING_DESCRIPTIONS[tuning]}</p>
            </Card>

            {/* Frequency Levels */}
            <Card className="p-5">
                <label className="block text-xs font-semibold text-white/60 mb-3 tracking-wide">
                    Sound Profile (adjust to match your IEM's character)
                </label>
                <div className="flex flex-col gap-4">
                    {/* Bass */}
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-warm-300 font-medium">Bass</span>
                            <span className="text-white/50">{Math.round(bass * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={bass}
                            onChange={e => setBass(parseFloat(e.target.value))}
                            className="w-full accent-warm-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-white/20 mt-0.5">
                            <span>Lean</span>
                            <span>Neutral</span>
                            <span>Heavy</span>
                        </div>
                    </div>

                    {/* Mids */}
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-green-300 font-medium">Mids</span>
                            <span className="text-white/50">{Math.round(mid * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={mid}
                            onChange={e => setMid(parseFloat(e.target.value))}
                            className="w-full accent-green-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-white/20 mt-0.5">
                            <span>Recessed</span>
                            <span>Neutral</span>
                            <span>Forward</span>
                        </div>
                    </div>

                    {/* Treble */}
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-cyan-300 font-medium">Treble</span>
                            <span className="text-white/50">{Math.round(treble * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={treble}
                            onChange={e => setTreble(parseFloat(e.target.value))}
                            className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-white/20 mt-0.5">
                            <span>Rolled off</span>
                            <span>Neutral</span>
                            <span>Bright</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Save */}
            <button
                onClick={handleSave}
                disabled={!canSave}
                className={`
          w-full py-4 rounded-2xl font-semibold text-sm tracking-wide
          transition-all duration-300
          ${canSave
                        ? 'bg-gradient-to-r from-warm-600 to-warm-400 text-white shadow-lg shadow-warm-500/30 hover:shadow-warm-500/50 active:scale-[0.98]'
                        : 'bg-white/8 text-white/30 cursor-not-allowed'
                    }
        `}
            >
                {existingProfile ? 'Update IEM Profile' : 'Save & Continue'}
            </button>

            {/* Tip */}
            <Card className="p-4">
                <p className="text-xs text-white/40">
                    💡 <strong className="text-white/50">Don't know your IEM's tuning?</strong> Just enter the brand and model name, leave sliders at 50%, and pick "Harman Target" — it works great as a starting point.
                </p>
            </Card>
        </div>
    );
}
