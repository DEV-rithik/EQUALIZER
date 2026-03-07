import type { SongProfile, Genre, Mood } from '../types';

// ─── Keyword maps ─────────────────────────────────────────────────────────────

const GENRE_KEYWORDS: Record<Genre, string[]> = {
  'pop': ['pop', 'taylor', 'ariana', 'ed sheeran', 'billie', 'dua lipa', 'weeknd', 'selena', 'shawn', 'doja'],
  'rock': ['rock', 'guitar', 'band', 'nirvana', 'foo fighters', 'green day', 'radiohead', 'muse', 'oasis', 'arctic monkeys'],
  'electronic': ['electronic', 'edm', 'house', 'techno', 'trance', 'dj', 'deadmau5', 'skrillex', 'avicii', 'flume', 'aphex', 'burial', 'boards of canada', 'synth'],
  'jazz': ['jazz', 'miles davis', 'coltrane', 'bebop', 'swing', 'blues', 'duke ellington', 'bill evans', 'herbie'],
  'classical': ['classical', 'beethoven', 'mozart', 'bach', 'symphony', 'orchestra', 'piano', 'chopin', 'debussy', 'vivaldi'],
  'hip-hop': ['hip hop', 'hip-hop', 'rap', 'kendrick', 'drake', 'j. cole', 'travis', 'kanye', 'eminem', 'jay-z', 'nas', 'wu-tang'],
  'r&b': ['r&b', 'rnb', 'soul', 'frank ocean', 'sza', 'usher', 'beyonce', 'marvin gaye', 'stevie wonder', 'alicia keys'],
  'metal': ['metal', 'heavy', 'death', 'black metal', 'metallica', 'slipknot', 'pantera', 'lamb of god', 'meshuggah'],
  'folk': ['folk', 'acoustic', 'indie folk', 'bon iver', 'fleet foxes', 'iron and wine', 'sufjan', 'joanna newsom'],
  'ambient': ['ambient', 'meditation', 'sleep', 'relaxing', 'nature', 'lofi', 'lo-fi', 'chill', 'drone', 'eno'],
  'unknown': [],
};

const ENERGY_KEYWORDS: Record<string, number> = {
  // high energy
  'metal': 0.95, 'edm': 0.9, 'electronic': 0.75, 'rock': 0.8, 'hip-hop': 0.75, 'hip hop': 0.75, 'rap': 0.75,
  'dance': 0.85, 'house': 0.85, 'techno': 0.9, 'trance': 0.88, 'heavy': 0.9, 'energetic': 0.9,
  // medium
  'pop': 0.6, 'r&b': 0.55, 'rnb': 0.55, 'soul': 0.5, 'funk': 0.7, 'jazz': 0.45,
  // low energy
  'classical': 0.35, 'ambient': 0.15, 'folk': 0.3, 'acoustic': 0.3, 'sleep': 0.1,
  'meditation': 0.1, 'chill': 0.25, 'lofi': 0.2, 'lo-fi': 0.2, 'relaxing': 0.15,
};

const MOOD_MAP: Record<string, Mood> = {
  'ambient': 'peaceful', 'sleep': 'peaceful', 'meditation': 'peaceful',
  'chill': 'relaxed', 'lofi': 'relaxed', 'lo-fi': 'relaxed', 'folk': 'relaxed',
  'acoustic': 'relaxed', 'classical': 'peaceful',
  'rock': 'intense', 'metal': 'intense', 'heavy': 'intense',
  'hip-hop': 'energetic', 'hip hop': 'energetic', 'rap': 'energetic',
  'edm': 'energetic', 'dance': 'energetic', 'house': 'energetic', 'electronic': 'energetic',
  'pop': 'uplifting', 'soul': 'uplifting', 'jazz': 'melancholic',
  'r&b': 'melancholic', 'rnb': 'melancholic',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lower(s: string) { return s.toLowerCase(); }

function detectGenre(title: string): Genre {
  const t = lower(title);
  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS) as [Genre, string[]][]) {
    if (genre === 'unknown') continue;
    if (keywords.some(kw => t.includes(kw))) return genre;
  }
  return 'unknown';
}

function estimateEnergy(title: string, genre: Genre): number {
  const t = lower(title);
  for (const [kw, val] of Object.entries(ENERGY_KEYWORDS)) {
    if (t.includes(kw)) return val;
  }
  // Fallback by genre
  const genreEnergy: Partial<Record<Genre, number>> = {
    'electronic': 0.75, 'rock': 0.75, 'metal': 0.9, 'hip-hop': 0.7,
    'pop': 0.6, 'r&b': 0.5, 'jazz': 0.45, 'classical': 0.35,
    'folk': 0.3, 'ambient': 0.15, 'unknown': 0.5,
  };
  return genreEnergy[genre] ?? 0.5;
}

function estimateMood(title: string, genre: Genre, energy: number): Mood {
  const t = lower(title);
  for (const [kw, mood] of Object.entries(MOOD_MAP)) {
    if (t.includes(kw)) return mood;
  }
  const genreMoods: Partial<Record<Genre, Mood>> = {
    'ambient': 'peaceful', 'classical': 'peaceful', 'folk': 'relaxed',
    'jazz': 'melancholic', 'r&b': 'melancholic', 'pop': 'uplifting',
    'electronic': 'energetic', 'hip-hop': 'energetic', 'rock': 'intense',
    'metal': 'intense',
  };
  const byGenre = genreMoods[genre];
  if (byGenre) return byGenre;
  if (energy > 0.7) return 'energetic';
  if (energy < 0.3) return 'peaceful';
  return 'uplifting';
}

function estimateBPM(genre: Genre, energy: number): number {
  const baseBPM: Partial<Record<Genre, number>> = {
    'ambient': 60, 'classical': 80, 'folk': 90, 'jazz': 100,
    'r&b': 85, 'pop': 115, 'hip-hop': 95, 'rock': 130,
    'electronic': 128, 'metal': 170, 'unknown': 100,
  };
  const base = baseBPM[genre] ?? 100;
  // Jitter by energy
  return Math.round(base + (energy - 0.5) * 30);
}

function estimateBassEmphasis(genre: Genre): number {
  const map: Partial<Record<Genre, number>> = {
    'hip-hop': 0.85, 'electronic': 0.75, 'metal': 0.7, 'rock': 0.6,
    'r&b': 0.65, 'pop': 0.5, 'jazz': 0.4, 'folk': 0.3,
    'classical': 0.3, 'ambient': 0.4, 'unknown': 0.5,
  };
  return map[genre] ?? 0.5;
}

function estimateVocalPresence(genre: Genre): number {
  const map: Partial<Record<Genre, number>> = {
    'folk': 0.85, 'r&b': 0.82, 'pop': 0.8, 'rock': 0.65, 'jazz': 0.6,
    'hip-hop': 0.7, 'classical': 0.2, 'electronic': 0.3, 'metal': 0.55,
    'ambient': 0.1, 'unknown': 0.5,
  };
  return map[genre] ?? 0.5;
}

function estimateTrebleEnergy(genre: Genre, energy: number): number {
  const map: Partial<Record<Genre, number>> = {
    'metal': 0.75, 'electronic': 0.7, 'rock': 0.65, 'pop': 0.55,
    'jazz': 0.5, 'classical': 0.55, 'folk': 0.4, 'ambient': 0.25,
    'r&b': 0.45, 'hip-hop': 0.5, 'unknown': 0.5,
  };
  return (map[genre] ?? 0.5) * (0.5 + energy * 0.5);
}

// ─── Main analysis function ───────────────────────────────────────────────────

export function analyzeSong(title: string): SongProfile {
  const genre = detectGenre(title);
  const energy = estimateEnergy(title, genre);
  const mood = estimateMood(title, genre, energy);
  const bpmEstimate = estimateBPM(genre, energy);
  const bassEmphasis = estimateBassEmphasis(genre);
  const vocalPresence = estimateVocalPresence(genre);
  const trebleEnergy = estimateTrebleEnergy(genre, energy);
  const rhythmIntensity = Math.min(1, energy * 1.1);

  return {
    title,
    genre,
    energy,
    mood,
    bpmEstimate,
    bassEmphasis,
    vocalPresence,
    trebleEnergy,
    rhythmIntensity,
  };
}
