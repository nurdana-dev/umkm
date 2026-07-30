import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UMKM Naik Kelas Bersama AI | Transformasi Digital UMKM Desa",
  description:
    "Platform pemberdayaan UMKM desa melalui literasi dan pemanfaatan AI. Belajar AI, buat branding digital, dan kembangkan usaha bersama mentor pendamping.",
  keywords: [
    "UMKM",
    "AI",
    "Transformasi Digital",
    "Pemberdayaan Desa",
    "Branding Digital",
    "Sociopreneur",
    "Desa Bringin",
    "Magelang",
  ],
  authors: [{ name: "Program UMKM Naik Kelas Bersama AI" }],
  openGraph: {
    title: "UMKM Naik Kelas Bersama AI",
    description:
      "Transformasi Digital UMKM Desa melalui Literasi dan Pemanfaatan AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
