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
import BottomNavigation from '../components/BottomNavigation';
import ExtendedTest from '../components/ExtendedTest';
import QuickTest from '../components/QuickTest';

export default function HearingScreen({ onTabChange, onNavigateToTest }) {
  const [activeTab, setActiveTab] = useState('quick');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 1)', '#101047', 'rgba(70, 130, 180, 1)']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Hearing Test</Text>
            <Text style={styles.headerSubtitle}>Test Your Hearing</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={28} color="#fff" />
            <Text style={styles.helpText}>Help Center</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'quick' && styles.activeTab]}
            onPress={() => setActiveTab('quick')}
          >
            <Ionicons
              name="flash"
              size={24}
              color={activeTab === 'quick' ? '#4a9eff' : '#8696ac'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'quick' && styles.activeTabText,
              ]}
            >
              Quick
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'extended' && styles.activeTab]}
            onPress={() => setActiveTab('extended')}
          >
            <Ionicons
              name="list"
              size={24}
              color={activeTab === 'extended' ? '#4a9eff' : '#8696ac'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'extended' && styles.activeTabText,
              ]}
            >
              Extended
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {activeTab === 'quick' ? (
            <QuickTest onStartTest={onNavigateToTest} />
          ) : (
            <ExtendedTest />
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab="hearing" onTabChange={onTabChange} />
      </LinearGradient>
    </View>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191970',
    padding: 0,
    margin: 0,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#191970)',
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
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 158, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 158, 255, 0.3)',
  },
  helpText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeTab: {
    backgroundColor: 'rgba(74, 158, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(74, 158, 255, 0.5)',
  },
  tabText: {
    color: '#8696ac',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#4a9eff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
});