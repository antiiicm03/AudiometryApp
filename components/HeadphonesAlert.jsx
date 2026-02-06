// components/HeadphonesAlert.jsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HeadphonesAlert({ visible, audioRoute, onClose, onRetry }) {
  const getMessage = () => {
    switch (audioRoute) {
      case 'SPEAKER':
        return {
          title: 'Slušalice nisu povezane',
          message: 'Hearing test zahteva slušalice. Molimo povežite slušalice kako biste nastavili.',
          icon: 'headset-outline',
          iconColor: '#fb923c',
        };
      case 'UNKNOWN':
        return {
          title: 'Audio output nije detektovan',
          message: 'Nije moguće detektovati audio output. Molimo povežite slušalice i pokušajte ponovo.',
          icon: 'alert-circle-outline',
          iconColor: '#fb923c',
        };
      default:
        return {
          title: 'Slušalice povezane',
          message: 'Audio output je ispravan. Možete nastaviti sa testom.',
          icon: 'checkmark-circle',
          iconColor: '#4ade80',
        };
    }
  };

  const { title, message, icon, iconColor } = getMessage();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#1e4a7a', '#2d5a94']}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={80} color={iconColor} />
            </View>
            
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {onRetry && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={onRetry}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4a9eff', '#3d85e6']}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.retryButtonText}>Proveri ponovo</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              
              {onClose && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeButtonText}>Zatvori</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 25,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  gradient: {
    padding: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 12,
  },
  retryButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  closeButtonText: {
    color: '#8696ac',
    fontSize: 16,
    fontWeight: '600',
  },
});