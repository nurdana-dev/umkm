"use client";

import { useEffect, useState, useCallback } from "react";
import { useApp } from "@/lib/store";
import { api, LESSON_TYPE_META } from "@/lib/api";
import type { Module, Lesson } from "@/lib/types";
import { SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Palette,
  Megaphone,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowRight,
  Loader2,
  Play,
  Lock,
  GraduationCap,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MODULE_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  palette: Palette,
  megaphone: Megaphone,
  "shopping-bag": ShoppingBag,
  "trending-up": TrendingUp,
};

export function LearningView() {
  const { user, setView } = useApp();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .modules(user?.umkm?.id)
      .then((res) => {
        if (!cancelled) setModules(res.modules);
      })
      .catch(() => {
        if (!cancelled) toast.error("Gagal memuat modul pembelajaran");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.umkm?.id]);

  const handleToggleLesson = useCallback(
    async (lessonId: string, completed: boolean) => {
      if (!user?.umkm) return;
      setTogglingId(lessonId);
      // Optimistic update
      setModules((prev) =>
        prev.map((m) => {
          if (!m.lessons.some((l) => l.id === lessonId)) return m;
          const lessons = m.lessons.map((l) =>
            l.id === lessonId ? { ...l, completed } : l,
          );
          const completedCount = lessons.filter((l) => l.completed).length;
          const totalCount = lessons.length;
          const progressPercent = totalCount
            ? Math.round((completedCount / totalCount) * 100)
            : 0;
          return { ...m, lessons, completedCount, totalCount, progressPercent };
        }),
      );
      // Also update the open dialog module
      setSelectedModule((prev) => {
        if (!prev) return prev;
        const lessons = prev.lessons.map((l) =>
          l.id === lessonId ? { ...l, completed } : l,
        );
        const completedCount = lessons.filter((l) => l.completed).length;
        const totalCount = lessons.length;
        const progressPercent = totalCount
          ? Math.round((completedCount / totalCount) * 100)
          : 0;
        return {
          ...prev,
          lessons,
          completedCount,
          totalCount,
          progressPercent,
        };
      });
      try {
        await api.toggleLesson(user.umkm!.id, lessonId, completed);
        toast.success(
          completed ? "Materi selesai! 🎉" : "Status materi dibatalkan",
        );
      } catch {
        // Revert on failure
        setModules((prev) =>
          prev.map((m) => {
            if (!m.lessons.some((l) => l.id === lessonId)) return m;
            const lessons = m.lessons.map((l) =>
              l.id === lessonId ? { ...l, completed: !completed } : l,
            );
            const completedCount = lessons.filter((l) => l.completed).length;
            const totalCount = lessons.length;
            const progressPercent = totalCount
              ? Math.round((completedCount / totalCount) * 100)
              : 0;
            return {
              ...m,
              lessons,
              completedCount,
              totalCount,
              progressPercent,
            };
          }),
        );
        toast.error("Gagal menyimpan progress");
      } finally {
        setTogglingId(null);
      }
    },
    [user?.umkm],
  );

  const isLoggedIn = !!user?.umkm;

  return (
    <div className="bg-muted/20">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-brand-gradient-soft">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <SectionHeader
            eyebrow="Learning Center"
            title="5 Modul Praktis AI untuk UMKM Desa"
            description="Perjalanan belajar bertahap dari nol hingga mahir menggunakan AI untuk menumbuhkan usaha Anda. Setiap modul berisi materi, video, studi kasus, dan latihan praktis."
          />

          {/* Quick stats */}
          {!loading && modules.length > 0 && (
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3">
              <QuickStat
                icon={BookOpen}
                value={`${modules.reduce((a, m) => a + m.totalCount, 0)}`}
                label="Total Materi"
              />
              <QuickStat
                icon={Clock}
                value={
                  modules.reduce((a, m) => {
                    const mins = parseInt(m.duration) || 0;
                    return a + mins;
                  }, 0) + "m"
                }
                label="Estimasi Waktu"
              />
              <QuickStat
                icon={GraduationCap}
                value={
                  isLoggedIn
                    ? `${modules.filter((m) => m.progressPercent === 100).length}/${modules.length}`
                    : `${modules.length}`
                }
                label={isLoggedIn ? "Modul Selesai" : "Modul Tersedia"}
              />
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <BookOpen className="size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Modul pembelajaran belum tersedia.
            </p>
          </div>
        ) : (
          <>
            {/* Learning path roadmap (visual connector) */}
            <LearningPath modules={modules} isLoggedIn={isLoggedIn} />

            {/* Module list */}
            {!isLoggedIn ? (
              <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:justify-between sm:gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Lock className="size-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Masuk untuk melihat materi belajar Anda
                  </p>
                </div>
                <Button
                  onClick={() => setView("login")}
                  size="sm"
                  className="shrink-0 bg-brand-gradient text-white"
                >
                  Masuk <ArrowRight className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((m, idx) => {
                  const Icon = MODULE_ICONS[m.icon] ?? Sparkles;
                  const isDone = m.progressPercent === 100;
                  const isInProgress =
                    isLoggedIn && m.progressPercent > 0 && !isDone;
                  return (
                    <ModuleCard
                      key={m.id}
                      module={m}
                      icon={Icon}
                      isLoggedIn={isLoggedIn}
                      isDone={isDone}
                      isInProgress={isInProgress}
                      onOpen={() => setSelectedModule(m)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Module detail dialog */}
      <Dialog
        open={!!selectedModule}
        onOpenChange={(open) => !open && setSelectedModule(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selectedModule && (
            <ModuleDetail
              module={selectedModule}
              isLoggedIn={isLoggedIn}
              togglingId={togglingId}
              onToggle={handleToggleLesson}
              onLogin={() => setView("login")}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function QuickStat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card/80 p-3 text-center shadow-sm backdrop-blur">
      <Icon className="size-4 text-primary" />
      <div className="font-display text-lg font-extrabold text-foreground">
        {value}
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function LearningPath({
  modules,
  isLoggedIn,
}: {
  modules: Module[];
  isLoggedIn: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <GraduationCap className="size-4 text-primary" />
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
          Alur Belajar
        </h3>
      </div>
      <ol className="flex flex-col gap-0 sm:flex-row sm:items-center sm:gap-0">
        {modules.map((m, i) => {
          const Icon = MODULE_ICONS[m.icon] ?? Sparkles;
          const isDone = isLoggedIn && m.progressPercent === 100;
          const isCurrent =
            isLoggedIn &&
            !isDone &&
            m.progressPercent > 0 &&
            (i === 0 || modules[i - 1].progressPercent === 100);
          return (
            <li
              key={m.id}
              className="relative flex flex-1 items-center gap-3 sm:flex-col sm:text-center"
            >
              {/* Connector line */}
              {i < modules.length - 1 && (
                <div className="absolute left-5 top-1/2 hidden h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2 bg-border sm:block" />
              )}
              {/* Vertical connector on mobile */}
              {i < modules.length - 1 && (
                <div className="absolute left-5 top-10 h-[calc(100%-1rem)] w-0.5 bg-border sm:hidden" />
              )}
              <div
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  isDone
                    ? "border-green-500 bg-green-500 text-white"
                    : isCurrent
                      ? "border-primary bg-brand-gradient text-white shadow-lg shadow-primary/30"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1 pb-3 sm:pb-0 sm:pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Modul {m.order}
                </div>
                <div className="truncate text-xs font-semibold text-foreground sm:text-[13px]">
                  {m.title}
                </div>
                {isLoggedIn && (
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {m.progressPercent}%
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ModuleCard({
  module: m,
  icon: Icon,
  isLoggedIn,
  isDone,
  isInProgress,
  onOpen,
}: {
  module: Module;
  icon: LucideIcon;
  isLoggedIn: boolean;
  isDone: boolean;
  isInProgress: boolean;
  onOpen: () => void;
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden py-0 transition-all hover:-translate-y-1 hover:shadow-lg",
        isDone
          ? "border-green-200"
          : isInProgress
            ? "border-primary/30"
            : "border-border/60",
      )}
    >
      {/* Top gradient strip */}
      <div className="h-1.5 w-full bg-brand-gradient" />
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="font-display text-4xl font-extrabold leading-none text-brand-gradient">
              {m.order}
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-primary transition-transform group-hover:scale-105">
              <Icon className="size-5" />
            </div>
          </div>
          {isDone && (
            <Badge className="bg-green-100 text-green-700">Selesai</Badge>
          )}
          {isInProgress && (
            <Badge className="bg-primary/10 text-primary">Berlangsung</Badge>
          )}
        </div>

        <div>
          <h3 className="font-display text-lg font-bold leading-tight text-foreground">
            {m.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{m.subtitle}</p>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {m.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {m.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <BarChart3 className="size-3.5" /> {m.level}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5" /> {m.totalCount} materi
          </span>
        </div>

        {isLoggedIn && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Progress
              </span>
              <span className="font-semibold text-foreground">
                {m.completedCount}/{m.totalCount} · {m.progressPercent}%
              </span>
            </div>
            <Progress value={m.progressPercent} className="h-1.5" />
          </div>
        )}

        <Button
          onClick={onOpen}
          className="mt-1 w-full bg-brand-gradient text-white hover:opacity-90"
        >
          Lihat Materi <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ModuleDetail({
  module: m,
  isLoggedIn,
  togglingId,
  onToggle,
  onLogin,
}: {
  module: Module;
  isLoggedIn: boolean;
  togglingId: string | null;
  onToggle: (lessonId: string, completed: boolean) => void;
  onLogin: () => void;
}) {
  const Icon = MODULE_ICONS[m.icon] ?? Sparkles;
  return (
    <>
      <DialogHeader className="gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md">
            <Icon className="size-6" />
          </div>
          <div className="pr-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Modul {m.order} · {m.level}
            </div>
            <DialogTitle className="font-display text-xl font-extrabold leading-tight">
              {m.title}
            </DialogTitle>
          </div>
        </div>
        <DialogDescription>{m.subtitle}</DialogDescription>
      </DialogHeader>

      {/* Module meta */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {m.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen className="size-3.5" /> {m.totalCount} materi
        </span>
        {isLoggedIn && (
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-3.5 text-green-600" />
            {m.completedCount}/{m.totalCount} selesai · {m.progressPercent}%
          </span>
        )}
      </div>

      {isLoggedIn && (
        <div className="space-y-1.5">
          <Progress value={m.progressPercent} className="h-2" />
        </div>
      )}

      <p className="text-sm text-muted-foreground">{m.description}</p>

      {/* Lessons */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            Daftar Materi
          </h4>
          <div className="h-px flex-1 bg-border" />
        </div>

        {m.lessons.map((lesson, idx) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            index={idx}
            isLoggedIn={isLoggedIn}
            togglingId={togglingId}
            onToggle={onToggle}
            onLogin={onLogin}
          />
        ))}
      </div>
    </>
  );
}

function LessonRow({
  lesson,
  index,
  isLoggedIn,
  togglingId,
  onToggle,
  onLogin,
}: {
  lesson: Lesson;
  index: number;
  isLoggedIn: boolean;
  togglingId: string | null;
  onToggle: (lessonId: string, completed: boolean) => void;
  onLogin: () => void;
}) {
  const meta = LESSON_TYPE_META[lesson.type] ?? LESSON_TYPE_META.materi;
  const isCompleted = !!lesson.completed;
  const isToggling = togglingId === lesson.id;
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        isCompleted
          ? "border-green-200 bg-green-50/40"
          : "border-border/60 bg-card hover:border-primary/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("gap-1", meta.color)}>
              <span>{meta.emoji}</span>
              {meta.label}
            </Badge>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" /> {lesson.duration}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
                <CheckCircle2 className="size-3.5" /> Selesai
              </span>
            )}
          </div>
          <h5
            className={cn(
              "mt-2 font-display text-sm font-bold leading-tight text-foreground",
              isCompleted && "text-muted-foreground line-through decoration-1",
            )}
          >
            {lesson.title}
          </h5>

          {/* Content body */}
          {lesson.type === "video" ? (
            <div className="mt-3 flex aspect-video items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-gradient text-white shadow-md">
                  <Play className="size-5 fill-white" />
                </div>
                <span className="text-xs font-medium">Video Pembelajaran</span>
                <span className="text-[10px]">Klik untuk memutar (demo)</span>
              </div>
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
              {lesson.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
