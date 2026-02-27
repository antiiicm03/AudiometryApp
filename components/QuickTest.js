import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function QuickTest({ onStartTest }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LinearGradient
          colors={['#1e4a7a', '#2d5a94', '#1e4a7a']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.badge}>QUICK TEST</Text>
          <Text style={styles.title}>
            Instantly check your Hearing with Quick & Simplified Hearing Test
          </Text>

          <LottieView
            source={require('../assets/animations/headphones.json')}
            autoPlay
            loop
            style={styles.headphones}
          />

          <View style={styles.durationBadge}>
            <Ionicons name="time" size={16} color="#ffb84d" />
            <Text style={styles.durationText}>05 min</Text>
          </View>

          <TouchableOpacity 
            style={styles.startButton} 
            activeOpacity={0.8}
            onPress={onStartTest}
          >
            <LinearGradient
              colors={['#4a9eff', '#3d85e6']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Start Quick Test</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
 
  container: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginHorizontal: 0,
  },
  cardGradient: {
    padding: 25,
    paddingTop: 30,
    paddingBottom: 35,
    minHeight: 520,
  },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8bb4e0',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 26,
    marginBottom: 30,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 184, 77, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 77, 0.4)',
    marginBottom: 25,
  },
  durationText: {
    color: '#ffb84d',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#4a9eff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headphones: {
    width: 250,
    height: 250,    
    alignSelf: 'center',
    marginBottom: 20,
  },
});
