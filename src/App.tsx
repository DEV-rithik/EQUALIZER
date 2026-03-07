import React, { useState, useCallback } from 'react';
import type { AnalysisInput, AnalysisResult, VibeModeType, Preset } from './types';
import { analyzeSong } from './engine/songAnalysis';
import { matchIEM } from './data/iemDatabase';
import { recommendEQ } from './engine/eqEngine';
import { HomeScreen } from './screens/HomeScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PresetsScreen } from './screens/PresetsScreen';

type Screen = 'home' | 'results' | 'presets';

function useVibe(result: AnalysisResult | null): VibeModeType {
  if (!result) return 'peaceful';
  return result.songProfile.energy > 0.55 ? 'energetic' : 'peaceful';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lastInput, setLastInput] = useState<AnalysisInput | null>(null);

  const vibeMode = useVibe(analysisResult);

  const handleAnalyze = useCallback(async (input: AnalysisInput) => {
    setIsAnalyzing(true);
    setLastInput(input);

    // Simulate slight async delay for UX effect
    await new Promise(r => setTimeout(r, 800));

    const songProfile = analyzeSong(input.songTitle);
    const iemProfile = matchIEM(input.iemModel);
    const eqRecommendation = recommendEQ(songProfile, iemProfile, input.preference);

    setAnalysisResult({ songProfile, iemProfile, eqRecommendation });
    setIsAnalyzing(false);
    setScreen('results');
  }, []);

  function handleLoadPreset(preset: Preset) {
    setAnalysisResult({
      songProfile: preset.songProfile,
      iemProfile: preset.iemProfile,
      eqRecommendation: preset.eqRecommendation,
    });
    setLastInput({
      songTitle: preset.songTitle,
      iemModel: preset.iemModel,
      preference: preset.preference,
    });
    setScreen('results');
  }

  function handleBack() {
    setScreen('home');
    setAnalysisResult(null);
  }

  const bgClass = vibeMode === 'energetic'
    ? 'bg-gradient-to-br from-[#1a0f06] via-[#1f1008] to-[#0f0e17]'
    : 'bg-gradient-to-br from-[#0f0e17] via-[#1a1828] to-[#0d0c1a]';

  return (
    <div className={`min-h-screen min-h-dvh transition-colors duration-1000 ${bgClass}`}>
      {/* Ambient glow */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${vibeMode === 'energetic' ? 'opacity-100' : 'opacity-40'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: vibeMode === 'energetic' ? 'radial-gradient(circle, #f97316, transparent)' : 'radial-gradient(circle, #d4832a, transparent)' }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-md mx-auto px-4 pt-safe-top pb-safe-bottom">
        {/* Navigation tabs */}
        {screen !== 'results' && (
          <div className="sticky top-0 z-10 pt-4 pb-2 backdrop-blur-md">
            <div className="flex gap-1 bg-white/5 rounded-2xl p-1 border border-white/8">
              <button
                onClick={() => setScreen('home')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  screen === 'home'
                    ? 'bg-warm-500/30 text-warm-200 shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                🎵 Analyze
              </button>
              <button
                onClick={() => setScreen('presets')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  screen === 'presets'
                    ? 'bg-warm-500/30 text-warm-200 shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                📂 Presets
              </button>
            </div>
          </div>
        )}

        {/* Screens */}
        <div className="py-4">
          {screen === 'home' && (
            <HomeScreen onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          )}
          {screen === 'results' && analysisResult && (
            <ResultsScreen
              result={analysisResult}
              songTitle={lastInput?.songTitle ?? ''}
              iemModel={lastInput?.iemModel ?? ''}
              preference={lastInput?.preference ?? 'balanced'}
              vibeMode={vibeMode}
              onBack={handleBack}
            />
          )}
          {screen === 'presets' && (
            <PresetsScreen onLoad={handleLoadPreset} />
          )}
        </div>
      </div>
    </div>
  );
}
