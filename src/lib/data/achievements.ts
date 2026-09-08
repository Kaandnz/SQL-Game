import { Achievement } from "@/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_query",
    title: "İlk Doğrulama",
    description: "İlk SQL sorgu görevini başarıyla derleyip doğrula.",
    icon: "Footprints",
    category: "special",
    condition: (state) => Object.keys(state.completedChallenges || {}).length >= 1,
  },
  {
    id: "select_rookie",
    title: "Projeksiyon Yetkinliği",
    description: "World 1'deki tüm temel sorgulama ve projeksiyon görevlerini tamamla.",
    icon: "Compass",
    category: "mastery",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return ["w1-c1", "w1-c2", "w1-c3", "w1-c4"].every((id) => solved[id]);
    },
  },
  {
    id: "where_warrior",
    title: "Koşullu Filtreleme Uzmanı",
    description: "World 2'deki tüm mantıksal filtreleme ve karşılaştırma görevlerini tamamla.",
    icon: "ShieldAlert",
    category: "mastery",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return ["w2-c1", "w2-c2", "w2-c3", "w2-c4", "w2-c5", "w2-c6"].every((id) => solved[id]);
    },
  },
  {
    id: "join_master",
    title: "İlişkisel Veri Bütünlüğü",
    description: "Çoklu tablo birleştirmelerini (INNER, LEFT ve zincirleme JOIN) başarıyla kurgula.",
    icon: "GitFork",
    category: "mastery",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return ["w7-c1", "w7-c2", "w7-c3"].every((id) => solved[id]);
    },
  },
  {
    id: "zero_hint_hero",
    title: "Bağımsız Analist",
    description: "Hiçbir ipucu desteği almadan 5 farklı analitik görevi tek seferde çöz.",
    icon: "Brain",
    category: "special",
    condition: (state) => {
      const solved = Object.values(state.completedChallenges || {});
      return solved.filter((c: any) => c.hintsUsed === 0 && !c.viewedSolution).length >= 5;
    },
  },
  {
    id: "streak_3",
    title: "Çalışma Disiplini",
    description: "3 günlük kesintisiz öğrenme serisine (Streak) ulaş.",
    icon: "Flame",
    category: "streak",
    condition: (state) => (state.currentStreak || 0) >= 3 || (state.longestStreak || 0) >= 3,
  },
  {
    id: "streak_7",
    title: "Haftalık İstikrar",
    description: "7 günlük kesintisiz aktif çalışma serisine ulaş.",
    icon: "Zap",
    category: "streak",
    condition: (state) => (state.currentStreak || 0) >= 7 || (state.longestStreak || 0) >= 7,
  },
  {
    id: "boss_slayer",
    title: "Adli Bilişim Denetçisi",
    description: "Büyük adli soruşturma vakalarından (World 15) en az birini başarıyla tamamla.",
    icon: "Crown",
    category: "special",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return Boolean(solved["w15-c1"] || solved["w15-c2"]);
    },
  },
  {
    id: "xp_1000",
    title: "Kıdemli Seviye",
    description: "Toplam 1.000 XP analitik deneyim puanına ulaş.",
    icon: "Award",
    category: "xp",
    condition: (state) => (state.xp || 0) >= 1000,
  },
];
