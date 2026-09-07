import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ACHIEVEMENTS } from "@/lib/data/achievements";
import { WORLDS } from "@/lib/data/worlds";
import { CHALLENGES } from "@/lib/data/challenges";
import { soundEffects } from "@/lib/audio/sound-effects";

export type AppTheme =
  | "warm-amber"
  | "cyber-emerald"
  | "midnight-cyan"
  | "sunset-rose"
  | "monochrome-slate"
  | "clean-light"
  | "warm-paper";

export const LIGHT_THEMES: AppTheme[] = ["clean-light", "warm-paper"];

export function isLightTheme(theme: AppTheme): boolean {
  return theme === "clean-light" || theme === "warm-paper";
}

export interface UserStoreState {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  completedChallenges: Record<
    string,
    {
      solvedAt: string;
      hintsUsed: number;
      viewedSolution: boolean;
      xpEarned: number;
      userSql: string;
      attempts: number;
    }
  >;
  unlockedWorlds: number[];
  unlockedAchievements: string[];
  soundEnabled: boolean;
  activeDatasetId: string;
  theme: AppTheme;

  // Actions
  recordChallengeSuccess: (
    challengeId: string,
    xpEarned: number,
    hintsUsed: number,
    viewedSolution: boolean,
    userSql: string
  ) => { newLevelUnlocked: boolean; newAchievements: string[] };
  checkAndUpdateStreak: () => void;
  toggleSound: () => boolean;
  setTheme: (theme: AppTheme) => void;
  toggleLightDarkMode: () => AppTheme;
  setActiveDatasetId: (id: string) => void;
  resetProgress: () => void;
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 250) + 1;
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: null,
      completedChallenges: {},
      unlockedWorlds: [1],
      unlockedAchievements: [],
      soundEnabled: true,
      activeDatasetId: "ecommerce",
      theme: "warm-amber",

      setTheme: (theme: AppTheme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
          if (isLightTheme(theme)) {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
          } else {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
          }
        }
      },

      toggleLightDarkMode: () => {
        const currentTheme = get().theme;
        const nextTheme: AppTheme = isLightTheme(currentTheme) ? "warm-amber" : "clean-light";
        get().setTheme(nextTheme);
        return nextTheme;
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        set({ soundEnabled: next });
        soundEffects.setEnabled(next);
        return next;
      },

      setActiveDatasetId: (id: string) => {
        set({ activeDatasetId: id });
      },

      checkAndUpdateStreak: () => {
        const state = get();
        const today = getTodayString();

        if (!state.lastActiveDate) {
          set({ lastActiveDate: today, currentStreak: 1 });
          return;
        }

        if (state.lastActiveDate === today) {
          return;
        }

        const lastDate = new Date(state.lastActiveDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          const newStreak = state.currentStreak + 1;
          const newLongest = Math.max(state.longestStreak, newStreak);
          set({
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastActiveDate: today,
          });
        } else if (diffDays > 1) {
          set({
            currentStreak: 1,
            lastActiveDate: today,
          });
        }
      },

      recordChallengeSuccess: (
        challengeId: string,
        xpEarned: number,
        hintsUsed: number,
        viewedSolution: boolean,
        userSql: string
      ) => {
        const state = get();
        const oldXp = state.xp;
        const newXp = oldXp + xpEarned;
        const oldLevel = state.level;
        const newLevel = calculateLevel(newXp);
        const levelUp = newLevel > oldLevel;

        const currentAttempts = state.completedChallenges[challengeId]?.attempts || 0;

        const updatedCompleted = {
          ...state.completedChallenges,
          [challengeId]: {
            solvedAt: new Date().toISOString(),
            hintsUsed,
            viewedSolution,
            xpEarned,
            userSql,
            attempts: currentAttempts + 1,
          },
        };

        const targetChallenge = CHALLENGES.find((c) => c.id === challengeId);
        const currentWorldId = targetChallenge?.worldId || 1;

        const worldChallenges = CHALLENGES.filter((c) => c.worldId === currentWorldId);
        const allWorldSolved = worldChallenges.every((c) => updatedCompleted[c.id]);

        let updatedUnlockedWorlds = [...state.unlockedWorlds];
        if (allWorldSolved && currentWorldId < 15) {
          const nextWorld = currentWorldId + 1;
          if (!updatedUnlockedWorlds.includes(nextWorld)) {
            updatedUnlockedWorlds.push(nextWorld);
          }
        }

        const newlyUnlockedAchievements: string[] = [];
        const stateSnapshot = {
          ...state,
          xp: newXp,
          level: newLevel,
          completedChallenges: updatedCompleted,
          unlockedWorlds: updatedUnlockedWorlds,
        };

        ACHIEVEMENTS.forEach((ach) => {
          if (!state.unlockedAchievements.includes(ach.id)) {
            try {
              if (ach.condition(stateSnapshot)) {
                newlyUnlockedAchievements.push(ach.id);
              }
            } catch (e) {
              console.error(e);
            }
          }
        });

        const allAchievements = [
          ...state.unlockedAchievements,
          ...newlyUnlockedAchievements,
        ];

        set({
          xp: newXp,
          level: newLevel,
          completedChallenges: updatedCompleted,
          unlockedWorlds: updatedUnlockedWorlds,
          unlockedAchievements: allAchievements,
        });

        get().checkAndUpdateStreak();

        if (levelUp) {
          soundEffects.playLevelUp();
        } else {
          soundEffects.playSuccess();
        }

        return {
          newLevelUnlocked: levelUp,
          newAchievements: newlyUnlockedAchievements,
        };
      },

      resetProgress: () => {
        set({
          xp: 0,
          level: 1,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: getTodayString(),
          completedChallenges: {},
          unlockedWorlds: [1],
          unlockedAchievements: [],
        });
      },
    }),
    {
      name: "sql_detective_user_store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
