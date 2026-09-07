import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "SQL Quest: Data Detective | İnteraktif SQL Öğrenme Oyunu",
  description:
    "PostgreSQL sorguları yazarak veritabanı dedektifliği yapın, seviye atlayın ve SQL uzmanı olun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col antialiased transition-colors duration-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
