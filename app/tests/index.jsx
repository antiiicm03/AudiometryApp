import HearingScreen from '@/screens/HearingScreen';
import MainScreen from '@/screens/MainScreen';
import QuickTestScreen from '@/screens/QuickTestScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState('hearing');
  const [showQuickTest, setShowQuickTest] = useState(false);

  const renderScreen = () => {
    // Ako je QuickTest otvoren, prikaži ga preko svih tabova
    if (showQuickTest) {
      return <QuickTestScreen onBack={() => setShowQuickTest(false)} />;
    }

    // Inače prikaži normalne tab screens
    switch (activeTab) {
      case 'hearing':
        return (
          <HearingScreen 
            onTabChange={setActiveTab}
            onNavigateToTest={() => setShowQuickTest(true)}
          />
        );
      case 'results':
        return <MainScreen onTabChange={setActiveTab} />;
      case 'settings':
        return <SettingsScreen onTabChange={setActiveTab} />;
      default:
        return (
          <HearingScreen 
            onTabChange={setActiveTab}
            onNavigateToTest={() => setShowQuickTest(true)}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#0a1628',
    padding: 0,
    margin: 0,
  },
});