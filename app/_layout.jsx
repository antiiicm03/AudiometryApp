import { Stack } from "expo-router";
import { Image, StyleSheet } from "react-native";

const RootLayout = () => {
  return <Stack
  screenOptions={{
          headerStyle: {
            backgroundColor: 'rgba(15, 23, 42, 1)',
          },
          headerTintColor: '#fff',
            headerTitle: () => (
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        ),
      }}
    >
          <Stack.Screen name='index' options={{ title: 'Welcome' }} />
          <Stack.Screen name='tests' options={{ headerTitle: 'Tests' }} />
        </Stack>
};

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 40,
  },
})

export default RootLayout;



