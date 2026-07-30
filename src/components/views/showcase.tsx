"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { api, CATEGORY_META } from "@/lib/api";
import type { Showcase } from "@/lib/types";
import { SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Quote,
  TrendingUp,
  CheckCircle2,
  Store,
  ArrowRight,
  Sparkles,
  Trophy,
  Calendar,
  Loader2,
  ImageOff,
  History,
} from "lucide-react";

const FILTERS = [
  { key: "all", label: "Semua", emoji: "✨" },
  ...Object.entries(CATEGORY_META).map(([key, m]) => ({
    key,
    label: m.label,
    emoji: m.emoji,
  })),
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function digitizationColor(d: number) {
  if (d >= 80) return "bg-green-100 text-green-700";
  if (d >= 60) return "bg-emerald-100 text-emerald-700";
  if (d >= 40) return "bg-amber-100 text-amber-700";
  return "bg-muted text-muted-foreground";
}

export function ShowcaseView() {
  const { setView } = useApp();
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    api
      .showcases()
      .then((r) => setShowcases(r.showcases))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return showcases;
    return showcases.filter((s) => s.umkm?.category === active);
  }, [showcases, active]);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <div className="flex flex-col">
      {/* ── Hero / Page Header ───────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-gradient-soft py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 size-72 rounded-full bg-primary/15 blur-3xl animate-blob" />
          <div
            className="absolute right-0 bottom-0 size-80 rounded-full bg-green-300/25 blur-3xl animate-blob"
            style={{ animationDelay: "4s" }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Showcase UMKM"
            title={
              <>
                Kisah Sukses{" "}
                <span className="text-brand-gradient">UMKM Naik Kelas</span>
              </>
            }
            description="Cerita nyata pelaku UMKM desa sebelum dan sesudah mengikuti program—bukti bahwa AI dan pendampingan bisa mengubah usaha kecil menjadi berkembang."
          />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <Badge className="gap-1 rounded-full bg-white/70 px-3 py-1 text-primary backdrop-blur">
              <Trophy className="size-3.5" />
              {showcases.length} Cerita Sukses
            </Badge>
            <Badge className="gap-1 rounded-full bg-white/70 px-3 py-1 text-primary backdrop-blur">
              <TrendingUp className="size-3.5" />
              Transformasi Nyata
            </Badge>
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────── */}
      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filter pills */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((f) => {
              const isActive = active === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all",
                    isActive
                      ? "border-transparent bg-brand-gradient text-white shadow-md"
                      : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <span className="text-xs">{f.emoji}</span>
                  {f.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <ShowcaseLoading />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-10">
              {/* Featured showcase */}
              {featured && <FeaturedShowcase showcase={featured} />}

              {/* Grid of remaining showcases */}
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((s) => (
                    <ShowcaseCard key={s.id} showcase={s} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <section className="bg-muted/30 pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border bg-brand-gradient-soft p-8 text-center shadow-lg sm:p-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-10 -top-10 size-56 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 size-56 rounded-full bg-green-300/20 blur-3xl" />
            </div>
            <div className="relative">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-md">
                <Sparkles className="size-7 text-white" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
                Ingin cerita Anda juga tampil di sini?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Bergabunglah dengan program UMKM Naik Kelas Bersama AI. Kembangkan
                usaha Anda dengan bantuan AI dan pendampingan mentor berpengalaman.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => setView("login")}
                  className="bg-brand-gradient text-white shadow-lg hover:opacity-90"
                >
                  Gabung Program <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" onClick={() => setView("about")}>
                  Pelajari Program
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── Subcomponents ─────────────────────────── */

function FeaturedShowcase({ showcase }: { showcase: Showcase }) {
  const cat = CATEGORY_META[showcase.umkm?.category] ?? {
    label: showcase.umkm?.category ?? "UMKM",
    emoji: "🏪",
    color: "bg-muted text-muted-foreground",
  };
  const digitization = showcase.umkm?.digitization ?? 0;

  return (
    <Card className="relative overflow-hidden rounded-3xl border-0 bg-brand-gradient-soft shadow-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-12 -top-12 size-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 size-56 rounded-full bg-green-300/25 blur-3xl" />
      </div>
      <CardContent className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-5">
        {/* Left: headline + meta */}
        <div className="flex flex-col gap-5 lg:col-span-3">
          <div className="flex items-center gap-2">
            <Badge className="gap-1 rounded-full bg-white/80 px-3 py-1 text-primary backdrop-blur">
              <Trophy className="size-3.5" /> Cerita Utama
            </Badge>
            <Badge
              className={cn("gap-1 rounded-full px-3 py-1", cat.color)}
            >
              <span>{cat.emoji}</span> {cat.label}
            </Badge>
          </div>

          <div className="relative">
            <Quote className="absolute -left-2 -top-4 size-10 text-primary/20" />
            <h3 className="font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              {showcase.headline}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 backdrop-blur">
              <Store className="size-4 text-primary" />
              <span className="font-bold text-foreground">
                {showcase.umkm?.name ?? "UMKM"}
              </span>
            </div>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                digitizationColor(digitization)
              )}
            >
              <TrendingUp className="size-3.5" />
              Digitalisasi {digitization}%
            </div>
          </div>

          {/* Achievements */}
          {showcase.achievements?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {showcase.achievements.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white/70 px-3 py-1 text-xs font-medium text-green-700 backdrop-blur"
                >
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: before/after comparison */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <BeforeAfter
            before={showcase.beforeStory}
            after={showcase.afterStory}
          />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            Dipublikasikan {formatDate(showcase.publishedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BeforeAfter({
  before,
  after,
  compact = false,
}: {
  before: string;
  after: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "rounded-2xl border border-border/60 bg-white/60 p-4 backdrop-blur",
          compact && "p-3"
        )}
      >
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <History className="size-3.5" /> Sebelum
        </div>
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            compact && "line-clamp-2"
          )}
        >
          {before}
        </p>
      </div>
      <div
        className={cn(
          "rounded-2xl border border-green-200 bg-green-50/80 p-4 backdrop-blur",
          compact && "p-3"
        )}
      >
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
          <CheckCircle2 className="size-3.5" /> Sesudah
        </div>
        <p
          className={cn(
            "text-sm font-medium leading-relaxed text-foreground",
            compact && "line-clamp-2"
          )}
        >
          {after}
        </p>
      </div>
    </div>
  );
}

function ShowcaseCard({ showcase }: { showcase: Showcase }) {
  const cat = CATEGORY_META[showcase.umkm?.category] ?? {
    label: showcase.umkm?.category ?? "UMKM",
    emoji: "🏪",
    color: "bg-muted text-muted-foreground",
  };
  const digitization = showcase.umkm?.digitization ?? 0;
  const achievements = showcase.achievements ?? [];
  const visibleAch = achievements.slice(0, 3);
  const moreCount = achievements.length - visibleAch.length;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Top gradient banner with headline */}
      <div className="relative overflow-hidden bg-brand-gradient-soft px-5 py-5">
        <div className="pointer-events-none absolute -right-4 -top-4 size-24 rounded-full bg-primary/10 blur-2xl" />
        <Quote className="size-6 text-primary/40" />
        <h3 className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug text-foreground">
          {showcase.headline}
        </h3>
      </div>

      <CardContent className="-mt-1 flex flex-1 flex-col gap-4 p-5">
        {/* UMKM name + category */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient-soft">
              <Store className="size-4 text-primary" />
            </div>
            <span className="truncate text-sm font-bold text-foreground">
              {showcase.umkm?.name ?? "UMKM"}
            </span>
          </div>
          <Badge className={cn("gap-1 rounded-full px-2 py-0.5 text-xs", cat.color)}>
            <span>{cat.emoji}</span>
            {cat.label}
          </Badge>
        </div>

        {/* Before / After */}
        <BeforeAfter
          before={showcase.beforeStory}
          after={showcase.afterStory}
          compact
        />

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleAch.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700"
              >
                <CheckCircle2 className="size-3 shrink-0" />
                <span className="line-clamp-1">{a}</span>
              </span>
            ))}
            {moreCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                +{moreCount} lainnya
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="size-3" />
            {formatDate(showcase.publishedAt)}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              digitizationColor(digitization)
            )}
          >
            <TrendingUp className="size-3" />
            {digitization}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ShowcaseLoading() {
  return (
    <div className="flex flex-col gap-10">
      {/* Featured skeleton */}
      <div className="rounded-3xl bg-brand-gradient-soft p-6 sm:p-10">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="mt-4 h-10 w-3/4 rounded-lg" />
        <Skeleton className="mt-2 h-10 w-1/2 rounded-lg" />
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-3 lg:col-span-3">
            <Skeleton className="h-6 w-40" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-32 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-2">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/60 p-5">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-2 h-16 rounded-lg" />
            <Skeleton className="mt-2 h-16 rounded-lg" />
            <Skeleton className="mt-3 h-5 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-dashed border-border/70 bg-muted/30 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-gradient-soft">
        <ImageOff className="size-8 text-primary" />
      </div>
      <h3 className="font-display text-lg font-bold">Belum ada cerita sukses</h3>
      <p className="text-sm text-muted-foreground">
        Belum ada cerita sukses untuk kategori ini. Coba pilih kategori lain atau
        jadilah yang pertama membagikan kisah transformasi usaha Anda.
      </p>
    </div>
  );
}

export default ShowcaseView;
