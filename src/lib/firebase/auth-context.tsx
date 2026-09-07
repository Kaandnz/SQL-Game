"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./client";
import { loadUserProgressFromCloud, saveUserProgressToCloud } from "./sync";
import { useUserStore } from "../state/user-store";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  isSyncing: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncNow: () => Promise<boolean>;
  resetAccountProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
  isSyncing: false,
  loginWithGoogle: async () => {},
  logout: async () => {},
  syncNow: async () => false,
  resetAccountProgress: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Zustand hooks
  const loadCloudProgress = useUserStore((s) => s.loadCloudProgress);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        setIsSyncing(true);
        try {
          const { data, isNewUser } = await loadUserProgressFromCloud(currentUser.uid);
          if (data && !isNewUser) {
            // Existing user: Load their saved data
            loadCloudProgress(data);
          } else if (isNewUser) {
            // New user: If they have guest progress on screen, save it to their account
            const currentScreen = useUserStore.getState();
            if (currentScreen.xp > 0 || Object.keys(currentScreen.completedChallenges).length > 0) {
              await saveUserProgressToCloud(currentUser.uid, currentScreen, {
                displayName: currentUser.displayName,
                email: currentUser.email,
                photoURL: currentUser.photoURL,
              });
            } else {
              useUserStore.getState().resetProgress();
            }
          }
        } catch (e) {
          console.error("Giriş sonrası senkronizasyon hatası:", e);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, [loadCloudProgress]);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error(
        "Firebase yapılandırma anahtarları henüz eklenmedi. Lütfen .env.local dosyasını ayarlayın."
      );
    }
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      setIsSyncing(true);
      try {
        const { data, isNewUser } = await loadUserProgressFromCloud(result.user.uid);
        if (data && !isNewUser) {
          loadCloudProgress(data);
        } else if (isNewUser) {
          const currentScreen = useUserStore.getState();
          await saveUserProgressToCloud(result.user.uid, currentScreen, {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          });
        }
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const logout = async () => {
    // 1. Önce bu kullanıcının mevcut ilerlemesini kendi hesabına kaydet
    if (user) {
      const currentState = useUserStore.getState();
      await saveUserProgressToCloud(user.uid, currentState, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }

    // 2. Firebase oturumunu kapat
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
    setUser(null);

    // 3. Ekranı misafir moduna (sıfıra) çek
    useUserStore.getState().resetProgress();
  };

  const resetAccountProgress = async () => {
    useUserStore.getState().resetProgress();
    if (user) {
      await saveUserProgressToCloud(user.uid, {
        xp: 0,
        level: 1,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: null,
        completedChallenges: {},
        unlockedWorlds: [1],
        unlockedAchievements: [],
      });
    }
  };

  const syncNow = async (): Promise<boolean> => {
    if (!user) return false;
    setIsSyncing(true);
    try {
      const localState = useUserStore.getState();
      const success = await saveUserProgressToCloud(user.uid, localState, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      return success;
    } catch {
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        isSyncing,
        loginWithGoogle,
        logout,
        syncNow,
        resetAccountProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
