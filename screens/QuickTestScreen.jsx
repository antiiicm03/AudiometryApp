// screens/QuickTestScreen.jsx
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioTone, {
  AudiometryHelper,
  PulsePresets
} from '../components/AudioTone';

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];

export default function QuickTestScreen({ onBack }) {
  const [testStarted, setTestStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Test parameters
  const [currentFrequencyIndex, setCurrentFrequencyIndex] = useState(0);
  const [currentIntensity, setCurrentIntensity] = useState(40);
  const [selectedEar, setSelectedEar] = useState('left');
  const [playbackMode, setPlaybackMode] = useState('continuous');
  const [pulseTiming, setPulseTiming] = useState(PulsePresets.STANDARD);
  
  // Results
  const [testResults, setTestResults] = useState({});
  const [error, setError] = useState(null);

  // Initialize audio
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
      Alert.alert(
        'Audio nije spreman',
        'Molimo sačekajte da se audio sistem inicijalizuje.',
        [{ text: 'U redu' }]
      );
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
      [
        { text: 'Otkaži', style: 'cancel' },
        { text: 'Započni', onPress: beginTest },
      ]
    );
  };

  const beginTest = () => {
    setTestStarted(true);
    setCurrentFrequencyIndex(0);
    setCurrentIntensity(40);
    setSelectedEar('left');
    setPlaybackMode('continuous');
  };

  // PLAY/STOP TON
  const handlePlayTone = async () => {
    if (isPlaying) {
      await AudioTone.stopTone();
      setIsPlaying(false);
    } else {
      try {
        // Ako je pulsed, konfiguriši timing
        if (playbackMode === 'pulsed') {
          await AudioTone.configurePulseTiming(
            pulseTiming.onDurationMs,
            pulseTiming.offDurationMs,
            pulseTiming.cycles
          );
        }

        // Reprodukuj ton
        await AudioTone.playTone(
          FREQUENCIES[currentFrequencyIndex],
          currentIntensity,
          selectedEar,
          playbackMode
        );
        
        setIsPlaying(true);
        setError(null);
        
        // Ako je pulsed, auto-stop nakon trajanja
        if (playbackMode === 'pulsed') {
          const duration = AudiometryHelper.calculatePulseDuration(pulseTiming);
          setTimeout(() => {
            setIsPlaying(false);
          }, duration + 100); // +100ms buffer
        }
      } catch (err) {
        setError(err.message || 'Failed to play tone');
        console.error('Play error:', err);
      }
    }
  };

  // INTENSITY CONTROL
  const increaseIntensity = async () => {
    const newIntensity = Math.min(currentIntensity + 5, 100);
    setCurrentIntensity(newIntensity);
    
    if (isPlaying && playbackMode === 'continuous') {
      await AudioTone.stopTone();
      setTimeout(async () => {
        await AudioTone.playTone(
          FREQUENCIES[currentFrequencyIndex],
          newIntensity,
          selectedEar,
          playbackMode
        );
      }, 100);
    }
  };

  const decreaseIntensity = async () => {
    const newIntensity = Math.max(currentIntensity - 5, 0);
    setCurrentIntensity(newIntensity);
    
    if (isPlaying && playbackMode === 'continuous') {
      await AudioTone.stopTone();
      setTimeout(async () => {
        await AudioTone.playTone(
          FREQUENCIES[currentFrequencyIndex],
          newIntensity,
          selectedEar,
          playbackMode
        );
      }, 100);
    }
  };

  const handleSliderChange = async (value) => {
    const roundedValue = Math.round(value / 5) * 5;
    setCurrentIntensity(roundedValue);
    
    if (isPlaying && playbackMode === 'continuous') {
      await AudioTone.stopTone();
      setTimeout(async () => {
        await AudioTone.playTone(
          FREQUENCIES[currentFrequencyIndex],
          roundedValue,
          selectedEar,
          playbackMode
        );
      }, 100);
    }
  };

  // EAR SELECTION
  const handleEarChange = async (ear) => {
    setSelectedEar(ear);
    
    if (isPlaying && playbackMode === 'continuous') {
      await AudioTone.stopTone();
      setTimeout(async () => {
        await AudioTone.playTone(
          FREQUENCIES[currentFrequencyIndex],
          currentIntensity,
          ear,
          playbackMode
        );
      }, 100);
    }
  };

  // PLAYBACK MODE
  const handleModeChange = async (mode) => {
    setPlaybackMode(mode);
    await AudioTone.setPlaybackMode(mode);
    
    if (isPlaying) {
      await AudioTone.stopTone();
      setIsPlaying(false);
    }
  };

  // PULSE PRESET
  const changePulsePreset = async (preset) => {
    setPulseTiming(preset);
    await AudioTone.configurePulseTiming(
      preset.onDurationMs,
      preset.offDurationMs,
      preset.cycles
    );
  };

  // FREQUENCY NAVIGATION
  const nextFrequency = async () => {
    if (currentFrequencyIndex < FREQUENCIES.length - 1) {
      const wasPlaying = isPlaying;
      
      if (wasPlaying) await AudioTone.stopTone();
      
      setCurrentFrequencyIndex(prev => prev + 1);
      setIsPlaying(false);
      
      if (wasPlaying && playbackMode === 'continuous') {
        setTimeout(async () => {
          await handlePlayTone();
        }, 300);
      }
    }
  };

  const prevFrequency = async () => {
    if (currentFrequencyIndex > 0) {
      const wasPlaying = isPlaying;
      
      if (wasPlaying) await AudioTone.stopTone();
      
      setCurrentFrequencyIndex(prev => prev - 1);
      setIsPlaying(false);
      
      if (wasPlaying && playbackMode === 'continuous') {
        setTimeout(async () => {
          await handlePlayTone();
        }, 300);
      }
    }
  };

  // SAVE RESULT
  const saveResult = () => {
    const resultKey = `${FREQUENCIES[currentFrequencyIndex]}Hz_${selectedEar}`;
    
    Alert.alert(
      'Sačuvaj rezultat',
      `Sačuvati ${currentIntensity} dB za ${FREQUENCIES[currentFrequencyIndex]} Hz (${
        selectedEar === 'left' ? 'Levo' : selectedEar === 'right' ? 'Desno' : 'Oba'
      } uvo)?`,
      [
        { text: 'Otkaži', style: 'cancel' },
        {
          text: 'Sačuvaj',
          onPress: () => {
            setTestResults(prev => ({
              ...prev,
              [resultKey]: currentIntensity
            }));
            
            Alert.alert('✓ Sačuvano', `${resultKey}: ${currentIntensity} dB`);
          }
        }
      ]
    );
  };

  // SHOW ALL RESULTS
  const showAllResults = () => {
    if (Object.keys(testResults).length === 0) {
      Alert.alert('Nema rezultata', 'Još niste sačuvali nijedan rezultat.');
      return;
    }

    const leftResults = Object.entries(testResults)
      .filter(([key]) => key.endsWith('_left'))
      .map(([key, value]) => `${key}: ${value} dB`)
      .join('\n');

    const rightResults = Object.entries(testResults)
      .filter(([key]) => key.endsWith('_right'))
      .map(([key, value]) => `${key}: ${value} dB`)
      .join('\n');

    const bothResults = Object.entries(testResults)
      .filter(([key]) => key.endsWith('_both'))
      .map(([key, value]) => `${key}: ${value} dB`)
      .join('\n');

    let resultsText = '';
    if (leftResults) resultsText += '◀ LEVO UVO:\n' + leftResults + '\n\n';
    if (rightResults) resultsText += '▶ DESNO UVO:\n' + rightResults + '\n\n';
    if (bothResults) resultsText += '◀▶ OBA UVA:\n' + bothResults;
    
    Alert.alert('📊 Svi rezultati', resultsText || 'Nema rezultata');
  };

  const handleBackPress = async () => {
    if (testStarted) {
      await AudioTone.stopTone();
      
      Alert.alert(
        'Napusti test?',
        'Da li želite da napustite test?',
        [
          { text: 'Ne', style: 'cancel' },
          { 
            text: 'Da', 
            onPress: () => {
              setTestStarted(false);
              setIsPlaying(false);
              onBack();
            }
          }
        ]
      );
    } else {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 1)', '#101047', 'rgba(70, 130, 180, 1)']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hearing Test</Text>
          {testStarted && (
            <TouchableOpacity onPress={showAllResults}>
              <Ionicons name="list" size={28} color="#fff" />
            </TouchableOpacity>
          )}
          {!testStarted && <View style={{ width: 28 }} />}
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning" size={16} color="#fb923c" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {!testStarted ? (
            // PRE-TEST SCREEN
            <View style={styles.pretestContainer}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isInitialized ? 'checkmark-circle' : 'hourglass'}
                  size={80}
                  color={isInitialized ? '#4ade80' : '#fb923c'}
                />
              </View>

              <Text style={styles.statusTitle}>
                {isInitialized ? 'Audio spreman ✓' : 'Inicijalizacija...'}
              </Text>

              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsTitle}>Manuelna kontrola:</Text>
                
                <View style={styles.instructionItem}>
                  <Ionicons name="git-network" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Birajte frekvenciju sa strelicama (←/→)
                  </Text>
                </View>
                
                <View style={styles.instructionItem}>
                  <Ionicons name="volume-medium" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Kontrolišite intenzitet (+/- ili slider)
                  </Text>
                </View>
                
                <View style={styles.instructionItem}>
                  <Ionicons name="ear" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Birajte levo/desno/oba uva
                  </Text>
                </View>
                
                <View style={styles.instructionItem}>
                  <Ionicons name="play-circle" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Continuous ili Pulsed playback
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.startButton, !isInitialized && styles.disabledButton]}
                onPress={startTest}
                disabled={!isInitialized}
              >
                <LinearGradient
                  colors={isInitialized ? ['#4a9eff', '#3d85e6'] : ['#64748b', '#475569']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {isInitialized ? 'Započni Test' : '⏳ Priprema...'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            // TEST SCREEN
            <View style={styles.testContainer}>
              
              {/* PLAYBACK MODE SELECTION */}
              <View style={styles.modeCard}>
                <Text style={styles.sectionTitle}>Playback Mode:</Text>
                
                <View style={styles.modeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      playbackMode === 'continuous' && styles.modeButtonActive
                    ]}
                    onPress={() => handleModeChange('continuous')}
                  >
                    <LinearGradient
                      colors={playbackMode === 'continuous' ? ['#4a9eff', '#3d85e6'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.modeButtonGradient}
                    >
                      <Ionicons 
                        name="play" 
                        size={28} 
                        color={playbackMode === 'continuous' ? '#fff' : '#8696ac'} 
                      />
                      <Text style={[styles.modeButtonText, playbackMode === 'continuous' && styles.modeButtonTextActive]}>
                        CONTINUOUS
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      playbackMode === 'pulsed' && styles.modeButtonActive
                    ]}
                    onPress={() => handleModeChange('pulsed')}
                  >
                    <LinearGradient
                      colors={playbackMode === 'pulsed' ? ['#22c55e', '#16a34a'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.modeButtonGradient}
                    >
                      <View style={styles.pulsedIcon}>
                        <View style={[styles.pulseDot, playbackMode === 'pulsed' && styles.pulseDotActive]} />
                        <View style={styles.pulseGap} />
                        <View style={[styles.pulseDot, playbackMode === 'pulsed' && styles.pulseDotActive]} />
                        <View style={styles.pulseGap} />
                        <View style={[styles.pulseDot, playbackMode === 'pulsed' && styles.pulseDotActive]} />
                      </View>
                      <Text style={[styles.modeButtonText, playbackMode === 'pulsed' && styles.modeButtonTextActive]}>
                        PULSED
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* PULSE PRESETS */}
                {playbackMode === 'pulsed' && (
                  <View style={styles.presetsContainer}>
                    <Text style={styles.presetsLabel}>Timing:</Text>
                    <View style={styles.presetsButtons}>
                      {Object.entries(PulsePresets).map(([name, preset]) => (
                        <TouchableOpacity
                          key={name}
                          style={[
                            styles.presetButton,
                            pulseTiming === preset && styles.presetButtonActive
                          ]}
                          onPress={() => changePulsePreset(preset)}
                        >
                          <Text style={styles.presetButtonText}>{name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text style={styles.timingText}>
                      {pulseTiming.onDurationMs}/{pulseTiming.offDurationMs}ms, {pulseTiming.cycles} cycles
                    </Text>
                  </View>
                )}
              </View>

              {/* EAR SELECTION */}
              <View style={styles.earSelectionCard}>
                <Text style={styles.sectionTitle}>Izaberi uvo:</Text>
                
                <View style={styles.earButtons}>
                  <TouchableOpacity
                    style={[styles.earButton, selectedEar === 'left' && styles.earButtonActive]}
                    onPress={() => handleEarChange('left')}
                  >
                    <LinearGradient
                      colors={selectedEar === 'left' ? ['#4a9eff', '#3d85e6'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.earButtonGradient}
                    >
                      <Ionicons name="ear" size={28} color={selectedEar === 'left' ? '#fff' : '#8696ac'} />
                      <Text style={[styles.earButtonText, selectedEar === 'left' && styles.earButtonTextActive]}>LEVO</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.earButton, selectedEar === 'both' && styles.earButtonActive]}
                    onPress={() => handleEarChange('both')}
                  >
                    <LinearGradient
                      colors={selectedEar === 'both' ? ['#22c55e', '#16a34a'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.earButtonGradient}
                    >
                      <View style={styles.bothEarsIcon}>
                        <Ionicons name="ear" size={20} color={selectedEar === 'both' ? '#fff' : '#8696ac'} />
                        <Ionicons name="ear-outline" size={20} color={selectedEar === 'both' ? '#fff' : '#8696ac'} />
                      </View>
                      <Text style={[styles.earButtonText, selectedEar === 'both' && styles.earButtonTextActive]}>OBA</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.earButton, selectedEar === 'right' && styles.earButtonActive]}
                    onPress={() => handleEarChange('right')}
                  >
                    <LinearGradient
                      colors={selectedEar === 'right' ? ['#ef4444', '#dc2626'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.earButtonGradient}
                    >
                      <Ionicons name="ear-outline" size={28} color={selectedEar === 'right' ? '#fff' : '#8696ac'} />
                      <Text style={[styles.earButtonText, selectedEar === 'right' && styles.earButtonTextActive]}>DESNO</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              {/* FREQUENCY SELECTION */}
              <View style={styles.frequencyCard}>
                <Text style={styles.sectionTitle}>Frekvencija:</Text>
                
                <View style={styles.frequencyControls}>
                  <TouchableOpacity
                    style={[styles.arrowButton, currentFrequencyIndex === 0 && styles.arrowButtonDisabled]}
                    onPress={prevFrequency}
                    disabled={currentFrequencyIndex === 0}
                  >
                    <Ionicons name="chevron-back" size={32} color={currentFrequencyIndex === 0 ? '#64748b' : '#4a9eff'} />
                  </TouchableOpacity>

                  <View style={styles.frequencyDisplay}>
                    <Text style={styles.frequencyValue}>{FREQUENCIES[currentFrequencyIndex]}</Text>
                    <Text style={styles.frequencyUnit}>Hz</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.arrowButton, currentFrequencyIndex === FREQUENCIES.length - 1 && styles.arrowButtonDisabled]}
                    onPress={nextFrequency}
                    disabled={currentFrequencyIndex === FREQUENCIES.length - 1}
                  >
                    <Ionicons name="chevron-forward" size={32} color={currentFrequencyIndex === FREQUENCIES.length - 1 ? '#64748b' : '#4a9eff'} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.frequencyProgress}>
                  {currentFrequencyIndex + 1} od {FREQUENCIES.length}
                </Text>
              </View>

              {/* INTENSITY CONTROL */}
              <View style={styles.intensityCard}>
                <Text style={styles.sectionTitle}>Intenzitet (dB):</Text>
                
                <View style={styles.intensityButtonsRow}>
                  <TouchableOpacity
                    style={[styles.intensityButton, currentIntensity === 0 && styles.intensityButtonDisabled]}
                    onPress={decreaseIntensity}
                    disabled={currentIntensity === 0}
                  >
                    <Ionicons name="remove-circle" size={40} color={currentIntensity === 0 ? '#64748b' : '#ef4444'} />
                    <Text style={styles.intensityButtonText}>-5 dB</Text>
                  </TouchableOpacity>

                  <View style={styles.intensityDisplay}>
                    <Text style={styles.intensityValue}>{currentIntensity}</Text>
                    <Text style={styles.intensityUnit}>dB</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.intensityButton, currentIntensity === 100 && styles.intensityButtonDisabled]}
                    onPress={increaseIntensity}
                    disabled={currentIntensity === 100}
                  >
                    <Ionicons name="add-circle" size={40} color={currentIntensity === 100 ? '#64748b' : '#4ade80'} />
                    <Text style={styles.intensityButtonText}>+5 dB</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>0</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                    value={currentIntensity}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#4a9eff"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#4a9eff"
                  />
                  <Text style={styles.sliderLabel}>100</Text>
                </View>

                <Text style={styles.intensityDescription}>
                  {currentIntensity <= 20 && '🔇 Veoma tiho'}
                  {currentIntensity > 20 && currentIntensity <= 40 && '🔉 Tiho'}
                  {currentIntensity > 40 && currentIntensity <= 60 && '🔊 Umereno'}
                  {currentIntensity > 60 && currentIntensity <= 80 && '📢 Glasno'}
                  {currentIntensity > 80 && '⚠️ Veoma glasno!'}
                </Text>
              </View>

              {/* PLAY/STOP BUTTON */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayTone}
              >
                <LinearGradient
                  colors={isPlaying ? ['#ef4444', '#dc2626'] : ['#4ade80', '#22c55e']}
                  style={styles.playButtonGradient}
                >
                  <Ionicons 
                    name={isPlaying ? 'stop-circle' : 'play-circle'} 
                    size={40} 
                    color="#fff" 
                  />
                  <Text style={styles.playButtonText}>
                    {isPlaying ? 'ZAUSTAVI TON' : 'REPRODUKUJ TON'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Playing Indicator */}
              {isPlaying && (
                <View style={styles.playingIndicator}>
                  <View style={styles.soundWaves}>
                    <View style={[styles.soundWave, styles.wave1]} />
                    <View style={[styles.soundWave, styles.wave2]} />
                    <View style={[styles.soundWave, styles.wave3]} />
                  </View>
                  <Text style={styles.playingText}>
                    🔊 {FREQUENCIES[currentFrequencyIndex]} Hz @ {currentIntensity} dB
                  </Text>
                  <Text style={styles.playingSubtext}>
                    {selectedEar === 'left' ? '◀ Levo uvo' : selectedEar === 'right' ? 'Desno uvo ▶' : '◀▶ Oba uva'} | {playbackMode === 'continuous' ? 'Continuous' : 'Pulsed'}
                  </Text>
                </View>
              )}

              {/* SAVE RESULT BUTTON */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveResult}
              >
                <Ionicons name="save" size={24} color="#4a9eff" />
                <Text style={styles.saveButtonText}>Sačuvaj rezultat</Text>
              </TouchableOpacity>

              {/* Results count */}
              {Object.keys(testResults).length > 0 && (
                <View style={styles.resultsCount}>
                  <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                  <Text style={styles.resultsCountText}>
                    Sačuvano rezultata: {Object.keys(testResults).length}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#191970' },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(251, 146, 60, 0.2)', paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 20, marginBottom: 10, borderRadius: 20 },
  errorText: { fontSize: 13, color: '#fb923c', marginLeft: 8, fontWeight: '600' },
  content: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
  
  // Pre-test
  pretestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  iconContainer: { marginBottom: 30 },
  statusTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 10, textAlign: 'center' },
  instructionsCard: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 25, width: '100%', marginBottom: 30 },
  instructionsTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 20 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  instructionText: { fontSize: 15, color: '#cbd5e1', marginLeft: 15, flex: 1, lineHeight: 22 },
  startButton: { width: '100%', borderRadius: 30, overflow: 'hidden', elevation: 4 },
  disabledButton: { opacity: 0.5 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },

  // Test container
  testContainer: { paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 15, textAlign: 'center' },
  
  // Playback mode
  modeCard: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  modeButtons: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  modeButton: { flex: 1, borderRadius: 15, overflow: 'hidden' },
  modeButtonActive: { elevation: 8 },
  modeButtonGradient: { padding: 15, alignItems: 'center' },
  modeButtonText: { fontSize: 12, fontWeight: '700', color: '#8696ac', marginTop: 8 },
  modeButtonTextActive: { color: '#ffffff' },
  pulsedIcon: { flexDirection: 'row', alignItems: 'center' },
  pulseDot: { width: 6, height: 20, backgroundColor: '#8696ac', borderRadius: 3 },
  pulseDotActive: { backgroundColor: '#fff' },
  pulseGap: { width: 4 },
  presetsContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  presetsLabel: { fontSize: 13, color: '#8696ac', marginBottom: 10 },
  presetsButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, borderWidth: 2, borderColor: 'transparent' },
  presetButtonActive: { borderColor: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.2)' },
  presetButtonText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  timingText: { fontSize: 11, color: '#64748b', marginTop: 8, textAlign: 'center' },
  
  // Ear selection
  earSelectionCard: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  earButtons: { flexDirection: 'row', gap: 10 },
  earButton: { flex: 1, borderRadius: 15, overflow: 'hidden' },
  earButtonActive: { elevation: 8 },
  earButtonGradient: { padding: 15, alignItems: 'center' },
  bothEarsIcon: { flexDirection: 'row', gap: 6 },
  earButtonText: { fontSize: 13, fontWeight: '700', color: '#8696ac', marginTop: 8 },
  earButtonTextActive: { color: '#ffffff' },

  // Frequency
  frequencyCard: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  frequencyControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  arrowButton: { padding: 10 },
  arrowButtonDisabled: { opacity: 0.3 },
  frequencyDisplay: { alignItems: 'center' },
  frequencyValue: { fontSize: 48, fontWeight: '700', color: '#4a9eff' },
  frequencyUnit: { fontSize: 16, color: '#8696ac' },
  frequencyProgress: { fontSize: 13, color: '#64748b', textAlign: 'center' },

  // Intensity
  intensityCard: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  intensityButtonsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  intensityButton: { alignItems: 'center' },
  intensityButtonDisabled: { opacity: 0.3 },
  intensityButtonText: { fontSize: 12, color: '#8696ac', marginTop: 5, fontWeight: '600' },
  intensityDisplay: { alignItems: 'center' },
  intensityValue: { fontSize: 56, fontWeight: '700', color: '#4a9eff' },
  intensityUnit: { fontSize: 18, color: '#8696ac' },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  slider: { flex: 1 },
  sliderLabel: { fontSize: 13, color: '#64748b', fontWeight: '600', width: 30, textAlign: 'center' },
  intensityDescription: { fontSize: 14, color: '#cbd5e1', textAlign: 'center', marginTop: 10, fontWeight: '600' },

  // Play button
  playButton: { borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 6 },
  playButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  playButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginLeft: 12 },

  // Playing indicator
  playingIndicator: { backgroundColor: 'rgba(74, 158, 255, 0.15)', borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(74, 158, 255, 0.3)' },
  soundWaves: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  soundWave: { width: 4, backgroundColor: '#4a9eff', borderRadius: 2 },
  wave1: { height: 20 },
  wave2: { height: 30 },
  wave3: { height: 20 },
  playingText: { fontSize: 16, fontWeight: '700', color: '#4a9eff', marginBottom: 4 },
  playingSubtext: { fontSize: 13, color: '#8696ac' },

  // Save button
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(74, 158, 255, 0.2)', paddingVertical: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(74, 158, 255, 0.4)' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#4a9eff', marginLeft: 8 },

  // Results count
  resultsCount: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  resultsCountText: { fontSize: 13, color: '#4ade80', fontWeight: '600' },
});