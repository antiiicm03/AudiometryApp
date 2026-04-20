import { useCallback, useEffect, useState } from 'react';
import HeadphonesDetection, { subscribeToHeadphonesChanges } from '../components/HeadphonesDetection';

interface AudioRouteInfo {
  audioRoute: 'headphones' | 'bluetooth' | 'usb' | 'speaker';
  deviceType: 'wired' | 'bluetooth' | 'usb' | 'speaker';
  headphonesConnected: boolean;
  canStartTest: boolean;
  message: string;
}

export const useHeadphonesDetection = (shouldMonitor: boolean = false) => {
  const [audioRoute, setAudioRoute] = useState<AudioRouteInfo | null>(null);
  const [headphonesConnected, setHeadphonesConnected] = useState<boolean>(false);
  const [canStartTest, setCanStartTest] = useState<boolean>(false);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Provera trenutnog statusa slušalica
  const checkHeadphones = useCallback(async () => {
    try {
      const result = await HeadphonesDetection.checkHeadphonesConnected();
      setAudioRoute(result);
      setHeadphonesConnected(result.headphonesConnected);
      setCanStartTest(result.canStartTest);
      return result;
    } catch (error) {
      console.error('Error checking headphones:', error);
      setHeadphonesConnected(false);
      setCanStartTest(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ponovno proveravanje (za "Retry" dugme)
  const recheckHeadphones = useCallback(async () => {
    setIsLoading(true);
    return await checkHeadphones();
  }, [checkHeadphones]);

  // Inicijalna provera pri mount-u
  useEffect(() => {
    checkHeadphones();
  }, [checkHeadphones]);

  // Monitoring tokom testa
  useEffect(() => {
    if (!shouldMonitor) {
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const startMonitoring = async () => {
      try {
        await HeadphonesDetection.startMonitoring();
        const monitoring = await HeadphonesDetection.isMonitoring();
        setIsMonitoring(monitoring);

        // Subscribe na promene
        unsubscribe = subscribeToHeadphonesChanges((connected: boolean) => {
          setHeadphonesConnected(connected);
          setCanStartTest(connected);
          
          if (!connected) {
            console.warn('⚠️ Headphones disconnected during test!');
          }
        });
      } catch (error) {
        console.error('Error starting monitoring:', error);
      }
    };

    startMonitoring();

    return () => {
      // Cleanup
      HeadphonesDetection.stopMonitoring()
        .then(() => setIsMonitoring(false))
        .catch(console.error);
      
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [shouldMonitor]);

  return {
    audioRoute,
    headphonesConnected,
    canStartTest,
    isMonitoring,
    isLoading,
    checkHeadphones,
    recheckHeadphones,
  };
};