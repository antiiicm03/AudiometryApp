import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.stackContent,
      }}
    /> 
  );
}

const styles = StyleSheet.create({
  stackContent: {
    flex: 1,
    backgroundColor: '#0a1628',
    padding: 0,
    margin: 0,
  },
});