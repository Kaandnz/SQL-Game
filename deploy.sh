#!/usr/bin/env bash

# ==============================================================================
# SQL Quest: Tek Tikla Otomatik Firebase Deploy Betigi
# ==============================================================================

set -e

# Terminal Renkleri
CYAN="\033[0;36m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BOLD="\033[1m"
NC="\033[0m"

echo ""
echo -e "${CYAN}${BOLD}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║       🚀 SQL QUEST - OTOMATİK FIREBASE DEPLOY         ║${NC}"
echo -e "${CYAN}${BOLD}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Firebase CLI Giris Kontrolu
echo -e "${YELLOW}🔍 1/4: Firebase yetkilendirmesi kontrol ediliyor...${NC}"
if ! npx --no-install firebase-tools login:list 2>/dev/null | grep -q "@"; then
  echo -e "${CYAN}🔑 Firebase hesabınıza henüz giriş yapılmamış.${NC}"
  echo -e "${CYAN}Tarayıcınız açılacak, lütfen Google hesabınızla giriş yapın...${NC}"
  npx firebase-tools login
else
  USER_EMAIL=$(npx --no-install firebase-tools login:list 2>/dev/null | grep "@" | head -n 1 | awk "{print \$NF}" | tr -d "()")
  echo -e "${GREEN}✅ Firebase oturumu açık (${USER_EMAIL:-Aktif})${NC}"
fi

# 2. Firebase Proje Eslesme Kontrolu (.firebaserc)
echo ""
echo -e "${YELLOW}📦 2/4: Firebase proje ayarları kontrol ediliyor...${NC}"
if [ ! -f ".firebaserc" ]; then
  echo -e "${CYAN}ℹ️  Bu klasör henüz bir Firebase projesine bağlanmamış.${NC}"
  echo -e "${CYAN}Lütfen açılan listeden Firebase Console\x27da açtığınız projeyi seçin:${NC}"
  npx firebase-tools use --add
else
  CURRENT_PROJECT=$(grep -o '"default": *"[^"]*"' .firebaserc | cut -d'"' -f4 || echo "")
  if [ -z "$CURRENT_PROJECT" ]; then
    echo -e "${CYAN}Lütfen Firebase projenizi seçin:${NC}"
    npx firebase-tools use --add
    CURRENT_PROJECT=$(grep -o '"default": *"[^"]*"' .firebaserc | cut -d'"' -f4 || echo "")
  else
    echo -e "${GREEN}✅ Bağlı Firebase Projesi: ${BOLD}${CURRENT_PROJECT}${NC}"
  fi
fi

# 3. Temiz Derleme (Next.js Static Export)
echo ""
echo -e "${YELLOW}⚙️  3/4: Proje derleniyor ve optimize ediliyor (Static Export)...${NC}"
rm -rf .next out
npm run build

if [ ! -d "out" ]; then
  echo -e "${RED}❌ Hata: 'out' klasörü oluşturulamadı. Derleme başarısız.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Derleme tamamlandı! WebAssembly ve 38 sayfa hazır.${NC}"

# 4. Firebase Hosting Deploy
echo ""
echo -e "${YELLOW}🌐 4/4: Dosyalar Firebase Hosting CDN sunucularına yükleniyor (${CURRENT_PROJECT})...${NC}"
npx firebase-tools deploy --project "$CURRENT_PROJECT" --only hosting

echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}🎉 TEBRİKLER! OYUNUNUZ BAŞARIYLA YAYINA ALINDI!         ${NC}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo ""
