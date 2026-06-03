import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { ViroARSceneNavigator } from '@viro-community/react-viro';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ARAnimalScene, { pauseScanning, resumeScanning } from '../components/ARAnimalScene';
import SoundButton from '../components/SoundButton';


export default function ScanScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [detectedAnimal, setDetectedAnimal] = useState(null);
  const cardAnim = useRef(new Animated.Value(0)).current;

  const handleAnimalFound = useCallback((animal) => {
    pauseScanning(); // artık yeni sayfa taranmasın
    setDetectedAnimal(animal);
    cardAnim.setValue(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }, [cardAnim]);

  const handleAnimalLost = useCallback(() => {
    // tarama duraklatıldığında bu callback zaten ARAnimalScene'den gelmiyor
    // ama gelirse popup'ı kaldır
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setDetectedAnimal(null));
  }, [cardAnim]);

  const handleNewScan = useCallback(() => {
    // Önce kartı animasyonla kapat, sonra state'i temizle
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setDetectedAnimal(null);
      resumeScanning();
    });
  }, [cardAnim]);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{ scene: ARAnimalScene }}
        viroAppProps={{ onAnimalFound: handleAnimalFound, onAnimalLost: handleAnimalLost }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {!detectedAnimal && (
        <View style={styles.hintContainer}>
          <View style={styles.hintBox}>
            <Text style={styles.hintIcon}>📖</Text>
            <Text style={styles.hintText}>Kitabın bir sayfasını kameraya tut</Text>
          </View>
        </View>
      )}

      {detectedAnimal && (
        <Animated.View
          style={[
            styles.animalCard,
            {
              bottom: insets.bottom + 24,
              opacity: cardAnim,
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.cardAccent, { backgroundColor: detectedAnimal.color }]} />
          <View style={styles.cardContent}>
            <Text style={styles.cardEmoji}>{detectedAnimal.emoji}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardName}>{detectedAnimal.name}</Text>
              <Text style={styles.cardSub}>{detectedAnimal.habitat}</Text>
              <Text style={styles.cardSub}>{detectedAnimal.diet}</Text>
            </View>
            <SoundButton soundFile={detectedAnimal.sound} size={54} />
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {detectedAnimal.description}
          </Text>

          <TouchableOpacity style={styles.newScanButton} onPress={handleNewScan}>
            <Text style={styles.newScanIcon}>📷</Text>
            <Text style={styles.newScanText}>Yeni Hayvan Tara</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { color: '#fff', fontSize: 20, fontWeight: '600' },
  hintContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  hintIcon: { fontSize: 22 },
  hintText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  animalCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#0f3460',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  cardAccent: { height: 4 },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  cardEmoji: { fontSize: 42 },
  cardText: { flex: 1 },
  cardName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  cardSub: { fontSize: 12, color: '#8899aa', marginTop: 2 },
  cardDescription: {
    fontSize: 13,
    color: '#aabbcc',
    paddingHorizontal: 16,
    paddingBottom: 12,
    lineHeight: 19,
  },
  newScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#e94560',
  },
  newScanIcon: { fontSize: 18 },
  newScanText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
