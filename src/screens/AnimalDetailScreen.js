import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SoundButton from '../components/SoundButton';

export default function AnimalDetailScreen({ route, navigation }) {
  const { animal } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Üst Kısım */}
      <View style={[styles.hero, { backgroundColor: animal.color + '22', paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.heroEmoji}>{animal.emoji}</Text>
        <Text style={styles.heroName}>{animal.name}</Text>
        <Text style={styles.heroEnglish}>{animal.englishName}</Text>

        <View style={styles.soundRow}>
          <SoundButton soundFile={animal.sound} size={56} />
          <Text style={styles.soundHint}>Sesini dinle</Text>
        </View>
      </View>

      {/* Bilgi Kısmı */}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Text style={styles.description}>{animal.description}</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatBox label="Yaşam Alanı" value={animal.habitat} icon="🌍" />
          <StatBox label="Beslenme" value={animal.diet} icon="🍽️" />
          <StatBox label="Kitap Sayfası" value={`Sayfa ${animal.pageNumber}`} icon="📖" />
        </View>

        {/* AR ipucu */}
        <TouchableOpacity
          style={[styles.arHint, { borderColor: animal.color }]}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.arHintIcon}>📷</Text>
          <View>
            <Text style={styles.arHintTitle}>AR ile Gör!</Text>
            <Text style={styles.arHintSub}>
              Kitabın {animal.pageNumber}. sayfasını kameraya tut
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  backIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  heroEmoji: {
    fontSize: 72,
    marginTop: 8,
  },
  heroName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  heroEnglish: {
    fontSize: 15,
    color: '#8899aa',
    marginTop: 2,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  soundHint: {
    color: '#aabbcc',
    fontSize: 14,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#0f3460',
    borderRadius: 16,
    padding: 18,
  },
  description: {
    fontSize: 15,
    color: '#ccd8e4',
    lineHeight: 23,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#8899aa',
    textAlign: 'center',
  },
  arHint: {
    backgroundColor: '#0f3460',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
  },
  arHintIcon: {
    fontSize: 30,
  },
  arHintTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  arHintSub: {
    fontSize: 12,
    color: '#8899aa',
    marginTop: 2,
  },
});
