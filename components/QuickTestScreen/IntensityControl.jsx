import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INTENSITY_LABEL = (v) => {
  if (v <= 20) return '🔇 Veoma tiho';
  if (v <= 40) return '🔉 Tiho';
  if (v <= 60) return '🔊 Umereno';
  if (v <= 80) return '📢 Glasno';
  return '⚠️ Veoma glasno!';
};

export default function IntensityControl({ intensity, onIncrease, onDecrease, onSliderChange }) {
  const atMin = intensity === 0;
  const atMax = intensity === 100;

  return (
    <View style={styles.intensityCard}>
      <Text style={styles.sectionTitle}>Intenzitet (dB):</Text>

      <View style={styles.intensityButtonsRow}>
        <TouchableOpacity
          style={[styles.intensityButton, atMin && styles.intensityButtonDisabled]}
          onPress={onDecrease}
          disabled={atMin}
        >
          <Ionicons name="remove-circle" size={40} color={atMin ? '#64748b' : '#ef4444'} />
          <Text style={styles.intensityButtonText}>-5 dB</Text>
        </TouchableOpacity>

        <View style={styles.intensityDisplay}>
          <Text style={styles.intensityValue}>{intensity}</Text>
          <Text style={styles.intensityUnit}>dB</Text>
        </View>

        <TouchableOpacity
          style={[styles.intensityButton, atMax && styles.intensityButtonDisabled]}
          onPress={onIncrease}
          disabled={atMax}
        >
          <Ionicons name="add-circle" size={40} color={atMax ? '#64748b' : '#4ade80'} />
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
          value={intensity}
          onValueChange={onSliderChange}
          minimumTrackTintColor="#4a9eff"
          maximumTrackTintColor="rgba(255,255,255,0.2)"
          thumbTintColor="#4a9eff"
        />
        <Text style={styles.sliderLabel}>100</Text>
      </View>

      <Text style={styles.intensityDescription}>{INTENSITY_LABEL(intensity)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intensityCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 15, textAlign: 'center' },
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
});