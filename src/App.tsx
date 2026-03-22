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
import { CustomEQScreen } from './screens/CustomEQScreen';

type Screen = 'home' | 'results' | 'presets' | 'iem-setup' | 'insights' | 'live-eq' | 'custom-eq';

function useVibe(result: AnalysisResult | null): VibeModeType {
  if (!result) return 'peaceful';
  return result.songProfile.energy > 0.55 ? 'energetic' : 'peaceful';
}

// Bottom nav items: Home (Analyse), Presets, Insights — no more Live EQ in nav
const NAV_ITEMS: { key: Screen; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'presets', label: 'Library', icon: 'library_music' },
  { key: 'insights', label: 'Insights', icon: 'analytics' },
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
      // Redirect to Live EQ page after applying
      setScreen('live-eq');
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

  const isFullScreen = screen === 'results' || screen === 'iem-setup' || screen === 'live-eq' || screen === 'custom-eq';

  return (
    <div className="min-h-screen min-h-dvh bg-background text-on-background font-body antialiased">
      {/* Top App Bar */}
      {!isFullScreen && (
        <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
            </div>
            <h1 className="font-headline font-bold tracking-tight text-zinc-900 text-xl">Equalizer</h1>
          </div>
          <button
            onClick={() => setScreen('iem-setup')}
            className="hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-rose-600 text-2xl">settings</span>
          </button>
        </header>
      )}

      {/* Content */}
      <main className={isFullScreen ? '' : 'pt-24 pb-32 px-6 max-w-2xl mx-auto'}>
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
            onOpenEqualizer={() => setScreen('custom-eq')}
            onOpenPresets={() => setScreen('presets')}
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
            onApplySystemEQ={handleApplySystemEQ}
          />
        )}
        {screen === 'live-eq' && (
          <LiveEQScreen
            lastAppliedEQ={lastEQRecommendation}
            songTitle={lastInput?.songTitle}
            iemModel={lastInput?.iemModel}
            onBack={() => setScreen('home')}
            onFeedback={handleFeedback}
          />
        )}
        {screen === 'custom-eq' && (
          <CustomEQScreen
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'presets' && (
          <PresetsScreen onLoad={handleLoadPreset} />
        )}
        {screen === 'insights' && (
          <InsightsScreen />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {!isFullScreen && (
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pt-3 pb-6 px-4 glass-header border-t border-zinc-100/50 z-50">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setScreen(item.key)}
              className={`flex flex-col items-center justify-center active:scale-90 transition-transform ${
                screen === item.key
                  ? 'text-rose-600'
                  : 'text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={screen === item.key ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >{item.icon}</span>
              <span className="text-[10px] font-medium tracking-wide mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
