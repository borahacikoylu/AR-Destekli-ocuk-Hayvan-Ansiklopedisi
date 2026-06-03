import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ANIMALS } from '../data/animals';

function AnimalCard({ animal, onPress }) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={() => onPress(animal)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { borderLeftColor: animal.color }]}
        activeOpacity={1}
      >
        <Text style={styles.cardEmoji}>{animal.emoji}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{animal.name}</Text>
          <Text style={styles.cardEnglish}>{animal.englishName}</Text>
          <Text style={styles.cardHabitat}>{animal.habitat}</Text>
        </View>
        <View style={[styles.pageBadge, { backgroundColor: animal.color }]}>
          <Text style={styles.pageBadgeText}>{animal.pageNumber}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleAnimalPress = (animal) => {
    navigation.navigate('AnimalDetail', { animal });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Başlık */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>Hayvan Ansiklopedisi</Text>
        <Text style={styles.subtitle}>AR ile keşfet</Text>
      </View>

      {/* AR Başlat Butonu */}
      <TouchableOpacity
        style={styles.arButton}
        onPress={() => navigation.navigate('Scan')}
        activeOpacity={0.85}
      >
        <Text style={styles.arButtonIcon}>📷</Text>
        <View>
          <Text style={styles.arButtonText}>AR ile Tara</Text>
          <Text style={styles.arButtonSub}>Kitabı kameraya tut</Text>
        </View>
      </TouchableOpacity>

      {/* Hayvan Listesi */}
      <Text style={styles.sectionTitle}>Hayvanlara Göz At</Text>
      <FlatList
        data={ANIMALS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimalCard animal={item} onPress={handleAnimalPress} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#e94560',
    fontWeight: '600',
    marginTop: 2,
  },
  arButton: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#0f3460',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#e94560',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  arButtonIcon: {
    fontSize: 34,
  },
  arButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  arButtonSub: {
    fontSize: 12,
    color: '#8899aa',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8899aa',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  list: {
    paddingHorizontal: 24,
    gap: 10,
  },
  card: {
    backgroundColor: '#0f3460',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    gap: 12,
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardEnglish: {
    fontSize: 13,
    color: '#8899aa',
    marginTop: 1,
  },
  cardHabitat: {
    fontSize: 12,
    color: '#8899aa',
    marginTop: 4,
  },
  pageBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
