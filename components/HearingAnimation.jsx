import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function HearingAnimation({ style }) {
  return (
    <View style={[styles.container, style]}>

      <LottieView
        source={require('../assets/animations/wave.json')}
        autoPlay
        loop
        style={styles.waves}
        colorFilters={[
    {
      keypath: '**.Stroke 1',
      color: '#FFFFFF',
    },
  ]}
      />

      <Image
        source={require('../assets/images/ear-image.png')}
        style={styles.ear}
        resizeMode="contain"
        tintColor="#FFFFFF"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waves: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: -50,
    top: 0,
  },
  ear: {
    width: '100%',
    height: '100%',
    left: 50,
  },
});
