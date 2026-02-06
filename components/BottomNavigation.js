import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNavigation({ activeTab = 'hearing', onTabChange }) {
  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'hearing' && styles.navItemActive]}
          onPress={() => onTabChange && onTabChange('hearing')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              activeTab === 'hearing' && styles.iconContainerActive,
            ]}
          >
            <Ionicons
              name={activeTab === 'hearing' ? 'ear' : 'ear-outline'}
              size={26}
              color={activeTab === 'hearing' ? '#4a9eff' : '#8696ac'}
            />
          </View>
          <Text
            style={[styles.navText, activeTab === 'hearing' && styles.navTextActive]}
          >
            Hearing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'results' && styles.navItemActive]}
          onPress={() => onTabChange && onTabChange('results')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              activeTab === 'results' && styles.iconContainerActive,
            ]}
          >
            <Ionicons
              name={activeTab === 'results' ? 'stats-chart' : 'stats-chart-outline'}
              size={26}
              color={activeTab === 'results' ? '#4a9eff' : '#8696ac'}
            />
          </View>
          <Text
            style={[styles.navText, activeTab === 'results' && styles.navTextActive]}
          >
            Results
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'settings' && styles.navItemActive]}
          onPress={() => onTabChange && onTabChange('settings')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              activeTab === 'settings' && styles.iconContainerActive,
            ]}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={26}
              color={activeTab === 'settings' ? '#4a9eff' : '#8696ac'}
            />
          </View>
          <Text
            style={[styles.navText, activeTab === 'settings' && styles.navTextActive]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(10, 22, 40, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    paddingTop: 8,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: 'rgba(74, 158, 255, 0.1)',
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8696ac',
  },
  navTextActive: {
    color: '#4a9eff',
    fontWeight: '700',
  },
});