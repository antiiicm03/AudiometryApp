import { NativeModules } from 'react-native';

const { AudioToneModule } = NativeModules;

export type Ear = 'left' | 'right' | 'both';
export type PlaybackMode = 'continuous' | 'pulsed';

interface PulseTiming {
  onDurationMs: number;
  offDurationMs: number;
  cycles: number;
}

interface AudioToneModuleInterface {
  initialize(): Promise<string>;
  playTone(frequency: number, dbLevel: number, ear: Ear, mode: PlaybackMode): Promise<string>;
  stopTone(): Promise<string>;
  setPlaybackMode(mode: PlaybackMode): Promise<string>;
  getPlaybackMode(): Promise<PlaybackMode>;
  configurePulseTiming(onMs: number, offMs: number, cycles: number): Promise<string>;
  getPulseTiming(): Promise<PulseTiming>;
  switchEar(ear: Ear): Promise<string>;
  getCurrentEar(): Promise<Ear>;
  setFrequency(frequency: number): Promise<string>;
  setIntensity(dbLevel: number): Promise<string>;
  isPlaying(): Promise<boolean>;
}

export const AudioTone = AudioToneModule as AudioToneModuleInterface;

// Constants
export const EarConstants = {
  LEFT: 'left' as Ear,
  RIGHT: 'right' as Ear,
  BOTH: 'both' as Ear,
};

export const PlaybackModeConstants = {
  CONTINUOUS: 'continuous' as PlaybackMode,
  PULSED: 'pulsed' as PlaybackMode,
};

// Preset pulse timings
export const PulsePresets = {
  
  STANDARD: { onDurationMs: 200, offDurationMs: 200, cycles: 3 },
  
  
  FAST: { onDurationMs: 100, offDurationMs: 100, cycles: 5 },
  
 
  SLOW: { onDurationMs: 500, offDurationMs: 500, cycles: 2 },
  
  
  BRIEF: { onDurationMs: 150, offDurationMs: 150, cycles: 2 },
};

export const AudiometryHelper = {
  STANDARD_FREQUENCIES: [125, 250, 500, 1000, 2000, 4000, 8000] as const,
  STANDARD_INTENSITIES: Array.from({ length: 21 }, (_, i) => i * 5),
  MIN_PAUSE_DURATION: 500,
  MAX_SAFE_LEVEL: 100,

  getPlaybackModeDescription(mode: PlaybackMode): string {
    switch (mode) {
      case 'continuous': return 'Kontinuirani ton';
      case 'pulsed': return 'Pulsed ton (ciklusi)';
      default: return 'Nepoznat mod';
    }
  },

  getPlaybackModeIcon(mode: PlaybackMode): string {
    switch (mode) {
      case 'continuous': return '▶';
      case 'pulsed': return '⏸▶⏸▶';
      default: return '?';
    }
  },

  calculatePulseDuration(timing: PulseTiming): number {
    
    return (timing.onDurationMs + timing.offDurationMs) * timing.cycles;
  },

  getPulseDurationText(timing: PulseTiming): string {
    const totalMs = this.calculatePulseDuration(timing);
    return `${totalMs}ms (${timing.cycles} ciklusa)`;
  },

  getIntensityDescription(dbLevel: number): string {
    if (dbLevel <= 20) return 'Veoma tiho';
    if (dbLevel <= 40) return 'Tiho';
    if (dbLevel <= 60) return 'Umereno';
    if (dbLevel <= 80) return 'Glasno';
    return 'Veoma glasno';
  },

  getEarDescription(ear: Ear): string {
    switch (ear) {
      case 'left': return 'Levo uvo';
      case 'right': return 'Desno uvo';
      case 'both': return 'Oba uva';
      default: return 'Nepoznato';
    }
  },

  isValidFrequency(frequency: number): boolean {
    return frequency >= 125 && frequency <= 8000;
  },

  isValidIntensity(dbLevel: number): boolean {
    return dbLevel >= 0 && dbLevel <= this.MAX_SAFE_LEVEL;
  },
};

export default AudioTone;