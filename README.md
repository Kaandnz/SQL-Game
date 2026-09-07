# 🕵️‍♂️ SQL Quest: Data Detective
### *İnteraktif SQL Öğrenme & Adli Bilişim Oyunu*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_WASM-336791?style=for-the-badge&logo=postgresql)](https://github.com/electric-sql/pglite)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting_%26_Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

> **SQL'i ezberleme, dedektif gibi sorgula.**  
> Gerçek şirket veri setleri ve adli soruşturmalar üzerinde `SELECT`'ten `Window Functions` ve `Recursive CTE`'lere kadar sorgular yazarak veritabanı uzmanı olun.

🌐 **Canlı Demo:** [https://learn-sql-game.web.app](https://learn-sql-game.web.app)

---

## 🌟 Öne Çıkan Özellikler

- ⚡ **Tarayıcı İçi Gerçek PostgreSQL (WebAssembly):**  
  Herhangi bir uzak sunucuya bağlanmadan, `@electric-sql/pglite` ile doğrudan kullanıcının tarayıcısında çalışan gerçek bir PostgreSQL 16 motoru. Sıfır sunucu maliyeti, sıfır gecikme (0ms latency), %100 gizlilik.
- 🔍 **15 Dünyalık Adli Soruşturma Müfredatı:**  
  FinTech şüpheli para transferleri, e-ticaret kargo krizleri, siber saldırı log analizleri gibi gerçekçi senaryolarla zenginleştirilmiş dedektiflik görevleri.
- 🎓 **SQL Akademisi:**  
  Temel sorgulardan başlayıp ileri seviye analitik fonksiyonlara uzanan interaktif dersler ve anlık çalışan kodlama alanları.
- 🔐 **Firebase Auth & Bulut Senkronizasyonu:**  
  Google ile tek tıkla giriş yapabilme, misafir modunda başlayan ilerlemeyi kaybetmeden hesaba aktarabilme ve cihazlar arası otomatik senkronizasyon.
- 💻 **Monaco Code Editor:**  
  VS Code kalitesinde SQL sözdizimi renklendirmesi (syntax highlighting), otomatik tamamlama ve formatlama.
- 🏆 **Gelişmiş Oyunlaştırma:**  
  XP puanları, dedektif seviyeleri, günlük çalışma serisi (streak), kilitlenebilir başarımlar ve liderlik tablosu.
- 🎨 **7 Özel Tema:**  
  Sıcak Kehribar, Siber Zümrüt, Geceyarısı Mavisi, Minimalist Kağıt dahil hem Koyu (Dark) hem Açık (Light) tema desteği.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Statik HTML Export (`output: "export"`) mimarisi |
| **Dil** | TypeScript | Tip güvenli kod tabanı |
| **SQL Motoru** | PGlite (ElectricSQL) | Tarayıcıda koşan WebAssembly PostgreSQL 16 |
| **Kod Editörü** | Monaco Editor | VS Code tarayıcı editör çekirdeği |
| **Stil** | Tailwind CSS | Özel CSS değişkenleri ve karanlık tema mimarisi |
| **State** | Zustand | Çift korumalı yerel hafıza ve bulut veri senkronizasyonu |
| **Kimlik & Bulut**| Firebase Auth & Firestore | Google ile tek tıkla oturum açma ve bulut yedekleme |
| **Hosting** | Firebase Hosting CDN | Yüksek hızlı küresel CDN dağıtımı |

---

## 🚀 Hızlı Başlangıç (Yerel Geliştirme)

Projeyi kendi bilgisayarınızda çalıştırmak için:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/Kaandnz/SQL-Game.git
cd SQL-Game
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın (Opsiyonel - Firebase için)
`.env.example` dosyasını `.env.local` olarak kopyalayın ve Firebase anahtarlarınızı girin:
```bash
cp .env.example .env.local
```

### 4. Geliştirici Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak oynamaya başlayabilirsiniz!

---

## 📦 Dağıtım (Firebase Hosting Deploy)

Projeyi Firebase Hosting'e tek komutla derleyip yüklemek için:

```bash
npm run build
npx firebase-tools deploy --only hosting
```
*(Veya otomatik sihirbaz betiğini çalıştırabilirsiniz: `bash deploy.sh`)*

---

## 📄 Lisans

Bu proje MIT lisansı altında geliştirilmiştir. Dilediğiniz gibi geliştirebilir, fork'layabilir ve katkıda bulunabilirsiniz.
