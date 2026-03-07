import React, { useState } from 'react';
import type { EQFeedbackRating } from '../types';

interface EQFeedbackProps {
    onFeedback: (rating: EQFeedbackRating) => void;
    disabled?: boolean;
}

const RATING_OPTIONS: { rating: EQFeedbackRating; emoji: string; label: string; color: string }[] = [
    { rating: 'perfect', emoji: '🎯', label: 'Perfect', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300' },
    { rating: 'good', emoji: '👍', label: 'Good', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300' },
    { rating: 'needs_work', emoji: '🔧', label: 'Needs Work', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-300' },
    { rating: 'bad', emoji: '👎', label: 'Bad', color: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300' },
];

export function EQFeedbackComponent({ onFeedback, disabled }: EQFeedbackProps) {
    const [submitted, setSubmitted] = useState(false);
    const [selectedRating, setSelectedRating] = useState<EQFeedbackRating | null>(null);

    function handleRate(rating: EQFeedbackRating) {
        if (submitted || disabled) return;
        setSelectedRating(rating);
        setSubmitted(true);
        onFeedback(rating);

        // Reset after 3 seconds to allow re-rating
        setTimeout(() => {
            setSubmitted(false);
            setSelectedRating(null);
        }, 3000);
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-base">🧠</span>
                <h4 className="text-xs font-semibold text-warm-200">Rate This EQ</h4>
                <span className="text-[10px] text-white/30">Helps ML learn your preferences</span>
            </div>

            {submitted ? (
                <div className="flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 animate-fade-in">
                    <span className="text-sm text-green-300 font-medium">
                        ✨ Thanks! Model updated with your feedback
                    </span>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-2">
                    {RATING_OPTIONS.map(({ rating, emoji, label, color }) => (
                        <button
                            key={rating}
                            onClick={() => handleRate(rating)}
                            disabled={disabled}
                            className={`
                flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border
                transition-all duration-200
                ${selectedRating === rating
                                    ? `bg-gradient-to-b ${color} scale-95`
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95'
                                }
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            <span className="text-lg">{emoji}</span>
                            <span className="text-[10px] text-white/50 font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
