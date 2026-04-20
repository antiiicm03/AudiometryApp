import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function PlayingIndicator({ frequency, intensity, selectedEar, playbackMode }) {
  const earLabel =
    selectedEar === 'left' ? '◀ Levo uvo' : selectedEar === 'right' ? 'Desno uvo ▶' : '◀▶ Oba uva';
  const modeLabel = playbackMode === 'continuous' ? 'Continuous' : 'Pulsed';

  return (
    <View style={styles.playingIndicator}>
      <View style={styles.soundWaves}>
        <View style={[styles.soundWave, styles.wave1]} />
        <View style={[styles.soundWave, styles.wave2]} />
        <View style={[styles.soundWave, styles.wave3]} />
      </View>
      <Text style={styles.playingText}>🔊 {frequency} Hz @ {intensity} dB</Text>
      <Text style={styles.playingSubtext}>{earLabel} | {modeLabel}</Text>
    </View>
  );
}

export default function PlayButton({ isPlaying, frequency, intensity, selectedEar, playbackMode, onPress }) {
  return (
    <>
      <TouchableOpacity style={styles.playButton} onPress={onPress}>
        <LinearGradient
          colors={isPlaying ? ['#ef4444', '#dc2626'] : ['#4ade80', '#22c55e']}
          style={styles.playButtonGradient}
        >
          <Ionicons name={isPlaying ? 'stop-circle' : 'play-circle'} size={40} color="#fff" />
          <Text style={styles.playButtonText}>
            {isPlaying ? 'ZAUSTAVI TON' : 'REPRODUKUJ TON'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {isPlaying && (
        <PlayingIndicator
          frequency={frequency}
          intensity={intensity}
          selectedEar={selectedEar}
          playbackMode={playbackMode}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  playButton: { borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 6 },
  playButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  playButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginLeft: 12 },
  playingIndicator: { backgroundColor: 'rgba(74,158,255,0.15)', borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(74,158,255,0.3)' },
  soundWaves: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  soundWave: { width: 4, backgroundColor: '#4a9eff', borderRadius: 2 },
  wave1: { height: 20 },
  wave2: { height: 30 },
  wave3: { height: 20 },
  playingText: { fontSize: 16, fontWeight: '700', color: '#4a9eff', marginBottom: 4 },
  playingSubtext: { fontSize: 13, color: '#8696ac' },
});