import React, { useState, useMemo } from 'react';
import type { Genre } from '../types';
import { Card } from '../components/Card';
import { loadFeedback, clearMLData } from '../utils/storage';
import { mlModel } from '../engine/mlModel';

const GENRE_COLORS: Record<string, string> = {
    'pop': 'bg-primary', 'rock': 'bg-primary/80', 'electronic': 'bg-primary',
    'jazz': 'bg-zinc-500', 'classical': 'bg-zinc-500', 'hip-hop': 'bg-primary/60',
    'r&b': 'bg-primary/70', 'metal': 'bg-primary/90', 'folk': 'bg-zinc-400',
    'ambient': 'bg-zinc-400', 'unknown': 'bg-zinc-500',
};

const RATING_CONFIG = {
    'perfect': { label: 'Perfect', color: 'bg-primary', textColor: 'text-primary' },
    'good': { label: 'Good', color: 'bg-primary/60', textColor: 'text-on-surface' },
    'needs_work': { label: 'Needs Work', color: 'bg-zinc-400', textColor: 'text-on-surface-variant' },
    'bad': { label: 'Bad', color: 'bg-zinc-300', textColor: 'text-on-surface-variant' },
};

export function InsightsScreen() {
    const [resetConfirm, setResetConfirm] = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const feedback = useMemo(() => loadFeedback(), [resetDone]);

    const totalFeedback = feedback.length;
    const ratingCounts = useMemo(() => {
        const counts = { perfect: 0, good: 0, needs_work: 0, bad: 0 };
        for (const f of feedback) {
            counts[f.rating] = (counts[f.rating] || 0) + 1;
        }
        return counts;
    }, [feedback]);

    const positiveFeedback = ratingCounts.perfect + ratingCounts.good;
    const positiveRatio = totalFeedback > 0 ? positiveFeedback / totalFeedback : 0;

    const blendAlpha = totalFeedback > 0
        ? Math.min(0.3 + positiveRatio * 0.4, 0.7)
        : 0.3;

    const genreCounts = useMemo(() => {
        const map: Record<string, number> = {};
        for (const f of feedback) {
            map[f.genre] = (map[f.genre] || 0) + 1;
        }
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [feedback]);

    const maxGenreCount = genreCounts.length > 0 ? genreCounts[0][1] : 1;

    const modelFeedbackCount = mlModel.getFeedbackCount();
    const modelConfidence = Math.min(0.6 + Math.min(modelFeedbackCount * 0.05, 0.3), 0.95);

    function handleReset() {
        if (!resetConfirm) {
            setResetConfirm(true);
            return;
        }
        clearMLData();
        mlModel.initialize();
        setResetConfirm(false);
        setResetDone(d => !d);
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <section>
                <span className="text-[10px] font-medium tracking-widest text-on-surface-variant uppercase mb-1 block">Advanced Processing</span>
                <h2 className="text-3xl font-bold tracking-tight text-on-surface">Acoustic Intelligence</h2>
            </section>

            {/* ML Insights Card — Dark inverse-surface */}
            <div className="relative overflow-hidden rounded-xl bg-inverse-surface text-inverse-on-surface p-8">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                    <span className="material-symbols-outlined text-6xl">neurology</span>
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">ML Insights</h3>
                            <p className="text-zinc-400 text-sm">Neural Audio Calibration Engine</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-8 bg-zinc-900/50 rounded-lg p-6 border border-zinc-800 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-tighter">ML Weight</p>
                                <p className="text-2xl font-bold text-primary-fixed-dim">{blendAlpha.toFixed(3)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-tighter">Confidence</p>
                                <p className="text-2xl font-bold text-white">{(modelConfidence * 100).toFixed(1)}%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-tighter">Feedback</p>
                                <p className="text-2xl font-bold text-white">{totalFeedback}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-tighter">Updates</p>
                                <p className="text-2xl font-bold text-white">{modelFeedbackCount}</p>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        {totalFeedback > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-zinc-300">Rating Distribution</h4>
                                <div className="flex items-end gap-2 h-32 pt-4">
                                    {(Object.keys(RATING_CONFIG) as Array<keyof typeof RATING_CONFIG>).map(rating => {
                                        const count = ratingCounts[rating];
                                        const pct = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
                                        return (
                                            <div
                                                key={rating}
                                                className={`flex-1 rounded-t-sm transition-all hover:bg-primary/40 ${
                                                    pct > 60 ? 'bg-primary' : 'bg-zinc-800'
                                                }`}
                                                style={{ height: `${Math.max(pct, 5)}%` }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Genre Synergy */}
                        {genreCounts.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-zinc-300">Genre Synergy</h4>
                                <div className="space-y-3">
                                    {genreCounts.slice(0, 4).map(([genre, count]) => (
                                        <div key={genre}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-zinc-400 capitalize">{genre}</span>
                                                <span className={`text-xs font-bold ${count / maxGenreCount > 0.8 ? 'text-primary' : 'text-zinc-300'}`}>
                                                    {count / maxGenreCount > 0.8 ? 'High' : 'Optimal'}
                                                </span>
                                            </div>
                                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${count / maxGenreCount > 0.8 ? 'bg-primary' : 'bg-zinc-500'}`}
                                                    style={{ width: `${(count / maxGenreCount) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="pt-6 border-t border-zinc-800/50 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-zinc-500 text-sm">terminal</span>
                                <span className="text-[10px] font-mono text-zinc-500">ARCH: 20→32→15 | PARAMS: {20 * 32 + 32 + 32 * 15 + 15}</span>
                            </div>
                            <button
                                onClick={handleReset}
                                className={`text-xs font-bold flex items-center gap-1 ${
                                    resetConfirm ? 'text-error' : 'text-primary'
                                }`}
                            >
                                {resetConfirm ? 'CONFIRM RESET' : 'RESET DATA'}
                                <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* How ML Works */}
            <Card className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">How It Works</h3>
                <div className="space-y-3 text-sm text-on-surface-variant">
                    <p>The ML model starts at <strong className="text-on-surface">30% influence</strong> over final EQ and grows as you provide positive feedback.</p>
                    <p>Maximum ML influence caps at <strong className="text-on-surface">70%</strong>. The remaining weight always comes from the rules engine for stability.</p>
                </div>
            </Card>

            <div className="h-4" />
        </div>
    );
}
