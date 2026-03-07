// ─── Lightweight Neural Network for EQ Prediction ────────────────────────────
// 2-layer fully-connected network: input(20) → hidden(32) → output(15)
// Runs entirely in the browser. Supports online learning from user feedback.

import type { SongProfile, IEMProfile, ListenerPreference, EQGains, MLPrediction } from '../types';
import { EQ_BANDS, GENRE_INDEX, PREFERENCE_INDEX, TUNING_INDEX, ML_INPUT_SIZE, ML_HIDDEN_SIZE, ML_OUTPUT_SIZE } from '../types';
import { TRAINING_DATA } from './trainingData';
import { loadMLWeights, saveMLWeights } from '../utils/storage';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ModelWeights {
    w1: number[];  // ML_INPUT_SIZE × ML_HIDDEN_SIZE flattened
    b1: number[];  // ML_HIDDEN_SIZE
    w2: number[];  // ML_HIDDEN_SIZE × ML_OUTPUT_SIZE flattened
    b2: number[];  // ML_OUTPUT_SIZE
}

// ─── Activation functions ────────────────────────────────────────────────────

function relu(x: number): number {
    return Math.max(0, x);
}

function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
}

// ─── Feature encoding ────────────────────────────────────────────────────────

export function encodeFeatures(
    song: SongProfile,
    iem: IEMProfile,
    preference: ListenerPreference,
): number[] {
    const features: number[] = new Array(ML_INPUT_SIZE).fill(0);

    // One-hot encode genre (indices 0-10)
    const gi = GENRE_INDEX[song.genre] ?? 10;
    features[gi] = 1.0;

    // IEM levels (indices 11-13)
    features[11] = iem.bassLevel;
    features[12] = iem.midLevel;
    features[13] = iem.trebleLevel;

    // Preference as normalized scalar (index 14)
    features[14] = PREFERENCE_INDEX[preference] / 3.0;

    // Song features (indices 15-18)
    features[15] = song.energy;
    features[16] = song.bassEmphasis;
    features[17] = song.vocalPresence;
    features[18] = song.trebleEnergy;

    // Tuning signature normalized (index 19)
    features[19] = (TUNING_INDEX[iem.tuningSignature] ?? 0) / 11.0;

    return features;
}

/** Expand raw 10-feature training input to full 20D feature vector */
function expandTrainingInput(raw: number[]): number[] {
    const features: number[] = new Array(ML_INPUT_SIZE).fill(0);

    // Genre one-hot
    const genreIdx = Math.round(raw[0]);
    if (genreIdx >= 0 && genreIdx < 11) features[genreIdx] = 1.0;

    // IEM levels
    features[11] = raw[1];
    features[12] = raw[2];
    features[13] = raw[3];

    // Preference
    features[14] = raw[4] / 3.0;

    // Song features
    features[15] = raw[5];
    features[16] = raw[6];
    features[17] = raw[7];
    features[18] = raw[8];

    // Tuning
    features[19] = raw[9] / 11.0;

    return features;
}

// ─── Weight initialization ──────────────────────────────────────────────────

function xavierInit(fanIn: number, fanOut: number): number {
    const limit = Math.sqrt(6.0 / (fanIn + fanOut));
    return (Math.random() * 2 - 1) * limit;
}

function initWeights(): ModelWeights {
    const w1: number[] = [];
    for (let i = 0; i < ML_INPUT_SIZE * ML_HIDDEN_SIZE; i++) {
        w1.push(xavierInit(ML_INPUT_SIZE, ML_HIDDEN_SIZE));
    }

    const b1 = new Array(ML_HIDDEN_SIZE).fill(0);

    const w2: number[] = [];
    for (let i = 0; i < ML_HIDDEN_SIZE * ML_OUTPUT_SIZE; i++) {
        w2.push(xavierInit(ML_HIDDEN_SIZE, ML_OUTPUT_SIZE));
    }

    const b2 = new Array(ML_OUTPUT_SIZE).fill(0);

    return { w1, b1, w2, b2 };
}

// ─── Forward pass ────────────────────────────────────────────────────────────

function forward(input: number[], weights: ModelWeights): { hidden: number[]; output: number[] } {
    // Hidden layer: input(20) × w1(20×32) + b1(32)
    const hidden: number[] = new Array(ML_HIDDEN_SIZE).fill(0);
    for (let j = 0; j < ML_HIDDEN_SIZE; j++) {
        let sum = weights.b1[j];
        for (let i = 0; i < ML_INPUT_SIZE; i++) {
            sum += input[i] * weights.w1[i * ML_HIDDEN_SIZE + j];
        }
        hidden[j] = relu(sum);
    }

    // Output layer: hidden(32) × w2(32×15) + b2(15)
    const output: number[] = new Array(ML_OUTPUT_SIZE).fill(0);
    for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
        let sum = weights.b2[j];
        for (let i = 0; i < ML_HIDDEN_SIZE; i++) {
            sum += hidden[i] * weights.w2[i * ML_OUTPUT_SIZE + j];
        }
        output[j] = clamp(sum, -6, 6);
    }

    return { hidden, output };
}

// ─── Training (batch gradient descent) ───────────────────────────────────────

function trainEpoch(weights: ModelWeights, lr: number): number {
    let totalLoss = 0;

    for (const entry of TRAINING_DATA) {
        const input = expandTrainingInput(entry.input);
        const target = entry.target;
        const { hidden, output } = forward(input, weights);

        // Compute output error & loss
        const outputError: number[] = new Array(ML_OUTPUT_SIZE).fill(0);
        for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
            outputError[j] = output[j] - target[j];
            totalLoss += outputError[j] * outputError[j];
        }

        // Backprop to w2, b2
        for (let i = 0; i < ML_HIDDEN_SIZE; i++) {
            for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
                weights.w2[i * ML_OUTPUT_SIZE + j] -= lr * outputError[j] * hidden[i];
            }
        }
        for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
            weights.b2[j] -= lr * outputError[j];
        }

        // Backprop to hidden layer
        const hiddenError: number[] = new Array(ML_HIDDEN_SIZE).fill(0);
        for (let i = 0; i < ML_HIDDEN_SIZE; i++) {
            let err = 0;
            for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
                err += outputError[j] * weights.w2[i * ML_OUTPUT_SIZE + j];
            }
            hiddenError[i] = hidden[i] > 0 ? err : 0; // ReLU derivative
        }

        // Backprop to w1, b1
        for (let i = 0; i < ML_INPUT_SIZE; i++) {
            for (let j = 0; j < ML_HIDDEN_SIZE; j++) {
                weights.w1[i * ML_HIDDEN_SIZE + j] -= lr * hiddenError[j] * input[i];
            }
        }
        for (let j = 0; j < ML_HIDDEN_SIZE; j++) {
            weights.b1[j] -= lr * hiddenError[j];
        }
    }

    return totalLoss / TRAINING_DATA.length;
}

// ─── Model class ─────────────────────────────────────────────────────────────

class EQNeuralNetwork {
    private weights: ModelWeights;
    private trained = false;
    private feedbackCount = 0;

    constructor() {
        this.weights = initWeights();
    }

    /** Initialize model: load saved weights or train from scratch */
    initialize(): void {
        const saved = loadMLWeights();
        if (saved) {
            this.weights = saved as unknown as ModelWeights;
            this.trained = true;
            console.log('[ML] Loaded saved model weights');
        } else {
            this.train();
        }
    }

    /** Train the model on the curated dataset */
    private train(): void {
        console.log('[ML] Training model on curated dataset...');
        const epochs = 200;
        let lr = 0.005;
        let lastLoss = Infinity;

        for (let epoch = 0; epoch < epochs; epoch++) {
            const loss = trainEpoch(this.weights, lr);

            // Learning rate decay
            if (epoch > 0 && loss > lastLoss * 0.99) {
                lr *= 0.95;
            }
            lastLoss = loss;

            if (epoch % 50 === 0) {
                console.log(`[ML] Epoch ${epoch}: loss=${loss.toFixed(4)}, lr=${lr.toFixed(6)}`);
            }
        }

        this.trained = true;
        saveMLWeights(this.weights);
        console.log(`[ML] Training complete. Final loss: ${lastLoss.toFixed(4)}`);
    }

    /** Predict EQ gains from song + IEM + preference */
    predict(song: SongProfile, iem: IEMProfile, preference: ListenerPreference): MLPrediction {
        if (!this.trained) {
            this.initialize();
        }

        const features = encodeFeatures(song, iem, preference);
        const { output } = forward(features, this.weights);

        // Convert output array to EQGains
        const gains = {} as EQGains;
        for (let i = 0; i < EQ_BANDS.length; i++) {
            gains[EQ_BANDS[i]] = Math.round(clamp(output[i], -6, 6) * 10) / 10;
        }

        // Confidence based on training data proximity and feedback count
        const baseConfidence = 0.6;
        const feedbackBoost = Math.min(this.feedbackCount * 0.05, 0.3);
        const confidence = Math.min(baseConfidence + feedbackBoost, 0.95);

        return { gains, confidence };
    }

    /** Online learning: update weights based on user feedback */
    onlineLearning(
        song: SongProfile,
        iem: IEMProfile,
        preference: ListenerPreference,
        actualGains: EQGains,
        ratingMultiplier: number, // positive for good, negative for bad
    ): void {
        const features = encodeFeatures(song, iem, preference);
        const { hidden, output } = forward(features, this.weights);

        // Target is the actual gains the user accepted/liked
        const target: number[] = EQ_BANDS.map(b => actualGains[b]);
        const lr = 0.001 * Math.abs(ratingMultiplier);

        // Simple gradient update towards the target
        const outputError: number[] = new Array(ML_OUTPUT_SIZE).fill(0);
        for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
            outputError[j] = (output[j] - target[j]) * Math.sign(ratingMultiplier);
        }

        // Update w2, b2
        for (let i = 0; i < ML_HIDDEN_SIZE; i++) {
            for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
                this.weights.w2[i * ML_OUTPUT_SIZE + j] -= lr * outputError[j] * hidden[i];
            }
        }
        for (let j = 0; j < ML_OUTPUT_SIZE; j++) {
            this.weights.b2[j] -= lr * outputError[j];
        }

        this.feedbackCount++;
        saveMLWeights(this.weights);
        console.log(`[ML] Online update applied (rating: ${ratingMultiplier}). Total feedback: ${this.feedbackCount}`);
    }

    getFeedbackCount(): number {
        return this.feedbackCount;
    }
}

// ─── Singleton instance ──────────────────────────────────────────────────────

export const mlModel = new EQNeuralNetwork();
