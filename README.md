# AR Destekli Çocuk Hayvan Ansiklopedisi

Bu proje, çocukların basılı bir hayvan kitabındaki sayfaları kamerayla tarayarak 3D hayvan modellerini artırılmış gerçeklik içinde görmesini sağlayan bir mobil uygulamadır. Uygulama Expo ve React Native üzerine kuruludur; AR görüntü takibi için `@viro-community/react-viro`, hayvan sesleri için `expo-av` kullanır.

Kamera ilgili kitap sayfasındaki marker görselini algıladığında sayfanın üzerine 3D model yerleşir, altta hayvana ait kısa bilgi kartı açılır ve kullanıcı hayvan sesini dinleyebilir.

## Öne Çıkan Özellikler

- Basılı kitap sayfalarını marker olarak tanıyan AR görüntü takibi
- Her hayvan için ayrı GLB 3D model, marker görseli ve MP3 ses dosyası
- Aslan, fil, kaplan, zürafa ve penguen için hazır içerik
- Algılanan hayvan için animasyonlu bilgi kartı
- 3D model yüklenene kadar gizleme, yüklendikten sonra hafif zıplama animasyonu
- Modeli AR sahnesinde sürükleyerek konumlandırma
- Tek taramada bir hayvana odaklanma ve "Yeni Hayvan Tara" ile sahneyi sıfırlama
- Expo/EAS tabanlı iOS build akışı
- Docker ile Metro/Expo geliştirme ortamı

## Teknoloji Yığını

| Katman | Kullanılan teknoloji |
|---|---|
| Mobil uygulama | React Native `0.73.6` |
| Expo | Expo SDK `~50.0.0` |
| AR | `@viro-community/react-viro` |
| Ses | `expo-av` |
| Navigasyon | React Navigation Native Stack |
| Animasyon | React Native Animated, Reanimated |
| 3D asset formatı | GLB / GLTF |
| Build | EAS Build, Expo native build |
| Geliştirme ortamı | Node.js, npm, Docker |

## Uygulama Akışı

```text
App.js
  -> NavigationContainer
    -> AppNavigator
      -> HomeScreen
        -> "AR ile Tara" butonu
      -> ScanScreen
        -> ViroARSceneNavigator
          -> ARAnimalScene
            -> ViroARTrackingTargets
            -> ViroARImageMarker
            -> Viro3DObject
            -> ViroText
        -> Bilgi kartı
        -> SoundButton
      -> AnimalDetailScreen
```

Mevcut ana kullanıcı akışı `HomeScreen` üzerinden `ScanScreen` ekranına gider. `AnimalDetailScreen` projede hazır bir detay ekranı olarak bulunur ve `animal` parametresi bekler; mevcut arayüzde bu ekrana doğrudan giden aktif bir buton görünmemektedir.

## Nasıl Çalışır?

Uygulamanın temel verisi [src/data/animals.js](src/data/animals.js) içindeki `ANIMALS` listesidir. Her hayvan kaydı şu bilgileri taşır:

- Hayvan adı, İngilizce adı, açıklama, yaşam alanı ve beslenme türü
- Kitap sayfa numarası
- AR marker dosyası
- 3D model dosyası
- Ses dosyası
- Marker fiziksel genişliği
- Modelin AR sahnesindeki ölçek, pozisyon ve rotasyon ayarları

AR sahnesi açıldığında [src/components/ARAnimalScene.js](src/components/ARAnimalScene.js) bu listeyi okuyarak Viro için tracking target kayıtlarını oluşturur.

```text
Kitap sayfası / marker
  -> Kamera
    -> Viro AR image tracking
      -> İlgili hayvan bulunur
        -> 3D model yüklenir
        -> Model sayfanın üzerine yerleşir
        -> Bilgi kartı ve ses butonu görünür
```

Tespit akışında kısa bir doğrulama gecikmesi vardır (`MATCH_CONFIRM_DELAY_MS = 250`). Bu gecikme, kamera görüntüsündeki anlık eşleşme dalgalanmalarını azaltmak için kullanılır. Bir hayvan algılandıktan sonra `pauseScanning()` ile yeni eşleşmeler durdurulur. Kullanıcı "Yeni Hayvan Tara" dediğinde `navigation.replace('Scan')` ile AR ekranı yeniden mount edilir ve sahne sıfırlanır.

## Desteklenen Hayvanlar

| Sayfa | Hayvan | İngilizce | Marker hedefi | 3D model | Ses |
|---:|---|---|---|---|---|
| 1 | Aslan | Lion | `aslan_sayfasi` | `assets/models/aslan.glb` | `assets/sounds/aslan.mp3` |
| 2 | Fil | Elephant | `fil_sayfasi` | `assets/models/fil.glb` | `assets/sounds/fil.mp3` |
| 3 | Kaplan | Tiger | `kaplan_sayfasi` | `assets/models/kaplan.glb` | `assets/sounds/kaplan.mp3` |
| 4 | Zürafa | Giraffe | `zurafa_sayfasi` | `assets/models/zurafa.glb` | `assets/sounds/zurafa.mp3` |
| 5 | Penguen | Penguin | `penguen_sayfasi` | `assets/models/penguen.glb` | `assets/sounds/penguen.mp3` |

Marker kırpımları `assets/targets/markers/` klasöründedir:

- `page1_aslan_marker.jpg`
- `page2_fil_marker.jpg`
- `page3_kaplan_marker.jpg`
- `page4_zurafa_marker.jpg`
- `page5_penguen_marker.jpg`

Tam sayfa hedef görselleri ise `assets/targets/` klasöründe tutulur.

## Proje Yapısı

```text
.
|-- App.js
|-- index.js
|-- app.json
|-- package.json
|-- metro.config.js
|-- eas.json
|-- Dockerfile
|-- docker-compose.yml
|-- SETUP.md
|-- assets
|   |-- icon.png
|   |-- adaptive-icon.png
|   |-- splash.png
|   |-- models
|   |   |-- aslan.glb
|   |   |-- fil.glb
|   |   |-- kaplan.glb
|   |   |-- penguen.glb
|   |   `-- zurafa.glb
|   |-- sounds
|   |   |-- aslan.mp3
|   |   |-- fil.mp3
|   |   |-- kaplan.mp3
|   |   |-- penguen.mp3
|   |   `-- zurafa.mp3
|   `-- targets
|       |-- page1_aslan.jpg
|       |-- page2_fil.jpg
|       |-- page3_kaplan.jpg
|       |-- page4_zurafa.jpg
|       |-- page5_penguen.jpg
|       `-- markers
|           |-- page1_aslan_marker.jpg
|           |-- page2_fil_marker.jpg
|           |-- page3_kaplan_marker.jpg
|           |-- page4_zurafa_marker.jpg
|           `-- page5_penguen_marker.jpg
|-- docs
|   |-- RAMS.pdf
|   |-- Requirements.pdf
|   |-- SWOT.pdf
|   |-- THS_report.pdf
|   `-- UserScenario.pdf
`-- src
    |-- components
    |   |-- ARAnimalScene.js
    |   `-- SoundButton.js
    |-- data
    |   `-- animals.js
    |-- navigation
    |   `-- AppNavigator.js
    `-- screens
        |-- AnimalDetailScreen.js
        |-- HomeScreen.js
        `-- ScanScreen.js
```

## Önemli Dosyalar

| Dosya | Görevi |
|---|---|
| [App.js](App.js) | Safe area, navigation container ve status bar kurulumunu yapar. |
| [src/navigation/AppNavigator.js](src/navigation/AppNavigator.js) | Home, Scan ve AnimalDetail ekranlarını native stack içinde tanımlar. |
| [src/screens/HomeScreen.js](src/screens/HomeScreen.js) | Ana ekranı ve AR tarama başlangıç butonunu içerir. |
| [src/screens/ScanScreen.js](src/screens/ScanScreen.js) | AR kamera ekranını, algılanan hayvan kartını ve yeni tarama akışını yönetir. |
| [src/components/ARAnimalScene.js](src/components/ARAnimalScene.js) | Viro AR tracking target'larını, marker'ları, 3D modelleri ve AR metnini yönetir. |
| [src/components/SoundButton.js](src/components/SoundButton.js) | MP3 seslerini yükler, oynatır, durdurur ve unmount sırasında temizler. |
| [src/data/animals.js](src/data/animals.js) | Hayvan veritabanı ve asset eşleşmelerini içerir. |
| [app.json](app.json) | Expo adı, paket kimlikleri, izinler, splash/icon ve plugin ayarlarını içerir. |
| [metro.config.js](metro.config.js) | GLB, GLTF ve BIN asset uzantılarını Metro'ya tanıtır. |
| [eas.json](eas.json) | Development, preview ve production build profillerini tanımlar. |
| [Dockerfile](Dockerfile) | Node tabanlı Expo/Metro geliştirme ortamını hazırlar. |
| [docker-compose.yml](docker-compose.yml) | Docker container, port ve volume ayarlarını tanımlar. |
| [SETUP.md](SETUP.md) | Kurulum, asset hazırlama ve EAS build için ek rehber içerir. |

## Kurulum

Ön gereksinimler:

- Node.js 18 veya 20
- npm
- Expo/EAS CLI kullanımı için Expo hesabı
- Kamera erişimi olan fiziksel cihaz
- ViroReact native modülü nedeniyle Expo Go yerine development/native build

Bağımlılıkları yükleyin:

```bash
npm install --legacy-peer-deps
```

Metro/Expo geliştirme sunucusunu başlatın:

```bash
npm start
```

Alternatif olarak:

```bash
npx expo start
```

## Çalıştırma Notları

Bu proje native AR modülü kullandığı için Expo Go ile doğrudan çalıştırılması beklenmez. Uygulamayı gerçek cihazda denemek için development build gerekir.

iOS için yerel çalıştırma:

```bash
npm run ios
```

Bu komut macOS ve Xcode gerektirir.

Android için yerel çalıştırma:

```bash
npm run android
```

Android tarafında da native build gerektiği için uygun Android SDK/emülatör veya fiziksel cihaz kurulumu gerekir.

## EAS Build

Expo hesabına giriş:

```bash
npx eas-cli login
```

Development build:

```bash
npx eas-cli build --platform ios --profile development
```

Preview build:

```bash
npm run build:ios:preview
```

Production build:

```bash
npm run build:ios
```

`eas.json` içinde development profili iOS simulator için, preview profili internal dağıtım için, production profili ise otomatik sürüm artırma ile yayın build'i için tanımlanmıştır.

## Docker ile Geliştirme

Docker ortamı uygulamayı native olarak derlemez; Expo/Metro geliştirme sunucusunu container içinde çalıştırır.

Başlatmak için:

```bash
docker compose up --build
```

Durdurmak için:

```bash
docker compose down
```

Container şu portları dışarı açar:

- `8081` - Metro bundler
- `19000`, `19001`, `19002` - Expo geliştirme servisleri

`Dockerfile` içindeki başlangıç komutu Expo'yu tunnel modu ile başlatır. QR kodu development build yüklü bir cihazla kullanılmalıdır.

## NPM Scriptleri

| Komut | Açıklama |
|---|---|
| `npm start` | Expo geliştirme sunucusunu başlatır. |
| `npm run ios` | iOS native build/çalıştırma akışını başlatır. |
| `npm run android` | Android native build/çalıştırma akışını başlatır. |
| `npm run build:ios` | EAS production iOS build alır. |
| `npm run build:ios:preview` | EAS preview iOS build alır. |

## Yeni Hayvan Ekleme

1. Marker kırpımını `assets/targets/markers/` altına ekleyin.
2. İsterseniz tam sayfa hedef görselini `assets/targets/` altına ekleyin.
3. GLB modelini `assets/models/` altına ekleyin.
4. MP3 ses dosyasını `assets/sounds/` altına ekleyin.
5. [src/data/animals.js](src/data/animals.js) içindeki `ANIMALS` listesine yeni kayıt girin.

Örnek kayıt:

```js
{
  id: 'kopek_baligi',
  name: 'Köpek Balığı',
  englishName: 'Shark',
  pageNumber: 6,
  color: '#4a90d9',
  description: 'Köpek balığı okyanuslarda yaşayan güçlü bir yırtıcıdır.',
  habitat: 'Okyanuslar',
  diet: 'Etçil',
  targetName: 'kopek_baligi_sayfasi',
  targetImage: require('../../assets/targets/markers/page6_kopek_baligi_marker.jpg'),
  model: require('../../assets/models/kopek_baligi.glb'),
  sound: require('../../assets/sounds/kopek_baligi.mp3'),
  physicalWidth: 0.094,
  modelScale: [0.005, 0.005, 0.005],
  modelPosition: [0, 0.02, 0],
  modelRotation: [-90, 0, 0],
}
```

Yeni model eklendikten sonra `modelScale`, `modelPosition` ve `modelRotation` değerleri cihaz üzerinde denenerek ayarlanmalıdır. Model çok büyük, çok küçük veya sayfaya ters oturuyorsa bu üç değer ilk kontrol edilecek alandır.

## Marker Hazırlama İpuçları

- Marker görseli sayfaya özel olmalıdır.
- Ortak kenarlık, şablon veya tekrar eden arka planlar mümkün olduğunca kırpım dışında kalmalıdır.
- Başlık, ana hayvan görseli ve belirgin renk/geometri içeren alanlar daha iyi takip edilir.
- Fiziksel marker genişliği değişirse `physicalWidth` değeri de güncellenmelidir.
- Düşük ışık, parlama, bulanık baskı ve düşük kontrast AR takibini zorlaştırır.

## Ses Yönetimi

[SoundButton](src/components/SoundButton.js), her tıklamada önce mevcut sesi durdurup temizler. Ardından yeni sesi `Audio.Sound.createAsync` ile yükleyip oynatır. Ekran kapanırken `stopAsync` ve `unloadAsync` çağrılarıyla kaynak temizliği yapılır. Bu yapı, hızlı ekran geçişlerinde veya yeni tarama sırasında ses kaynaklarının arkada kalmasını önlemek için kullanılır.

## AR Sahnesi Notları

- `ViroARTrackingTargets.createTargets` sadece sahne ilk kez initialize edilirken çalışır.
- Marker bulunduğunda önce pending state'e alınır, 250 ms sonra doğrulanır.
- Aynı anda yalnızca bir hayvan aktif tutulur.
- Model yüklenmeden önce ölçek `[0, 0, 0]` yapılarak görünmesi engellenir.
- Model yüklendikten sonra `bounce` animasyonu başlar.
- `onDrag` ile modelin AR sahnesindeki pozisyonu kullanıcı tarafından değiştirilebilir.
- Yeni tarama için ekran yeniden mount edilir; bu, Viro navigator ve AR anchor hafızasını temizlemek için tercih edilmiştir.

## Expo ve Native Ayarlar

[app.json](app.json) içinde:

- Uygulama adı: `AR Hayvan Ansiklopedisi`
- Slug: `ar-hayvan-ansiklopedisi`
- Tema: dark
- iOS bundle identifier: `com.borahacikoylu.arhayvanansiklopedisi2`
- Android package: `com.borahacikoylu.arhayvanansiklopedisi`
- Kamera ve mikrofon izinleri
- `@viro-community/react-viro` ve `expo-av` plugin tanımları
- `assets/**/*` asset bundle pattern tanımı

[metro.config.js](metro.config.js) içinde `glb`, `gltf` ve `bin` uzantıları asset olarak eklenmiştir. Bu ayar 3D model dosyalarının Metro tarafından paketlenebilmesi için gereklidir.

## Proje Belgeleri

`docs/` klasörü proje yönetimi ve analiz belgelerini içerir:

- `Requirements.pdf` - gereksinim belgesi
- `UserScenario.pdf` - kullanıcı senaryosu
- `SWOT.pdf` - SWOT analizi
- `RAMS.pdf` - RAMS dokümanı
- `THS_report.pdf` - teknik/hazırlık raporu

## Bilinen Durumlar ve Geliştirme Fırsatları

- Otomatik test komutu veya test dosyası bulunmamaktadır.
- `AnimalDetailScreen` hazırdır ancak mevcut ana akışta bu ekrana yönlendiren görünür bir buton yoktur.
- Projede iOS EAS build akışı daha belirgin dokümante edilmiştir; Android native çalışma için ortam kurulumu ayrıca doğrulanmalıdır.
- AR deneyimi marker kalitesine ve gerçek cihaz kamera koşullarına bağlıdır.
- Expo Go yerine development build kullanılması gerekir.

## Kısa Özet

Bu proje, basılı hayvan ansiklopedisi sayfalarını AR marker olarak kullanan, çocuklara yönelik etkileşimli bir mobil öğrenme uygulamasıdır. Kod tarafında veri modeli sade tutulmuştur: yeni hayvan eklemek için temel olarak asset dosyalarını eklemek ve `ANIMALS` listesine yeni bir kayıt girmek yeterlidir. AR tarafında ise ViroReact marker takibi, GLB model yükleme, model animasyonu ve ses çalma akışı birlikte çalışır.

Bu README mevcut kaynak kodu, asset yapısı ve proje konfigürasyonları incelenerek hazırlanmıştır.
