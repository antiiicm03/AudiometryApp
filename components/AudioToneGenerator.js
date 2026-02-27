import { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';

const AudioToneGenerator = ({
  frequency,      
  volumeDb,       
  ear,            
  isPlaying,
  onReady,        
  onError,        
}) => {
  const webViewRef = useRef(null);

  useEffect(() => {
    if (!webViewRef.current) return;
    
    const message = {
      type: isPlaying ? 'play' : 'stop',
      frequency,
      volume: Math.pow(10, volumeDb / 20), 
      ear,
    };
    
    webViewRef.current.postMessage(JSON.stringify(message));
  }, [frequency, volumeDb, ear, isPlaying]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <script>
          let audioContext;
          let oscillator;
          let gainNode;
          let panner;
          let initialized = false;

          function initAudio() {
            if (initialized) return;
            
            try {
              audioContext = new (window.AudioContext || window.webkitAudioContext)();
              gainNode = audioContext.createGain();
              panner = audioContext.createStereoPanner();
              
              panner.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              initialized = true;
              
              // Notify React Native that audio is ready
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'ready',
                sampleRate: audioContext.sampleRate 
              }));
            } catch (error) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'error', 
                message: error.message 
              }));
            }
          }

          function playTone(freq, gain, ear) {
            try {
              initAudio();
              
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }

              stopTone();

              oscillator = audioContext.createOscillator();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

              // Ear balance: -1 = left, 0 = both, 1 = right
              if (ear === 'left') {
                panner.pan.value = -1;
              } else if (ear === 'right') {
                panner.pan.value = 1;
              } else {
                panner.pan.value = 0;
              }

              // Smooth fade in (prevents clicking/popping)
              gainNode.gain.cancelScheduledValues(audioContext.currentTime);
              gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              gainNode.gain.linearRampToValueAtTime(
                gain,
                audioContext.currentTime + 0.02 // 20ms fade in
              );

              oscillator.connect(panner);
              oscillator.start();

              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'playing',
                frequency: freq,
                volume: gain,
                ear: ear
              }));
            } catch (error) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'error', 
                message: error.message 
              }));
            }
          }

          function stopTone() {
            if (!oscillator) return;

            try {
              const now = audioContext.currentTime;
              
              // Smooth fade out (prevents clicking/popping)
              gainNode.gain.cancelScheduledValues(now);
              gainNode.gain.linearRampToValueAtTime(0, now + 0.02); // 20ms fade out

              setTimeout(() => {
                if (oscillator) {
                  oscillator.stop();
                  oscillator.disconnect();
                  oscillator = null;
                }
              }, 30);

              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'stopped' 
              }));
            } catch (error) {
              console.error('Error stopping tone:', error);
            }
          }

          function handleMessage(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'play') {
                playTone(data.frequency, data.volume, data.ear);
              } else if (data.type === 'stop') {
                stopTone();
              }
            } catch (error) {
              console.error('Error handling message:', error);
            }
          }

          // Listen for messages from React Native
          document.addEventListener('message', handleMessage);
          window.addEventListener('message', handleMessage);

          // Initialize on load
          document.addEventListener('DOMContentLoaded', initAudio);
          initAudio();
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'ready' && onReady) {
        onReady(data);
      } else if (data.type === 'error' && onError) {
        onError(data.message);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
      if (onError) onError(error.message);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ html: htmlContent }}
      style={{ width: 0, height: 0, opacity: 0 }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback={true}
      originWhitelist={['*']}
    />
  );
};

export default AudioToneGenerator;