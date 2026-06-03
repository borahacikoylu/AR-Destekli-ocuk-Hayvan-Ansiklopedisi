# ─── Geliştirme ortamı ───────────────────────────────────────────────────────
# Bu Docker imajı yalnızca Metro bundler + JS geliştirme ortamını çalıştırır.
# iOS derlemesi için EAS Build kullanılır (eas build --platform ios).
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine

# Gerekli sistem paketleri
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl

# Çalışma dizini
WORKDIR /app

# Önce bağımlılıkları kopyala (Docker cache'i verimli kullan)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Uygulama dosyalarını kopyala
COPY . .

# Expo CLI global olarak yükle
RUN npm install -g @expo/cli eas-cli

# Metro bundler portu
EXPOSE 8081
# Expo Dev Tools portu
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Başlatma komutu: --tunnel ile ağ erişimi sağla
CMD ["npx", "expo", "start", "--tunnel", "--no-dev", "--minify"]
