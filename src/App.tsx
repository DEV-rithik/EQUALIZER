import React, { useState, useCallback, useEffect } from 'react';
import type { AnalysisInput, AnalysisResult, VibeModeType, Preset, EQFeedbackRating, IEMProfile } from './types';
import { analyzeSongWithAudio } from './engine/songAnalysis';
import { analyzeFromiTunes } from './services/iTunesService';
import { hybridRecommendEQ, submitFeedback, initializeMLModel } from './engine/mlRecommender';
import { loadUserIEM, saveUserIEM, hasUserIEM } from './utils/storage';
import { HomeScreen } from './screens/HomeScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PresetsScreen } from './screens/PresetsScreen';
import { IEMSetupScreen } from './screens/IEMSetupScreen';
import { InsightsScreen } from './screens/InsightsScreen';

type Screen = 'home' | 'results' | 'presets' | 'iem-setup' | 'insights';

function useVibe(result: AnalysisResult | null): VibeModeType {
  if (!result) return 'peaceful';
  return result.songProfile.energy > 0.55 ? 'energetic' : 'peaceful';
}

export default function App() {
  // Show IEM setup on first launch, otherwise home
  const [screen, setScreen] = useState<Screen>(() => hasUserIEM() ? 'home' : 'iem-setup');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lastInput, setLastInput] = useState<AnalysisInput | null>(null);
  const [userIEM, setUserIEM] = useState<IEMProfile | null>(() => loadUserIEM());

  const vibeMode = useVibe(analysisResult);

  // Initialize ML model on mount
  useEffect(() => {
    initializeMLModel();
  }, []);

  function handleSaveIEM(profile: IEMProfile) {
    saveUserIEM(profile);
    setUserIEM(profile);
    setScreen('home');
  }

  const handleAnalyze = useCallback(async (input: AnalysisInput) => {
    if (!userIEM) {
      setScreen('iem-setup');
      return;
    }

    setIsAnalyzing(true);
    setLastInput(input);

    await new Promise(r => setTimeout(r, 400));

    // Use iTunes analysis if a track was selected, otherwise fall back to heuristic
    let songProfile;
    if (input.iTunesTrack) {
      songProfile = await analyzeFromiTunes(input.iTunesTrack);
    } else {
      songProfile = await analyzeSongWithAudio(input.songTitle, input.audioFile);
    }

    // Always use the saved user IEM profile
    const iemProfile = userIEM;
    const eqRecommendation = hybridRecommendEQ(songProfile, iemProfile, input.preference);

    setAnalysisResult({
      songProfile,
      iemProfile,
      eqRecommendation,
      mlConfidence: eqRecommendation.mlConfidence,
      mlEnhanced: eqRecommendation.mlEnhanced,
    });
    setIsAnalyzing(false);
    setScreen('results');
  }, [userIEM]);

  const handleFeedback = useCallback((rating: EQFeedbackRating) => {
    if (!analysisResult || !lastInput || !userIEM) return;
    submitFeedback(
      analysisResult.songProfile,
      analysisResult.iemProfile,
      lastInput.preference,
      analysisResult.eqRecommendation.gains,
      rating,
    );
  }, [analysisResult, lastInput, userIEM]);

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

  const mainTabs: Screen[] = ['home', 'presets', 'insights'];

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
        {screen !== 'results' && screen !== 'iem-setup' && (
          <div className="sticky top-0 z-10 pt-4 pb-2 backdrop-blur-md">
            <div className="flex gap-1 bg-white/5 rounded-2xl p-1 border border-white/8">
              <button
                onClick={() => setScreen('home')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${screen === 'home'
                  ? 'bg-warm-500/30 text-warm-200 shadow-sm'
                  : 'text-white/40 hover:text-white/60'
                  }`}
              >
                🎵 Analyze
              </button>
              <button
                onClick={() => setScreen('presets')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${screen === 'presets'
                  ? 'bg-warm-500/30 text-warm-200 shadow-sm'
                  : 'text-white/40 hover:text-white/60'
                  }`}
              >
                📂 Presets
              </button>
              <button
                onClick={() => setScreen('insights')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${screen === 'insights'
                  ? 'bg-purple-500/30 text-purple-200 shadow-sm'
                  : 'text-white/40 hover:text-white/60'
                  }`}
              >
                🧠 Insights
              </button>
            </div>
          </div>
        )}

        {/* Screens */}
        <div className="py-4">
          {screen === 'iem-setup' && (
            <IEMSetupScreen
              onSave={handleSaveIEM}
              existingProfile={userIEM}
            />
          )}
          {screen === 'home' && (
            <HomeScreen
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              userIEM={userIEM}
              onEditIEM={() => setScreen('iem-setup')}
            />
          )}
          {screen === 'results' && analysisResult && (
            <ResultsScreen
              result={analysisResult}
              songTitle={lastInput?.songTitle ?? ''}
              iemModel={lastInput?.iemModel ?? ''}
              preference={lastInput?.preference ?? 'balanced'}
              vibeMode={vibeMode}
              onBack={handleBack}
              onFeedback={handleFeedback}
            />
          )}
          {screen === 'presets' && (
            <PresetsScreen onLoad={handleLoadPreset} />
          )}
          {screen === 'insights' && (
            <InsightsScreen />
          )}
        </div>
      </div>
    </div>
  );
}
