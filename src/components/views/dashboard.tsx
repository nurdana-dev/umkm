"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Trophy,
  FolderOpen,
  Bot,
  TrendingUp,
  Store,
  Megaphone,
  PackageCheck,
  Target,
  Calendar,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api, LESSON_TYPE_META } from "@/lib/api";
import type { Module, Challenge } from "@/lib/types";
import { cn } from "@/lib/utils";

const MODULE_ICONS: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  palette: Target,
  megaphone: Megaphone,
  "shopping-bag": PackageCheck,
  "trending-up": TrendingUp,
};

export function DashboardView() {
  const { user, setView } = useApp();
  const [modules, setModules] = useState<Module[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.umkm) return;
    Promise.all([
      api.modules(user.umkm.id),
      api.challenges(user.umkm.id),
      api
        .prompts({ userId: user.id, fav: true })
        .catch(() => ({ prompts: [], total: 0 })),
    ])
      .then(([m, c, f]) => {
        setModules(m.modules);
        setChallenges(c.challenges);
        setFavCount(f.total);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?.umkm) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <Store className="size-12 text-muted-foreground" />
        <h2 className="font-display text-xl font-bold">
          Belum ada profil UMKM
        </h2>
        <p className="text-sm text-muted-foreground">
          Akun Anda belum terhubung dengan profil UMKM. Hubungi admin untuk
          pendaftaran.
        </p>
        <Button onClick={() => setView("landing")}>Kembali ke Beranda</Button>
      </div>
    );
  }

  const umkm = user.umkm;
  const completedModules = modules.filter(
    (m) => m.progressPercent === 100,
  ).length;
  const currentModule =
    modules.find((m) => m.progressPercent > 0 && m.progressPercent < 100) ??
    modules.find((m) => m.progressPercent === 0);
  const activeChallenge =
    challenges.find((c) => c.submissions[0]?.status === "proses") ??
    challenges.find(
      (c) => !c.submissions[0] || c.submissions[0].status !== "selesai",
    );
  const completedChallenges = challenges.filter(
    (c) => c.submissions[0]?.status === "selesai",
  ).length;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  })();

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Welcome header */}
            <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 shadow-xl shadow-primary/20 sm:p-8">
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="absolute -right-10 -top-10 size-60 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-10 left-1/4 size-60 rounded-full bg-white blur-3xl" />
              </div>
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16 border-2 border-white/40 shadow-lg">
                    <AvatarImage
                      src={user.avatar ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-white/20 text-xl font-bold text-white">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <div className="text-sm font-medium text-white/80">
                      {greeting},
                    </div>
                    <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
                      {user.name}
                    </h1>
                    <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
                      <Store className="size-4" /> {umkm.name}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setView("learning")}
                    className="bg-white text-primary shadow-lg hover:bg-white/90"
                  >
                    Lanjut Belajar <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Top stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={CheckCircle2}
                label="Modul Selesai"
                value={`${completedModules}/5`}
                color="bg-green-100 text-green-600"
                onClick={() => setView("learning")}
              />
              <StatCard
                icon={Trophy}
                label="Challenge Selesai"
                value={`${completedChallenges}/5`}
                color="bg-amber-100 text-amber-600"
                onClick={() => setView("challenges")}
              />
              {/* <StatCard icon={FolderOpen} label="Aset Digital" value={`${completedChallenges * 2 + completedModules * 3}`} color="bg-blue-100 text-blue-600" onClick={() => setView("templates")} /> */}
              <StatCard
                icon={Bot}
                label="Prompt Favorit"
                value={favCount}
                color="bg-purple-100 text-purple-600"
                onClick={() => setView("prompts")}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Progress Digitalisasi */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <TrendingUp className="size-4 text-primary" /> Progress
                    Digitalisasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="relative flex size-40 items-center justify-center">
                    <svg className="size-40 -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(umkm.digitization / 100) * 327} 327`}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="oklch(0.52 0.19 255)" />
                          <stop offset="100%" stopColor="oklch(0.6 0.13 155)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-display text-3xl font-extrabold text-brand-gradient">
                        {umkm.digitization}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        digitalisasi
                      </span>
                    </div>
                  </div>
                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Kategori Usaha
                      </span>
                      <Badge variant="secondary" className="capitalize">
                        {umkm.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Lokasi</span>
                      <span className="font-medium">{umkm.village}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Bergabung</span>
                      <span className="font-medium">
                        {new Date(umkm.joinedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Perjalanan Belajar */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <Sparkles className="size-4 text-primary" /> Perjalanan
                    Belajar
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView("learning")}
                    className="text-primary"
                  >
                    Lihat semua <ArrowRight className="size-3.5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {modules.map((m, i) => {
                      const Icon = MODULE_ICONS[m.icon] ?? Sparkles;
                      const isDone = m.progressPercent === 100;
                      const isCurrent =
                        !isDone &&
                        (i === 0 || modules[i - 1].progressPercent === 100) &&
                        (m.progressPercent > 0 ||
                          modules
                            .slice(0, i)
                            .every((x) => x.progressPercent === 100));
                      return (
                        <button
                          key={m.id}
                          onClick={() => setView("learning")}
                          className={cn(
                            "group flex items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-md",
                            isCurrent
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/60 hover:border-primary/30",
                          )}
                        >
                          <div
                            className={cn(
                              "flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                              isDone
                                ? "bg-green-100 text-green-600"
                                : isCurrent
                                  ? "bg-brand-gradient text-white"
                                  : "bg-muted text-muted-foreground",
                            )}
                          >
                            {isDone ? (
                              <CheckCircle2 className="size-5" />
                            ) : isCurrent ? (
                              <PlayCircle className="size-5" />
                            ) : (
                              <Icon className="size-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Modul {m.order}
                              </span>
                              {isCurrent && (
                                <Badge className="bg-primary/10 text-primary text-[10px]">
                                  Sedang Berlangsung
                                </Badge>
                              )}
                              {isDone && (
                                <Badge className="bg-green-100 text-green-700 text-[10px]">
                                  Selesai
                                </Badge>
                              )}
                            </div>
                            <div className="truncate text-sm font-semibold">
                              {m.title}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <Progress
                                value={m.progressPercent}
                                className="h-1.5 flex-1"
                              />
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {m.progressPercent}%
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Modul berikutnya */}
              {currentModule && (
                <Card className="overflow-hidden border-primary/20">
                  <CardHeader className="bg-brand-gradient-soft">
                    <CardTitle className="flex items-center gap-2 font-display text-base">
                      <PlayCircle className="size-4 text-primary" /> Modul
                      Berikutnya
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Badge className="bg-primary/10 text-primary">
                      Modul {currentModule.order}
                    </Badge>
                    <h3 className="mt-2 font-display text-lg font-bold">
                      {currentModule.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {currentModule.subtitle}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />{" "}
                        {currentModule.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Circle className="size-3" /> {currentModule.totalCount}{" "}
                        materi
                      </span>
                    </div>
                    <Button
                      onClick={() => setView("learning")}
                      className="mt-4 w-full bg-brand-gradient text-white"
                    >
                      Lanjutkan Belajar <ArrowRight className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Challenge aktif */}
              {activeChallenge && (
                <Card className="overflow-hidden border-amber-200">
                  <CardHeader className="bg-amber-50">
                    <CardTitle className="flex items-center gap-2 font-display text-base">
                      <Trophy className="size-4 text-amber-600" /> Challenge
                      Aktif
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Badge className="bg-amber-100 text-amber-700">
                      Minggu {activeChallenge.week}
                    </Badge>
                    <h3 className="mt-2 font-display text-lg font-bold">
                      {activeChallenge.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {activeChallenge.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />{" "}
                        {activeChallenge.deadline}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-medium",
                          activeChallenge.submissions[0]?.status === "proses"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {activeChallenge.submissions[0]?.status === "proses"
                          ? "Dalam Proses"
                          : "Belum Mulai"}
                      </span>
                    </div>
                    <Button
                      onClick={() => setView("challenges")}
                      variant="outline"
                      className="mt-4 w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      Kerjakan Challenge <ArrowRight className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Hasil karya peserta */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  <FolderOpen className="size-4 text-primary" /> Hasil Karya
                  Saya
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView("templates")}
                  className="text-primary"
                >
                  Buat karya baru <ArrowRight className="size-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                {completedChallenges > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {challenges
                      .filter((c) => c.submissions[0]?.status === "selesai")
                      .map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-border/60 bg-muted/30 p-4"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-green-600" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Challenge Minggu {c.week}
                            </span>
                          </div>
                          <h4 className="mt-1 text-sm font-semibold">
                            {c.title}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {c.submissions[0]?.content}
                          </p>
                        </div>
                      ))}
                    {/* <button
                      onClick={() => setView("templates")}
                      className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Lightbulb className="size-5" />
                      <span className="text-xs font-medium">
                        Buat aset digital baru
                      </span>
                    </button> */}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                    <FolderOpen className="size-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      Belum ada karya. Selesaikan challenge pertama Anda!
                    </p>
                    <Button
                      onClick={() => setView("challenges")}
                      variant="outline"
                    >
                      <Trophy className="size-4" /> Lihat Challenge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: typeof Sparkles;
  label: string;
  value: string | number;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className={cn(
          "flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
          color,
        )}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <div className="font-display text-2xl font-extrabold text-foreground">
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </button>
  );
}
