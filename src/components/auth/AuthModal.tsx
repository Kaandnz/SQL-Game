"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/firebase/auth-context";
import { X, Sparkles, Cloud, ShieldCheck, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginWithGoogle, isConfigured } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Giriş penceresi kapatıldı.");
      } else {
        setError(err.message || "Giriş yapılırken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md my-auto rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl p-6 md:p-8 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            SQL Analitik Hesabı
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1.5">
            Çalışma geçmişinizi senkronize edin ve her cihazdan kesintisiz devam edin
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2.5 mb-6 bg-[var(--bg-card)]/70 border border-[var(--border-subtle)] p-4 rounded-2xl">
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <Cloud className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Tüm tamamlanan senaryolarınız ve analitik skorunuz bulutta saklanır.</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Mevcut yerel çözümleriniz korunur, hesabınızla anında eşleşir.</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl font-medium bg-white text-gray-800 hover:bg-gray-100 active:scale-[0.99] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed border border-gray-300 cursor-pointer text-sm"
          >
            {/* Google SVG Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? "Giriş yapılıyor..." : "Google ile Devam Et"}</span>
          </button>

          {!isConfigured && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-[11px] text-amber-400 font-medium">
                ⚙️ Firebase anahtarları henüz eklenmedi.
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                Google ile giriş yapabilmek için Firebase Console&apos;dan anahtarları alıp eklemeniz yeterlidir.
              </p>
            </div>
          )}

          <p className="text-[11px] text-center text-[var(--text-muted)] mt-2">
            Giriş yapmadan misafir olarak oynamaya dilediğiniz gibi devam edebilirsiniz.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
