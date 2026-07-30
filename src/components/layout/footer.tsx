"use client";

import { useApp } from "@/lib/store";
import { Sparkles, MapPin, Mail, Heart } from "lucide-react";
import type { ViewKey } from "@/lib/types";

const FOOTER_LINKS: { title: string; links: { label: string; view: ViewKey }[] }[] = [
  {
    title: "Program",
    links: [
      { label: "Beranda", view: "landing" },
      { label: "Tentang Program", view: "about" },
      { label: "Showcase UMKM", view: "showcase" },
    ],
  },
  {
    title: "Pembelajaran",
    links: [
      { label: "Learning Center", view: "learning" },
      { label: "AI Prompt Library", view: "prompts" },
      { label: "Template Digital", view: "templates" },
      { label: "Challenge", view: "challenges" },
    ],
  },
];

export function Footer() {
  const { setView } = useApp();
  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient shadow-md">
                <Sparkles className="size-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base font-extrabold">UMKM Naik Kelas</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Bersama AI
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Transformasi Digital UMKM Desa melalui Literasi dan Pemanfaatan AI. Platform
              pemberdayaan untuk pelaku usaha desa naik kelas di era digital.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Desa Bringin, Kec. Srumbung, Kab. Magelang
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4 text-primary" /> halo@umkmai.id
              </span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => setView(l.view)}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Program UMKM Naik Kelas Bersama AI. Dibuat untuk pemberdayaan UMKM desa.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Dibuat dengan <Heart className="size-3 fill-destructive text-destructive" /> untuk Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
