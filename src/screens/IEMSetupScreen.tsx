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
        <div className="min-h-screen bg-background text-on-background pb-8">
            {/* Top Bar */}
            <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>headphones</span>
                    </div>
                    <h1 className="font-headline font-bold tracking-tight text-zinc-900 text-xl">Equalizer</h1>
                </div>
            </header>

            <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <section>
                    <span className="text-[10px] font-medium tracking-widest text-on-surface-variant uppercase mb-1 block">Hardware Configuration</span>
                    <h2 className="text-3xl font-bold tracking-tight text-on-surface">IEM Profile</h2>
                    <p className="text-on-surface-variant text-sm mt-2 max-w-xs leading-relaxed">
                        Configure your in-ear monitors to calibrate the audio engine for your specific hardware.
                    </p>
                </section>

                {/* Brand & Model */}
                <section className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">Brand Name</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                            placeholder="e.g. Sennheiser"
                            className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">Model Name</label>
                        <input
                            type="text"
                            value={model}
                            onChange={e => setModel(e.target.value)}
                            placeholder="e.g. IE 900"
                            className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                    </div>
                </section>

                {/* Tuning Signature */}
                <section>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-1">Tuning Signature</label>
                    <div className="grid grid-cols-2 gap-2.5">
                        {TUNING_OPTIONS.map(t => (
                            <button
                                key={t}
                                onClick={() => setTuning(t)}
                                className={`
                                    text-left px-4 py-3.5 rounded-lg text-xs font-medium transition-all duration-300
                                    flex items-center justify-between
                                    ${tuning === t
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                                    }
                                `}
                            >
                                {t}
                                {tuning === t && <span className="material-symbols-outlined text-sm">check</span>}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2 pl-1">{TUNING_DESCRIPTIONS[tuning]}</p>
                </section>

                {/* Sound Profile Calibration */}
                <Card className="p-6">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="font-bold text-base text-on-surface">Sound Profile Calibration</h3>
                        <span className="text-[10px] text-on-surface-variant">Manual Override</span>
                    </div>
                    <div className="flex flex-col gap-8">
                        {/* Bass */}
                        <div>
                            <div className="flex justify-between items-center px-1 mb-3">
                                <span className="text-sm font-medium text-on-surface">Bass</span>
                                <span className="text-sm font-semibold text-primary">{Math.round((bass - 0.5) * 200)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={bass}
                                onChange={e => setBass(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-[10px] uppercase tracking-wide text-on-surface-variant mt-1 px-1">
                                <span>Lean</span>
                                <span>Impactful</span>
                            </div>
                        </div>

                        {/* Mids */}
                        <div>
                            <div className="flex justify-between items-center px-1 mb-3">
                                <span className="text-sm font-medium text-on-surface">Mids</span>
                                <span className="text-sm font-semibold text-primary">{Math.round((mid - 0.5) * 200)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={mid}
                                onChange={e => setMid(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-[10px] uppercase tracking-wide text-on-surface-variant mt-1 px-1">
                                <span>Recessed</span>
                                <span>Forward</span>
                            </div>
                        </div>

                        {/* Treble */}
                        <div>
                            <div className="flex justify-between items-center px-1 mb-3">
                                <span className="text-sm font-medium text-on-surface">Treble</span>
                                <span className="text-sm font-semibold text-primary">{Math.round((treble - 0.5) * 200)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={treble}
                                onChange={e => setTreble(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-[10px] uppercase tracking-wide text-on-surface-variant mt-1 px-1">
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
                        w-full h-14 rounded-full font-bold text-lg tracking-wide
                        transition-all duration-300 flex items-center justify-center gap-2
                        ${canSave
                            ? 'bg-primary-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95'
                            : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                        }
                    `}
                >
                    {existingProfile ? 'Update IEM Profile' : 'Save & Continue'}
                    {canSave && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                </button>

                {/* Tip */}
                <p className="text-xs text-on-surface-variant text-center pb-4">
                    💡 Don't know your IEM's tuning? Enter brand/model, leave sliders at center, and pick "Harman Target".
                </p>
            </main>
        </div>
    );
}
