"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section";
import {
  Sparkles,
  Target,
  Lightbulb,
  Users,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Bot,
  BookOpen,
  TrendingUp,
  HandHeart,
} from "lucide-react";

const PROBLEMS = [
  {
    title: "Literasi Digital Rendah",
    desc: "Banyak pelaku UMKM desa kesulitan memanfaatkan teknologi digital untuk pemasaran.",
  },
  {
    title: "Branding Belum Optimal",
    desc: "Produk unggulan belum memiliki identitas brand yang menarik dan konsisten.",
  },
  {
    title: "Promosi Terbatas",
    desc: "Pemasaran masih mengandalkan mulut ke muluk, jangkauan pelanggan sempit.",
  },
  {
    title: "Aset Digital Kurang",
    desc: "Belum ada caption, katalog, maupun konten yang siap dipublikasikan.",
  },
];

const SOLUTIONS = [
  {
    icon: BookOpen,
    title: "Pembelajaran AI Bertahap",
    desc: "5 modul praktis dari pengenalan AI hingga strategi pengembangan usaha.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Bot,
    title: "Prompt Library UMKM",
    desc: "50+ prompt siap pakai untuk caption, deskripsi, ide konten, dan branding.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Target,
    title: "Template Digital",
    desc: "6 template siap isi: profil usaha, bio Instagram, kalender konten, dan lainnya.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: HandHeart,
    title: "Pendampingan Mentor",
    desc: "Challenge mingguan dengan feedback langsung dari mentor berpengalaman.",
    color: "bg-cyan-100 text-cyan-600",
  },
];

const TEAM = [
  {
    name: "Nurdana Ahmad Fadil",
    role: "Program Lead",
    desc: "Mengarahkan strategi & operasional program.",
    initials: "NAF",
    color: "bg-blue-500",
  },
  {
    name: "Novia Hasna Salsabilla",
    role: "Mentor & AI Trainer",
    desc: "Mendampingi UMKM & menyusun kurikulum AI.",
    initials: "NHS",
    color: "bg-green-500",
  },
  {
    name: "Hanif",
    role: "Community Manager",
    desc: "Menjaga hubungan dengan peserta & mitra desa.",
    initials: "SN",
    color: "bg-emerald-500",
  },
];

const PARTNERS = [
  { name: "Pemerintah Desa Bringin", type: "Pemerintahan" },
  // { name: "Kecamatan Srumbung", type: "Pemerintahan" },
  // { name: "Universitas Magelang", type: "Akademik" },
  // { name: "Koperasi UMKM Magelang", type: "Koperasi" },
  // { name: "Komunitas Digital Desa", type: "Komunitas" },
  // { name: "Local Tech Hub Jateng", type: "Teknologi" },
];

export function AboutView() {
  const { setView } = useApp();
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient-soft py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 size-72 rounded-full bg-primary/15 blur-3xl animate-blob" />
          <div
            className="absolute right-0 bottom-0 size-80 rounded-full bg-green-300/25 blur-3xl animate-blob"
            style={{ animationDelay: "4s" }}
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-primary backdrop-blur">
            <MapPin className="size-3.5" /> Desa Bringin · Kec. Srumbung · Kab.
            Magelang
          </Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Tentang Program
            <span className="block text-brand-gradient">
              UMKM Naik Kelas Bersama AI
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Inisiatif sociopreneur yang berawal dari edukasi AI di Desa Bringin,
            kini berkembang menjadi platform scale-up untuk memberdayakan lebih
            banyak UMKM desa di Indonesia.
          </p>
        </div>
      </section>

      {/* Latar Belakang */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-5">
              <SectionHeader
                eyebrow="Latar Belakang"
                align="left"
                title="UMKM Desa Punya Potensi, Tapi Terhambat Literasi Digital"
              />
              <p className="text-muted-foreground">
                UMKM adalah tulang punggung ekonomi desa. Namun, banyak pelaku
                UMKM di Desa Bringin dan sekitarnya masih menghadapi tantangan
                dalam memanfaatkan teknologi—terutama AI—untuk mengembangkan
                usaha mereka.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PROBLEMS.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-xl border border-border/60 bg-muted/30 p-4"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        ✕
                      </div>
                      <div>
                        <div className="text-sm font-bold">{p.title}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {p.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-border/60 bg-brand-gradient-soft p-8 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-md">
                    <Lightbulb className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold">
                      Visi Program
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pemberdayaan berkelanjutan
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground">
                  Menjadikan AI sebagai jembatan agar UMKM desa bisa naik
                  kelas—dari usaha rumahan yang terbatas, menjadi bisnis digital
                  yang berkembang dan berdaya saing.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { v: "Literasi", l: "AI bertumbuh" },
                    { v: "Aset", l: "digital terbentuk" },
                    { v: "Dampak", l: "terukur & luas" },
                  ].map((x) => (
                    <div
                      key={x.l}
                      className="rounded-xl bg-white/70 p-3 text-center backdrop-blur"
                    >
                      <div className="font-display text-sm font-bold text-primary">
                        {x.v}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {x.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solusi Berbasis AI */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Solusi Berbasis AI"
            title="Empat Pilar Pemberdayaan UMKM"
            description="Pendekatan terintegrasi yang membuat AI benar-benar bisa dipakai UMKM desa."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS.map((s) => (
              <Card
                key={s.title}
                className="group border-border/60 transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl ${s.color} transition-transform group-hover:scale-110`}
                  >
                    <s.icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tim Pengembang"
            title="Tim di Balik Program"
            description="Tim multidisiplin yang berdedikasi untuk pemberdayaan UMKM desa."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((t) => (
              <Card
                key={t.name}
                className="text-center transition-shadow hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center p-6">
                  <div
                    className={`flex size-16 items-center justify-center rounded-full ${t.color} font-display text-xl font-bold text-white shadow-md`}
                  >
                    {t.initials}
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold">
                    {t.name}
                  </h3>
                  <div className="text-xs font-semibold text-primary">
                    {t.role}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mitra */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Mitra Program"
            title="Bersama Membangun Ekosistem UMKM Desa"
            description="Berkolaborasi dengan berbagai pihak untuk memperluas dampak program."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient-soft">
                  <HeartHandshake className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border bg-brand-gradient-soft p-8 text-center sm:p-12">
            <Sparkles className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
              Bergabung dan Jadilah Bagian dari Perubahan
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Program ini terbuka untuk UMKM desa yang ingin naik kelas bersama
              AI.
            </p>
            {/* <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => setView("login")}
                className="bg-brand-gradient text-white shadow-lg hover:opacity-90"
              >
                Mulai Sekarang <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" onClick={() => setView("showcase")}>
                <TrendingUp className="size-4" /> Lihat Dampak
              </Button>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
