# Design System & Visual Authority

<!-- impeccable:design-schema 1 -->

## Design Direction & Aesthetic Family

- **Aesthetic:** Warm Dark Espresso & Amber Forensics (Linear Warm Dark / JetBrains Fleet / Claude Dark aesthetic).
- **Core Philosophy:** Eye-friendly soft contrast. Zero cold neon grids, deep warm mocha/charcoal slate base (`#121110`, `#181614`), warm honey amber & terracotta highlights (`#f59e0b`, `#f97316`), soft cream typography (`#f6f3ee`, `#e6e0d6`), tactile physical micro-interactions.

## Dials Configuration

- **`DESIGN_VARIANCE: 7`** (Asimetrik editoryal perdelere bölünmüş müfredat, monospaced veri şeritleri)
- **`MOTION_INTENSITY: 4`** (Hızlı tepkisel, 150-200ms ease-out geçişler, sıfır gecikmeli klavye kısayolları)
- **`VISUAL_DENSITY: 6`** (Kompakt, geliştirici dostu yüksek bilgi yoğunluğu)

## Color Palette & Tokens (Warm Eye-Friendly)

- **Background:** `#121110` (Derin Sıcak Espresso Kömür)
- **Surface (Card):** `#181614` with warm border `#2c2823`
- **Surface Elevated:** `#221f1b` with border `#332e28`
- **Accent Primary (Warm Amber):** `#f59e0b` (Amber 500)
- **Accent Secondary (Terracotta Sunset):** `#f97316` (Orange 500)
- **Text Primary (Warm Cream):** `#f6f3ee`
- **Text Muted:** `#a8a196` / `#736c61`
- **Success:** `#10b981` (Emerald 500)
- **Error / Danger:** `#f43f5e` (Rose 500)

## Typography

- **Display & Headlines:** System Sans / Geist (`font-extrabold`, `tracking-tight`)
- **Code & Data Tables:** `JetBrains Mono`, `Fira Code`, `Menlo`, `monospace`
- **Body & Story:** System Sans (`text-xs md:text-sm`, `text-[#c8c1b5]`, `leading-relaxed`)

## Surface Modes

- **`/` (Home):** Mode `Persuade` / `Operate` — Sıcak Hero değer önerisi, dedektif metrik şeridi, 4 perdelik görev haritası.
- **`/play/[challengeId]`:** Mode `Operate` — Sıcak Monaco Editör, Tablo Gezgini, ER Şeması, Sonuç Izgarası, Teori Çekmecesi.
- **`/academy`:** Mode `Read` — 15 bölümlük rehber, zihinsel model kartları, canlı çalışan PostgreSQL kutuları.
- **`/leaderboard`:** Mode `Operate` — Rütbe basamakları, günün soruşturması, küresel sıralama.
- **`/skill-tree`:** Mode `Experience` — Görsel kilitli/açık yetenek ağacı düğümleri.

## Tactile Micro-Interactions (Emil Kowalski Rules)

- **Button Press:** `btn-glow-warm`, `active:scale-[0.98]` dokunsal geri bildirim.
- **Execution Shortcuts:** `⌘+Enter` anında çalıştırır.
- **Modals & Drawers:** `ease-out` ve yumuşak yay fiziği.
