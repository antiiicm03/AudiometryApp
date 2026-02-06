// hooks/useHeadphonesDetection.js
import { Audio } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';

export const useHeadphonesDetection = (monitoringEnabled = false) => {
  const [state, setState] = useState({
    audioRoute: 'UNKNOWN',
    headphonesConnected: false,
    canStartTest: false,
    isMonitoring: false,
  });

  const detectAudioRoute = useCallback(async () => {
    try {
      const output = await Audio.getCurrentOutput();
      
      if (!output) {
        return 'SPEAKER';
      }

      const outputType = output.type?.toLowerCase() || '';
      const portName = output.portName?.toLowerCase() || '';
      
      // Bluetooth detekcija
      if (
        outputType.includes('bluetooth') || 
        portName.includes('bluetooth') ||
        output.type === 'BLUETOOTH_A2DP' ||
        output.type === 'BLUETOOTH_SCO'
      ) {
        return 'BLUETOOTH';
      }
      
      // Žične slušalice detekcija
      if (
        outputType.includes('headphone') ||
        outputType.includes('wired') ||
        portName.includes('headphone') ||
        portName.includes('wired') ||
        output.type === 'HEADPHONES' ||
        output.type === 'WIRED_HEADSET'
      ) {
        return 'HEADPHONES';
      }
      
      // Speaker detekcija
      if (
        outputType.includes('speaker') ||
        portName.includes('speaker') ||
        output.type === 'SPEAKER' ||
        output.type === 'EARPIECE'
      ) {
        return 'SPEAKER';
      }

      return 'SPEAKER';
    } catch (error) {
      console.error('Error detecting audio route:', error);
      return 'UNKNOWN';
    }
  }, []);

  const updateAudioRoute = useCallback(async () => {
    const route = await detectAudioRoute();
    const headphonesConnected = route === 'HEADPHONES' || route === 'BLUETOOTH';
    
    setState(prev => ({
      ...prev,
      audioRoute: route,
      headphonesConnected,
      canStartTest: headphonesConnected,
    }));

    return route;
  }, [detectAudioRoute]);

  // Inicijalna detekcija
  useEffect(() => {
    updateAudioRoute();
  }, [updateAudioRoute]);

  // Monitoring tokom testa
  useEffect(() => {
    if (!monitoringEnabled) {
      setState(prev => ({ ...prev, isMonitoring: false }));
      return;
    }

    setState(prev => ({ ...prev, isMonitoring: true }));

    const interval = setInterval(() => {
      updateAudioRoute();
    }, 1500);

    return () => {
      clearInterval(interval);
      setState(prev => ({ ...prev, isMonitoring: false }));
    };
  }, [monitoringEnabled, updateAudioRoute]);

  return {
    audioRoute: state.audioRoute,
    headphonesConnected: state.headphonesConnected,
    canStartTest: state.canStartTest,
    isMonitoring: state.isMonitoring,
    recheckHeadphones: updateAudioRoute,
  };
};