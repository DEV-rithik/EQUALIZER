import React, { useState, useMemo } from 'react';
import type { Genre } from '../types';
import { Card } from '../components/Card';
import { loadFeedback, clearMLData } from '../utils/storage';
import { mlModel } from '../engine/mlModel';

const GENRE_COLORS: Record<string, string> = {
    'pop': 'bg-amber-400', 'rock': 'bg-amber-500', 'electronic': 'bg-amber-300',
    'jazz': 'bg-amber-600', 'classical': 'bg-amber-200', 'hip-hop': 'bg-amber-500',
    'r&b': 'bg-amber-400', 'metal': 'bg-amber-700', 'folk': 'bg-amber-300',
    'ambient': 'bg-amber-200', 'unknown': 'bg-stone-500',
};

const RATING_CONFIG = {
    'perfect': { emoji: '🎯', label: 'Perfect', color: 'bg-amber-400', textColor: 'text-amber-300' },
    'good': { emoji: '👍', label: 'Good', color: 'bg-amber-500', textColor: 'text-amber-400' },
    'needs_work': { emoji: '🔧', label: 'Needs Work', color: 'bg-amber-600', textColor: 'text-amber-500' },
    'bad': { emoji: '👎', label: 'Bad', color: 'bg-stone-500', textColor: 'text-stone-400' },
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
        <div className="flex flex-col gap-5 animate-fade-in">
            {/* Header */}
            <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-1 block">Intelligence</span>
                <h1 className="text-2xl font-extrabold text-stone-100 tracking-tight">ML Insights</h1>
                <p className="text-xs text-stone-500 mt-1">What the model is learning from your feedback</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                    <p className="text-2xl font-extrabold text-stone-100">{totalFeedback}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Feedback</p>
                </Card>
                <Card className="p-3 text-center">
                    <p className="text-2xl font-extrabold text-amber-400">{Math.round(blendAlpha * 100)}%</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">ML Weight</p>
                </Card>
                <Card className="p-3 text-center">
                    <p className="text-2xl font-extrabold text-amber-300">{Math.round(modelConfidence * 100)}%</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Confidence</p>
                </Card>
            </div>

            {/* Rating Distribution */}
            <Card className="p-5">
                <h3 className="text-sm font-bold text-amber-400 mb-3">📊 Rating Distribution</h3>
                {totalFeedback === 0 ? (
                    <p className="text-xs text-stone-600 text-center py-4">No feedback yet. Rate some EQ results!</p>
                ) : (
                    <div className="flex flex-col gap-2.5">
                        {(Object.keys(RATING_CONFIG) as Array<keyof typeof RATING_CONFIG>).map(rating => {
                            const count = ratingCounts[rating];
                            const pct = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
                            const cfg = RATING_CONFIG[rating];
                            return (
                                <div key={rating}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className={`${cfg.textColor} font-medium`}>{cfg.emoji} {cfg.label}</span>
                                        <span className="text-stone-500">{count} ({Math.round(pct)}%)</span>
                                    </div>
                                    <div className="h-2 bg-[#292524] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${cfg.color} transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Genre Distribution */}
            <Card className="p-5">
                <h3 className="text-sm font-bold text-amber-400 mb-3">🎵 Genre Feedback</h3>
                {genreCounts.length === 0 ? (
                    <p className="text-xs text-stone-600 text-center py-4">No genre data yet</p>
                ) : (
                    <div className="flex flex-col gap-2.5">
                        {genreCounts.map(([genre, count]) => (
                            <div key={genre}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-stone-300 capitalize font-medium">{genre}</span>
                                    <span className="text-stone-500">{count}</span>
                                </div>
                                <div className="h-1.5 bg-[#292524] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${GENRE_COLORS[genre] ?? 'bg-stone-500'} transition-all duration-700`}
                                        style={{ width: `${(count / maxGenreCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Model Details */}
            <Card className="p-5">
                <h3 className="text-sm font-bold text-amber-400 mb-3">🔬 Model Details</h3>
                <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex justify-between">
                        <span className="text-stone-500">Architecture</span>
                        <span className="text-stone-300 font-mono">20 → 32 → 15</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-500">Parameters</span>
                        <span className="text-stone-300 font-mono">{20 * 32 + 32 + 32 * 15 + 15}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-500">Training Data</span>
                        <span className="text-stone-300">50 curated entries</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-500">Online Updates</span>
                        <span className="text-stone-300">{modelFeedbackCount} applied</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-500">ML Blend</span>
                        <span className="text-stone-300">{Math.round(blendAlpha * 100)}% ML + {Math.round((1 - blendAlpha) * 100)}% Rules</span>
                    </div>
                    <div className="mt-1 pt-2 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#292524] rounded-full overflow-hidden">
                                <div className="flex h-full">
                                    <div className="bg-amber-400 rounded-l-full transition-all duration-500" style={{ width: `${blendAlpha * 100}%` }} />
                                    <div className="bg-amber-700 rounded-r-full transition-all duration-500" style={{ width: `${(1 - blendAlpha) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] mt-1">
                            <span className="text-amber-400">ML Model</span>
                            <span className="text-amber-700">Rules Engine</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* How it works */}
            <Card className="p-5">
                <h3 className="text-sm font-bold text-amber-400 mb-2">💡 How Learning Works</h3>
                <ul className="text-xs text-stone-500 space-y-1.5">
                    <li>• The ML model starts at <strong className="text-stone-300">30% influence</strong> over final EQ</li>
                    <li>• Each positive rating (Perfect/Good) increases its influence</li>
                    <li>• Maximum ML influence caps at <strong className="text-stone-300">70%</strong></li>
                    <li>• Negative ratings push the model away from those predictions</li>
                    <li>• The model learns your personal preferences over time</li>
                </ul>
            </Card>

            {/* Reset */}
            <button
                onClick={handleReset}
                className={`
                    w-full py-3.5 rounded-2xl text-sm font-bold border transition-all duration-300
                    ${resetConfirm
                        ? 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                        : 'bg-[#1c1917] text-stone-500 border-white/[0.06] hover:text-stone-300 hover:bg-[#292524]'
                    }
                `}
            >
                {resetConfirm ? '⚠️ Confirm: Delete all feedback & reset model?' : '🗑️ Reset ML Model'}
            </button>

            <div className="h-4" />
        </div>
    );
}
