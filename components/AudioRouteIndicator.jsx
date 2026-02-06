// components/AudioRouteIndicator.jsx
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function AudioRouteIndicator({ audioRoute, isMonitoring }) {
  const getIndicatorConfig = () => {
    switch (audioRoute) {
      case 'HEADPHONES':
        return {
          icon: 'headset',
          label: 'Žične slušalice',
          color: '#4ade80',
          bgColor: 'rgba(74, 222, 128, 0.15)',
        };
      case 'BLUETOOTH':
        return {
          icon: 'bluetooth',
          label: 'Bluetooth slušalice',
          color: '#4a9eff',
          bgColor: 'rgba(74, 158, 255, 0.15)',
        };
      case 'SPEAKER':
        return {
          icon: 'volume-high',
          label: 'Zvučnik telefona',
          color: '#fb923c',
          bgColor: 'rgba(251, 146, 60, 0.15)',
        };
      default:
        return {
          icon: 'help-circle',
          label: 'Nepoznato',
          color: '#8696ac',
          bgColor: 'rgba(134, 150, 172, 0.15)',
        };
    }
  };

  const config = getIndicatorConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }]}>
      <Ionicons name={config.icon} size={24} color={config.color} />
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: config.color }]}>
          {config.label}
        </Text>
        {isMonitoring && (
          <View style={styles.monitoringBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.monitoringText}>Aktivno praćenje</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    marginVertical: 12,
    marginHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  monitoringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },
  monitoringText: {
    fontSize: 12,
    color: '#8696ac',
    fontWeight: '600',
  },
});