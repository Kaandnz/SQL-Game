import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { AuthLoadingOverlay } from "@/components/auth/AuthLoadingOverlay";

export const metadata: Metadata = {
  title: "SQL Studio | İnteraktif PostgreSQL & Veri Analitiği Platformu",
  description:
    "Gerçek PostgreSQL çekirdeği üzerinde çalışan etkileşimli vakalar, e-ticaret metrikleri, finansal denetim ve adli bilişim senaryolarıyla ileri düzey SQL yetkinliği kazanın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col antialiased transition-colors duration-200">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <AuthLoadingOverlay />
        </AuthProvider>
      </body>
    </html>
  );
}
