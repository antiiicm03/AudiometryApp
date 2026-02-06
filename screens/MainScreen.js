import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function MainScreen({ onTabChange }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 1)', '#101047', 'rgba(70, 130, 180, 1)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Test Results</Text>
          <Text style={styles.headerSubtitle}>Your Hearing History</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={80} color="#4a9eff" />
            <Text style={styles.emptyTitle}>No Results Yet</Text>
            <Text style={styles.emptyText}>
              Complete a hearing test to see your results here
            </Text>
          </View>
        </View>

        <BottomNavigation activeTab="results" onTabChange={onTabChange} />
      </LinearGradient>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
    padding: 0,
    margin: 0,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8696ac',
    marginTop: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: '#8696ac',
    textAlign: 'center',
    lineHeight: 22,
  },
});