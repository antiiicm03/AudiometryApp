// hooks/useAudioTone.ts (Updated with Ear Support)
import { useCallback, useEffect, useRef, useState } from 'react';
import AudioTone, { AudiometryHelper, EarConstants, PlaybackModeConstants, type Ear, type PlaybackMode } from '../components/AudioTone';
interface UseAudioToneOptions {
  autoInitialize?: boolean;
  defaultDuration?: number;
  defaultEar?: Ear;
  defaultMode?: PlaybackMode;
}

export const useAudioTone = (options: UseAudioToneOptions = {}) => {
  const { 
    autoInitialize = true, 
    defaultDuration = 1000,
    defaultEar = EarConstants.BOTH,
    defaultMode = PlaybackModeConstants.CONTINUOUS
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [currentIntensity, setCurrentIntensity] = useState<number | null>(null);
  const [currentEar, setCurrentEar] = useState<Ear>(defaultEar);
  const [error, setError] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<PlaybackMode>(defaultMode);

  const toneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoInitialize) {
      initializeAudio();
    }

    return () => {
      if (toneTimeoutRef.current) {
        clearTimeout(toneTimeoutRef.current);
      }
      AudioTone.stopTone().catch(console.error);
    };
  }, [autoInitialize]);

  const initializeAudio = useCallback(async () => {
    try {
      await AudioTone.initialize();
      setIsInitialized(true);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize audio');
      console.error('Audio initialization error:', err);
      return false;
    }
  }, []);

  const playTone = useCallback(
    async (frequency: number, dbLevel: number, duration?: number, ear?: Ear) => {
      if (!isInitialized) {
        setError('Audio not initialized');
        return false;
      }

      if (!AudiometryHelper.isValidFrequency(frequency)) {
        setError(`Invalid frequency: ${frequency}Hz (must be 125-8000Hz)`);
        return false;
      }

      if (!AudiometryHelper.isValidIntensity(dbLevel)) {
        setError(`Invalid intensity: ${dbLevel}dB (must be 0-100dB)`);
        return false;
      }

      try {
        if (toneTimeoutRef.current) {
          clearTimeout(toneTimeoutRef.current);
        }

        const targetEar = ear || currentEar;
        await AudioTone.playTone(frequency, dbLevel, targetEar, currentMode);
        
        setIsPlaying(true);
        setCurrentFrequency(frequency);
        setCurrentIntensity(dbLevel);
        setCurrentEar(targetEar);
        setError(null);

        const toneDuration = duration || defaultDuration;
        if (toneDuration > 0) {
          toneTimeoutRef.current = setTimeout(() => {
            stopTone();
          }, toneDuration);
        }

        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to play tone');
        console.error('Playback error:', err);
        return false;
      }
    },
    [isInitialized, currentEar, defaultDuration]
  );

  const stopTone = useCallback(async () => {
    if (toneTimeoutRef.current) {
      clearTimeout(toneTimeoutRef.current);
      toneTimeoutRef.current = null;
    }

    try {
      await AudioTone.stopTone();
      setIsPlaying(false);
      setCurrentFrequency(null);
      setCurrentIntensity(null);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to stop tone');
      console.error('Stop error:', err);
      return false;
    }
  }, []);

  const switchEar = useCallback(
    async (newEar: Ear) => {
      if (!isPlaying) {
        // Ako se ne reprodukuje, samo promeni state
        setCurrentEar(newEar);
        return true;
      }

      try {
        await AudioTone.switchEar(newEar);
        setCurrentEar(newEar);
        setError(null);
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to switch ear');
        return false;
      }
    },
    [isPlaying]
  );

  const updateFrequency = useCallback(
    async (frequency: number) => {
      if (!isPlaying) {
        setError('No tone is currently playing');
        return false;
      }

      if (!AudiometryHelper.isValidFrequency(frequency)) {
        setError(`Invalid frequency: ${frequency}Hz`);
        return false;
      }

      try {
        await AudioTone.setFrequency(frequency);
        setCurrentFrequency(frequency);
        setError(null);
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to update frequency');
        return false;
      }
    },
    [isPlaying]
  );

  const updateIntensity = useCallback(
    async (dbLevel: number) => {
      if (!isPlaying) {
        setError('No tone is currently playing');
        return false;
      }

      if (!AudiometryHelper.isValidIntensity(dbLevel)) {
        setError(`Invalid intensity: ${dbLevel}dB`);
        return false;
      }

      try {
        await AudioTone.setIntensity(dbLevel);
        setCurrentIntensity(dbLevel);
        setError(null);
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to update intensity');
        return false;
      }
    },
    [isPlaying]
  );

  const switchMode = useCallback(async (newMode: PlaybackMode) => {
  try {
    await AudioTone.setPlaybackMode(newMode);
    setCurrentMode(newMode);
    setError(null);
    return true;
  } catch (err: any) {
    setError(err.message || 'Failed to switch playback mode');
    return false;
  }
}, []);

  return {
    // State
    isInitialized,
    isPlaying,
    currentFrequency,
    currentIntensity,
    currentEar,
    error,
    currentMode,

    // Actions
    initializeAudio,
    playTone,
    stopTone,
    switchEar,
    updateFrequency,
    updateIntensity,
    switchMode,

    // Helpers
    helpers: AudiometryHelper,
    ears: EarConstants,
    modes: PlaybackModeConstants,
  };
};