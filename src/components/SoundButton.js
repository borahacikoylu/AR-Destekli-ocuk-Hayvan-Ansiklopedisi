import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const soundRef   = useRef(null);
  const mountedRef = useRef(true); // unmount sonrası state güncelleme önlemek için

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Unmount olduğunda sesi sessizce temizle — AbortError fırlatmadan
      soundRef.current?.stopAsync().catch(() => {}).finally(() => {
        soundRef.current?.unloadAsync().catch(() => {});
        soundRef.current = null;
      });
    };
  }, []);

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,   duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const playSound = useCallback(async () => {
    if (isLoading) return;

    try {
      // Önceki sesi durdur ve temizle
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      if (isPlaying) {
        if (mountedRef.current) setIsPlaying(false);
        return;
      }

      if (mountedRef.current) setIsLoading(true);
      pulse();

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(soundFile);

      // Yükleme biterken unmount olduysa temizle
      if (!mountedRef.current) {
        sound.unloadAsync().catch(() => {});
        return;
      }

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          if (mountedRef.current) setIsPlaying(false);
          sound.unloadAsync().catch(() => {});
          if (soundRef.current === sound) soundRef.current = null;
        }
      });

      if (mountedRef.current) {
        setIsLoading(false);
        setIsPlaying(true);
      }
      await sound.playAsync();
    } catch (error) {
      // AbortError ve diğer iptal hatalarını sessizce geç
      if (mountedRef.current) {
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, isLoading, soundFile]);

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
