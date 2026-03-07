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
}
