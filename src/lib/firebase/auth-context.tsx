"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./client";
import { loadUserProgressFromCloud, saveUserProgressToCloud, getLocalUserProgress } from "./sync";
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

        // 1. Fast Path: Yerel hafızada kayıt varsa 0 milisaniyede uygula (anında tiklensin!)
        const fastLocal = getLocalUserProgress(currentUser.uid);
        if (fastLocal) {
          loadCloudProgress(fastLocal);
        }

        try {
          // 2. Bulut kontrolü ve senkronizasyonu
          const { data, isNewUser } = await loadUserProgressFromCloud(currentUser.uid);
          if (data && !isNewUser) {
            loadCloudProgress(data);
          } else if (isNewUser) {
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
          console.error("Giriş senkronizasyon hatası:", e);
        } finally {
          setIsSyncing(false);
          // Yükleme animasyonunun pürüzsüz görünmesi ve tatmin edici kapanması için minik bir gecikme
          setTimeout(() => {
            setIsSyncing(false);
          }, 400);
        }
      } else {
        setIsSyncing(false);
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
      } catch (e) {
        console.warn("Giriş verisi okunamadı:", e);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const logout = async () => {
    const currentUser = user;
    
    // 1. Ekranı ve oturum durumunu hemen sıfırla (Kullanıcı beklemesin)
    setUser(null);
    setIsSyncing(false);

    try {
      // 2. Kullanıcının mevcut ilerlemesini yerel hafızaya ve buluta hemen kaydet
      if (currentUser) {
        const currentState = useUserStore.getState();
        saveUserProgressToCloud(currentUser.uid, currentState, {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        }).catch(() => {});
      }

      // 3. Firebase oturumunu kapat
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("Çıkış işlemi uyarısı:", e);
    } finally {
      // 4. Ekranı misafir moduna çek
      useUserStore.getState().resetProgress();
    }
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
