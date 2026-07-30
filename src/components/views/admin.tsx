"use client";

import { useApp } from "@/lib/store";
import { api, CATEGORY_META } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import { SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Store,
  GraduationCap,
  FileText,
  TrendingUp,
  CheckCircle2,
  Trophy,
  Loader2,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  LayoutGrid,
  Image as ImageIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// Palette
const COLOR_BLUE = "#2563eb";
const COLOR_GREEN = "#16a34a";
const COLOR_LIGHT_BLUE = "#60a5fa";
const COLOR_LIGHT_GREEN = "#4ade80";

// Category -> chart color mapping
const CATEGORY_CHART_COLOR: Record<string, string> = {
  kuliner: "#f59e0b",
  fashion: "#ec4899",
  kerajinan: "#a16207",
  pertanian: "#16a34a",
  jasa: "#2563eb",
};

const BUCKET_LABELS = ["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"];
const BUCKET_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#22c55e",
  "#16a34a",
];

export function AdminView() {
  const { user, setView } = useApp();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allowed = !!user && (user.role === "admin" || user.role === "mentor");

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    api
      .dashboard()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e?.message ?? "Gagal memuat data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [allowed]);

  // ---- Auth guard (safety net) ----
  if (!allowed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <ShieldAlert className="size-8" />
        </div>
        <h2 className="font-display text-2xl font-bold">Akses terbatas untuk Admin &amp; Mentor</h2>
        <p className="text-sm text-muted-foreground">
          Halaman monitoring dampak program ini hanya tersedia untuk akun Admin
          atau Mentor. Silakan masuk dengan akun yang sesuai.
        </p>
        <Button onClick={() => setView("login")} className="bg-brand-gradient text-white">
          Masuk ke Akun
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <SectionHeader
          align="left"
          eyebrow="Program Impact Dashboard"
          title="Monitoring & Dampak Program"
          description="Pantau perkembangan UMKM, progress pembelajaran, dan dampak program secara real-time."
        />

        {/* Welcome line */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Halo,</span>
          <span className="font-semibold text-foreground">{user.name}</span>
          <Badge
            className={cn(
              "capitalize",
              user.role === "admin"
                ? "bg-primary/10 text-primary"
                : "bg-green-100 text-green-700"
            )}
          >
            {user.role}
          </Badge>
        </div>

        {loading ? (
          <div className="mt-12 flex h-72 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
            <ShieldAlert className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Coba lagi
            </Button>
          </div>
        ) : data ? (
          <div className="mt-8 flex flex-col gap-6">
            {/* ---- Top KPI cards ---- */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                icon={Store}
                label="UMKM Terdaftar"
                value={data.stats.totalUmkm}
                gradient="from-blue-500 to-blue-600"
              />
              <KpiCard
                icon={Users}
                label="UMKM Aktif"
                value={data.stats.activeUmkm}
                subtext="sedang dalam program"
                gradient="from-cyan-500 to-blue-500"
              />
              <KpiCard
                icon={TrendingUp}
                label="Rata-rata Progress"
                value={`${data.stats.avgDigitization}%`}
                progress={data.stats.avgDigitization}
                gradient="from-blue-500 to-green-500"
              />
              <KpiCard
                icon={FileText}
                label="Konten Digital Dibuat"
                value={data.stats.contentProduced}
                subtext="prompt, template & showcase"
                gradient="from-green-500 to-emerald-600"
              />
            </div>

            {/* ---- Secondary stats row ---- */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MiniStat
                icon={CheckCircle2}
                label="Modul Selesai"
                value={`${data.stats.completionRate}%`}
                color="text-green-600 bg-green-100"
              />
              <MiniStat
                icon={Sparkles}
                label="Total Prompt"
                value={data.stats.totalPrompts}
                color="text-blue-600 bg-blue-100"
              />
              <MiniStat
                icon={LayoutGrid}
                label="Total Template"
                value={data.stats.totalTemplates}
                color="text-purple-600 bg-purple-100"
              />
              <MiniStat
                icon={Trophy}
                label="Total Showcase"
                value={data.stats.totalShowcase}
                color="text-amber-600 bg-amber-100"
              />
            </div>

            {/* ---- Charts row 1 ---- */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard
                icon={BarChart3}
                title="UMKM per Kategori"
                description="Distribusi peserta berdasarkan kategori usaha"
              >
                <CategoryPie data={data.categoryDist} />
              </ChartCard>

              <ChartCard
                icon={TrendingUp}
                title="Sebaran Progress Digitalisasi"
                description="Jumlah UMKM pada setiap rentang progress digitalisasi"
              >
                <DigitizationBar buckets={data.digitizationBuckets} />
              </ChartCard>
            </div>

            {/* ---- Charts row 2 ---- */}
            <ChartCard
              icon={GraduationCap}
              title="Penyelesaian Modul"
              description="Persentase rata-rata penyelesaian per modul di seluruh UMKM"
            >
              <ModuleBar modules={data.moduleStats} />
            </ChartCard>

            {/* ---- Top UMKM table ---- */}
            <Card className="rounded-2xl">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  <Trophy className="size-4 text-amber-600" /> UMKM dengan Progress Tertinggi
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Top {Math.min(8, data.topUmkm.length)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto scrollbar-thin rounded-xl border border-border/60">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card">
                      <TableRow>
                        <TableHead className="pl-4">UMKM</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="min-w-[160px]">Progress</TableHead>
                        <TableHead className="pr-4 text-right">Materi Selesai</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.topUmkm.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                            Belum ada data UMKM.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.topUmkm.map((u, idx) => {
                          const meta = CATEGORY_META[u.category];
                          return (
                            <TableRow key={u.id}>
                              <TableCell className="pl-4">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={cn(
                                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                      idx < 3
                                        ? "bg-brand-gradient text-white"
                                        : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    {idx + 1}
                                  </span>
                                  <span className="line-clamp-1 font-medium text-foreground">
                                    {u.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {meta ? (
                                  <Badge variant="secondary" className={cn("gap-1", meta.color)}>
                                    <span>{meta.emoji}</span> {meta.label}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="capitalize">{u.category}</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={u.digitization} className="h-2 flex-1" />
                                  <span className="w-9 text-right text-xs font-semibold text-foreground">
                                    {u.digitization}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="pr-4 text-right">
                                <span className="inline-flex items-center gap-1 font-medium">
                                  <CheckCircle2 className="size-3.5 text-green-600" />
                                  {u.completedLessons}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* ---- Bottom CTA ---- */}
            <div className="grid gap-4 sm:grid-cols-2">
              <CtaCard
                icon={ImageIcon}
                title="Lihat Showcase"
                description="Jelajahi karya dan cerita sukses para UMKM peserta program."
                cta="Buka Showcase"
                onClick={() => setView("showcase")}
              />
              <CtaCard
                icon={GraduationCap}
                title="Kelola Pembelajaran"
                description="Pantau modul, materi, dan progress belajar peserta."
                cta="Buka Learning"
                onClick={() => setView("learning")}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function KpiCard({
  icon: Icon,
  label,
  value,
  subtext,
  progress,
  gradient,
}: {
  icon: typeof Store;
  label: string;
  value: string | number;
  subtext?: string;
  progress?: number;
  gradient: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-brand-gradient-soft opacity-60 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-brand-gradient">
            {value}
          </div>
          {subtext && (
            <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>
          )}
          {typeof progress === "number" && (
            <div className="mt-3">
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
            gradient
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Store;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className={cn("flex size-10 items-center justify-center rounded-xl", color)}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-xl font-extrabold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Store;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient-soft text-primary">
            <Icon className="size-4" />
          </span>
          {title}
        </CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CategoryPie({ data }: { data: { category: string; _count: number }[] }) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: CATEGORY_META[d.category]?.label ?? d.category,
        value: d._count,
        category: d.category,
      })),
    [data]
  );

  if (chartData.length === 0) {
    return <EmptyChart />;
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={45}
            paddingAngle={2}
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.category}
                fill={CATEGORY_CHART_COLOR[entry.category] ?? COLOR_BLUE}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid oklch(0.91 0.01 220)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              fontSize: 12,
            }}
            formatter={(v: number, n: string) => [`${v} UMKM`, n]}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => <span className="text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function DigitizationBar({ buckets }: { buckets: number[] }) {
  const chartData = useMemo(
    () =>
      BUCKET_LABELS.map((label, i) => ({
        label,
        value: buckets[i] ?? 0,
        fill: BUCKET_COLORS[i],
      })),
    [buckets]
  );

  const total = chartData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.91 0.01 220)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "oklch(0.5 0.02 240)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "oklch(0.5 0.02 240)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "oklch(0.95 0.02 220)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid oklch(0.91 0.01 220)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              fontSize: 12,
            }}
            formatter={(v: number) => [
              `${v} UMKM${total > 0 ? ` (${Math.round((v / total) * 100)}%)` : ""}`,
              "Jumlah",
            ]}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ModuleBar({
  modules,
}: {
  modules: DashboardStats["moduleStats"];
}) {
  const chartData = useMemo(
    () =>
      [...modules]
        .sort((a, b) => a.order - b.order)
        .map((m) => ({
          name:
            m.title.length > 28 ? m.title.slice(0, 26).trimEnd() + "…" : m.title,
          fullName: m.title,
          percent: m.percent,
          order: m.order,
        })),
    [modules]
  );

  if (chartData.length === 0) {
    return <EmptyChart />;
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.91 0.01 220)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "oklch(0.5 0.02 240)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "oklch(0.4 0.03 240)" }}
            tickLine={false}
            axisLine={false}
            width={180}
          />
          <Tooltip
            cursor={{ fill: "oklch(0.95 0.02 220)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid oklch(0.91 0.01 220)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              fontSize: 12,
            }}
            formatter={(v: number, _n: string, p: { payload?: { fullName?: string } }) => [
              `${v}% selesai`,
              p?.payload?.fullName ?? "Modul",
            ]}
          />
          <Bar dataKey="percent" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.percent >= 75
                    ? COLOR_GREEN
                    : entry.percent >= 50
                      ? COLOR_LIGHT_GREEN
                      : entry.percent >= 25
                        ? COLOR_BLUE
                        : COLOR_LIGHT_BLUE
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-muted-foreground">
      <BarChart3 className="size-8 opacity-40" />
      <p className="text-xs">Belum ada data untuk ditampilkan.</p>
    </div>
  );
}

function CtaCard({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
}: {
  icon: typeof Store;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl">
      <div className="flex items-center gap-4 p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md transition-transform group-hover:scale-105">
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <Button
          onClick={onClick}
          className="bg-brand-gradient text-white"
        >
          {cta} <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
