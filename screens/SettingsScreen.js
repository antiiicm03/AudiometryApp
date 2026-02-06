import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function SettingsScreen({ onTabChange }) {
  const SettingItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={24} color="#4a9eff" />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8696ac" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 1)', '#101047', 'rgba(70, 130, 180, 1)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize Your Experience</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AUDIO SETTINGS</Text>
            <View style={styles.card}>
              <SettingItem
                icon="volume-high"
                title="Volume Calibration"
                subtitle="Adjust test volume levels"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="headset"
                title="Audio Output"
                subtitle="Select headphones or speakers"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="musical-notes"
                title="Test Tone Type"
                subtitle="Pure tone or warble"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TEST PREFERENCES</Text>
            <View style={styles.card}>
              <SettingItem
                icon="time"
                title="Test Duration"
                subtitle="Quick: 5 min, Extended: 15 min"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="notifications"
                title="Test Reminders"
                subtitle="Weekly hearing check notifications"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GENERAL</Text>
            <View style={styles.card}>
              <SettingItem
                icon="language"
                title="Language"
                subtitle="English"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="document-text"
                title="Privacy Policy"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="information-circle"
                title="About"
                subtitle="Version 1.0.0"
              />
            </View>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>

        <BottomNavigation activeTab="settings" onTabChange={onTabChange} />
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
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8696ac',
    letterSpacing: 1.2,
    marginBottom: 12,
    paddingLeft: 5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 158, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#8696ac',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginLeft: 73,
  },
});