import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HearingAnimation from '../components/HearingAnimation';

const HomeScreen = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'MarcellusSC': require('../assets/fonts/MarcellusSC-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <LinearGradient
        colors={['rgba(15, 23, 42, 1)', '#101047', 'rgba(70, 130, 180, 1)']}
        style={styles.gradient}
      >
    
    <View style={styles.container}> 
      <HearingAnimation style={styles.image}/>
      <Text style={styles.title}>Welcome to the Hearing Test App</Text>
      <Text style={styles.subtitle}>Check your hearing quickly and easily</Text> 
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/tests')}
        >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
    /*</ImageBackground>*/
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  title: {
    fontFamily: 'MarcellusSC',
    fontSize: 22,
    textAlign: 'center',
    width: 350,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'MarcellusSC',
    color: '#fff',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
  width: 202,
  height: 200,
  marginBottom: 14,
 
},
  button: {
    backgroundColor: 'rgba(15, 23, 42, 1)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;