// ─── Hybrid Recommender: Rules Engine + ML Model ─────────────────────────────
// Blends the deterministic rules engine output with ML predictions using a
// confidence-weighted approach. As the ML model receives more positive feedback,
// its influence grows.

import type { SongProfile, IEMProfile, ListenerPreference, EQGains, EQFeedbackRating, HybridRecommendation } from '../types';
import { EQ_BANDS } from '../types';
import { recommendEQ } from './eqEngine';
import { mlModel } from './mlModel';
import { saveFeedback, loadFeedback, generateFeedbackId } from '../utils/storage';

// ─── Blend weight ────────────────────────────────────────────────────────────

function getBlendAlpha(): number {
    const feedback = loadFeedback();
    const positiveFeedback = feedback.filter(f => f.rating === 'perfect' || f.rating === 'good').length;
    const totalFeedback = feedback.length;

    // Start at 0.3 (30% ML), increase with positive feedback
    const baseAlpha = 0.3;
    const feedbackBoost = totalFeedback > 0
        ? (positiveFeedback / totalFeedback) * 0.4  // max +0.4 boost
        : 0;

    return Math.min(baseAlpha + feedbackBoost, 0.7); // cap at 70% ML
}

function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
}

// ─── Compute preamp ──────────────────────────────────────────────────────────

function computePreamp(gains: EQGains): number {
    const maxBoost = Math.max(0, ...Object.values(gains));
    return maxBoost > 0 ? -maxBoost : 0;
}

// ─── Main hybrid recommendation function ─────────────────────────────────────

export function hybridRecommendEQ(
    song: SongProfile,
    iem: IEMProfile,
    preference: ListenerPreference,
): HybridRecommendation {
    // Get rules-based recommendation
    const rulesResult = recommendEQ(song, iem, preference);

    // Get ML prediction
    const mlPrediction = mlModel.predict(song, iem, preference);

    // Compute blend weight
    const alpha = getBlendAlpha();

    // Blend gains
    const blendedGains = {} as EQGains;
    for (const band of EQ_BANDS) {
        const rulesGain = rulesResult.gains[band];
        const mlGain = mlPrediction.gains[band];
        blendedGains[band] = clamp(
            Math.round((alpha * mlGain + (1 - alpha) * rulesGain) * 10) / 10,
            -6,
            6,
        );
    }

    // Build enhanced reasoning
    const reasoning = [...rulesResult.reasoning];
    reasoning.push(
        `🧠 ML model contributed ${Math.round(alpha * 100)}% to final EQ (confidence: ${Math.round(mlPrediction.confidence * 100)}%).`
    );

    if (mlModel.getFeedbackCount() > 0) {
        reasoning.push(
            `📊 Model has been refined with ${mlModel.getFeedbackCount()} feedback ${mlModel.getFeedbackCount() === 1 ? 'response' : 'responses'}.`
        );
    }

    return {
        gains: blendedGains,
        preamp: computePreamp(blendedGains),
        reasoning,
        mlConfidence: mlPrediction.confidence,
        mlEnhanced: true,
        rulesGains: rulesResult.gains,
        mlGains: mlPrediction.gains,
    };
}

// ─── Feedback submission ─────────────────────────────────────────────────────

const RATING_MULTIPLIER: Record<EQFeedbackRating, number> = {
    'perfect': 1.0,
    'good': 0.5,
    'needs_work': -0.3,
    'bad': -0.8,
};

export function submitFeedback(
    song: SongProfile,
    iem: IEMProfile,
    preference: ListenerPreference,
    gains: EQGains,
    rating: EQFeedbackRating,
): void {
    // Save feedback record
    const feedback = {
        id: generateFeedbackId(),
        timestamp: new Date().toISOString(),
        genre: song.genre,
        iemBass: iem.bassLevel,
        iemMid: iem.midLevel,
        iemTreble: iem.trebleLevel,
        preference,
        energy: song.energy,
        bassEmphasis: song.bassEmphasis,
        vocalPresence: song.vocalPresence,
        trebleEnergy: song.trebleEnergy,
        gains,
        rating,
    };
    saveFeedback(feedback);

    // Online learning update
    const multiplier = RATING_MULTIPLIER[rating];
    mlModel.onlineLearning(song, iem, preference, gains, multiplier);
}

// ─── Initialize model ────────────────────────────────────────────────────────

export function initializeMLModel(): void {
    mlModel.initialize();
}
