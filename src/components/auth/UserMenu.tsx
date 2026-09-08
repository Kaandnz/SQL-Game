"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { useUserStore } from "@/lib/state/user-store";
import { AuthModal } from "./AuthModal";
import { 
  LogIn, 
  LogOut, 
  Cloud, 
  RefreshCw, 
  Check, 
  Sparkles,
  ChevronDown,
  RotateCcw
} from "lucide-react";

export function UserMenu() {
  const { user, loading, logout, syncNow, isSyncing, resetAccountProgress } = useAuth();
  const { xp, level } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [syncedRecently, setSyncedRecently] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSync = async () => {
    const success = await syncNow();
    if (success) {
      setSyncedRecently(true);
      setTimeout(() => setSyncedRecently(false), 3000);
    }
  };

  if (!mounted || loading) {
    return (
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30 opacity-70 shrink-0 cursor-default"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Giriş Yap</span>
      </button>
    );
  }

  // Not logged in: Show Login Button
  if (!user) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
          title="Google ile Giriş Yap & İlerlemeyi Kaydet"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Giriş Yap</span>
        </button>

        <AuthModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </>
    );
  }

  // Logged in: Show Avatar & Dropdown
  const userInitial = (user.displayName || user.email || "D")[0].toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition-all shadow-sm cursor-pointer"
        aria-expanded={isDropdownOpen}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "Kullanıcı"}
            className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center justify-center border border-amber-500/40">
            {userInitial}
          </div>
        )}
        <span className="text-xs font-medium text-[var(--text-primary)] max-w-[90px] truncate hidden md:inline">
          {user.displayName?.split(" ")[0] || "Analist"}
        </span>
        <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="p-2 border-b border-[var(--border-subtle)] mb-2">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {user.displayName || "SQL Analisti"}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {user.email}
            </p>
            <div className="mt-2.5 flex items-center justify-between text-xs bg-[var(--bg-card)] px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)]">
              <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Kademe {level}
              </span>
              <span className="font-mono text-amber-500 font-bold">
                {xp} XP
              </span>
            </div>
          </div>

          {/* Sync Option */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-500" />
              <span>Bulut Eşitleme</span>
            </div>
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
            ) : syncedRecently ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Eşitlendi
              </span>
            ) : (
              <span className="text-[10px] text-[var(--text-muted)]">Şimdi Eşitle</span>
            )}
          </button>

          {/* Reset Account Option */}
          <button
            onClick={async () => {
              if (window.confirm("Bu hesaptaki tüm çözümleri ve XP'yi sıfırlamak istediğinize emin misiniz?")) {
                setIsDropdownOpen(false);
                await resetAccountProgress();
              }
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 mt-0.5 rounded-xl text-xs text-amber-500/80 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>İlerlemeyi Sıfırla (0 XP)</span>
          </button>

          {/* Logout Option */}
          <button
            onClick={async () => {
              setIsDropdownOpen(false);
              await logout();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 mt-1 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}
    </div>
  );
}
