// ─── iTunes Search API Service ───────────────────────────────────────────────
// Free, no API key needed. Searches Apple's music catalog and fetches
// 30-second audio previews for real spectral analysis.

import type { Genre, SongProfile } from '../types';
import { analyzeAudioFile, mergeAudioFeatures } from '../engine/audioAnalyzer';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;       // album
  primaryGenreName: string;
  artworkUrl100: string;        // 100×100 album art
  previewUrl: string;           // 30-sec audio preview (m4a)
  trackTimeMillis: number;
}

interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesTrack[];
}

// ─── Genre Mapping ───────────────────────────────────────────────────────────

const ITUNES_GENRE_MAP: Record<string, Genre> = {
  'pop': 'pop',
  'dance': 'pop',
  'singer/songwriter': 'pop',
  'rock': 'rock',
  'alternative': 'rock',
  'hard rock': 'rock',
  'indie rock': 'rock',
  'punk': 'rock',
  'electronic': 'electronic',
  'electronica': 'electronic',
  'house': 'electronic',
  'techno': 'electronic',
  'trance': 'electronic',
  'ambient': 'ambient',
  'new age': 'ambient',
  'hip-hop/rap': 'hip-hop',
  'hip hop/rap': 'hip-hop',
  'hip-hop': 'hip-hop',
  'rap': 'hip-hop',
  'r&b/soul': 'r&b',
  'r&b': 'r&b',
  'soul': 'r&b',
  'jazz': 'jazz',
  'blues': 'jazz',
  'classical': 'classical',
  'opera': 'classical',
  'metal': 'metal',
  'heavy metal': 'metal',
  'death metal': 'metal',
  'folk': 'folk',
  'country': 'folk',
  'acoustic': 'folk',
  'reggae': 'folk',
  'soundtrack': 'classical',
  'anime': 'pop',
  'j-pop': 'pop',
  'k-pop': 'pop',
  'latin': 'pop',
  'world': 'folk',
};

function mapGenre(iTunesGenre: string): Genre {
  const lower = iTunesGenre.toLowerCase();
  if (ITUNES_GENRE_MAP[lower]) return ITUNES_GENRE_MAP[lower];
  // Try partial matching
  for (const [key, genre] of Object.entries(ITUNES_GENRE_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return genre;
  }
  return 'unknown';
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchSongs(query: string): Promise<iTunesTrack[]> {
  if (!query.trim()) return [];

  const encoded = encodeURIComponent(query.trim());
  const url = `https://itunes.apple.com/search?term=${encoded}&media=music&entity=song&limit=5`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`iTunes API error: ${res.status}`);
    const data: iTunesSearchResponse = await res.json();
    return data.results.filter(r => r.previewUrl); // Only tracks with previews
  } catch (err) {
    console.warn('[iTunes] Search failed:', err);
    return [];
  }
}

// ─── Audio Preview Fetch ─────────────────────────────────────────────────────

async function fetchPreviewAsFile(previewUrl: string, trackName: string): Promise<File | null> {
  try {
    const res = await fetch(previewUrl);
    if (!res.ok) throw new Error(`Preview fetch failed: ${res.status}`);
    const blob = await res.blob();
    // Convert to File object for audioAnalyzer compatibility
    return new File([blob], `${trackName}.m4a`, { type: 'audio/mp4' });
  } catch (err) {
    console.warn('[iTunes] Preview fetch failed:', err);
    return null;
  }
}

// ─── Full Analysis from iTunes Track ─────────────────────────────────────────

export async function analyzeFromiTunes(track: iTunesTrack): Promise<SongProfile> {
  const genre = mapGenre(track.primaryGenreName);

  // Base profile from metadata
  const baseProfile: SongProfile = {
    title: `${track.trackName} — ${track.artistName}`,
    genre,
    energy: 0.5,
    mood: 'uplifting',
    bpmEstimate: 120,
    bassEmphasis: 0.5,
    vocalPresence: 0.5,
    trebleEnergy: 0.5,
    rhythmIntensity: 0.5,
    albumArt: track.artworkUrl100.replace('100x100', '300x300'),
    source: 'itunes',
  };

  // Try to fetch and analyze the preview audio
  if (track.previewUrl) {
    const audioFile = await fetchPreviewAsFile(track.previewUrl, track.trackName);
    if (audioFile) {
      const audioFeatures = await analyzeAudioFile(audioFile);
      if (audioFeatures) {
        console.log('[iTunes] Real audio analysis complete:', audioFeatures);
        const merged = mergeAudioFeatures(baseProfile, audioFeatures);
        return {
          ...merged,
          albumArt: baseProfile.albumArt,
          source: 'itunes',
        };
      }
    }
  }

  console.log('[iTunes] Using genre-based fallback for:', track.trackName);
  return baseProfile;
}

// ─── High-res artwork helper ─────────────────────────────────────────────────

export function getHighResArtwork(url: string, size: number = 300): string {
  return url.replace('100x100', `${size}x${size}`);
}
