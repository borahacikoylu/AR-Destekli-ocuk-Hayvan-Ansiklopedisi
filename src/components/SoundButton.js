import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';

export default function SoundButton({ soundFile, size = 60, style }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const soundRef = React.useRef(null);

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const playSound = useCallback(async () => {
    if (isLoading) return;

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      if (isPlaying) {
        setIsPlaying(false);
        return;
      }

      setIsLoading(true);
      pulse();

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.loadAsync(soundFile);
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });

      setIsLoading(false);
      setIsPlaying(true);
      await sound.playAsync();
    } catch (error) {
      console.warn('Ses çalınamadı:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [isPlaying, isLoading, soundFile]);

  React.useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={playSound}
        style={[
          styles.button,
          { width: size, height: size, borderRadius: size / 2 },
          isPlaying && styles.playing,
        ]}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Animated.Text style={styles.icon}>
            {isPlaying ? '⏹' : '🔊'}
          </Animated.Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  playing: {
    backgroundColor: '#c0392b',
  },
  icon: {
    fontSize: 22,
  },
});
