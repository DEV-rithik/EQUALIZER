import type { SongProfile, IEMProfile, EQGains, EQRecommendation, ListenerPreference } from '../types';
import { EQ_BANDS } from '../types';

// ─── 10-Band groupings ───────────────────────────────────────────────────────
// [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

const SUB_BASS = [31] as const;     // Deep sub-bass rumble
const BASS = [62, 125] as const;    // Punch, body, kick drums
const LOW_MID = [250, 500] as const;// Warmth, muddiness zone
const MID = [1000, 2000] as const;  // Vocals, instruments clarity
const TREBLE = [4000, 8000] as const; // Presence, attack, detail
const AIR = [16000] as const;       // Sparkle, airiness, shimmer

type Band = typeof EQ_BANDS[number];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// ─── Build base EQ from IEM profile (AGGRESSIVE corrections) ─────────────────

function buildIEMCorrection(iem: IEMProfile): Partial<Record<Band, number>> {
  const gains: Partial<Record<Band, number>> = {};

  // MORE AGGRESSIVE corrections: ±8 dB range to make differences audible
  const bassCorrection = (0.5 - iem.bassLevel) * 8;   // was *4
  const midCorrection = (0.5 - iem.midLevel) * 6;     // was *3
  const trebleCorrection = (0.5 - iem.trebleLevel) * 6; // was *3

  for (const b of SUB_BASS) gains[b] = clamp(bassCorrection * 0.9, -8, 8);
  for (const b of BASS) gains[b] = clamp(bassCorrection * 1.1, -8, 8);
  for (const b of LOW_MID) gains[b] = clamp(midCorrection * 0.6, -6, 6);
  for (const b of MID) gains[b] = clamp(midCorrection, -6, 6);
  for (const b of TREBLE) gains[b] = clamp(trebleCorrection * 0.8, -6, 6);
  for (const b of AIR) gains[b] = clamp(trebleCorrection * 1.1, -8, 8);

  return gains;
}

// ─── Apply song-based shaping (NOTICEABLE changes) ───────────────────────────

function applySongShaping(
  gains: Partial<Record<Band, number>>,
  song: SongProfile,
): Partial<Record<Band, number>> {
  const result = { ...gains };

  // Sub-bass & bass: heavy boost for bass-emphasis songs
  const bassBoost = (song.bassEmphasis - 0.35) * 8;  // was *4, lower threshold
  for (const b of SUB_BASS) result[b] = (result[b] ?? 0) + bassBoost * 1.2;
  for (const b of BASS) result[b] = (result[b] ?? 0) + bassBoost;

  // Fight muddiness: scoop lower mids slightly on bass-heavy tracks
  if (song.bassEmphasis > 0.6) {
    for (const b of LOW_MID) result[b] = (result[b] ?? 0) - 1.5;
  }

  // Mids: boost hard for vocal-heavy genres
  const midBoost = (song.vocalPresence - 0.4) * 5;  // was *2
  for (const b of MID) result[b] = (result[b] ?? 0) + midBoost;

  // Treble / air: strong adjustment for treble energy
  const trebleBoost = (song.trebleEnergy - 0.4) * 5;  // was *2
  for (const b of TREBLE) result[b] = (result[b] ?? 0) + trebleBoost * 0.8;
  for (const b of AIR) result[b] = (result[b] ?? 0) + trebleBoost * 1.2;

  // Energy-based dynamic shaping: loud tracks get more punch
  if (song.energy > 0.7) {
    for (const b of BASS) result[b] = (result[b] ?? 0) + 1.5;
    for (const b of TREBLE) result[b] = (result[b] ?? 0) + 1.0;
  } else if (song.energy < 0.3) {
    // Chill tracks: warmer, smoother
    for (const b of LOW_MID) result[b] = (result[b] ?? 0) + 1.0;
    for (const b of TREBLE) result[b] = (result[b] ?? 0) - 1.0;
  }

  return result;
}

// ─── Apply listener preference (STRONG, OBVIOUS impact) ──────────────────────

function applyPreference(
  gains: Partial<Record<Band, number>>,
  pref: ListenerPreference,
): Partial<Record<Band, number>> {
  const result = { ...gains };

  switch (pref) {
    case 'bass':
      // HEAVY bass boost — user should feel it in their chest
      for (const b of SUB_BASS) result[b] = (result[b] ?? 0) + 5.0;
      for (const b of BASS) result[b] = (result[b] ?? 0) + 4.0;
      for (const b of LOW_MID) result[b] = (result[b] ?? 0) + 1.5;
      // Slight mid scoop to make bass stand out more
      for (const b of MID) result[b] = (result[b] ?? 0) - 1.0;
      break;
    case 'vocals':
      // Push mids and upper-mids hard for forward, intimate vocals
      for (const b of MID) result[b] = (result[b] ?? 0) + 4.0;
      for (const b of TREBLE) result[b] = (result[b] ?? 0) + 2.5;
      // Cut bass to clean up and let vocals shine
      for (const b of SUB_BASS) result[b] = (result[b] ?? 0) - 1.5;
      for (const b of BASS) result[b] = (result[b] ?? 0) - 1.0;
      for (const b of LOW_MID) result[b] = (result[b] ?? 0) - 1.5;
      break;
    case 'sparkle':
      // Bright, airy, shimmering top-end
      for (const b of TREBLE) result[b] = (result[b] ?? 0) + 4.0;
      for (const b of AIR) result[b] = (result[b] ?? 0) + 5.0;
      for (const b of MID) result[b] = (result[b] ?? 0) + 1.5;
      // Slight bass cut for perceived clarity
      for (const b of SUB_BASS) result[b] = (result[b] ?? 0) - 1.0;
      break;
    case 'balanced':
    default:
      // Gentle Harman-inspired curve: slight bass boost, slight treble lift
      for (const b of SUB_BASS) result[b] = (result[b] ?? 0) + 1.5;
      for (const b of BASS) result[b] = (result[b] ?? 0) + 1.0;
      for (const b of TREBLE) result[b] = (result[b] ?? 0) + 0.5;
      for (const b of AIR) result[b] = (result[b] ?? 0) + 1.0;
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
    reasons.push(`${iem.brand} ${iem.model} has heavy bass — aggressively tamed to prevent bloat and improve clarity.`);
  } else if (iem.bassLevel < 0.38) {
    reasons.push(`${iem.brand} ${iem.model} is bass-lean — significant sub-bass and bass boost to restore impact.`);
  } else {
    reasons.push(`${iem.brand} ${iem.model}'s bass is near-neutral; moderate correction applied.`);
  }

  if (iem.midLevel > 0.65) {
    reasons.push(`Forward mids on this IEM — pulled back to reduce honkiness and fatigue.`);
  } else if (iem.midLevel < 0.38) {
    reasons.push(`Recessed mids (${iem.tuningSignature} signature) — strongly boosted for vocal clarity and instrument presence.`);
  }

  if (iem.trebleLevel > 0.65) {
    reasons.push(`Bright/extended treble on ${iem.model} — presence and air tamed to prevent sibilance.`);
  } else if (iem.trebleLevel < 0.38) {
    reasons.push(`Dark/warm treble on ${iem.model} — treble and air bands strongly lifted for detail and sparkle.`);
  }

  // Song shaping
  if (song.bassEmphasis > 0.65) {
    reasons.push(`"${song.title}" is a bass-heavy ${song.genre} track — deep sub-bass and bass boosted for maximum impact.`);
  } else if (song.bassEmphasis < 0.35) {
    reasons.push(`"${song.title}" has light bass — low-end kept tight and controlled.`);
  }

  if (song.vocalPresence > 0.7) {
    reasons.push(`Strong vocal presence detected — mids pushed forward to project vocals clearly.`);
  }

  if (song.trebleEnergy > 0.65) {
    reasons.push(`High treble energy in this track — upper frequencies enhanced for detail and air.`);
  }

  if (song.energy > 0.7) {
    reasons.push(`High-energy track (${song.genre}) — extra punch added to bass and treble for dynamic impact.`);
  } else if (song.energy < 0.3) {
    reasons.push(`Chill track — warmer tuning with smoother treble for relaxed listening.`);
  }

  // Preference
  switch (pref) {
    case 'bass':
      reasons.push(`🔊 Bass preference — heavy sub-bass boost (+5 dB) and bass boost (+4 dB) for chest-thumping impact.`);
      break;
    case 'vocals':
      reasons.push(`🎤 Vocals preference — mids elevated +4 dB with bass scooped for crystal-clear vocals.`);
      break;
    case 'sparkle':
      reasons.push(`✨ Sparkle preference — treble +4 dB and air +5 dB for brilliant, shimmering detail.`);
      break;
    case 'balanced':
      reasons.push(`⚖️ Balanced preference — gentle Harman-inspired curve for natural, full-bodied sound.`);
      break;
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

  // Normalize to EQGains (clamp to ±10 dB for noticeable impact)
  const gains = {} as EQGains;
  for (const band of EQ_BANDS) {
    gains[band] = clamp(Math.round((partial[band] ?? 0) * 10) / 10, -10, 10);
  }

  // Ensure minimum impact: if all gains are too close to 0, amplify
  const maxAbs = Math.max(...Object.values(gains).map(Math.abs));
  if (maxAbs < 2.0) {
    const boost = 2.0 / (maxAbs || 1);
    for (const band of EQ_BANDS) {
      gains[band] = clamp(Math.round(gains[band] * boost * 10) / 10, -10, 10);
    }
  }

  const preamp = computePreamp(gains);
  const reasoning = buildReasoning(song, iem, preference);

  return { gains, preamp, reasoning };
}
