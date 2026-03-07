// ─── Song Analysis ────────────────────────────────────────────────────────────

export type Genre =
  | 'pop'
  | 'rock'
  | 'electronic'
  | 'jazz'
  | 'classical'
  | 'hip-hop'
  | 'r&b'
  | 'metal'
  | 'folk'
  | 'ambient'
  | 'unknown';

export type Mood = 'energetic' | 'peaceful' | 'melancholic' | 'uplifting' | 'intense' | 'relaxed';

export interface SongProfile {
  title: string;
  genre: Genre;
  energy: number;          // 0–1
  mood: Mood;
  bpmEstimate: number;
  bassEmphasis: number;    // 0–1
  vocalPresence: number;   // 0–1
  trebleEnergy: number;    // 0–1
  rhythmIntensity: number; // 0–1
}

export type VibeModeType = 'energetic' | 'peaceful';

// ─── IEM Profiling ────────────────────────────────────────────────────────────

export type TuningSignature =
  | 'Harman Target'
  | 'V-Shape'
  | 'Sharp V'
  | 'Balanced V'
  | 'Warm Neutral'
  | 'Bright'
  | 'Dark'
  | 'U-Shape'
  | 'W-Shape'
  | 'Mid-Forward'
  | 'Diffuse Field'
  | 'Bass Boosted';

export interface IEMProfile {
  id: string;
  model: string;
  brand: string;
  tuningSignature: TuningSignature;
  tonalNotes: string[];
  bassLevel: number;       // 0–1 (relative)
  midLevel: number;        // 0–1
  trebleLevel: number;     // 0–1
  confidence: number;      // 0–1 match confidence
}

// ─── EQ ──────────────────────────────────────────────────────────────────────

export const EQ_BANDS = [25, 40, 63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000, 16000] as const;
export type EQBand = typeof EQ_BANDS[number];

export type EQGains = Record<EQBand, number>;

export interface EQRecommendation {
  gains: EQGains;
  preamp: number;
  reasoning: string[];
}

// ─── User Preferences ─────────────────────────────────────────────────────────

export type ListenerPreference = 'balanced' | 'bass' | 'vocals' | 'sparkle';

// ─── Preset ──────────────────────────────────────────────────────────────────

export interface Preset {
  id: string;
  name: string;
  createdAt: string;
  songProfile: SongProfile;
  iemProfile: IEMProfile;
  eqRecommendation: EQRecommendation;
  preference: ListenerPreference;
  songTitle: string;
  iemModel: string;
}

// ─── Analysis Input ───────────────────────────────────────────────────────────

export interface AnalysisInput {
  songTitle: string;
  iemModel: string;
  preference: ListenerPreference;
  audioFile?: File;
}

// ─── Analysis Result ─────────────────────────────────────────────────────────

export interface AnalysisResult {
  songProfile: SongProfile;
  iemProfile: IEMProfile;
  eqRecommendation: EQRecommendation;
  mlConfidence?: number;
  mlEnhanced?: boolean;
}

// ─── ML Types ────────────────────────────────────────────────────────────────

export type EQFeedbackRating = 'perfect' | 'good' | 'needs_work' | 'bad';

export interface EQFeedback {
  id: string;
  timestamp: string;
  genre: Genre;
  iemBass: number;
  iemMid: number;
  iemTreble: number;
  preference: ListenerPreference;
  energy: number;
  bassEmphasis: number;
  vocalPresence: number;
  trebleEnergy: number;
  gains: EQGains;
  rating: EQFeedbackRating;
}

export interface MLPrediction {
  gains: EQGains;
  confidence: number;
}

export interface HybridRecommendation extends EQRecommendation {
  mlConfidence: number;
  mlEnhanced: boolean;
  rulesGains: EQGains;
  mlGains: EQGains;
}

// ─── Feature Encoding Maps ───────────────────────────────────────────────────

export const GENRE_INDEX: Record<Genre, number> = {
  'pop': 0, 'rock': 1, 'electronic': 2, 'jazz': 3, 'classical': 4,
  'hip-hop': 5, 'r&b': 6, 'metal': 7, 'folk': 8, 'ambient': 9, 'unknown': 10,
};

export const PREFERENCE_INDEX: Record<ListenerPreference, number> = {
  'balanced': 0, 'bass': 1, 'vocals': 2, 'sparkle': 3,
};

export const TUNING_INDEX: Record<TuningSignature, number> = {
  'Harman Target': 0, 'V-Shape': 1, 'Sharp V': 2, 'Balanced V': 3,
  'Warm Neutral': 4, 'Bright': 5, 'Dark': 6, 'U-Shape': 7,
  'W-Shape': 8, 'Mid-Forward': 9, 'Diffuse Field': 10, 'Bass Boosted': 11,
};

export const ML_INPUT_SIZE = 20;  // 11 genre one-hot + 3 IEM levels + 1 preference + 4 song features + 1 tuning
export const ML_HIDDEN_SIZE = 32;
export const ML_OUTPUT_SIZE = 15; // 15 EQ bands
