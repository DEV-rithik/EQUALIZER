// ─── Brand Profiles: Intelligent Fallback for Unknown IEM Models ─────────────
// When we recognize the brand but not the specific model, we use the brand's
// typical tuning characteristics as a fallback. Much better than a generic neutral.

import type { IEMProfile, TuningSignature } from '../types';

export interface BrandProfile {
    brand: string;
    aliases: string[];            // Alternative brand names / abbreviations
    typicalSignature: TuningSignature;
    avgBass: number;
    avgMid: number;
    avgTreble: number;
    tonalNotes: string[];
}

export const BRAND_PROFILES: BrandProfile[] = [
    // ─── Budget Chi-Fi ─────────────────────────────────────────────────────────
    {
        brand: 'KZ', aliases: ['kz', 'knowledge zenith'],
        typicalSignature: 'V-Shape', avgBass: 0.72, avgMid: 0.32, avgTreble: 0.68,
        tonalNotes: ['V-shaped tuning', 'Boosted bass & treble', 'Recessed mids'],
    },
    {
        brand: 'CCA', aliases: ['cca'],
        typicalSignature: 'V-Shape', avgBass: 0.68, avgMid: 0.35, avgTreble: 0.65,
        tonalNotes: ['V-shaped tuning', 'Bass emphasis', 'Bright treble'],
    },
    {
        brand: 'QKZ', aliases: ['qkz'],
        typicalSignature: 'Bass Boosted', avgBass: 0.75, avgMid: 0.30, avgTreble: 0.60,
        tonalNotes: ['Heavy bass boost', 'Consumer-tuned', 'Fun signature'],
    },
    {
        brand: 'TRN', aliases: ['trn'],
        typicalSignature: 'V-Shape', avgBass: 0.65, avgMid: 0.38, avgTreble: 0.65,
        tonalNotes: ['V-shaped', 'Budget-friendly', 'Energetic'],
    },
    {
        brand: 'BLON', aliases: ['blon'],
        typicalSignature: 'Warm Neutral', avgBass: 0.62, avgMid: 0.50, avgTreble: 0.36,
        tonalNotes: ['Warm punchy bass', 'Musical mids', 'Gentle treble'],
    },

    // ─── Mid-Fi Popular ────────────────────────────────────────────────────────
    {
        brand: 'Moondrop', aliases: ['moondrop', 'moon drop'],
        typicalSignature: 'Harman Target', avgBass: 0.46, avgMid: 0.50, avgTreble: 0.47,
        tonalNotes: ['Harman-tuned', 'Clean mids', 'Smooth treble'],
    },
    {
        brand: 'Truthear', aliases: ['truthear', 'truth ear'],
        typicalSignature: 'Harman Target', avgBass: 0.46, avgMid: 0.52, avgTreble: 0.48,
        tonalNotes: ['Harman-inspired', 'Balanced tuning', 'Good detail'],
    },
    {
        brand: '7Hz', aliases: ['7hz', 'seven hz', 'sevenhertz'],
        typicalSignature: 'Harman Target', avgBass: 0.50, avgMid: 0.48, avgTreble: 0.52,
        tonalNotes: ['Slightly bright', 'Good technicality', 'Balanced'],
    },
    {
        brand: 'Tin HiFi', aliases: ['tin hifi', 'tinhifi', 'tin', 'tin audio'],
        typicalSignature: 'Diffuse Field', avgBass: 0.38, avgMid: 0.58, avgTreble: 0.62,
        tonalNotes: ['Bright analytical', 'Forward mids', 'Lean bass'],
    },
    {
        brand: 'Tangzu', aliases: ['tangzu', 'tang zu'],
        typicalSignature: 'Harman Target', avgBass: 0.48, avgMid: 0.50, avgTreble: 0.50,
        tonalNotes: ['Balanced tuning', 'Clean sound', 'Good for price'],
    },
    {
        brand: 'Simgot', aliases: ['simgot'],
        typicalSignature: 'Balanced V', avgBass: 0.58, avgMid: 0.44, avgTreble: 0.58,
        tonalNotes: ['Slightly V-shaped', 'Good dynamics', 'Clear treble'],
    },
    {
        brand: 'Tripowin', aliases: ['tripowin'],
        typicalSignature: 'Harman Target', avgBass: 0.48, avgMid: 0.50, avgTreble: 0.50,
        tonalNotes: ['Balanced tuning', 'Good value', 'Clean sound'],
    },
    {
        brand: 'Kiwi Ears', aliases: ['kiwi ears', 'kiwiears'],
        typicalSignature: 'Harman Target', avgBass: 0.48, avgMid: 0.52, avgTreble: 0.50,
        tonalNotes: ['Harman-inspired', 'Musical tuning', 'Good mids'],
    },

    // ─── Mid-to-High-Fi ────────────────────────────────────────────────────────
    {
        brand: 'Dunu', aliases: ['dunu'],
        typicalSignature: 'Balanced V', avgBass: 0.55, avgMid: 0.48, avgTreble: 0.58,
        tonalNotes: ['Extended bass', 'Clean mids', 'Detailed treble'],
    },
    {
        brand: 'FiiO', aliases: ['fiio', 'fio'],
        typicalSignature: 'Balanced V', avgBass: 0.55, avgMid: 0.45, avgTreble: 0.60,
        tonalNotes: ['Mild V-shape', 'Good detail', 'Extended highs'],
    },
    {
        brand: 'Hidizs', aliases: ['hidizs'],
        typicalSignature: 'Harman Target', avgBass: 0.50, avgMid: 0.50, avgTreble: 0.52,
        tonalNotes: ['Balanced', 'Slightly bright', 'Good resolution'],
    },
    {
        brand: 'Tanchjim', aliases: ['tanchjim'],
        typicalSignature: 'Harman Target', avgBass: 0.48, avgMid: 0.52, avgTreble: 0.50,
        tonalNotes: ['Neutral-ish', 'Sweet mids', 'Refined treble'],
    },
    {
        brand: 'Ikko', aliases: ['ikko'],
        typicalSignature: 'Warm Neutral', avgBass: 0.58, avgMid: 0.52, avgTreble: 0.45,
        tonalNotes: ['Warm bass', 'Musical mids', 'Smooth treble'],
    },
    {
        brand: 'Letshuoer', aliases: ['letshuoer', 'shuoer', 's12'],
        typicalSignature: 'Bright', avgBass: 0.50, avgMid: 0.48, avgTreble: 0.68,
        tonalNotes: ['Planar detail', 'Clean mids', 'Resolving treble'],
    },
    {
        brand: 'Yanyin', aliases: ['yanyin'],
        typicalSignature: 'Balanced V', avgBass: 0.55, avgMid: 0.48, avgTreble: 0.55,
        tonalNotes: ['Balanced V', 'Musical tuning', 'Good dynamics'],
    },
    {
        brand: 'TFZ', aliases: ['tfz', 'the fragrant zither'],
        typicalSignature: 'Bass Boosted', avgBass: 0.68, avgMid: 0.42, avgTreble: 0.50,
        tonalNotes: ['Bass emphasis', 'Warm sound', 'Consumer-friendly'],
    },

    // ─── High-End / Audiophile ─────────────────────────────────────────────────
    {
        brand: 'Etymotic', aliases: ['etymotic', 'ety'],
        typicalSignature: 'Diffuse Field', avgBass: 0.36, avgMid: 0.62, avgTreble: 0.60,
        tonalNotes: ['DF-neutral', 'Analytical', 'Reference-class'],
    },
    {
        brand: 'Shure', aliases: ['shure'],
        typicalSignature: 'Mid-Forward', avgBass: 0.50, avgMid: 0.60, avgTreble: 0.40,
        tonalNotes: ['Mid-forward', 'Musical', 'Slightly warm'],
    },
    {
        brand: 'Sony', aliases: ['sony'],
        typicalSignature: 'Warm Neutral', avgBass: 0.58, avgMid: 0.52, avgTreble: 0.48,
        tonalNotes: ['Warm musical', 'Natural mids', 'Smooth presentation'],
    },
    {
        brand: 'Sennheiser', aliases: ['sennheiser', 'senn'],
        typicalSignature: 'Balanced V', avgBass: 0.58, avgMid: 0.42, avgTreble: 0.60,
        tonalNotes: ['Neutral-bright', 'Detailed treble', 'Open sound'],
    },
    {
        brand: 'Campfire Audio', aliases: ['campfire', 'campfire audio', 'ca', 'alo'],
        typicalSignature: 'Balanced V', avgBass: 0.60, avgMid: 0.48, avgTreble: 0.62,
        tonalNotes: ['Extended bass', 'Airy treble', 'Wide soundstage'],
    },
    {
        brand: '64 Audio', aliases: ['64 audio', '64audio'],
        typicalSignature: 'Warm Neutral', avgBass: 0.52, avgMid: 0.55, avgTreble: 0.44,
        tonalNotes: ['Dense warm', 'Musical mids', 'Smooth highs'],
    },
    {
        brand: 'Final', aliases: ['final', 'final audio'],
        typicalSignature: 'Warm Neutral', avgBass: 0.55, avgMid: 0.52, avgTreble: 0.48,
        tonalNotes: ['Musical warm', 'Natural tonality', 'Easy listening'],
    },
    {
        brand: 'Thieaudio', aliases: ['thieaudio', 'thie audio'],
        typicalSignature: 'Harman Target', avgBass: 0.50, avgMid: 0.50, avgTreble: 0.50,
        tonalNotes: ['Reference tuned', 'Balanced', 'Technically capable'],
    },
    {
        brand: 'Westone', aliases: ['westone'],
        typicalSignature: 'Mid-Forward', avgBass: 0.45, avgMid: 0.60, avgTreble: 0.48,
        tonalNotes: ['Mid-centric', 'Musical', 'Smooth sound'],
    },
    {
        brand: 'Noble Audio', aliases: ['noble', 'noble audio'],
        typicalSignature: 'Warm Neutral', avgBass: 0.55, avgMid: 0.55, avgTreble: 0.48,
        tonalNotes: ['Warm coherent', 'Musical mids', 'Premium build'],
    },
    {
        brand: 'Empire Ears', aliases: ['empire ears', 'ee'],
        typicalSignature: 'W-Shape', avgBass: 0.65, avgMid: 0.52, avgTreble: 0.60,
        tonalNotes: ['Dynamic bass', 'Forward mids', 'Extended treble'],
    },
    {
        brand: 'Vision Ears', aliases: ['vision ears', 've'],
        typicalSignature: 'Warm Neutral', avgBass: 0.52, avgMid: 0.58, avgTreble: 0.48,
        tonalNotes: ['Musical neutral', 'Refined mids', 'Natural tonality'],
    },
    {
        brand: 'JH Audio', aliases: ['jh audio', 'jerry harvey', 'jh'],
        typicalSignature: 'Bass Boosted', avgBass: 0.68, avgMid: 0.48, avgTreble: 0.55,
        tonalNotes: ['Powerful bass', 'Forward sound', 'Engaging'],
    },
    {
        brand: 'Unique Melody', aliases: ['unique melody', 'um'],
        typicalSignature: 'Balanced V', avgBass: 0.58, avgMid: 0.48, avgTreble: 0.58,
        tonalNotes: ['Balanced V', 'Good dynamics', 'Premium detail'],
    },

    // ─── Headphone Brands (for users who type headphones) ──────────────────────
    {
        brand: 'Hifiman', aliases: ['hifiman', 'hifi man'],
        typicalSignature: 'Bright', avgBass: 0.42, avgMid: 0.52, avgTreble: 0.65,
        tonalNotes: ['Planar magnetic', 'Detailed', 'Bright-leaning'],
    },
    {
        brand: 'Beyerdynamic', aliases: ['beyerdynamic', 'beyer'],
        typicalSignature: 'Bright', avgBass: 0.48, avgMid: 0.50, avgTreble: 0.68,
        tonalNotes: ['Analytical', 'Bright treble', 'Detailed sound'],
    },
    {
        brand: 'Audio-Technica', aliases: ['audio technica', 'audio-technica', 'ath'],
        typicalSignature: 'Balanced V', avgBass: 0.50, avgMid: 0.48, avgTreble: 0.58,
        tonalNotes: ['Slight V-shape', 'Good detail', 'Clear sound'],
    },
    {
        brand: 'AKG', aliases: ['akg'],
        typicalSignature: 'Diffuse Field', avgBass: 0.40, avgMid: 0.55, avgTreble: 0.60,
        tonalNotes: ['Reference tuning', 'Analytical mids', 'Bright'],
    },
];

// ─── Driver-type keyword inference ───────────────────────────────────────────

export interface DriverInference {
    keywords: string[];
    bassAdjust: number;
    midAdjust: number;
    trebleAdjust: number;
    signature: TuningSignature;
}

export const DRIVER_INFERENCES: DriverInference[] = [
    {
        keywords: ['planar', 'planar magnetic', 'pm'],
        bassAdjust: 0.0, midAdjust: 0.0, trebleAdjust: 0.08,
        signature: 'Bright',
    },
    {
        keywords: ['balanced armature', 'ba', 'multi-ba', 'multi ba'],
        bassAdjust: -0.05, midAdjust: 0.05, trebleAdjust: 0.05,
        signature: 'Bright',
    },
    {
        keywords: ['dynamic driver', 'dd', 'single dd', '1dd'],
        bassAdjust: 0.05, midAdjust: 0.0, trebleAdjust: -0.03,
        signature: 'Warm Neutral',
    },
    {
        keywords: ['hybrid', 'tribrid'],
        bassAdjust: 0.03, midAdjust: 0.0, trebleAdjust: 0.03,
        signature: 'Balanced V',
    },
    {
        keywords: ['electrostatic', 'est', 'estat'],
        bassAdjust: -0.03, midAdjust: 0.02, trebleAdjust: 0.08,
        signature: 'Bright',
    },
    {
        keywords: ['bone conduction'],
        bassAdjust: -0.10, midAdjust: 0.05, trebleAdjust: -0.05,
        signature: 'Mid-Forward',
    },
];

// ─── Match brand from query ──────────────────────────────────────────────────

export function matchBrand(query: string): BrandProfile | null {
    const q = query.toLowerCase();

    for (const brand of BRAND_PROFILES) {
        // Check if any alias matches
        for (const alias of brand.aliases) {
            if (q.includes(alias)) return brand;
        }
        // Check brand name
        if (q.includes(brand.brand.toLowerCase())) return brand;
    }

    return null;
}

// ─── Infer driver type from query ────────────────────────────────────────────

export function inferDriverType(query: string): DriverInference | null {
    const q = query.toLowerCase();

    for (const driver of DRIVER_INFERENCES) {
        if (driver.keywords.some(kw => q.includes(kw))) return driver;
    }

    return null;
}

// ─── Build IEM profile from brand fallback ───────────────────────────────────

export function buildBrandFallback(query: string, brand: BrandProfile): IEMProfile {
    const driver = inferDriverType(query);

    let bass = brand.avgBass;
    let mid = brand.avgMid;
    let treble = brand.avgTreble;
    let signature = brand.typicalSignature;

    if (driver) {
        bass += driver.bassAdjust;
        mid += driver.midAdjust;
        treble += driver.trebleAdjust;
        signature = driver.signature;
    }

    // Extract model name from query (remove brand name)
    const modelName = query
        .replace(new RegExp(brand.brand, 'i'), '')
        .replace(new RegExp(brand.aliases.join('|'), 'i'), '')
        .trim() || 'Unknown Model';

    return {
        id: `brand-fallback-${brand.brand.toLowerCase().replace(/\s/g, '-')}`,
        model: modelName,
        brand: brand.brand,
        tuningSignature: signature,
        tonalNotes: [...brand.tonalNotes, '(Brand profile estimate)'],
        bassLevel: Math.max(0, Math.min(1, bass)),
        midLevel: Math.max(0, Math.min(1, mid)),
        trebleLevel: Math.max(0, Math.min(1, treble)),
        confidence: 0.55,
    };
}
