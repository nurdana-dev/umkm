"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader, StatBadge } from "@/components/shared/section";
import {
  Sparkles,
  ArrowRight,
  Play,
  GraduationCap,
  Lightbulb,
  Users,
  TrendingUp,
  ClipboardCheck,
  HandHeart,
  BarChart3,
  Target,
  Quote,
  CheckCircle2,
  Store,
  Bot,
  Megaphone,
  PackageCheck,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Showcase } from "@/lib/types";

const IMPACT_STATS = [
  {
    value: "30+",
    label: "UMKM Pendampingan",
    icon: <Store className="size-5" />,
  },
  {
    value: "5",
    label: "Modul Pembelajaran AI",
    icon: <GraduationCap className="size-5" />,
  },
  {
    value: "50+",
    label: "Prompt Bisnis Siap Pakai",
    icon: <Lightbulb className="size-5" />,
  },
  {
    value: "20+",
    label: "Template Digital UMKM",
    icon: <PackageCheck className="size-5" />,
  },
];

const FLOW_STEPS = [
  {
    icon: ClipboardCheck,
    title: "Assessment UMKM",
    desc: "Memetakan kondisi awal usaha & literasi digital peserta.",
  },
  {
    icon: Bot,
    title: "Pelatihan AI",
    desc: "Belajar praktis AI untuk kebutuhan branding & pemasaran.",
  },
  {
    icon: Megaphone,
    title: "Praktik Digitalisasi",
    desc: "Membuat aset digital: caption, katalog, konten.",
  },
  {
    icon: HandHeart,
    title: "Pendampingan",
    desc: "Mentor membimbing lewat challenge & feedback rutin.",
  },
  {
    icon: BarChart3,
    title: "Evaluasi Dampak",
    desc: "Mengukur perkembangan & dampak sosial program.",
  },
];

const MODULES_PREVIEW = [
  {
    icon: Sparkles,
    title: "AI untuk Transformasi UMKM",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Target,
    title: "Membangun Branding Digital",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Megaphone,
    title: "AI untuk Konten Marketing",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: PackageCheck,
    title: "Digitalisasi Produk UMKM",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: TrendingUp,
    title: "Strategi Pengembangan UMKM",
    color: "from-teal-500 to-emerald-600",
  },
];

export function LandingView() {
  const { setView } = useApp();
  const [stories, setStories] = useState<Showcase[]>([]);

  useEffect(() => {
    api
      .showcases()
      .then((r) => setStories(r.showcases.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-brand-gradient-soft">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 size-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div
            className="absolute right-0 top-40 size-80 rounded-full bg-green-300/30 blur-3xl animate-blob"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute bottom-0 left-1/3 size-72 rounded-full bg-blue-200/40 blur-3xl animate-blob"
            style={{ animationDelay: "6s" }}
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
          {/* Left: text */}
          <div className="flex flex-col gap-6">
            <Badge className="w-fit gap-1.5 rounded-full border-primary/20 bg-white/70 px-3 py-1.5 text-primary backdrop-blur">
              <Sparkles className="size-3.5" />
              Program Sociopreneur · Desa Bringin, Magelang
            </Badge>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              UMKM Naik Kelas
              <span className="block text-brand-gradient">Bersama AI</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Memberdayakan UMKM desa dengan teknologi AI untuk membangun
              branding digital, meningkatkan pemasaran, dan menciptakan peluang
              ekonomi baru.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => setView("learning")}
                className="bg-brand-gradient text-white shadow-lg shadow-primary/25 hover:opacity-90"
              >
                Mulai Belajar <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView("about")}
                className="border-primary/30 bg-white/60 backdrop-blur hover:bg-white"
              >
                <Play className="size-4" /> Jelajahi Program
              </Button>
            </div>

            {/* mini stats */}
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {IMPACT_STATS.slice(0, 3).map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="font-display text-2xl font-extrabold text-foreground">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual card */}
          <div className="relative">
            <div className="relative mx-auto max-w-md">
              {/* main card */}
              <div className="glass-card rounded-3xl border border-white/60 p-6 shadow-2xl shadow-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-gradient">
                      <Store className="size-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Sambal Bu Ani</div>
                      <div className="text-xs text-muted-foreground">
                        Kuliner · Desa Bringin
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Aktif</Badge>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      Progress Digitalisasi
                    </span>
                    <span className="font-bold text-primary">80%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {MODULES_PREVIEW.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1.5 rounded-xl bg-white/70 p-3 text-center"
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg bg-linear-to-br ${m.color}`}
                      >
                        <m.icon className="size-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium leading-tight text-muted-foreground">
                        Modul {i + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 p-3">
                  <Bot className="size-5 shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    AI membantu Bu Ani membuat{" "}
                    <span className="font-semibold text-foreground">
                      5 caption Instagram
                    </span>{" "}
                    dalam 1 menit.
                  </p>
                </div>
              </div>

              {/* floating badges */}
              <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-2xl border bg-white p-3 shadow-xl animate-float">
                <div className="flex size-9 items-center justify-center rounded-xl bg-green-100">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-bold">Omzet +35%</div>
                  <div className="text-[10px] text-muted-foreground">
                    setelah program
                  </div>
                </div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl border bg-white p-3 shadow-xl animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100">
                  <Star className="size-5 fill-blue-500 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">320 followers</div>
                  <div className="text-[10px] text-muted-foreground">
                    Instagram baru
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT PROGRAM ─── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tentang Program"
            title="Pemberdayaan Digital Berbasis AI untuk UMKM Desa"
            description="UMKM Naik Kelas Bersama AI merupakan program pemberdayaan digital yang membantu pelaku UMKM memahami dan memanfaatkan teknologi AI secara praktis untuk meningkatkan daya saing usaha."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: "Literasi AI Praktis",
                desc: "Mengubah AI yang terkesan rumit menjadi alat sederhana yang langsung bisa dipakai UMKM sehari-hari.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: HandHeart,
                title: "Pendampingan Mentor",
                desc: "Setiap UMKM didampingi mentor lewat challenge mingguan dan feedback berkala hingga naik kelas.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: TrendingUp,
                title: "Dampak Terukur",
                desc: "Perkembangan usaha dipantau lewat dashboard—dari literasi, aset digital, hingga pertumbuhan omzet.",
                color: "bg-emerald-100 text-emerald-600",
              },
            ].map((c) => (
              <Card
                key={c.title}
                className="group relative overflow-hidden border-border/60 transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl ${c.color} transition-transform group-hover:scale-110`}
                  >
                    <c.icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMPACT STATS ─── */}
      <section className="relative overflow-hidden bg-brand-gradient py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-0 size-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 size-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dampak Program"
            title={
              <span className="text-white">
                Pencapaian yang Nyata, Bukan Sekadar Janji
              </span>
            }
            description={
              <span className="text-white/80">
                Hasil program hingga saat ini dalam memberdayakan UMKM desa
                dengan AI.
              </span>
            }
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {IMPACT_STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-6 text-center backdrop-blur"
              >
                <div className="text-white/80">{s.icon}</div>
                <div className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                  {s.value}
                </div>
                <div className="text-sm font-medium text-white/80">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROGRAM FLOW ─── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Alur Program"
            title="5 Langkah Naik Kelas Bersama AI"
            description="Perjalanan terstruktur dari mengenal AI hingga merasakan dampak nyata bagi usaha."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {FLOW_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative flex size-16 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg shadow-primary/20">
                  <step.icon className="size-7 text-white" />
                  <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-sm font-bold">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.desc}
                </p>
                {i < FLOW_STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-6 hidden size-5 text-primary/40 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MODULES PREVIEW ─── */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Learning Center"
            title="5 Modul AI untuk UMKM"
            description="Kurikulum praktis yang dirancang khusus untuk pelaku UMKM desa—dari nol hingga mahir."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {MODULES_PREVIEW.map((m, i) => (
              <Card
                key={i}
                className="group cursor-pointer border-border/60 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent
                  className="flex flex-col items-start gap-3 p-5"
                  onClick={() => setView("learning")}
                >
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl bg-linear-to-br ${m.color} shadow-md transition-transform group-hover:scale-110`}
                  >
                    <m.icon className="size-5 text-white" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Modul {i + 1}
                  </div>
                  <h3 className="font-display text-sm font-bold leading-snug">
                    {m.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setView("learning")}
              variant="outline"
              className="gap-2"
            >
              Lihat Semua Modul <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── IMPACT STORIES ─── */}
      {/* <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Cerita Dampak"
            title="Kisah Nyata UMKM Sebelum & Sesudah Program"
            description="Dari usaha yang dulu hanya bertahan, kini berkembang berkat AI dan pendampingan."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {stories.length === 0
              ? // fallback skeleton cards
                [0, 1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="h-40 animate-pulse rounded-xl bg-muted" />
                    </CardContent>
                  </Card>
                ))
              : stories.map((s) => (
                  <Card
                    key={s.id}
                    className="group overflow-hidden border-border/60 transition-shadow hover:shadow-xl"
                  >
                    <CardContent className="p-0">
                      <div className="bg-brand-gradient-soft p-5">
                        <Quote className="size-7 text-primary/40" />
                        <h3 className="mt-2 font-display text-base font-bold leading-snug text-foreground">
                          {s.headline}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary" className="bg-white/70">
                            {s.umkm.category}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground">
                            {s.umkm.name}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 p-5">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Sebelum
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {s.beforeStory}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-green-600">
                            Sesudah
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-foreground">
                            {s.afterStory}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {s.achievements.slice(0, 2).map((a, j) => (
                            <span
                              key={j}
                              className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700"
                            >
                              <CheckCircle2 className="size-3" /> {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setView("showcase")}
              variant="outline"
              className="gap-2"
            >
              Lihat Semua Cerita <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section> */}

      {/* ─── CTA ─── */}
      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-center shadow-2xl shadow-primary/20 sm:p-14">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -left-10 top-0 size-60 rounded-full bg-white blur-3xl" />
              <div className="absolute -right-10 bottom-0 size-60 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative flex flex-col items-center gap-5">
              <Badge className="w-fit gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-white backdrop-blur">
                <Sparkles className="size-3.5" /> Bergabung Sekarang
              </Badge>
              <h2 className="max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
                Siap Membawa UMKM Anda Naik Kelas?
              </h2>
              <p className="max-w-xl text-white/80">
                Mulai perjalanan digital Anda hari ini. Belajar AI, buat aset
                digital, dan kembangkan usaha bersama mentor.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {/* <Button
                  size="lg"
                  onClick={() => setView("login")}
                  className="bg-white text-primary shadow-lg hover:bg-white/90"
                >
                  Masuk Akun <ArrowRight className="size-4" />
                </Button> */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setView("learning")}
                  className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                >
                  <GraduationCap className="size-4" /> Mulai Belajar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
