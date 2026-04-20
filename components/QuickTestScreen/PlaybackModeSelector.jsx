import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PulsePresets } from '../AudioTone';

export default function PlaybackModeSelector({ playbackMode, pulseTiming, onModeChange, onPresetChange }) {
  return (
    <View style={styles.modeCard}>
      <Text style={styles.sectionTitle}>Playback Mode:</Text>

      <View style={styles.modeButtons}>
        {/* CONTINUOUS */}
        <TouchableOpacity
          style={[styles.modeButton, playbackMode === 'continuous' && styles.modeButtonActive]}
          onPress={() => onModeChange('continuous')}
        >
          <LinearGradient
            colors={playbackMode === 'continuous' ? ['#4a9eff', '#3d85e6'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.modeButtonGradient}
          >
            <Ionicons name="play" size={28} color={playbackMode === 'continuous' ? '#fff' : '#8696ac'} />
            <Text style={[styles.modeButtonText, playbackMode === 'continuous' && styles.modeButtonTextActive]}>
              CONTINUOUS
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* PULSED */}
        <TouchableOpacity
          style={[styles.modeButton, playbackMode === 'pulsed' && styles.modeButtonActive]}
          onPress={() => onModeChange('pulsed')}
        >
          <LinearGradient
            colors={playbackMode === 'pulsed' ? ['#22c55e', '#16a34a'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.modeButtonGradient}
          >
            <View style={styles.pulsedIcon}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={styles.pulsedIconItem}>
                  <View style={[styles.pulseDot, playbackMode === 'pulsed' && styles.pulseDotActive]} />
                  {i < 2 && <View style={styles.pulseGap} />}
                </View>
              ))}
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
                style={[styles.presetButton, pulseTiming === preset && styles.presetButtonActive]}
                onPress={() => onPresetChange(preset)}
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
  );
}

const styles = StyleSheet.create({
  modeCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 15, textAlign: 'center' },
  modeButtons: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  modeButton: { flex: 1, borderRadius: 15, overflow: 'hidden' },
  modeButtonActive: { elevation: 8 },
  modeButtonGradient: { padding: 15, alignItems: 'center' },
  modeButtonText: { fontSize: 12, fontWeight: '700', color: '#8696ac', marginTop: 8 },
  modeButtonTextActive: { color: '#ffffff' },
  pulsedIcon: { flexDirection: 'row', alignItems: 'center' },
  pulsedIconItem: { flexDirection: 'row', alignItems: 'center' },
  pulseDot: { width: 6, height: 20, backgroundColor: '#8696ac', borderRadius: 3 },
  pulseDotActive: { backgroundColor: '#fff' },
  pulseGap: { width: 4 },
  presetsContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  presetsLabel: { fontSize: 13, color: '#8696ac', marginBottom: 10 },
  presetsButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, borderWidth: 2, borderColor: 'transparent' },
  presetButtonActive: { borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.2)' },
  presetButtonText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  timingText: { fontSize: 11, color: '#64748b', marginTop: 8, textAlign: 'center' },
});