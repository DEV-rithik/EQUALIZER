import React, { useState, useEffect } from 'react';
import type { EQFeedbackRating } from '../types';

interface EQFeedbackProps {
    onFeedback: (rating: EQFeedbackRating) => void;
    disabled?: boolean;
}

const FEEDBACK_STORAGE_KEY = 'eq_feedback_submitted';

const RATING_OPTIONS: { rating: EQFeedbackRating; label: string; icon: string }[] = [
    { rating: 'perfect', label: 'Much Better', icon: 'thumb_up' },
    { rating: 'bad', label: 'Not Quite', icon: 'thumb_down' },
];

export function EQFeedbackComponent({ onFeedback, disabled }: EQFeedbackProps) {
    const [submitted, setSubmitted] = useState(false);

    // Check if user has already submitted feedback
    useEffect(() => {
        const hasSubmitted = localStorage.getItem(FEEDBACK_STORAGE_KEY);
        if (hasSubmitted === 'true') {
            setSubmitted(true);
        }
    }, []);

    function handleRate(rating: EQFeedbackRating) {
        if (submitted || disabled) return;
        setSubmitted(true);
        localStorage.setItem(FEEDBACK_STORAGE_KEY, 'true');
        onFeedback(rating);
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
                <span className="material-symbols-outlined text-primary text-4xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="text-lg font-bold text-on-surface">Thanks for your feedback!</p>
                <p className="text-sm text-on-surface-variant mt-1">Your input helps our ML model improve</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h4 className="text-xl font-bold text-on-surface mb-2">Smart Feedback</h4>
                <p className="text-on-surface-variant">Our ML model is optimizing the sound for your current environment. Does this sound better than the original?</p>
            </div>
            <div className="flex gap-4">
                {RATING_OPTIONS.map(({ rating, label, icon }) => (
                    <button
                        key={rating}
                        onClick={() => handleRate(rating)}
                        disabled={disabled}
                        className={`
                            flex-1 py-4 bg-surface-container-high rounded-lg font-bold flex items-center justify-center gap-2
                            hover:bg-primary/5 transition-colors group
                            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <span
                            className={`material-symbols-outlined ${rating === 'perfect' ? 'text-primary' : 'text-on-surface-variant'} group-hover:scale-110 transition-transform`}
                            style={rating === 'perfect' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >{icon}</span>
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
