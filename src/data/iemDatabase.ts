import type { IEMProfile } from '../types';
import { matchBrand, buildBrandFallback, inferDriverType } from './brandProfiles';

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
  // ═══ 7Hz ══════════════════════════════════════════════════════════════════
  {
    id: '7hz-salnotes-zero', model: 'Salnotes Zero', brand: '7Hz',
    tuningSignature: 'Harman Target', tonalNotes: ['Neutral tuning', 'Clean mids', 'Budget reference'],
    bassLevel: 0.45, midLevel: 0.52, trebleLevel: 0.48, confidence: 1,
  },
  {
    id: '7hz-timeless', model: 'Timeless', brand: '7Hz',
    tuningSignature: 'Harman Target', tonalNotes: ['Planar driver', 'Extended bass', 'Airy treble'],
    bassLevel: 0.50, midLevel: 0.48, trebleLevel: 0.55, confidence: 1,
  },
  {
    id: '7hz-dioko', model: 'Dioko', brand: '7Hz',
    tuningSignature: 'Bright', tonalNotes: ['Planar detail', 'Lean bass', 'Bright treble'],
    bassLevel: 0.38, midLevel: 0.50, trebleLevel: 0.62, confidence: 1,
  },
  {
    id: '7hz-zero2', model: 'Salnotes Zero 2', brand: '7Hz',
    tuningSignature: 'Harman Target', tonalNotes: ['Improved bass', 'Natural mids', 'Smooth treble'],
    bassLevel: 0.48, midLevel: 0.50, trebleLevel: 0.48, confidence: 1,
  },
  // ═══ Tangzu ════════════════════════════════════════════════════════════════
  {
    id: 'tangzu-waner', model: "Wan'er", brand: 'Tangzu',
    tuningSignature: 'Harman Target', tonalNotes: ['Balanced tuning', 'Clean mids', 'Budget king'],
    bassLevel: 0.48, midLevel: 0.50, trebleLevel: 0.48, confidence: 1,
  },
  {
    id: 'tangzu-zetian-wu', model: 'Zetian Wu', brand: 'Tangzu',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Warm bass', 'Lush mids', 'Smooth highs'],
    bassLevel: 0.55, midLevel: 0.52, trebleLevel: 0.42, confidence: 1,
  },
  {
    id: 'tangzu-fudu', model: 'Fudu', brand: 'Tangzu',
    tuningSignature: 'Harman Target', tonalNotes: ['Balanced', 'Open sound', 'Good detail'],
    bassLevel: 0.48, midLevel: 0.50, trebleLevel: 0.50, confidence: 1,
  },
  // ═══ Dunu ══════════════════════════════════════════════════════════════════
  {
    id: 'dunu-sa6', model: 'SA6', brand: 'Dunu',
    tuningSignature: 'Balanced V', tonalNotes: ['Multi-BA', 'Extended bass', 'Detailed highs'],
    bassLevel: 0.52, midLevel: 0.48, trebleLevel: 0.58, confidence: 1,
  },
  {
    id: 'dunu-titan-s', model: 'Titan S', brand: 'Dunu',
    tuningSignature: 'Harman Target', tonalNotes: ['Dynamic driver', 'Clean sound', 'Good bass'],
    bassLevel: 0.50, midLevel: 0.50, trebleLevel: 0.50, confidence: 1,
  },
  {
    id: 'dunu-falcon-pro', model: 'Falcon Pro', brand: 'Dunu',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Dynamic driver', 'Warm bass', 'Sweet mids'],
    bassLevel: 0.55, midLevel: 0.52, trebleLevel: 0.45, confidence: 1,
  },
  {
    id: 'dunu-vulkan', model: 'Vulkan', brand: 'Dunu',
    tuningSignature: 'Balanced V', tonalNotes: ['Tribrid', 'Extended range', 'Technical'],
    bassLevel: 0.55, midLevel: 0.48, trebleLevel: 0.60, confidence: 1,
  },
  // ═══ FiiO ══════════════════════════════════════════════════════════════════
  {
    id: 'fiio-fh3', model: 'FH3', brand: 'FiiO',
    tuningSignature: 'Balanced V', tonalNotes: ['Hybrid', 'Punchy bass', 'Clear treble'],
    bassLevel: 0.58, midLevel: 0.45, trebleLevel: 0.58, confidence: 1,
  },
  {
    id: 'fiio-fd5', model: 'FD5', brand: 'FiiO',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Beryllium DD', 'Rich bass', 'Smooth sound'],
    bassLevel: 0.60, midLevel: 0.50, trebleLevel: 0.48, confidence: 1,
  },
  {
    id: 'fiio-fh7', model: 'FH7', brand: 'FiiO',
    tuningSignature: 'Balanced V', tonalNotes: ['Hybrid', 'Extended bass', 'Detailed treble'],
    bassLevel: 0.55, midLevel: 0.48, trebleLevel: 0.62, confidence: 1,
  },
  {
    id: 'fiio-jd7', model: 'JD7', brand: 'FiiO',
    tuningSignature: 'Harman Target', tonalNotes: ['Dynamic driver', 'Balanced', 'Good value'],
    bassLevel: 0.50, midLevel: 0.50, trebleLevel: 0.48, confidence: 1,
  },
  // ═══ Tanchjim ══════════════════════════════════════════════════════════════
  {
    id: 'tanchjim-ola', model: 'Ola', brand: 'Tanchjim',
    tuningSignature: 'Harman Target', tonalNotes: ['Clean sound', 'Neutral mids', 'Airy'],
    bassLevel: 0.45, midLevel: 0.52, trebleLevel: 0.50, confidence: 1,
  },
  {
    id: 'tanchjim-oxygen', model: 'Oxygen', brand: 'Tanchjim',
    tuningSignature: 'Bright', tonalNotes: ['Detailed', 'Forward treble', 'Lean bass'],
    bassLevel: 0.42, midLevel: 0.50, trebleLevel: 0.62, confidence: 1,
  },
  {
    id: 'tanchjim-hana', model: 'Hana', brand: 'Tanchjim',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Musical', 'Warm bass', 'Sweet mids'],
    bassLevel: 0.55, midLevel: 0.54, trebleLevel: 0.44, confidence: 1,
  },
  // ═══ Ikko ══════════════════════════════════════════════════════════════════
  {
    id: 'ikko-oh10', model: 'OH10', brand: 'Ikko',
    tuningSignature: 'Bass Boosted', tonalNotes: ['Hybrid', 'Deep bass', 'Warm mids'],
    bassLevel: 0.68, midLevel: 0.48, trebleLevel: 0.45, confidence: 1,
  },
  {
    id: 'ikko-oh1s', model: 'OH1S', brand: 'Ikko',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Musical', 'Warm bass', 'Smooth'],
    bassLevel: 0.58, midLevel: 0.52, trebleLevel: 0.42, confidence: 1,
  },
  // ═══ Tripowin ══════════════════════════════════════════════════════════════
  {
    id: 'tripowin-tc01', model: 'TC-01', brand: 'Tripowin',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Dynamic driver', 'Warm bass', 'Smooth'],
    bassLevel: 0.58, midLevel: 0.50, trebleLevel: 0.42, confidence: 1,
  },
  {
    id: 'tripowin-olina', model: 'Olina', brand: 'Tripowin',
    tuningSignature: 'Harman Target', tonalNotes: ['Clean tuning', 'Good detail', 'Balanced'],
    bassLevel: 0.48, midLevel: 0.50, trebleLevel: 0.50, confidence: 1,
  },
  {
    id: 'tripowin-mele', model: 'Mele', brand: 'Tripowin',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Warm punchy', 'Thick mids', 'Smooth highs'],
    bassLevel: 0.60, midLevel: 0.52, trebleLevel: 0.38, confidence: 1,
  },
  {
    id: 'tripowin-lea', model: 'Lea', brand: 'Tripowin',
    tuningSignature: 'Harman Target', tonalNotes: ['Balanced', 'Budget-friendly', 'Clean'],
    bassLevel: 0.48, midLevel: 0.50, trebleLevel: 0.48, confidence: 1,
  },
  // ═══ Kiwi Ears ═════════════════════════════════════════════════════════════
  {
    id: 'kiwi-cadenza', model: 'Cadenza', brand: 'Kiwi Ears',
    tuningSignature: 'Harman Target', tonalNotes: ['Single DD', 'Clean tuning', 'Good value'],
    bassLevel: 0.48, midLevel: 0.52, trebleLevel: 0.48, confidence: 1,
  },
  {
    id: 'kiwi-quintet', model: 'Quintet', brand: 'Kiwi Ears',
    tuningSignature: 'Balanced V', tonalNotes: ['Multi-BA', 'Detailed', 'Extended range'],
    bassLevel: 0.52, midLevel: 0.48, trebleLevel: 0.58, confidence: 1,
  },
  // ═══ Moondrop Extended ═════════════════════════════════════════════════════
  {
    id: 'moondrop-chu', model: 'Chu', brand: 'Moondrop',
    tuningSignature: 'Harman Target', tonalNotes: ['Budget reference', 'Clean mids', 'Smooth'],
    bassLevel: 0.44, midLevel: 0.52, trebleLevel: 0.46, confidence: 1,
  },
  {
    id: 'moondrop-variations', model: 'Variations', brand: 'Moondrop',
    tuningSignature: 'Balanced V', tonalNotes: ['Tribrid', 'Extended bass', 'Detailed treble'],
    bassLevel: 0.55, midLevel: 0.46, trebleLevel: 0.58, confidence: 1,
  },
  {
    id: 'moondrop-s8', model: 'S8', brand: 'Moondrop',
    tuningSignature: 'Harman Target', tonalNotes: ['8-BA', 'Reference', 'Technically capable'],
    bassLevel: 0.45, midLevel: 0.52, trebleLevel: 0.52, confidence: 1,
  },
  {
    id: 'moondrop-dawn', model: 'Dawn', brand: 'Moondrop',
    tuningSignature: 'Harman Target', tonalNotes: ['Built-in DAC', 'Clean sound', 'Portable'],
    bassLevel: 0.46, midLevel: 0.50, trebleLevel: 0.48, confidence: 1,
  },
  {
    id: 'moondrop-kanas-pro', model: 'Kanas Pro', brand: 'Moondrop',
    tuningSignature: 'Harman Target', tonalNotes: ['Natural timbre', 'Smooth mids', 'Refined'],
    bassLevel: 0.48, midLevel: 0.50, trebleLevel: 0.46, confidence: 1,
  },
  // ═══ Hidizs ════════════════════════════════════════════════════════════════
  {
    id: 'hidizs-ms3', model: 'MS3', brand: 'Hidizs',
    tuningSignature: 'Harman Target', tonalNotes: ['Hybrid', 'Balanced', 'Good detail'],
    bassLevel: 0.50, midLevel: 0.50, trebleLevel: 0.52, confidence: 1,
  },
  {
    id: 'hidizs-mm2', model: 'MM2', brand: 'Hidizs',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Micro planar', 'Warm bass', 'Smooth'],
    bassLevel: 0.55, midLevel: 0.50, trebleLevel: 0.45, confidence: 1,
  },
  // ═══ TFZ ═══════════════════════════════════════════════════════════════════
  {
    id: 'tfz-king-edition', model: 'King Edition', brand: 'TFZ',
    tuningSignature: 'Bass Boosted', tonalNotes: ['Heavy bass', 'Warm mids', 'Consumer tuning'],
    bassLevel: 0.70, midLevel: 0.42, trebleLevel: 0.48, confidence: 1,
  },
  {
    id: 'tfz-no3', model: 'No.3', brand: 'TFZ',
    tuningSignature: 'Balanced V', tonalNotes: ['Dynamic DD', 'Extended bass', 'Bright treble'],
    bassLevel: 0.60, midLevel: 0.44, trebleLevel: 0.58, confidence: 1,
  },
  // ═══ Yanyin ════════════════════════════════════════════════════════════════
  {
    id: 'yanyin-canon', model: 'Canon', brand: 'Yanyin',
    tuningSignature: 'Balanced V', tonalNotes: ['Tuning switches', 'Versatile', 'Good dynamics'],
    bassLevel: 0.55, midLevel: 0.48, trebleLevel: 0.55, confidence: 1,
  },
  {
    id: 'yanyin-moonlight', model: 'Moon Light', brand: 'Yanyin',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Warm tuning', 'Musical mids', 'Gentle highs'],
    bassLevel: 0.58, midLevel: 0.52, trebleLevel: 0.40, confidence: 1,
  },
  // ═══ CCA ═══════════════════════════════════════════════════════════════════
  {
    id: 'cca-cra', model: 'CRA', brand: 'CCA',
    tuningSignature: 'V-Shape', tonalNotes: ['Budget V-shaped', 'Big bass', 'Bright treble'],
    bassLevel: 0.70, midLevel: 0.32, trebleLevel: 0.65, confidence: 1,
  },
  {
    id: 'cca-cra-plus', model: 'CRA+', brand: 'CCA',
    tuningSignature: 'V-Shape', tonalNotes: ['Enhanced V-shape', 'Punchy bass', 'Sparkly highs'],
    bassLevel: 0.72, midLevel: 0.35, trebleLevel: 0.68, confidence: 1,
  },
  // ═══ QKZ ═══════════════════════════════════════════════════════════════════
  {
    id: 'qkz-hbb', model: 'HBB', brand: 'QKZ',
    tuningSignature: 'Harman Target', tonalNotes: ['Tuned by HBB', 'Balanced', 'Clean'],
    bassLevel: 0.48, midLevel: 0.50, trebleLevel: 0.48, confidence: 1,
  },
  // ═══ KZ Extended ═══════════════════════════════════════════════════════════
  {
    id: 'kz-edx', model: 'EDX', brand: 'KZ',
    tuningSignature: 'V-Shape', tonalNotes: ['Budget', 'Bass boost', 'Bright'],
    bassLevel: 0.68, midLevel: 0.35, trebleLevel: 0.62, confidence: 1,
  },
  {
    id: 'kz-edx-pro', model: 'EDX Pro', brand: 'KZ',
    tuningSignature: 'V-Shape', tonalNotes: ['Budget V-shape', 'Enhanced bass', 'Clear highs'],
    bassLevel: 0.70, midLevel: 0.33, trebleLevel: 0.65, confidence: 1,
  },
  {
    id: 'kz-zas', model: 'ZAS', brand: 'KZ',
    tuningSignature: 'V-Shape', tonalNotes: ['Multi-driver', 'Deep bass', 'Extended treble'],
    bassLevel: 0.75, midLevel: 0.30, trebleLevel: 0.72, confidence: 1,
  },
  {
    id: 'kz-ast', model: 'AST', brand: 'KZ',
    tuningSignature: 'Balanced V', tonalNotes: ['12-BA', 'Detailed', 'Slightly bright'],
    bassLevel: 0.55, midLevel: 0.42, trebleLevel: 0.65, confidence: 1,
  },
  {
    id: 'kz-zex', model: 'ZEX', brand: 'KZ',
    tuningSignature: 'V-Shape', tonalNotes: ['Hybrid', 'Fun tuning', 'Punchy bass'],
    bassLevel: 0.72, midLevel: 0.30, trebleLevel: 0.68, confidence: 1,
  },
  {
    id: 'kz-pr1', model: 'PR1', brand: 'KZ',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Planar', 'Warm sound', 'Good resolution'],
    bassLevel: 0.55, midLevel: 0.50, trebleLevel: 0.50, confidence: 1,
  },
  // ═══ Truthear Extended ═════════════════════════════════════════════════════
  {
    id: 'truthear-hexa', model: 'Hexa', brand: 'Truthear',
    tuningSignature: 'Harman Target', tonalNotes: ['Quad driver', 'Reference tuning', 'Clean'],
    bassLevel: 0.46, midLevel: 0.52, trebleLevel: 0.50, confidence: 1,
  },
  {
    id: 'truthear-nova', model: 'Nova', brand: 'Truthear',
    tuningSignature: 'Balanced V', tonalNotes: ['Hybrid', 'Extended bass', 'Airy treble'],
    bassLevel: 0.52, midLevel: 0.48, trebleLevel: 0.55, confidence: 1,
  },
  // ═══ Hifiman ═══════════════════════════════════════════════════════════════
  {
    id: 'hifiman-re600s', model: 'RE600S', brand: 'Hifiman',
    tuningSignature: 'Warm Neutral', tonalNotes: ['Topology driver', 'Warm', 'Musical'],
    bassLevel: 0.52, midLevel: 0.55, trebleLevel: 0.45, confidence: 1,
  },
  // ═══ Westone ═══════════════════════════════════════════════════════════════
  {
    id: 'westone-w40', model: 'W40', brand: 'Westone',
    tuningSignature: 'Mid-Forward', tonalNotes: ['4-BA', 'Musical mids', 'Smooth sound'],
    bassLevel: 0.45, midLevel: 0.62, trebleLevel: 0.45, confidence: 1,
  },
  // ═══ Noble Audio ═══════════════════════════════════════════════════════════
  {
    id: 'noble-falcon-pro', model: 'Falcon Pro', brand: 'Noble Audio',
    tuningSignature: 'Warm Neutral', tonalNotes: ['TWS', 'Warm rich', 'Musical'],
    bassLevel: 0.55, midLevel: 0.55, trebleLevel: 0.45, confidence: 1,
  },
  // ═══ Generic fallback ═════════════════════════════════════════════════════
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

  // If confidence is low, try brand-based fallback
  if (confidence < 0.5) {
    const brandProfile = matchBrand(query);
    if (brandProfile) {
      console.log(`[IEM] Brand fallback: ${brandProfile.brand} (model not in DB)`);
      return buildBrandFallback(query, brandProfile);
    }

    // Try driver-type inference as last resort before generic
    const driverType = inferDriverType(query);
    if (driverType) {
      console.log(`[IEM] Driver-type inference: ${driverType.signature}`);
      const generic = { ...IEM_DATABASE[IEM_DATABASE.length - 1] };
      generic.bassLevel += driverType.bassAdjust;
      generic.midLevel += driverType.midAdjust;
      generic.trebleLevel += driverType.trebleAdjust;
      generic.tuningSignature = driverType.signature;
      generic.confidence = 0.4;
      generic.tonalNotes = ['Driver-type inferred tuning'];
      generic.model = query;
      return generic;
    }
  }

  return { ...bestMatch, confidence };
}
