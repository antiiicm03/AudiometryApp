import { NativeEventEmitter, NativeModules } from 'react-native';

const { HeadphonesDetectionModule } = NativeModules;

interface AudioRouteInfo {
  audioRoute: 'headphones' | 'bluetooth' | 'usb' | 'speaker';
  deviceType: 'wired' | 'bluetooth' | 'usb' | 'speaker';
  headphonesConnected: boolean;
  canStartTest: boolean;
  message: string;
}

interface AudioDeviceInfo {
  id: number;
  type: string;
  productName: string;
}

interface HeadphonesDetectionModuleInterface {
  ping(): Promise<string>;
  checkHeadphonesConnected(): Promise<AudioRouteInfo>;
  startMonitoring(): Promise<string>;
  stopMonitoring(): Promise<string>;
  isMonitoring(): Promise<boolean>;
  getAudioDeviceInfo(): Promise<AudioDeviceInfo[]>;
}


const eventEmitter = new NativeEventEmitter(HeadphonesDetectionModule);

export const HeadphonesDetection = HeadphonesDetectionModule as HeadphonesDetectionModuleInterface;

export const subscribeToHeadphonesChanges = (
  callback: (headphonesConnected: boolean) => void
) => {
  const subscription = eventEmitter.addListener(
    'onHeadphonesStateChanged',
    (event: { headphonesConnected: boolean }) => {
      callback(event.headphonesConnected);
    }
  );

  return () => subscription.remove();
};

export default HeadphonesDetection;