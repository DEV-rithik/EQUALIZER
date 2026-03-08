import type { Preset, EQFeedback, IEMProfile } from '../types';

const STORAGE_KEY = 'equalizer_presets';
const FEEDBACK_KEY = 'equalizer_feedback';
const ML_WEIGHTS_KEY = 'equalizer_ml_weights';
const USER_IEM_KEY = 'equalizer_user_iem';

export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Preset[];
  } catch {
    return [];
  }
}

export function savePreset(preset: Preset): void {
  const presets = loadPresets();
  // Replace if id exists, else prepend
  const idx = presets.findIndex(p => p.id === preset.id);
  if (idx >= 0) {
    presets[idx] = preset;
  } else {
    presets.unshift(preset);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function deletePreset(id: string): void {
  const presets = loadPresets().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function generatePresetId(): string {
  return `preset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Feedback Persistence ────────────────────────────────────────────────────

export function loadFeedback(): EQFeedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EQFeedback[];
  } catch {
    return [];
  }
}

export function saveFeedback(feedback: EQFeedback): void {
  const all = loadFeedback();
  all.push(feedback);
  // Keep only last 200 feedback entries to avoid storage bloat
  const trimmed = all.slice(-200);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(trimmed));
}

export function generateFeedbackId(): string {
  return `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── ML Weights Persistence ──────────────────────────────────────────────────

export function saveMLWeights(weights: unknown): void {
  try {
    localStorage.setItem(ML_WEIGHTS_KEY, JSON.stringify(weights));
  } catch {
    console.warn('[ML] Could not save model weights to localStorage');
  }
}

export function loadMLWeights(): unknown | null {
  try {
    const raw = localStorage.getItem(ML_WEIGHTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── User IEM Profile Persistence ────────────────────────────────────────────

export function saveUserIEM(profile: IEMProfile): void {
  try {
    localStorage.setItem(USER_IEM_KEY, JSON.stringify(profile));
  } catch {
    console.warn('[IEM] Could not save user IEM profile');
  }
}

export function loadUserIEM(): IEMProfile | null {
  try {
    const raw = localStorage.getItem(USER_IEM_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as IEMProfile;
  } catch {
    return null;
  }
}

export function hasUserIEM(): boolean {
  return localStorage.getItem(USER_IEM_KEY) !== null;
}

// ─── ML Data Reset ───────────────────────────────────────────────────────────

export function clearMLData(): void {
  localStorage.removeItem(FEEDBACK_KEY);
  localStorage.removeItem(ML_WEIGHTS_KEY);
  console.log('[ML] All feedback and model weights cleared');
}

