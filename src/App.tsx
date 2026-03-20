import React, { useState, useCallback, useEffect } from 'react';
import type { AnalysisInput, AnalysisResult, VibeModeType, Preset, EQFeedbackRating, IEMProfile, EQRecommendation } from './types';
import { analyzeSongWithAudio } from './engine/songAnalysis';
import { analyzeFromiTunes } from './services/iTunesService';
import { hybridRecommendEQ, submitFeedback, initializeMLModel } from './engine/mlRecommender';
import { loadUserIEM, saveUserIEM, hasUserIEM } from './utils/storage';
import { applySystemEQ, initializeSystemEQ } from './services/systemEQPlugin';
import { HomeScreen } from './screens/HomeScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PresetsScreen } from './screens/PresetsScreen';
import { IEMSetupScreen } from './screens/IEMSetupScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { LiveEQScreen } from './screens/LiveEQScreen';

type Screen = 'home' | 'results' | 'presets' | 'iem-setup' | 'insights' | 'live-eq';

function useVibe(result: AnalysisResult | null): VibeModeType {
  if (!result) return 'peaceful';
  return result.songProfile.energy > 0.55 ? 'energetic' : 'peaceful';
}

const NAV_ITEMS: { key: Screen; label: string; icon: string }[] = [
  { key: 'home', label: 'Analyze', icon: '🎵' },
  { key: 'live-eq', label: 'Live EQ', icon: '🎧' },
  { key: 'presets', label: 'Presets', icon: '📂' },
  { key: 'insights', label: 'Insights', icon: '🧠' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => hasUserIEM() ? 'home' : 'iem-setup');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lastInput, setLastInput] = useState<AnalysisInput | null>(null);
  const [userIEM, setUserIEM] = useState<IEMProfile | null>(() => loadUserIEM());
  const [lastEQRecommendation, setLastEQRecommendation] = useState<EQRecommendation | null>(null);

  const vibeMode = useVibe(analysisResult);

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

    let songProfile;
    if (input.iTunesTrack) {
      songProfile = await analyzeFromiTunes(input.iTunesTrack);
    } else {
      songProfile = await analyzeSongWithAudio(input.songTitle, input.audioFile);
    }

    const iemProfile = userIEM;
    const eqRecommendation = hybridRecommendEQ(songProfile, iemProfile, input.preference);

    setAnalysisResult({
      songProfile,
      iemProfile,
      eqRecommendation,
      mlConfidence: eqRecommendation.mlConfidence,
      mlEnhanced: eqRecommendation.mlEnhanced,
    });
    setLastEQRecommendation(eqRecommendation);
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

  const handleApplySystemEQ = useCallback(async () => {
    if (!analysisResult) return;
    try {
      await initializeSystemEQ();
      await applySystemEQ(analysisResult.eqRecommendation.gains);
      console.log('[App] Applied EQ to system audio');
    } catch (err) {
      console.error('[App] Failed to apply system EQ:', err);
    }
  }, [analysisResult]);

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
    setLastEQRecommendation(preset.eqRecommendation);
    setScreen('results');
  }

  function handleBack() {
    setScreen('home');
    setAnalysisResult(null);
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#141312]">
      {/* Ambient amber glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-amber-900/[0.04] blur-[100px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative max-w-md mx-auto px-4 pt-safe-top pb-safe-bottom">
        {/* Navigation tabs */}
        {screen !== 'results' && screen !== 'iem-setup' && (
          <div className="sticky top-0 z-10 pt-4 pb-2 backdrop-blur-xl bg-[#141312]/80">
            <div className="flex gap-1 bg-[#1c1917] rounded-2xl p-1 border border-amber-900/10">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => setScreen(item.key)}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 tracking-wide ${
                    screen === item.key
                      ? 'bg-amber-900/25 text-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.15)]'
                      : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
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
              onApplySystemEQ={handleApplySystemEQ}
            />
          )}
          {screen === 'live-eq' && (
            <LiveEQScreen
              lastAppliedEQ={lastEQRecommendation}
              songTitle={lastInput?.songTitle}
              iemModel={lastInput?.iemModel}
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
