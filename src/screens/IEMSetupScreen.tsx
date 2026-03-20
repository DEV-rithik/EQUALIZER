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
        <div className="flex flex-col gap-8 animate-fade-in">
            {/* Hero */}
            <div>
                <h1 className="font-extrabold text-3xl text-stone-100 tracking-tight">Setup Your IEM</h1>
                <p className="text-stone-500 text-sm mt-2 max-w-xs leading-relaxed">
                    Configure your in-ear monitors to calibrate the audio engine for your specific hardware.
                </p>
            </div>

            {/* Brand & Model */}
            <div className="flex flex-col gap-5">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 px-1">Brand Name</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        placeholder="e.g. Sennheiser"
                        className="w-full bg-[#0c0b0a] border-none ring-1 ring-white/[0.06] focus:ring-amber-600/50 rounded-lg py-4 px-5 text-stone-100 placeholder-stone-700 transition-all duration-300 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 px-1">Model Name</label>
                    <input
                        type="text"
                        value={model}
                        onChange={e => setModel(e.target.value)}
                        placeholder="e.g. IE 900"
                        className="w-full bg-[#0c0b0a] border-none ring-1 ring-white/[0.06] focus:ring-amber-600/50 rounded-lg py-4 px-5 text-stone-100 placeholder-stone-700 transition-all duration-300 outline-none"
                    />
                </div>
            </div>

            {/* Tuning Signature */}
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3 px-1">Tuning Signature</label>
                <div className="grid grid-cols-2 gap-2.5">
                    {TUNING_OPTIONS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTuning(t)}
                            className={`
                                text-left px-4 py-3.5 rounded-lg text-xs font-medium transition-all duration-300
                                flex items-center justify-between
                                ${tuning === t
                                    ? 'bg-amber-600 text-amber-50 shadow-lg shadow-amber-900/20'
                                    : 'bg-[#292524] text-stone-400 hover:bg-[#44403c] hover:text-stone-200'
                                }
                            `}
                        >
                            {t}
                            {tuning === t && <span className="text-[10px]">✓</span>}
                        </button>
                    ))}
                </div>
                <p className="text-[11px] text-stone-600 mt-2 pl-1">{TUNING_DESCRIPTIONS[tuning]}</p>
            </div>

            {/* Sound Profile Calibration */}
            <Card className="p-6">
                <div className="flex justify-between items-end mb-6">
                    <h3 className="font-bold text-base text-stone-100">Sound Profile Calibration</h3>
                    <span className="text-[10px] text-stone-600">Manual Override</span>
                </div>
                <div className="flex flex-col gap-8">
                    {/* Bass */}
                    <div>
                        <div className="flex justify-between items-center px-1 mb-3">
                            <span className="text-sm font-medium text-stone-200">Bass</span>
                            <span className="text-sm font-semibold text-amber-500">{Math.round((bass - 0.5) * 200)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={bass}
                            onChange={e => setBass(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] uppercase tracking-wide text-stone-600 mt-1 px-1">
                            <span>Lean</span>
                            <span>Impactful</span>
                        </div>
                    </div>

                    {/* Mids */}
                    <div>
                        <div className="flex justify-between items-center px-1 mb-3">
                            <span className="text-sm font-medium text-stone-200">Mids</span>
                            <span className="text-sm font-semibold text-amber-500">{Math.round((mid - 0.5) * 200)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={mid}
                            onChange={e => setMid(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] uppercase tracking-wide text-stone-600 mt-1 px-1">
                            <span>Recessed</span>
                            <span>Forward</span>
                        </div>
                    </div>

                    {/* Treble */}
                    <div>
                        <div className="flex justify-between items-center px-1 mb-3">
                            <span className="text-sm font-medium text-stone-200">Treble</span>
                            <span className="text-sm font-semibold text-amber-500">{Math.round((treble - 0.5) * 200)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={treble}
                            onChange={e => setTreble(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] uppercase tracking-wide text-stone-600 mt-1 px-1">
                            <span>Smooth</span>
                            <span>Crisp</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Save */}
            <button
                onClick={handleSave}
                disabled={!canSave}
                className={`
                    w-full py-5 rounded-xl font-bold text-sm tracking-wide
                    transition-all duration-300 flex items-center justify-center gap-2
                    ${canSave
                        ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-[0_20px_40px_rgba(217,119,6,0.15)] hover:scale-[1.01] active:scale-95'
                        : 'bg-[#292524] text-stone-600 cursor-not-allowed'
                    }
                `}
            >
                {existingProfile ? 'Update IEM Profile' : 'Save & Continue'}
                {canSave && <span>→</span>}
            </button>

            {/* Hardware Image Section */}
            <div className="w-full relative overflow-hidden rounded-2xl h-48 bg-[#1c1b1a] group border border-white/[0.06]">
                <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700">
                    <img
                        className="w-full h-full object-cover grayscale brightness-50"
                        src="https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&q=80"
                        alt="Premium IEM detail"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em]">Hardware Integration</span>
                    <h4 className="text-xl font-bold text-stone-100 mt-1">Studio-Grade Precision</h4>
                </div>
            </div>

            {/* Tip */}
            <p className="text-xs text-stone-600 text-center pb-4">
                💡 Don't know your IEM's tuning? Just enter the brand and model, leave sliders at center, and pick "Harman Target".
            </p>
        </div>
    );
}
