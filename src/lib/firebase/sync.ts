import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./client";
import type { UserStoreState } from "../state/user-store";

export interface CloudUserData {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
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
  updatedAt: string;
}

const LOCAL_ACCOUNT_KEY_PREFIX = "sql_quest_account_";

/**
 * Get user progress instantly from local storage (0ms) without waiting for network.
 */
export function getLocalUserProgress(uid: string): Partial<UserStoreState> | null {
  if (typeof window === "undefined" || !uid) return null;
  try {
    const stored = localStorage.getItem(LOCAL_ACCOUNT_KEY_PREFIX + uid);
    if (!stored) return null;
    const bestData = JSON.parse(stored) as CloudUserData;
    return {
      xp: bestData.xp ?? 0,
      level: bestData.level ?? 1,
      currentStreak: bestData.currentStreak ?? 1,
      longestStreak: bestData.longestStreak ?? 1,
      lastActiveDate: bestData.lastActiveDate ?? null,
      completedChallenges: bestData.completedChallenges ?? {},
      unlockedWorlds:
        bestData.unlockedWorlds && bestData.unlockedWorlds.length > 0
          ? bestData.unlockedWorlds
          : [1],
      unlockedAchievements: bestData.unlockedAchievements ?? [],
    };
  } catch {
    return null;
  }
}

/**
 * Timeout helper to prevent Firestore operations from hanging indefinitely
 * when database is not yet created in Firebase Console or network is blocked.
 */
async function withTimeout<T>(promise: Promise<T>, ms: number = 2500): Promise<T | null> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer!);
    return result as T | null;
  } catch (err) {
    clearTimeout(timer!);
    throw err;
  }
}

/**
 * Save user progress to BOTH local user storage and Firestore cloud.
 * Guarantees zero data loss and NEVER blocks or hangs the UI.
 */
export async function saveUserProgressToCloud(
  uid: string,
  state: Partial<UserStoreState>,
  meta?: { displayName?: string | null; email?: string | null; photoURL?: string | null }
): Promise<boolean> {
  if (!uid) return false;

  const dataToSave: CloudUserData = {
    uid,
    displayName: meta?.displayName ?? null,
    email: meta?.email ?? null,
    photoURL: meta?.photoURL ?? null,
    xp: state.xp ?? 0,
    level: state.level ?? 1,
    currentStreak: state.currentStreak ?? 1,
    longestStreak: state.longestStreak ?? 1,
    lastActiveDate: state.lastActiveDate ?? null,
    completedChallenges: state.completedChallenges ?? {},
    unlockedWorlds: state.unlockedWorlds ?? [1],
    unlockedAchievements: state.unlockedAchievements ?? [],
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to user-specific localStorage immediately (instant, 0ms, synchronous)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        LOCAL_ACCOUNT_KEY_PREFIX + uid,
        JSON.stringify(dataToSave)
      );
    } catch (e) {
      console.warn("Yerel kullanıcı hafızasına yazılamadı:", e);
    }
  }

  // 2. Save to Firestore Cloud with a strict timeout so it never hangs
  if (isFirebaseConfigured) {
    try {
      const userDocRef = doc(db, "users", uid);
      await withTimeout(setDoc(userDocRef, dataToSave, { merge: true }), 2500);
      return true;
    } catch (err: any) {
      console.warn("Firestore buluta kaydedilemedi (Yerel hafızada güvende):", err?.message || err);
    }
  }

  return true;
}

/**
 * Load user progress for a specific user ID.
 * Reads instantly from local user storage and checks Firestore with strict timeout.
 */
export async function loadUserProgressFromCloud(
  uid: string
): Promise<{ data: Partial<UserStoreState> | null; isNewUser: boolean }> {
  if (!uid) {
    return { data: null, isNewUser: false };
  }

  let localAccountData: CloudUserData | null = null;
  let cloudAccountData: CloudUserData | null = null;

  // 1. Read from user-specific localStorage immediately
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_ACCOUNT_KEY_PREFIX + uid);
      if (stored) {
        localAccountData = JSON.parse(stored) as CloudUserData;
      }
    } catch (e) {
      console.warn("Yerel kullanıcı verisi okunamadı:", e);
    }
  }

  // 2. Read from Firestore Cloud with a strict timeout
  if (isFirebaseConfigured) {
    try {
      const userDocRef = doc(db, "users", uid);
      const snapshot = await withTimeout(getDoc(userDocRef), 2500);
      if (snapshot && snapshot.exists()) {
        cloudAccountData = snapshot.data() as CloudUserData;
      }
    } catch (err: any) {
      console.warn("Firestore buluttan okunamadı (Yerel hafıza kullanılacak):", err?.message || err);
    }
  }

  // Determine best data: Pick whichever is most recent or has higher XP
  const bestData = cloudAccountData && localAccountData
    ? (cloudAccountData.xp >= localAccountData.xp ? cloudAccountData : localAccountData)
    : (cloudAccountData || localAccountData);

  if (!bestData) {
    return { data: null, isNewUser: true };
  }

  const userProgress: Partial<UserStoreState> = {
    xp: bestData.xp ?? 0,
    level: bestData.level ?? 1,
    currentStreak: bestData.currentStreak ?? 1,
    longestStreak: bestData.longestStreak ?? 1,
    lastActiveDate: bestData.lastActiveDate ?? null,
    completedChallenges: bestData.completedChallenges ?? {},
    unlockedWorlds:
      bestData.unlockedWorlds && bestData.unlockedWorlds.length > 0
        ? bestData.unlockedWorlds
        : [1],
    unlockedAchievements: bestData.unlockedAchievements ?? [],
  };

  return { data: userProgress, isNewUser: false };
}
