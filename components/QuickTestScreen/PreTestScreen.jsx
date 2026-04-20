import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreTestScreen({ isInitialized, onStart }) {
  return (
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

        {[
          { icon: 'git-network', text: 'Birajte frekvenciju sa strelicama (←/→)' },
          { icon: 'volume-medium', text: 'Kontrolišite intenzitet (+/- ili slider)' },
          { icon: 'ear', text: 'Birajte levo/desno/oba uva' },
          { icon: 'play-circle', text: 'Continuous ili Pulsed playback' },
        ].map(({ icon, text }) => (
          <View key={icon} style={styles.instructionItem}>
            <Ionicons name={icon} size={24} color="#4a9eff" />
            <Text style={styles.instructionText}>{text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.startButton, !isInitialized && styles.disabledButton]}
        onPress={onStart}
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
  );
}

const styles = StyleSheet.create({
  pretestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  iconContainer: { marginBottom: 30 },
  statusTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 10, textAlign: 'center' },
  instructionsCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 25, width: '100%', marginBottom: 30 },
  instructionsTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 20 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  instructionText: { fontSize: 15, color: '#cbd5e1', marginLeft: 15, flex: 1, lineHeight: 22 },
  startButton: { width: '100%', borderRadius: 30, overflow: 'hidden', elevation: 4 },
  disabledButton: { opacity: 0.5 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
});