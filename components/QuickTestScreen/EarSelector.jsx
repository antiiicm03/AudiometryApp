import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EAR_OPTIONS = [
  {
    key: 'left',
    label: 'LEVO',
    colors: ['#4a9eff', '#3d85e6'],
    icon: () => <Ionicons name="ear" size={28} color="#fff" />,
    iconInactive: () => <Ionicons name="ear" size={28} color="#8696ac" />,
  },
  {
    key: 'both',
    label: 'OBA',
    colors: ['#22c55e', '#16a34a'],
    icon: () => (
      <View style={styles.bothEarsIcon}>
        <Ionicons name="ear" size={20} color="#fff" />
        <Ionicons name="ear-outline" size={20} color="#fff" />
      </View>
    ),
    iconInactive: () => (
      <View style={styles.bothEarsIcon}>
        <Ionicons name="ear" size={20} color="#8696ac" />
        <Ionicons name="ear-outline" size={20} color="#8696ac" />
      </View>
    ),
  },
  {
    key: 'right',
    label: 'DESNO',
    colors: ['#ef4444', '#dc2626'],
    icon: () => <Ionicons name="ear-outline" size={28} color="#fff" />,
    iconInactive: () => <Ionicons name="ear-outline" size={28} color="#8696ac" />,
  },
];

export default function EarSelector({ selectedEar, onEarChange }) {
  return (
    <View style={styles.earSelectionCard}>
      <Text style={styles.sectionTitle}>Izaberi uvo:</Text>

      <View style={styles.earButtons}>
        {EAR_OPTIONS.map(({ key, label, colors, icon, iconInactive }) => {
          const active = selectedEar === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.earButton, active && styles.earButtonActive]}
              onPress={() => onEarChange(key)}
            >
              <LinearGradient
                colors={active ? colors : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.earButtonGradient}
              >
                {active ? icon() : iconInactive()}
                <Text style={[styles.earButtonText, active && styles.earButtonTextActive]}>
                  {label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  earSelectionCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 15, textAlign: 'center' },
  earButtons: { flexDirection: 'row', gap: 10 },
  earButton: { flex: 1, borderRadius: 15, overflow: 'hidden' },
  earButtonActive: { elevation: 8 },
  earButtonGradient: { padding: 15, alignItems: 'center' },
  bothEarsIcon: { flexDirection: 'row', gap: 6 },
  earButtonText: { fontSize: 13, fontWeight: '700', color: '#8696ac', marginTop: 8 },
  earButtonTextActive: { color: '#ffffff' },
});