import type { SongProfile, IEMProfile, EQGains, EQRecommendation, ListenerPreference } from '../types';
import { EQ_BANDS } from '../types';

// ─── Band groupings ──────────────────────────────────────────────────────────

const SUB_BASS = [25, 40] as const;
const BASS = [63, 100, 160] as const;
const LOW_MID = [250, 400] as const;
const MID = [630, 1000] as const;
const UPPER_MID = [1600, 2500] as const;
const PRESENCE = [4000, 6300] as const;
const AIR = [10000, 16000] as const;

type Band = typeof EQ_BANDS[number];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// ─── Build base EQ from IEM profile ──────────────────────────────────────────

function buildIEMCorrection(iem: IEMProfile): Partial<Record<Band, number>> {
  const gains: Partial<Record<Band, number>> = {};

  // Correct towards neutral: if IEM has high bass, cut bass; if lean, boost
  const bassCorrection = (0.5 - iem.bassLevel) * 4;
  const midCorrection = (0.5 - iem.midLevel) * 3;
  const trebleCorrection = (0.5 - iem.trebleLevel) * 3;

  for (const b of SUB_BASS) gains[b] = clamp(bassCorrection * 0.8, -4, 4);
  for (const b of BASS) gains[b] = clamp(bassCorrection, -4, 4);
  for (const b of LOW_MID) gains[b] = clamp(midCorrection * 0.5, -3, 3);
  for (const b of MID) gains[b] = clamp(midCorrection, -3, 3);
  for (const b of UPPER_MID) gains[b] = clamp(midCorrection * 0.7, -3, 3);
  for (const b of PRESENCE) gains[b] = clamp(trebleCorrection * 0.7, -3, 3);
  for (const b of AIR) gains[b] = clamp(trebleCorrection, -3, 3);

  return gains;
}

// ─── Apply song-based shaping ─────────────────────────────────────────────────

function applySongShaping(
  gains: Partial<Record<Band, number>>,
  song: SongProfile,
): Partial<Record<Band, number>> {
  const result = { ...gains };

  // Sub-bass: boost for high bass-emphasis songs
  const bassBoost = (song.bassEmphasis - 0.5) * 4;
  for (const b of SUB_BASS) result[b] = (result[b] ?? 0) + bassBoost * 0.7;
  for (const b of BASS) result[b] = (result[b] ?? 0) + bassBoost;

  // Mids: boost for vocal-heavy genres
  const midBoost = (song.vocalPresence - 0.5) * 2;
  for (const b of MID) result[b] = (result[b] ?? 0) + midBoost * 0.5;
  for (const b of UPPER_MID) result[b] = (result[b] ?? 0) + midBoost;

  // Treble / air: adjust for treble energy
  const trebleBoost = (song.trebleEnergy - 0.5) * 2;
  for (const b of PRESENCE) result[b] = (result[b] ?? 0) + trebleBoost * 0.6;
  for (const b of AIR) result[b] = (result[b] ?? 0) + trebleBoost;

  return result;
}

// ─── Apply listener preference ────────────────────────────────────────────────

function applyPreference(
  gains: Partial<Record<Band, number>>,
  pref: ListenerPreference,
): Partial<Record<Band, number>> {
  const result = { ...gains };

  switch (pref) {
    case 'bass':
      for (const b of SUB_BASS) result[b] = (result[b] ?? 0) + 2.5;
      for (const b of BASS) result[b] = (result[b] ?? 0) + 2;
      break;
    case 'vocals':
      for (const b of MID) result[b] = (result[b] ?? 0) + 1.5;
      for (const b of UPPER_MID) result[b] = (result[b] ?? 0) + 2;
      for (const b of LOW_MID) result[b] = (result[b] ?? 0) - 0.5;
      break;
    case 'sparkle':
      for (const b of PRESENCE) result[b] = (result[b] ?? 0) + 2;
      for (const b of AIR) result[b] = (result[b] ?? 0) + 2.5;
      for (const b of UPPER_MID) result[b] = (result[b] ?? 0) + 1;
      break;
    case 'balanced':
    default:
      // No additional shaping
      break;
  }

  return result;
}

// ─── Build reasoning strings ─────────────────────────────────────────────────

function buildReasoning(
  song: SongProfile,
  iem: IEMProfile,
  pref: ListenerPreference,
): string[] {
  const reasons: string[] = [];

  // IEM correction
  if (iem.bassLevel > 0.65) {
    reasons.push(`${iem.brand} ${iem.model} has a bass-heavy tuning — bass bands slightly reduced to maintain balance.`);
  } else if (iem.bassLevel < 0.38) {
    reasons.push(`${iem.brand} ${iem.model} is bass-lean — sub-bass and bass boosted to restore low-end body.`);
  } else {
    reasons.push(`${iem.brand} ${iem.model}'s bass is close to neutral; minor correction applied.`);
  }

  if (iem.midLevel > 0.65) {
    reasons.push(`Forward mids on this IEM — mids slightly relaxed to reduce potential harshness.`);
  } else if (iem.midLevel < 0.38) {
    reasons.push(`Recessed mids (${iem.tuningSignature} signature) — mids boosted for vocal clarity and instrument body.`);
  }

  if (iem.trebleLevel > 0.65) {
    reasons.push(`Bright/extended treble on ${iem.model} — presence and air frequencies tamed to prevent fatigue.`);
  } else if (iem.trebleLevel < 0.38) {
    reasons.push(`Dark/warm treble on ${iem.model} — high frequencies lifted for clarity and air.`);
  }

  // Song shaping
  if (song.bassEmphasis > 0.65) {
    reasons.push(`"${song.title}" is a bass-heavy ${song.genre} track — extra sub-bass and bass boost applied.`);
  } else if (song.bassEmphasis < 0.35) {
    reasons.push(`"${song.title}" is a lighter genre with less bass — low-end kept controlled.`);
  }

  if (song.vocalPresence > 0.7) {
    reasons.push(`High vocal presence detected — upper mids lifted to project vocals.`);
  }

  if (song.trebleEnergy > 0.65) {
    reasons.push(`High treble energy in this genre — air frequencies enhanced for sparkle.`);
  }

  // Preference
  switch (pref) {
    case 'bass':
      reasons.push(`Bass preference selected — additional sub-bass and bass boost applied (+2–2.5 dB).`);
      break;
    case 'vocals':
      reasons.push(`Vocals preference selected — mids and upper-mids elevated for forward vocals.`);
      break;
    case 'sparkle':
      reasons.push(`Sparkle preference selected — presence and air boosted for a bright, airy character.`);
      break;
    case 'balanced':
      reasons.push(`Balanced preference — no additional bias applied; targeting a neutral, flat response.`);
      break;
  }

  // Energy note
  if (song.energy > 0.75) {
    reasons.push(`High-energy track (${song.genre}) — EQ shaped for dynamic impact and drive.`);
  } else if (song.energy < 0.3) {
    reasons.push(`Low-energy track — EQ shaped for a smooth, relaxed listening experience.`);
  }

  return reasons;
}

// ─── Compute preamp ───────────────────────────────────────────────────────────

function computePreamp(gains: EQGains): number {
  const maxBoost = Math.max(0, ...Object.values(gains));
  return maxBoost > 0 ? -(maxBoost) : 0;
}

// ─── Main recommendation function ────────────────────────────────────────────

export function recommendEQ(
  song: SongProfile,
  iem: IEMProfile,
  preference: ListenerPreference,
): EQRecommendation {
  // Start from IEM correction
  let partial = buildIEMCorrection(iem);
  // Apply song shaping
  partial = applySongShaping(partial, song);
  // Apply user preference
  partial = applyPreference(partial, preference);

  // Normalize to EQGains (clamp to ±6 dB)
  const gains = {} as EQGains;
  for (const band of EQ_BANDS) {
    gains[band] = clamp(Math.round((partial[band] ?? 0) * 10) / 10, -6, 6);
  }

  const preamp = computePreamp(gains);
  const reasoning = buildReasoning(song, iem, preference);

  return { gains, preamp, reasoning };
}
