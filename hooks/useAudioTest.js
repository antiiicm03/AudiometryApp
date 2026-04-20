import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AudioTone, { AudiometryHelper, PulsePresets } from '../components/AudioTone';

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];

export default function useAudioTest() {
  const [testStarted, setTestStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentFrequencyIndex, setCurrentFrequencyIndex] = useState(0);
  const [currentIntensity, setCurrentIntensity] = useState(40);
  const [selectedEar, setSelectedEar] = useState('left');
  const [playbackMode, setPlaybackMode] = useState('continuous');
  const [pulseTiming, setPulseTiming] = useState(PulsePresets.STANDARD);

  const [testResults, setTestResults] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    initAudio();
    return () => {
      AudioTone.stopTone().catch(console.error);
    };
  }, []);

  const initAudio = async () => {
    try {
      await AudioTone.initialize();
      setIsInitialized(true);
    } catch (err) {
      setError('Failed to initialize audio');
      console.error('Init error:', err);
    }
  };

  const startTest = () => {
    if (!isInitialized) {
      Alert.alert('Audio nije spreman', 'Molimo sačekajte da se audio sistem inicijalizuje.', [{ text: 'U redu' }]);
      return;
    }
    Alert.alert(
      '🎧 Instrukcije za test',
      'MANUELNI AUDIOMETRIJSKI TEST:\n\n' +
        '📍 Birajte frekvenciju (←/→)\n' +
        '📍 Podešavajte intenzitet (+/- ili slider)\n' +
        '📍 Birajte uvo (levo/desno/oba)\n' +
        '📍 Birajte mod (continuous/pulsed)\n' +
        '📍 Kliknite REPRODUKUJ za ton\n\n' +
        '⚠️ VAŽNO: Koristite stereo slušalice!\n\n' +
        'CONTINUOUS: Ton svira dok ga ne zaustavite\n' +
        'PULSED: Ton svira 3 beep-a i prestaje',
      [{ text: 'Otkaži', style: 'cancel' }, { text: 'Započni', onPress: beginTest }]
    );
  };

  const beginTest = () => {
    setTestStarted(true);
    setCurrentFrequencyIndex(0);
    setCurrentIntensity(40);
    setSelectedEar('left');
    setPlaybackMode('continuous');
  };

  const handlePlayTone = async () => {
    if (isPlaying) {
      await AudioTone.stopTone();
      setIsPlaying(false);
      return;
    }
    try {
      if (playbackMode === 'pulsed') {
        await AudioTone.configurePulseTiming(pulseTiming.onDurationMs, pulseTiming.offDurationMs, pulseTiming.cycles);
      }
      await AudioTone.playTone(FREQUENCIES[currentFrequencyIndex], currentIntensity, selectedEar, playbackMode);
      setIsPlaying(true);
      setError(null);

      if (playbackMode === 'pulsed') {
        const duration = AudiometryHelper.calculatePulseDuration(pulseTiming);
        setTimeout(() => setIsPlaying(false), duration + 100);
      }
    } catch (err) {
      setError(err.message || 'Failed to play tone');
      console.error('Play error:', err);
    }
  };

  const restartToneIfPlaying = async (freq, intensity, ear, mode) => {
    if (isPlaying && mode === 'continuous') {
      await AudioTone.stopTone();
      setTimeout(async () => {
        await AudioTone.playTone(freq, intensity, ear, mode);
      }, 100);
    }
  };

  const increaseIntensity = async () => {
    const newVal = Math.min(currentIntensity + 5, 100);
    setCurrentIntensity(newVal);
    await restartToneIfPlaying(FREQUENCIES[currentFrequencyIndex], newVal, selectedEar, playbackMode);
  };

  const decreaseIntensity = async () => {
    const newVal = Math.max(currentIntensity - 5, 0);
    setCurrentIntensity(newVal);
    await restartToneIfPlaying(FREQUENCIES[currentFrequencyIndex], newVal, selectedEar, playbackMode);
  };

  const handleSliderChange = async (value) => {
    const rounded = Math.round(value / 5) * 5;
    setCurrentIntensity(rounded);
    await restartToneIfPlaying(FREQUENCIES[currentFrequencyIndex], rounded, selectedEar, playbackMode);
  };

  const handleEarChange = async (ear) => {
    setSelectedEar(ear);
    await restartToneIfPlaying(FREQUENCIES[currentFrequencyIndex], currentIntensity, ear, playbackMode);
  };

  const handleModeChange = async (mode) => {
    setPlaybackMode(mode);
    await AudioTone.setPlaybackMode(mode);
    if (isPlaying) {
      await AudioTone.stopTone();
      setIsPlaying(false);
    }
  };

  const changePulsePreset = async (preset) => {
    setPulseTiming(preset);
    await AudioTone.configurePulseTiming(preset.onDurationMs, preset.offDurationMs, preset.cycles);
  };

  const nextFrequency = async () => {
    if (currentFrequencyIndex >= FREQUENCIES.length - 1) return;
    const wasPlaying = isPlaying;
    if (wasPlaying) await AudioTone.stopTone();
    setCurrentFrequencyIndex((prev) => prev + 1);
    setIsPlaying(false);
    if (wasPlaying && playbackMode === 'continuous') {
      setTimeout(async () => await handlePlayTone(), 300);
    }
  };

  const prevFrequency = async () => {
    if (currentFrequencyIndex <= 0) return;
    const wasPlaying = isPlaying;
    if (wasPlaying) await AudioTone.stopTone();
    setCurrentFrequencyIndex((prev) => prev - 1);
    setIsPlaying(false);
    if (wasPlaying && playbackMode === 'continuous') {
      setTimeout(async () => await handlePlayTone(), 300);
    }
  };

  const saveResult = () => {
    const resultKey = `${FREQUENCIES[currentFrequencyIndex]}Hz_${selectedEar}`;
    const earLabel = selectedEar === 'left' ? 'Levo' : selectedEar === 'right' ? 'Desno' : 'Oba';
    Alert.alert(
      'Sačuvaj rezultat',
      `Sačuvati ${currentIntensity} dB za ${FREQUENCIES[currentFrequencyIndex]} Hz (${earLabel} uvo)?`,
      [
        { text: 'Otkaži', style: 'cancel' },
        {
          text: 'Sačuvaj',
          onPress: () => {
            setTestResults((prev) => ({ ...prev, [resultKey]: currentIntensity }));
            Alert.alert('✓ Sačuvano', `${resultKey}: ${currentIntensity} dB`);
          },
        },
      ]
    );
  };

  const showAllResults = () => {
    if (Object.keys(testResults).length === 0) {
      Alert.alert('Nema rezultata', 'Još niste sačuvali nijedan rezultat.');
      return;
    }
    const section = (suffix, label) => {
      const lines = Object.entries(testResults)
        .filter(([key]) => key.endsWith(suffix))
        .map(([key, val]) => `${key}: ${val} dB`)
        .join('\n');
      return lines ? `${label}:\n${lines}\n\n` : '';
    };
    const text =
      section('_left', '◀ LEVO UVO') +
      section('_right', '▶ DESNO UVO') +
      section('_both', '◀▶ OBA UVA');
    Alert.alert('📊 Svi rezultati', text || 'Nema rezultata');
  };

  const handleBackPress = async (onBack) => {
    if (testStarted) {
      await AudioTone.stopTone();
      Alert.alert('Napusti test?', 'Da li želite da napustite test?', [
        { text: 'Ne', style: 'cancel' },
        { text: 'Da', onPress: () => { setTestStarted(false); setIsPlaying(false); onBack(); } },
      ]);
    } else {
      onBack();
    }
  };

  return {
    // State
    testStarted,
    isInitialized,
    isPlaying,
    currentFrequencyIndex,
    currentIntensity,
    selectedEar,
    playbackMode,
    pulseTiming,
    testResults,
    error,
    // Constants
    FREQUENCIES,
    // Actions
    startTest,
    handlePlayTone,
    increaseIntensity,
    decreaseIntensity,
    handleSliderChange,
    handleEarChange,
    handleModeChange,
    changePulsePreset,
    nextFrequency,
    prevFrequency,
    saveResult,
    showAllResults,
    handleBackPress,
  };
}