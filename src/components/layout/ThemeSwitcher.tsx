"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUserStore, AppTheme, isLightTheme } from "@/lib/state/user-store";
import { Palette, Check, ChevronDown, Sun, Moon } from "lucide-react";
import { soundEffects } from "@/lib/audio/sound-effects";

interface ThemeOption {
  id: AppTheme;
  name: string;
  dotColor: string;
  description: string;
  isLight?: boolean;
}

const THEME_OPTIONS: ThemeOption[] = [
  // Dark Themes
  {
    id: "warm-amber",
    name: "Sıcak Bal & Espresso",
    dotColor: "bg-amber-400",
    description: "Göz yormayan yumuşak koyu tema",
  },
  {
    id: "cyber-emerald",
    name: "Siber Matrix",
    dotColor: "bg-emerald-400",
    description: "Derin siyah & neon yeşil terminal",
  },
  {
    id: "midnight-cyan",
    name: "Gece Okyanusu",
    dotColor: "bg-sky-400",
    description: "Linear & Supabase lacivert mavi",
  },
  {
    id: "sunset-rose",
    name: "Günbatımı Neon",
    dotColor: "bg-rose-400",
    description: "Synthwave pembe & mürdüm",
  },
  {
    id: "monochrome-slate",
    name: "Titanyum Mono",
    dotColor: "bg-slate-300",
    description: "Sade, temiz gümüş & siyah",
  },
  // Light Themes
  {
    id: "clean-light",
    name: "Gündüz / Arktik Temiz",
    dotColor: "bg-sky-500",
    description: "Modern, aydınlık arduvaz & safir mavi",
    isLight: true,
  },
  {
    id: "warm-paper",
    name: "Sıcak Kağıt & Kitap",
    dotColor: "bg-amber-600",
    description: "Göz yormayan editoryal fildişi & parşömen",
    isLight: true,
  },
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useUserStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync theme with HTML data-theme and class on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      const activeTheme = theme || "warm-amber";
      document.documentElement.setAttribute("data-theme", activeTheme);
      if (isLightTheme(activeTheme)) {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    }
  }, [theme]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTheme = (newTheme: AppTheme) => {
    soundEffects.playClick();
    setTheme(newTheme);
    setIsOpen(false);
  };

  const currentOption =
    THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  const darkThemes = THEME_OPTIONS.filter((t) => !t.isLight);
  const lightThemes = THEME_OPTIONS.filter((t) => t.isLight);

  return (
    <div className="relative select-none" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold transition-all active:scale-95"
        title="Tema Rengini Değiştir"
      >
        <span className={`w-2.5 h-2.5 rounded-full ${currentOption.dotColor} shadow-sm ring-1 ring-black/10`} />
        <Palette className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        <span className="hidden lg:inline text-[var(--text-primary)]">{currentOption.name}</span>
        <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl z-50 animate-fade-in-up space-y-1 backdrop-blur-xl">
          {/* Light Themes Group */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-color)] border-b border-[var(--border-color)]">
            <Sun className="w-3 h-3" />
            <span>Açık Temalar (Light Mode)</span>
          </div>

          {lightThemes.map((item) => {
            const isSelected = item.id === theme;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTheme(item.id)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold border border-[var(--border-color)] shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${item.dotColor} shrink-0 ring-2 ring-black/10 shadow-sm`} />
                  <div>
                    <div className="text-xs">{item.name}</div>
                    <div className="text-[10px] opacity-75 font-normal">{item.description}</div>
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />}
              </button>
            );
          })}

          {/* Dark Themes Group */}
          <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] mt-2">
            <Moon className="w-3 h-3" />
            <span>Koyu Temalar (Dark Mode)</span>
          </div>

          {darkThemes.map((item) => {
            const isSelected = item.id === theme;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTheme(item.id)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold border border-[var(--border-color)] shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${item.dotColor} shrink-0 ring-2 ring-black/10 shadow-sm`} />
                  <div>
                    <div className="text-xs">{item.name}</div>
                    <div className="text-[10px] opacity-75 font-normal">{item.description}</div>
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
