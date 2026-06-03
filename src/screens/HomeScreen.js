import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Hayvan Ansiklopedisi</Text>
          <Text style={styles.subtitle}>AR ile keşfet</Text>
        </View>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e94560',
    fontWeight: '600',
    marginTop: 6,
  },
  arButton: {
    backgroundColor: '#0f3460',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#e94560',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  arButtonIcon: {
    fontSize: 44,
  },
  arButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  arButtonSub: {
    fontSize: 13,
    color: '#8899aa',
    marginTop: 3,
  },
});
