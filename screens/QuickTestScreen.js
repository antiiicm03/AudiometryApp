// screens/QuickTestScreen.jsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRouteIndicator from '../components/AudioRouteIndicator';
import AudioToneGenerator from '../components/AudioToneGenerator';
import HeadphonesAlert from '../components/HeadphonesAlert';
import { useHeadphonesDetection } from '../hooks/useHeadphonesDetection';

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000];
const INTENSITIES = Array.from({ length: 21 }, (_, i) => i * 5);

const TEST_SEQUENCE = [
  ...FREQUENCIES.map(freq => ({ frequency: freq, ear: 'left' })),
  ...FREQUENCIES.map(freq => ({ frequency: freq, ear: 'right' })),
];

export default function QuickTestScreen({ onBack }) {
  const [audioReady, setAudioReady] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [currentIntensityIndex, setCurrentIntensityIndex] = useState(0);
  const [testResults, setTestResults] = useState({});
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [showHeadphonesAlert, setShowHeadphonesAlert] = useState(false);

  // Hook za detekciju slušalica - monitoring aktivan samo tokom testa
  const { 
    audioRoute, 
    headphonesConnected, 
    canStartTest, 
    isMonitoring,
    recheckHeadphones 
  } = useHeadphonesDetection(testStarted);

  // Automatska pauza testa ako se slušalice isključe tokom testa
  useEffect(() => {
    if (testStarted && !headphonesConnected) {
      handleTestInterruption();
    }
  }, [testStarted, headphonesConnected]);

  const handleTestInterruption = () => {
    setIsPlayingTone(false);
    setTestStarted(false);
    setShowHeadphonesAlert(true);
    
    Alert.alert(
      '⚠️ Test prekinut',
      'Slušalice su iskopčane tokom testa. Test je automatski pauziran.\n\nPovežite slušalice da nastavite.',
      [
        { 
          text: 'Proveri ponovo', 
          onPress: async () => {
            await recheckHeadphones();
            setShowHeadphonesAlert(false);
          }
        },
        { 
          text: 'Odustani od testa', 
          style: 'cancel',
          onPress: onBack
        },
      ]
    );
  };

  const startTest = () => {
    if (!headphonesConnected) {
      setShowHeadphonesAlert(true);
      return;
    }

    if (!audioReady) {
      Alert.alert(
        'Audio nije spreman',
        'Molimo sačekajte da se audio sistem inicijalizuje.',
        [{ text: 'U redu' }]
      );
      return;
    }

    Alert.alert(
      'Instrukcije za test',
      'Tokom testa ćete čuti tonove različitih frekvencija.\n\n' +
      '📍 Testiraćemo prvo levo, pa desno uvo\n' +
      '📍 Pritisnite "ČUO SAM" čim čujete ton\n' +
      '📍 Pritisnite "NISAM ČUO" ako ton nije čujan\n\n' +
      'Nađite tiho mesto pre početka testa.',
      [
        { text: 'Otkaži', style: 'cancel' },
        { text: 'Započni test', onPress: beginTest },
      ]
    );
  };

  const beginTest = () => {
    setTestStarted(true);
    setCurrentTestIndex(0);
    setCurrentIntensityIndex(0);
    setTimeout(() => setIsPlayingTone(true), 1000);
  };

  const handleHeardTone = () => {
    const currentTest = getCurrentTest();
    const currentIntensity = getCurrentIntensity();

    setIsPlayingTone(false);

    const resultKey = `${currentTest.frequency}Hz_${currentTest.ear}`;
    setTestResults((prev) => ({
      ...prev,
      [resultKey]: currentIntensity,
    }));

    if (currentTestIndex < TEST_SEQUENCE.length - 1) {
      setTimeout(() => {
        setCurrentTestIndex(prev => prev + 1);
        setCurrentIntensityIndex(0);
        setTimeout(() => setIsPlayingTone(true), 1000);
      }, 500);
    } else {
      finishTest();
    }
  };

  const handleDidNotHear = () => {
    if (currentIntensityIndex < INTENSITIES.length - 1) {
      setIsPlayingTone(false);
      setTimeout(() => {
        setCurrentIntensityIndex(prev => prev + 1);
        setTimeout(() => setIsPlayingTone(true), 500);
      }, 300);
    } else {
      const currentTest = getCurrentTest();
      const resultKey = `${currentTest.frequency}Hz_${currentTest.ear}`;
      
      setTestResults((prev) => ({
        ...prev,
        [resultKey]: '>100',
      }));
      
      if (currentTestIndex < TEST_SEQUENCE.length - 1) {
        setIsPlayingTone(false);
        setTimeout(() => {
          setCurrentTestIndex(prev => prev + 1);
          setCurrentIntensityIndex(0);
          setTimeout(() => setIsPlayingTone(true), 1000);
        }, 500);
      } else {
        finishTest();
      }
    }
  };

  const finishTest = () => {
    setIsPlayingTone(false);
    setTestStarted(false);

    Alert.alert(
      'Test završen! 🎉',
      'Vaši rezultati su sačuvani.\n\nŽelite li da vidite rezultate?',
      [
        { text: 'Ne, hvala', onPress: onBack },
        { 
          text: 'Prikaži rezultate', 
          onPress: showResultsSummary
        },
      ]
    );
  };

  const showResultsSummary = () => {
    const resultsText = Object.entries(testResults)
      .map(([key, intensity]) => `${key}: ${intensity}dB`)
      .join('\n');
    
    Alert.alert(
      'Rezultati testa',
      resultsText || 'Nema rezultata',
      [{ text: 'U redu', onPress: onBack }]
    );
  };

  const getCurrentTest = () => TEST_SEQUENCE[currentTestIndex];
  const getCurrentIntensity = () => INTENSITIES[currentIntensityIndex];

  const handleBackPress = () => {
    if (testStarted) {
      Alert.alert(
        'Napusti test?',
        'Da li ste sigurni da želite da napustite test?',
        [
          { text: 'Ne', style: 'cancel' },
          { 
            text: 'Da', 
            onPress: () => {
              setIsPlayingTone(false);
              setTestStarted(false);
              onBack();
            }
          }
        ]
      );
    } else {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 1)', '#101047', 'rgba(70, 130, 180, 1)']}
        style={styles.gradient}
      >
        <AudioToneGenerator
          frequency={testStarted ? getCurrentTest().frequency : 1000}
          volumeDb={testStarted ? getCurrentIntensity() : 0}
          ear={testStarted ? getCurrentTest().ear : 'both'}
          isPlaying={testStarted && isPlayingTone}
          onReady={() => setAudioReady(true)}
          onError={(error) => console.error('Audio error:', error)}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quick Hearing Test</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Audio Route Indicator - prikazuje se samo kada test nije aktivan */}
        {!testStarted && (
          <AudioRouteIndicator 
            audioRoute={audioRoute} 
            isMonitoring={isMonitoring}
          />
        )}

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {!testStarted ? (
            <View style={styles.pretestContainer}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={headphonesConnected ? 'checkmark-circle' : 'alert-circle'}
                  size={80}
                  color={headphonesConnected ? '#4ade80' : '#fb923c'}
                />
              </View>

              <Text style={styles.statusTitle}>
                {headphonesConnected ? 'Slušalice povezane ✓' : 'Povežite slušalice'}
              </Text>

              <Text style={styles.statusSubtitle}>
                {headphonesConnected
                  ? audioReady 
                    ? 'Sve je spremno za početak testa'
                    : 'Inicijalizujem audio sistem...'
                  : 'Za tačne rezultate potrebne su slušalice'}
              </Text>

              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsTitle}>Instrukcije:</Text>
                <View style={styles.instructionItem}>
                  <Ionicons name="headset" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Povežite slušalice i nađite tiho mesto
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="pulse" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Test meri 7 frekvencija (125Hz - 8000Hz)
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="ear" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Testiranje oba uva odvojeno
                  </Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="hand-left" size={24} color="#4a9eff" />
                  <Text style={styles.instructionText}>
                    Pritisnite "ČUO SAM" čim čujete ton
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.startButton,
                  (!canStartTest || !audioReady) && styles.disabledButton,
                ]}
                onPress={startTest}
                disabled={!canStartTest || !audioReady}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    canStartTest && audioReady
                      ? ['#4a9eff', '#3d85e6']
                      : ['#64748b', '#475569']
                  }
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {!canStartTest ? '🔒 Potrebne slušalice' : audioReady ? 'Počni test' : 'Priprema...'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {!headphonesConnected && (
                <TouchableOpacity 
                  style={styles.recheckButton}
                  onPress={() => {
                    recheckHeadphones();
                    setShowHeadphonesAlert(true);
                  }}
                >
                  <Ionicons name="refresh" size={16} color="#4a9eff" />
                  <Text style={styles.recheckText}>Proveri ponovo</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.testContainer}>
              {/* Monitoring indicator tokom testa */}
              {isMonitoring && (
                <View style={styles.monitoringBanner}>
                  <View style={styles.pulsingDot} />
                  <Text style={styles.monitoringText}>
                    Praćenje audio izlaza aktivno
                  </Text>
                </View>
              )}

              <View style={styles.earIndicator}>
                <Ionicons 
                  name={getCurrentTest().ear === 'left' ? 'ear' : 'ear-outline'} 
                  size={32} 
                  color={getCurrentTest().ear === 'left' ? '#4a9eff' : '#64748b'} 
                />
                <Text style={styles.earText}>
                  {getCurrentTest().ear === 'left' ? 'LEVO UVO' : 'DESNO UVO'}
                </Text>
                <Ionicons 
                  name={getCurrentTest().ear === 'right' ? 'ear' : 'ear-outline'} 
                  size={32} 
                  color={getCurrentTest().ear === 'right' ? '#4a9eff' : '#64748b'} 
                />
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Test {currentTestIndex + 1} od {TEST_SEQUENCE.length}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((currentTestIndex + 1) / TEST_SEQUENCE.length) * 100}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.frequencyCard}>
                <Text style={styles.frequencyLabel}>Frekvencija</Text>
                <Text style={styles.frequencyValue}>
                  {getCurrentTest().frequency} Hz
                </Text>
                <View style={styles.divider} />
                <Text style={styles.intensityLabel}>Intenzitet</Text>
                <Text style={styles.intensityValue}>
                  {getCurrentIntensity()} dB
                </Text>
              </View>

              <View style={styles.visualIndicator}>
                {isPlayingTone && (
                  <>
                    <View style={[styles.soundWave, styles.wave1]} />
                    <View style={[styles.soundWave, styles.wave2]} />
                    <View style={[styles.soundWave, styles.wave3]} />
                  </>
                )}
                <Ionicons
                  name={isPlayingTone ? "volume-high" : "volume-mute"}
                  size={60}
                  color={isPlayingTone ? '#4a9eff' : '#64748b'}
                />
              </View>

              <Text style={styles.questionText}>Da li čujete ton?</Text>

              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.heardButton}
                  onPress={handleHeardTone}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#4ade80', '#22c55e']}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="checkmark-circle" size={32} color="#fff" />
                    <Text style={styles.controlButtonText}>ČUO SAM</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.notHeardButton}
                  onPress={handleDidNotHear}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#f87171', '#ef4444']}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="close-circle" size={32} color="#fff" />
                    <Text style={styles.controlButtonText}>NISAM ČUO</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Headphones Alert Modal */}
        <HeadphonesAlert
          visible={showHeadphonesAlert}
          audioRoute={audioRoute}
          onClose={() => setShowHeadphonesAlert(false)}
          onRetry={async () => {
            await recheckHeadphones();
            setShowHeadphonesAlert(false);
          }}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#191970' },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  content: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pretestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  iconContainer: { marginBottom: 30 },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#8696ac',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 15,
    color: '#cbd5e1',
    marginLeft: 15,
    flex: 1,
    lineHeight: 22,
  },
  startButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 15,
  },
  disabledButton: { opacity: 0.5 },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  recheckButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, 
    paddingHorizontal: 24,
    gap: 6,
  },
  recheckText: {
    color: '#4a9eff',
    fontSize: 16,
    fontWeight: '600',
  },
  testContainer: { flex: 1, paddingTop: 20 },
  monitoringBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  monitoringText: {
    fontSize: 13,
    color: '#4ade80',
    fontWeight: '600',
  },
  earIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  earText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a9eff',
    letterSpacing: 1,
  },
  progressContainer: { marginBottom: 40 },
  progressText: {
    fontSize: 16,
    color: '#8696ac',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a9eff',
    borderRadius: 4,
  },
  frequencyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  frequencyLabel: {
    fontSize: 14,
    color: '#8696ac',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  frequencyValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4a9eff',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  intensityLabel: {
    fontSize: 14,
    color: '#8696ac',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  intensityValue: { fontSize: 32, fontWeight: '600', color: '#ffffff' },
  visualIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginBottom: 20,
    position: 'relative',
  },
  soundWave: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4a9eff',
  },
  wave1: { width: 100, height: 100, opacity: 0.3 },
  wave2: { width: 130, height: 130, opacity: 0.2 },
  wave3: { width: 160, height: 160, opacity: 0.1 },
  questionText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  heardButton: { flex: 1, borderRadius: 20, overflow: 'hidden', elevation: 4 },
  notHeardButton: { flex: 1, borderRadius: 20, overflow: 'hidden', elevation: 4 },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});