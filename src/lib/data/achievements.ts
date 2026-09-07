import { Achievement } from "@/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_query",
    title: "İlk Adım",
    description: "İlk SQL görevini başarıyla tamamla.",
    icon: "Footprints",
    category: "special",
    condition: (state) => Object.keys(state.completedChallenges || {}).length >= 1,
  },
  {
    id: "select_rookie",
    title: "SELECT Rookie",
    description: "World 1'deki tüm SELECT görevlerini çöz.",
    icon: "Compass",
    category: "mastery",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return ["w1-c1", "w1-c2", "w1-c3", "w1-c4"].every((id) => solved[id]);
    },
  },
  {
    id: "where_warrior",
    title: "WHERE Warrior",
    description: "World 2'deki tüm filtreleme görevlerini tamamla.",
    icon: "ShieldAlert",
    category: "mastery",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return ["w2-c1", "w2-c2", "w2-c3", "w2-c4", "w2-c5", "w2-c6"].every((id) => solved[id]);
    },
  },
  {
    id: "join_master",
    title: "JOIN Master",
    description: "Tabloları ustalıkla birleştir, JOIN Krallığı görevlerini çöz.",
    icon: "GitFork",
    category: "mastery",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return ["w7-c1", "w7-c2", "w7-c3"].every((id) => solved[id]);
    },
  },
  {
    id: "zero_hint_hero",
    title: "Zero Hint Hero",
    description: "Hiç ipucu kullanmadan 5 farklı görevi çöz.",
    icon: "Brain",
    category: "special",
    condition: (state) => {
      const solved = Object.values(state.completedChallenges || {});
      return solved.filter((c: any) => c.hintsUsed === 0 && !c.viewedSolution).length >= 5;
    },
  },
  {
    id: "streak_3",
    title: "Dedektif Rutini",
    description: "3 günlük kesintisiz çalışma serisine (Streak) ulaş.",
    icon: "Flame",
    category: "streak",
    condition: (state) => (state.currentStreak || 0) >= 3 || (state.longestStreak || 0) >= 3,
  },
  {
    id: "streak_7",
    title: "Haftalık Seri Ustası",
    description: "7 günlük alevli streak serisine ulaş.",
    icon: "Zap",
    category: "streak",
    condition: (state) => (state.currentStreak || 0) >= 7 || (state.longestStreak || 0) >= 7,
  },
  {
    id: "boss_slayer",
    title: "Boss Slayer",
    description: "En az bir büyük Boss Fight soruşturmasını başarıyla çöz.",
    icon: "Crown",
    category: "special",
    condition: (state) => {
      const solved = state.completedChallenges || {};
      return Boolean(solved["w15-c1"] || solved["w15-c2"]);
    },
  },
  {
    id: "xp_1000",
    title: "Binlik Kulüp",
    description: "Toplam 1.000 XP kazan.",
    icon: "Award",
    category: "xp",
    condition: (state) => (state.xp || 0) >= 1000,
  },
];
