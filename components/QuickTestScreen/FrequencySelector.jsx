import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FrequencySelector({ frequencies, currentIndex, onPrev, onNext }) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === frequencies.length - 1;

  return (
    <View style={styles.frequencyCard}>
      <Text style={styles.sectionTitle}>Frekvencija:</Text>

      <View style={styles.frequencyControls}>
        <TouchableOpacity
          style={[styles.arrowButton, isFirst && styles.arrowButtonDisabled]}
          onPress={onPrev}
          disabled={isFirst}
        >
          <Ionicons name="chevron-back" size={32} color={isFirst ? '#64748b' : '#4a9eff'} />
        </TouchableOpacity>

        <View style={styles.frequencyDisplay}>
          <Text style={styles.frequencyValue}>{frequencies[currentIndex]}</Text>
          <Text style={styles.frequencyUnit}>Hz</Text>
        </View>

        <TouchableOpacity
          style={[styles.arrowButton, isLast && styles.arrowButtonDisabled]}
          onPress={onNext}
          disabled={isLast}
        >
          <Ionicons name="chevron-forward" size={32} color={isLast ? '#64748b' : '#4a9eff'} />
        </TouchableOpacity>
      </View>

      <Text style={styles.frequencyProgress}>
        {currentIndex + 1} od {frequencies.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frequencyCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 15, textAlign: 'center' },
  frequencyControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  arrowButton: { padding: 10 },
  arrowButtonDisabled: { opacity: 0.3 },
  frequencyDisplay: { alignItems: 'center' },
  frequencyValue: { fontSize: 48, fontWeight: '700', color: '#4a9eff' },
  frequencyUnit: { fontSize: 16, color: '#8696ac' },
  frequencyProgress: { fontSize: 13, color: '#64748b', textAlign: 'center' },
});