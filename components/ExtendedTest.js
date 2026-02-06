import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];
const INTENSITIES = Array.from({ length: 21 }, (_, i) => i * 5); // 0, 5, 10, ..., 100

export default function ExtendedTest() {
  const [selectedFrequency, setSelectedFrequency] = useState(1000);
  const [selectedIntensity, setSelectedIntensity] = useState(50);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LinearGradient
          colors={['#1e4a7a', '#2d5a94', '#1e4a7a']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.badge}>EXTENDED TEST</Text>
          <Text style={styles.title}>
            Comprehensive Hearing Test with Custom Frequency & Intensity
          </Text>

          {/* Frequency Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pulse" size={22} color="#8bb4e0" />
              <Text style={styles.sectionTitle}>Frequency (Hz)</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.frequencyScroll}
            >
              {FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    selectedFrequency === freq && styles.frequencyButtonActive,
                  ]}
                  onPress={() => setSelectedFrequency(freq)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      selectedFrequency === freq && styles.frequencyTextActive,
                    ]}
                  >
                    {freq >= 1000 ? `${freq / 1000}k` : freq}
                  </Text>
                  <Text
                    style={[
                      styles.frequencyLabel,
                      selectedFrequency === freq && styles.frequencyLabelActive,
                    ]}
                  >
                    Hz
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Intensity Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="volume-high" size={22} color="#8bb4e0" />
              <Text style={styles.sectionTitle}>Intensity Level</Text>
            </View>

            <View style={styles.intensityContainer}>
              <View style={styles.intensityDisplay}>
                <Text style={styles.intensityValue}>{selectedIntensity}</Text>
                <Text style={styles.intensityUnit}>dB</Text>
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <LinearGradient
                    colors={['#4a9eff', '#3d85e6', '#2d6bc7']}
                    style={[
                      styles.sliderFill,
                      { width: `${selectedIntensity}%` },
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <View style={styles.intensityButtons}>
                  {[0, 25, 50, 75, 100].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={styles.quickIntensityButton}
                      onPress={() => setSelectedIntensity(val)}
                    >
                      <Text style={styles.quickIntensityText}>{val}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Intensity Grid */}
              <ScrollView
                style={styles.intensityGrid}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.intensityGridContainer}>
                  {INTENSITIES.map((intensity) => (
                    <TouchableOpacity
                      key={intensity}
                      style={[
                        styles.intensityGridButton,
                        selectedIntensity === intensity &&
                          styles.intensityGridButtonActive,
                      ]}
                      onPress={() => setSelectedIntensity(intensity)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.intensityGridText,
                          selectedIntensity === intensity &&
                            styles.intensityGridTextActive,
                        ]}
                      >
                        {intensity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Test Duration Info */}
          <View style={styles.infoBadge}>
            <Ionicons name="information-circle" size={18} color="#8bb4e0" />
            <Text style={styles.infoText}>
              Test each frequency at different intensities
            </Text>
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#4a9eff', '#3d85e6']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name="play-circle"
                size={24}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Start Extended Test</Text>
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

  },
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 20,
    
  },
  cardGradient: {
    padding: 25,
    paddingTop: 30,
    paddingBottom: 35,
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
    marginBottom: 25,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 10,
  },
  frequencyScroll: {
    paddingVertical: 5,
  },
  frequencyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 75,
  },
  frequencyButtonActive: {
    backgroundColor: 'rgba(74, 158, 255, 0.25)',
    borderColor: '#4a9eff',
    borderWidth: 2,
  },
  frequencyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8696ac',
  },
  frequencyTextActive: {
    color: '#4a9eff',
  },
  frequencyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7a8f',
    marginTop: 2,
  },
  frequencyLabelActive: {
    color: '#6ba9ff',
  },
  intensityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  intensityDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  intensityValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#4a9eff',
    letterSpacing: -1,
  },
  intensityUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8bb4e0',
    marginLeft: 8,
    marginTop: 10,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 15,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  intensityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickIntensityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  quickIntensityText: {
    color: '#8696ac',
    fontSize: 13,
    fontWeight: '600',
  },
  intensityGrid: {
    maxHeight: 180,
  },
  intensityGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intensityGridButton: {
    width: (width - 170) / 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  intensityGridButtonActive: {
    backgroundColor: 'rgba(74, 158, 255, 0.3)',
    borderColor: '#4a9eff',
    borderWidth: 2,
  },
  intensityGridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8696ac',
  },
  intensityGridTextActive: {
    color: '#4a9eff',
    fontWeight: '700',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 180, 224, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(139, 180, 224, 0.25)',
    marginBottom: 25,
  },
  infoText: {
    color: '#8bb4e0',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});