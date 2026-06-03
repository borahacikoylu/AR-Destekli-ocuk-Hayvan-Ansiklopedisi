# AR Hayvan Ansiklopedisi — Kurulum Rehberi

## 1. Nasıl Çalışır?

Uygulama **ViroReact** ile ARKit kullanır. Her PDF sayfasının fotoğrafını "hedef görüntü" olarak tanımlar. Kamera o sayfayı gördüğünde ilgili 3D model sayfanın üstüne oturur.

```
PDF Sayfası ──► Kamera ──► ARKit Image Tracking ──► 3D Model + Ses
```

---

## 2. Sana Gerekli Dosyalar

### 2a. Hedef Görüntüler — `assets/targets/`

Her PDF sayfası için yüksek kaliteli bir fotoğraf/ekran görüntüsü.

| Dosya Adı | Hangi Sayfa |
|---|---|
| `page1_aslan.jpg` | Aslan sayfası (sayfa 1) |
| `page2_fil.jpg` | Fil sayfası (sayfa 2) |
| `page3_kaplan.jpg` | Kaplan sayfası (sayfa 3) |
| `page4_zurafa.jpg` | Zürafa sayfası (sayfa 4) |
| `page5_penguen.jpg` | Penguen sayfası (sayfa 5) |

**İpuçları:**
- En az **300x400 px** çözünürlük
- Sayfada **renkli ve belirgin** bir tasarım olsun (düz beyaz üzerine metin ise ARKit zorlanır)
- PDF'ten direkt export et ya da düz yüzeyde fotoğrafla

### 2b. 3D Modeller — `assets/models/`

GLB formatında 3D hayvan modelleri.

| Dosya Adı | Hayvan |
|---|---|
| `aslan.glb` | Aslan |
| `fil.glb` | Fil |
| `kaplan.glb` | Kaplan |
| `zurafa.glb` | Zürafa |
| `penguen.glb` | Penguen |

**Ücretsiz model kaynakları:**
- https://sketchfab.com (ücretsiz, GLB formatında indir)
- https://poly.pizza (ücretsiz game-ready modeller)
- https://kenney.nl/assets (basit, hafif modeller)

### 2c. Ses Dosyaları — `assets/sounds/`

MP3 formatında hayvan sesleri.

| Dosya Adı | Ses |
|---|---|
| `aslan.mp3` | Aslan kükremesi |
| `fil.mp3` | Fil sesi |
| `kaplan.mp3` | Kaplan sesi |
| `zurafa.mp3` | Zürafa sesi |
| `penguen.mp3` | Penguen sesi |

**Ücretsiz ses kaynakları:**
- https://freesound.org
- https://soundsnap.com

---

## 3. iOS Build (EAS Build — Önerilen)

> Docker iOS app derleyemez. EAS Build, Expo'nun cloud build servisidir ve macOS olmadan da iOS build alabilirsin.

```bash
# 1. Expo hesabına giriş yap
npx eas-cli login

# 2. EAS projesini başlat
npx eas-cli init

# 3. iOS build al (simulator için test)
npx eas-cli build --platform ios --profile development

# 4. Production build (App Store)
npx eas-cli build --platform ios --profile production
```

---

## 4. Docker ile Geliştirme Ortamı

Docker, Metro bundler'ı çalıştırır. Farklı bir bilgisayarda çalışmak için:

```bash
# İmajı oluştur ve başlat
docker compose up --build

# Durdurmak için
docker compose down
```

Container çalışırken terminalde bir QR kodu çıkar. Bu QR'ı taramak için **EAS Build ile üretilmiş** bir development build gerekir (Expo Go bu uygulamayı çalıştıramaz çünkü ViroReact native modül içeriyor).

---

## 5. Yerel Geliştirme (Docker olmadan)

```bash
# Bağımlılıkları yükle
npm install --legacy-peer-deps

# Metro başlat
npx expo start

# iOS simülatörde çalıştır (Mac gerektirir)
npx expo run:ios
```

---

## 6. Hayvan Eklemek / Değiştirmek

[src/data/animals.js](src/data/animals.js) dosyasına yeni bir nesne ekle:

```js
{
  id: 'kopek_baligi',
  name: 'Köpek Balığı',
  englishName: 'Shark',
  emoji: '🦈',
  pageNumber: 6,
  color: '#4a90d9',
  description: 'Açıklama...',
  habitat: 'Okyanuslar',
  diet: 'Etçil',
  targetName: 'kopek_baligi_sayfasi',
  targetImage: require('../../assets/targets/page6_kopek_baligi.jpg'),
  model: require('../../assets/models/kopek_baligi.glb'),
  sound: require('../../assets/sounds/kopek_baligi.mp3'),
  physicalWidth: 0.148,        // A5 = 0.148, A4 = 0.21
  modelScale: [0.08, 0.08, 0.08],
  modelPosition: [0, 0.05, 0],
  modelRotation: [-90, 0, 0],
}
```

---

## 7. Proje Yapısı

```
ar-hayvan-ansiklopedisi/
├── assets/
│   ├── targets/        ← PDF sayfası fotoğrafları (.jpg)
│   ├── models/         ← 3D modeller (.glb)
│   └── sounds/         ← Ses dosyaları (.mp3)
├── src/
│   ├── components/
│   │   ├── ARAnimalScene.js   ← ViroReact AR sahnesi
│   │   └── SoundButton.js     ← Ses butonu
│   ├── data/
│   │   └── animals.js         ← Hayvan veritabanı
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── screens/
│       ├── HomeScreen.js       ← Ana ekran
│       ├── ScanScreen.js       ← AR kamera ekranı
│       └── AnimalDetailScreen.js
├── App.js
├── Dockerfile
├── docker-compose.yml
└── eas.json
```
