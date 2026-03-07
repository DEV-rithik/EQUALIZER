// ─── Web Audio API Spectral Analyzer ─────────────────────────────────────────
// Analyzes uploaded audio files to extract real spectral features using FFT.
// Falls back gracefully if no audio is provided or AudioContext is unavailable.

import type { SongProfile, Genre, Mood } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AudioFeatures {
    bassEmphasis: number;     // 0–1 (energy in 20–250 Hz relative to total)
    midEnergy: number;        // 0–1 (energy in 250–2 kHz)
    trebleEnergy: number;     // 0–1 (energy in 2–16 kHz)
    vocalPresence: number;    // 0–1 (energy in 300 Hz – 4 kHz range)
    rhythmIntensity: number;  // 0–1 (onset strength / transient density)
    estimatedBPM: number;     // beats per minute estimate
    spectralCentroid: number; // brightness indicator (0–1 normalized)
    dynamicRange: number;     // loudness variation (0–1)
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FFT_SIZE = 4096;
const SAMPLE_DURATION_SEC = 30; // analyze up to 30 seconds

// ─── Helper: compute band energy from frequency data ─────────────────────────

function bandEnergy(
    freqData: Float32Array,
    sampleRate: number,
    fftSize: number,
    lowHz: number,
    highHz: number,
): number {
    const binWidth = sampleRate / fftSize;
    const lowBin = Math.floor(lowHz / binWidth);
    const highBin = Math.min(Math.ceil(highHz / binWidth), freqData.length - 1);

    let energy = 0;
    for (let i = lowBin; i <= highBin; i++) {
        // freqData is in dB, convert to linear power
        const linearPower = Math.pow(10, freqData[i] / 10);
        energy += linearPower;
    }
    return energy;
}

// ─── Helper: detect transients for rhythm analysis ───────────────────────────

function detectOnsets(channelData: Float32Array, sampleRate: number): number {
    const hopSize = Math.floor(sampleRate * 0.01); // 10ms hops
    const frameSize = Math.floor(sampleRate * 0.02); // 20ms frames
    const energies: number[] = [];

    for (let i = 0; i + frameSize < channelData.length; i += hopSize) {
        let energy = 0;
        for (let j = 0; j < frameSize; j++) {
            energy += channelData[i + j] * channelData[i + j];
        }
        energies.push(energy / frameSize);
    }

    // Count significant energy jumps (onsets)
    let onsets = 0;
    for (let i = 1; i < energies.length; i++) {
        const ratio = energies[i] / (energies[i - 1] + 1e-10);
        if (ratio > 2.5) onsets++;
    }

    // Normalize to 0–1 (typical range: 0–100 onsets per 30 sec)
    return Math.min(onsets / 80, 1);
}

// ─── Helper: simple autocorrelation BPM estimation ───────────────────────────

function estimateBPMFromAudio(channelData: Float32Array, sampleRate: number): number {
    const hopSize = Math.floor(sampleRate * 0.01);
    const frameSize = Math.floor(sampleRate * 0.02);
    const energies: number[] = [];

    for (let i = 0; i + frameSize < channelData.length; i += hopSize) {
        let energy = 0;
        for (let j = 0; j < frameSize; j++) {
            energy += channelData[i + j] * channelData[i + j];
        }
        energies.push(energy / frameSize);
    }

    // Autocorrelation on energy envelope
    const minLag = Math.floor(60 / 200 / 0.01); // 200 BPM max
    const maxLag = Math.floor(60 / 50 / 0.01);  // 50 BPM min
    let bestLag = minLag;
    let bestCorr = -Infinity;

    for (let lag = minLag; lag <= maxLag && lag < energies.length; lag++) {
        let corr = 0;
        const count = Math.min(energies.length - lag, 500);
        for (let i = 0; i < count; i++) {
            corr += energies[i] * energies[i + lag];
        }
        if (corr > bestCorr) {
            bestCorr = corr;
            bestLag = lag;
        }
    }

    const bpm = 60 / (bestLag * 0.01);
    return Math.round(Math.max(50, Math.min(200, bpm)));
}

// ─── Main: analyze audio file ────────────────────────────────────────────────

export async function analyzeAudioFile(file: File): Promise<AudioFeatures | null> {
    try {
        // Check for AudioContext support
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
            console.warn('[Audio] AudioContext not supported');
            return null;
        }

        const ctx = new AudioContextClass();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        // Get channel data (mono mix)
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;

        // Limit analysis to SAMPLE_DURATION_SEC
        const maxSamples = Math.min(channelData.length, sampleRate * SAMPLE_DURATION_SEC);
        const trimmedData = channelData.slice(0, maxSamples);

        // Create offline context for FFT analysis
        const offlineCtx = new OfflineAudioContext(1, maxSamples, sampleRate);
        const source = offlineCtx.createBufferSource();
        const analyserBuffer = offlineCtx.createBuffer(1, maxSamples, sampleRate);
        analyserBuffer.getChannelData(0).set(trimmedData);
        source.buffer = analyserBuffer;

        const analyser = offlineCtx.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        source.connect(analyser);
        analyser.connect(offlineCtx.destination);
        source.start();

        await offlineCtx.startRendering();

        // Get frequency data
        const freqData = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(freqData);

        // Compute band energies
        const totalEnergy = bandEnergy(freqData, sampleRate, FFT_SIZE, 20, 20000) || 1;
        const bassRaw = bandEnergy(freqData, sampleRate, FFT_SIZE, 20, 250) / totalEnergy;
        const midRaw = bandEnergy(freqData, sampleRate, FFT_SIZE, 250, 2000) / totalEnergy;
        const trebleRaw = bandEnergy(freqData, sampleRate, FFT_SIZE, 2000, 16000) / totalEnergy;
        const vocalRaw = bandEnergy(freqData, sampleRate, FFT_SIZE, 300, 4000) / totalEnergy;

        // Spectral centroid (brightness)
        let centroidNum = 0;
        let centroidDen = 0;
        const binWidth = sampleRate / FFT_SIZE;
        for (let i = 0; i < freqData.length; i++) {
            const power = Math.pow(10, freqData[i] / 10);
            centroidNum += i * binWidth * power;
            centroidDen += power;
        }
        const centroid = centroidDen > 0 ? centroidNum / centroidDen : 2000;
        const normalizedCentroid = Math.min(centroid / 8000, 1);

        // Dynamic range
        const rms = Math.sqrt(
            trimmedData.reduce((sum, s) => sum + s * s, 0) / trimmedData.length
        );
        const peak = Math.max(...Array.from(trimmedData.slice(0, Math.min(trimmedData.length, 100000)).map(Math.abs)));
        const dynamicRange = peak > 0 ? Math.min(1 - rms / peak, 1) : 0.5;

        // Rhythm and BPM
        const rhythmIntensity = detectOnsets(trimmedData, sampleRate);
        const estimatedBPM = estimateBPMFromAudio(trimmedData, sampleRate);

        // Close context
        await ctx.close();

        return {
            bassEmphasis: Math.min(bassRaw * 2.5, 1),  // Scale to useful 0–1 range
            midEnergy: Math.min(midRaw * 2, 1),
            trebleEnergy: Math.min(trebleRaw * 3, 1),
            vocalPresence: Math.min(vocalRaw * 2, 1),
            rhythmIntensity,
            estimatedBPM,
            spectralCentroid: normalizedCentroid,
            dynamicRange,
        };
    } catch (err) {
        console.warn('[Audio] Analysis failed:', err);
        return null;
    }
}

// ─── Merge audio features into a heuristic song profile ──────────────────────

export function mergeAudioFeatures(
    heuristicProfile: SongProfile,
    audioFeatures: AudioFeatures,
): SongProfile {
    // Weight: 60% audio (measured), 40% heuristic (guessed)
    const aw = 0.6;
    const hw = 0.4;

    return {
        ...heuristicProfile,
        energy: Math.min(1, aw * (audioFeatures.rhythmIntensity * 0.6 + audioFeatures.spectralCentroid * 0.4) + hw * heuristicProfile.energy),
        bassEmphasis: aw * audioFeatures.bassEmphasis + hw * heuristicProfile.bassEmphasis,
        vocalPresence: aw * audioFeatures.vocalPresence + hw * heuristicProfile.vocalPresence,
        trebleEnergy: aw * audioFeatures.trebleEnergy + hw * heuristicProfile.trebleEnergy,
        bpmEstimate: audioFeatures.estimatedBPM,
        rhythmIntensity: aw * audioFeatures.rhythmIntensity + hw * heuristicProfile.rhythmIntensity,
    };
}
