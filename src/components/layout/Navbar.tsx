"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore, isLightTheme } from "@/lib/state/user-store";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { UserMenu } from "@/components/auth/UserMenu";
import { soundEffects } from "@/lib/audio/sound-effects";
import {
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  GitBranch,
  Terminal,
  Trophy,
  GraduationCap,
  Medal,
  Shield,
  Sun,
  Moon,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const {
    xp,
    level,
    currentStreak,
    soundEnabled,
    toggleSound,
    checkAndUpdateStreak,
    theme,
    toggleLightDarkMode,
  } = useUserStore();

  useEffect(() => {
    setMounted(true);
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  const navItems = [
    { href: "/", label: "Görevler", icon: Compass },
    { href: "/academy", label: "Akademi", icon: GraduationCap },
    { href: "/skill-tree", label: "Skill Tree", icon: GitBranch },
    { href: "/playground", label: "Playground", icon: Terminal },
    { href: "/leaderboard", label: "Liderlik", icon: Medal },
    { href: "/achievements", label: "Başarımlar", icon: Trophy },
  ];

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[var(--bg-main)]/90 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between select-none transition-colors duration-200">
      {/* Brand */}
      <div className="flex items-center gap-7">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-105 transition-all shadow-sm">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs tracking-wider text-[var(--text-primary)] font-mono">
                SQL_DETECTIVE
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[var(--accent-color)] border border-white/[0.1]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v1.2 WASM
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-sans tracking-tight">
              Interactive Forensics Engine
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white/[0.1] text-[var(--accent-color)] border border-white/[0.15] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Gamification Stats, Theme Switcher & Sound */}
      <div className="flex items-center gap-2.5">
        {mounted ? (
          <>
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold"
              title="Günlük SQL Çalışma Serisi"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
              <span>{currentStreak} Gün</span>
            </div>

            {/* XP & Level Badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono"
              title={`Seviye ${level} - Toplam ${xp} XP`}
            >
              <div className="flex items-center gap-1 text-[var(--accent-color)] font-extrabold">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{xp} XP</span>
              </div>
              <span className="text-slate-600 font-bold">|</span>
              <span className="text-[var(--text-primary)] font-bold">Lvl {level}</span>
            </div>
          </>
        ) : (
          <div className="w-36 h-8 bg-white/[0.04] rounded-xl animate-pulse" />
        )}

        {/* Theme Switcher Dropdown */}
        <ThemeSwitcher />

        {/* 1-Click Quick Light/Dark Toggle */}
        <button
          onClick={() => {
            soundEffects.playClick();
            toggleLightDarkMode();
          }}
          className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-white/[0.2] transition-all active:scale-95 flex items-center justify-center"
          title={isLightTheme(theme) ? "Koyu Moda Geç (Dark Mode)" : "Açık Moda Geç (Light Mode)"}
        >
          {isLightTheme(theme) ? (
            <Moon className="w-4 h-4 text-amber-500 hover:rotate-12 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          )}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-white/[0.2] transition-all active:scale-95"
          title={soundEnabled ? "Ses efektlerini kapat" : "Ses efektlerini aç"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[var(--accent-color)]" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-50" />
          )}
        </button>

        {/* User Auth Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
