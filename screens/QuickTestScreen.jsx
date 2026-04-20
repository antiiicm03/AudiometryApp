import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import EarSelector from '../components/QuickTestScreen/EarSelector';
import FrequencySelector from '../components/QuickTestScreen/FrequencySelector';
import IntensityControl from '../components/QuickTestScreen/IntensityControl';
import PlaybackModeSelector from '../components/QuickTestScreen/PlaybackModeSelector';
import PlayButton from '../components/QuickTestScreen/PlayButton';
import PreTestScreen from '../components/QuickTestScreen/PreTestScreen';
import useAudioTest from '../hooks/useAudioTest';

export default function QuickTestScreen({ onBack }) {
  const {
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
    FREQUENCIES,
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
  } = useAudioTest();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15,23,42,1)', '#101047', 'rgba(70,130,180,1)']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBackPress(onBack)}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hearing Test</Text>
          {testStarted ? (
            <TouchableOpacity onPress={showAllResults}>
              <Ionicons name="list" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 28 }} />
          )}
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
            <PreTestScreen isInitialized={isInitialized} onStart={startTest} />
          ) : (
            <View style={styles.testContainer}>
              <PlaybackModeSelector
                playbackMode={playbackMode}
                pulseTiming={pulseTiming}
                onModeChange={handleModeChange}
                onPresetChange={changePulsePreset}
              />

              <EarSelector selectedEar={selectedEar} onEarChange={handleEarChange} />

              <FrequencySelector
                frequencies={FREQUENCIES}
                currentIndex={currentFrequencyIndex}
                onPrev={prevFrequency}
                onNext={nextFrequency}
              />

              <IntensityControl
                intensity={currentIntensity}
                onIncrease={increaseIntensity}
                onDecrease={decreaseIntensity}
                onSliderChange={handleSliderChange}
              />

              <PlayButton
                isPlaying={isPlaying}
                frequency={FREQUENCIES[currentFrequencyIndex]}
                intensity={currentIntensity}
                selectedEar={selectedEar}
                playbackMode={playbackMode}
                onPress={handlePlayTone}
              />

              {/* Save Result */}
              <TouchableOpacity style={styles.saveButton} onPress={saveResult}>
                <Ionicons name="save" size={24} color="#4a9eff" />
                <Text style={styles.saveButtonText}>Sačuvaj rezultat</Text>
              </TouchableOpacity>

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
  errorBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(251,146,60,0.2)', paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 20, marginBottom: 10, borderRadius: 20 },
  errorText: { fontSize: 13, color: '#fb923c', marginLeft: 8, fontWeight: '600' },
  content: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
  testContainer: { paddingTop: 20 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(74,158,255,0.2)', paddingVertical: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(74,158,255,0.4)' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#4a9eff', marginLeft: 8 },
  resultsCount: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  resultsCountText: { fontSize: 13, color: '#4ade80', fontWeight: '600' },
});