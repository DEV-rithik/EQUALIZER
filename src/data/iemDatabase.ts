import type { IEMProfile, TuningSignature } from '../types';

export const IEM_DATABASE: IEMProfile[] = [
  {
    id: 'moondrop-aria',
    model: 'Aria',
    brand: 'Moondrop',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Slightly warm bass', 'Clean mids', 'Smooth treble', 'Natural timbre'],
    bassLevel: 0.45,
    midLevel: 0.5,
    trebleLevel: 0.45,
    confidence: 1,
  },
  {
    id: 'moondrop-starfield',
    model: 'Starfield',
    brand: 'Moondrop',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Controlled bass', 'Neutral mids', 'Extended treble', 'Reference-ish'],
    bassLevel: 0.42,
    midLevel: 0.52,
    trebleLevel: 0.48,
    confidence: 1,
  },
  {
    id: 'moondrop-blessing2',
    model: 'Blessing 2',
    brand: 'Moondrop',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Extended bass', 'Slightly recessed mids', 'Airy treble', 'Technically capable'],
    bassLevel: 0.46,
    midLevel: 0.44,
    trebleLevel: 0.52,
    confidence: 1,
  },
  {
    id: 'moondrop-kato',
    model: 'KATO',
    brand: 'Moondrop',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Punchy bass', 'Clear mids', 'Smooth highs', 'Dynamic driver character'],
    bassLevel: 0.48,
    midLevel: 0.5,
    trebleLevel: 0.44,
    confidence: 1,
  },
  {
    id: 'thieaudio-oracle',
    model: 'Oracle',
    brand: 'Thieaudio',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Deep bass', 'Lush mids', 'Detailed treble', 'Reference tuned'],
    bassLevel: 0.5,
    midLevel: 0.5,
    trebleLevel: 0.5,
    confidence: 1,
  },
  {
    id: 'tin-t2',
    model: 'T2',
    brand: 'Tin HiFi',
    tuningSignature: 'Diffuse Field',
    tonalNotes: ['Lean bass', 'Forward mids', 'Bright treble', 'Analytical'],
    bassLevel: 0.3,
    midLevel: 0.65,
    trebleLevel: 0.65,
    confidence: 1,
  },
  {
    id: 'tin-t3',
    model: 'T3',
    brand: 'Tin HiFi',
    tuningSignature: 'Balanced V',
    tonalNotes: ['Moderate bass', 'Slightly recessed mids', 'Sparkly treble'],
    bassLevel: 0.5,
    midLevel: 0.4,
    trebleLevel: 0.6,
    confidence: 1,
  },
  {
    id: 'kz-zsn-pro',
    model: 'ZSN Pro',
    brand: 'KZ',
    tuningSignature: 'V-Shape',
    tonalNotes: ['Boosted bass', 'Recessed mids', 'Bright treble', 'Consumer-tuned'],
    bassLevel: 0.75,
    midLevel: 0.3,
    trebleLevel: 0.7,
    confidence: 1,
  },
  {
    id: 'kz-zex-pro',
    model: 'ZEX Pro',
    brand: 'KZ',
    tuningSignature: 'V-Shape',
    tonalNotes: ['Heavy bass', 'Scooped mids', 'Crispy treble', 'Fun signature'],
    bassLevel: 0.8,
    midLevel: 0.25,
    trebleLevel: 0.72,
    confidence: 1,
  },
  {
    id: 'kz-zs10-pro',
    model: 'ZS10 Pro',
    brand: 'KZ',
    tuningSignature: 'V-Shape',
    tonalNotes: ['Strong bass', 'Slightly forward upper mids', 'Energetic treble'],
    bassLevel: 0.72,
    midLevel: 0.35,
    trebleLevel: 0.68,
    confidence: 1,
  },
  {
    id: 'etymotic-er2xr',
    model: 'ER2XR',
    brand: 'Etymotic',
    tuningSignature: 'Diffuse Field',
    tonalNotes: ['Neutral bass extension', 'Flat mids', 'Accurate treble', 'Reference class'],
    bassLevel: 0.35,
    midLevel: 0.6,
    trebleLevel: 0.6,
    confidence: 1,
  },
  {
    id: 'etymotic-er4xr',
    model: 'ER4XR',
    brand: 'Etymotic',
    tuningSignature: 'Diffuse Field',
    tonalNotes: ['Extended low end', 'Very neutral mids', 'Precise highs', 'Studio reference'],
    bassLevel: 0.4,
    midLevel: 0.62,
    trebleLevel: 0.58,
    confidence: 1,
  },
  {
    id: 'sony-ier-m7',
    model: 'IER-M7',
    brand: 'Sony',
    tuningSignature: 'Warm Neutral',
    tonalNotes: ['Warm bass', 'Natural mids', 'Smooth treble', 'Musical'],
    bassLevel: 0.55,
    midLevel: 0.55,
    trebleLevel: 0.42,
    confidence: 1,
  },
  {
    id: 'sony-ier-z1r',
    model: 'IER-Z1R',
    brand: 'Sony',
    tuningSignature: 'W-Shape',
    tonalNotes: ['Deep powerful bass', 'Present mids', 'Detailed highs', 'Grand soundstage'],
    bassLevel: 0.8,
    midLevel: 0.5,
    trebleLevel: 0.65,
    confidence: 1,
  },
  {
    id: 'shure-se215',
    model: 'SE215',
    brand: 'Shure',
    tuningSignature: 'Bass Boosted',
    tonalNotes: ['Warm bass', 'Smooth mids', 'Rolled treble', 'Forgiving'],
    bassLevel: 0.7,
    midLevel: 0.45,
    trebleLevel: 0.35,
    confidence: 1,
  },
  {
    id: 'shure-se535',
    model: 'SE535',
    brand: 'Shure',
    tuningSignature: 'Mid-Forward',
    tonalNotes: ['Controlled bass', 'Very forward mids', 'Smooth treble', 'Vocal-centric'],
    bassLevel: 0.4,
    midLevel: 0.75,
    trebleLevel: 0.4,
    confidence: 1,
  },
  {
    id: 'campfire-andromeda',
    model: 'Andromeda',
    brand: 'Campfire Audio',
    tuningSignature: 'Balanced V',
    tonalNotes: ['Extended bass', 'Present mids', 'Airy treble', 'Wide soundstage'],
    bassLevel: 0.58,
    midLevel: 0.48,
    trebleLevel: 0.62,
    confidence: 1,
  },
  {
    id: 'campfire-solaris',
    model: 'Solaris',
    brand: 'Campfire Audio',
    tuningSignature: 'W-Shape',
    tonalNotes: ['Rich bass', 'Nuanced mids', 'Extended treble', 'Holographic imaging'],
    bassLevel: 0.65,
    midLevel: 0.52,
    trebleLevel: 0.62,
    confidence: 1,
  },
  {
    id: 'iem-64audio-u12t',
    model: 'U12T',
    brand: '64 Audio',
    tuningSignature: 'Warm Neutral',
    tonalNotes: ['Tight bass', 'Warm mids', 'Smooth highs', 'Dense presentation'],
    bassLevel: 0.52,
    midLevel: 0.58,
    trebleLevel: 0.42,
    confidence: 1,
  },
  {
    id: 'sennheiser-ie300',
    model: 'IE300',
    brand: 'Sennheiser',
    tuningSignature: 'Balanced V',
    tonalNotes: ['Detailed bass', 'Recessed lower mids', 'Open highs', 'Musical'],
    bassLevel: 0.6,
    midLevel: 0.38,
    trebleLevel: 0.6,
    confidence: 1,
  },
  {
    id: 'sennheiser-ie600',
    model: 'IE600',
    brand: 'Sennheiser',
    tuningSignature: 'Balanced V',
    tonalNotes: ['Extended bass', 'Clean mids', 'Detailed treble', 'High resolution'],
    bassLevel: 0.58,
    midLevel: 0.44,
    trebleLevel: 0.62,
    confidence: 1,
  },
  {
    id: 'final-a4000',
    model: 'A4000',
    brand: 'Final',
    tuningSignature: 'Bright',
    tonalNotes: ['Lean bass', 'Forward mids', 'Bright energetic highs', 'Wide stage'],
    bassLevel: 0.32,
    midLevel: 0.55,
    trebleLevel: 0.72,
    confidence: 1,
  },
  {
    id: 'final-e3000',
    model: 'E3000',
    brand: 'Final',
    tuningSignature: 'Warm Neutral',
    tonalNotes: ['Warm low end', 'Natural mids', 'Smooth treble', 'Easy listening'],
    bassLevel: 0.6,
    midLevel: 0.52,
    trebleLevel: 0.38,
    confidence: 1,
  },
  {
    id: 'blon-bl03',
    model: 'BL-03',
    brand: 'BLON',
    tuningSignature: 'Warm Neutral',
    tonalNotes: ['Warm punchy bass', 'Slightly thick mids', 'Gentle treble', 'Musical'],
    bassLevel: 0.62,
    midLevel: 0.5,
    trebleLevel: 0.36,
    confidence: 1,
  },
  {
    id: 'truthear-hola',
    model: 'Hola',
    brand: 'Truthear',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Extended bass', 'Natural mids', 'Smooth treble', 'Budget reference'],
    bassLevel: 0.48,
    midLevel: 0.5,
    trebleLevel: 0.46,
    confidence: 1,
  },
  {
    id: 'truthear-zero',
    model: 'ZERO',
    brand: 'Truthear',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Controlled bass', 'Forward mids', 'Extended highs', 'Accurate'],
    bassLevel: 0.44,
    midLevel: 0.54,
    trebleLevel: 0.5,
    confidence: 1,
  },
  {
    id: 'simgot-em6l',
    model: 'EM6L',
    brand: 'Simgot',
    tuningSignature: 'Balanced V',
    tonalNotes: ['Impactful bass', 'Clear mids', 'Crisp treble', 'Dynamic presentation'],
    bassLevel: 0.6,
    midLevel: 0.44,
    trebleLevel: 0.58,
    confidence: 1,
  },
  {
    id: 'letshuoer-s12',
    model: 'S12',
    brand: "Letshuoer",
    tuningSignature: 'Bright',
    tonalNotes: ['Sub-bass emphasis', 'Clean mids', 'Resolving treble', 'Planar detail'],
    bassLevel: 0.5,
    midLevel: 0.48,
    trebleLevel: 0.68,
    confidence: 1,
  },
  {
    id: 'generic-balanced',
    model: 'Generic Balanced',
    brand: 'Generic',
    tuningSignature: 'Harman Target',
    tonalNotes: ['Neutral across spectrum', 'Reference-class tuning'],
    bassLevel: 0.5,
    midLevel: 0.5,
    trebleLevel: 0.5,
    confidence: 0.3,
  },
];

// ─── Fuzzy matching ───────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[\s\-_\/]+/).filter(Boolean);
}

function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function tokenSimilarity(queryTokens: string[], targetTokens: string[]): number {
  if (queryTokens.length === 0 || targetTokens.length === 0) return 0;
  let matched = 0;
  for (const qt of queryTokens) {
    const best = Math.min(...targetTokens.map(tt => editDistance(qt, tt)));
    const maxLen = Math.max(qt.length, 1);
    if (best / maxLen < 0.4) matched++;
  }
  return matched / queryTokens.length;
}

export function matchIEM(query: string): IEMProfile {
  if (!query.trim()) return { ...IEM_DATABASE[IEM_DATABASE.length - 1] };

  const qNorm = normalize(query);
  const qTokens = tokenize(query);

  let bestScore = -1;
  let bestMatch: IEMProfile = IEM_DATABASE[IEM_DATABASE.length - 1];

  for (const iem of IEM_DATABASE) {
    if (iem.id === 'generic-balanced') continue;

    const modelNorm = normalize(iem.model);
    const brandNorm = normalize(iem.brand);
    const combined = normalize(`${iem.brand} ${iem.model}`);
    const targetTokens = tokenize(`${iem.brand} ${iem.model}`);

    let score = 0;

    // Exact match bonuses
    if (qNorm === modelNorm || qNorm === combined) score += 1.0;
    if (qNorm.includes(modelNorm) || modelNorm.includes(qNorm)) score += 0.6;
    if (qNorm.includes(brandNorm)) score += 0.3;

    // Token similarity
    score += tokenSimilarity(qTokens, targetTokens) * 0.8;

    // Normalized edit distance
    const dist = editDistance(qNorm, combined);
    const normDist = 1 - dist / Math.max(qNorm.length, combined.length, 1);
    score += normDist * 0.4;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = iem;
    }
  }

  // Compute confidence based on best score
  const maxPossibleScore = 2.8;
  const rawConfidence = Math.min(bestScore / maxPossibleScore, 1);
  const confidence = Math.max(0.15, rawConfidence);

  return { ...bestMatch, confidence };
}
