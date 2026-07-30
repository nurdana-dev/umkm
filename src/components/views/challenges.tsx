"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { api } from "@/lib/api";
import type { Challenge, ChallengeSubmission } from "@/lib/types";
import { SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Trophy,
  Calendar,
  CheckCircle2,
  Clock,
  Upload,
  MessageSquare,
  ArrowRight,
  Loader2,
  Lock,
  PlayCircle,
  AlertCircle,
  ChevronDown,
  BookOpen,
  Sparkles,
  Store,
  LogIn,
} from "lucide-react";

type SubmissionStatus = "belum" | "proses" | "selesai";

function getSubmission(challenge: Challenge): ChallengeSubmission | undefined {
  return challenge.submissions?.[0];
}

function getStatus(challenge: Challenge): SubmissionStatus {
  const sub = getSubmission(challenge);
  if (sub?.status === "selesai") return "selesai";
  if (sub?.status === "proses") return "proses";
  return "belum";
}

const STATUS_META: Record<
  SubmissionStatus,
  { label: string; color: string; ringColor: string; badge: string }
> = {
  belum: {
    label: "Belum Mulai",
    color: "bg-muted text-muted-foreground",
    ringColor: "bg-muted text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
  proses: {
    label: "Dalam Proses",
    color: "bg-blue-100 text-blue-700",
    ringColor: "bg-brand-gradient text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  selesai: {
    label: "Selesai",
    color: "bg-green-100 text-green-700",
    ringColor: "bg-brand-gradient text-white",
    badge: "bg-green-100 text-green-700",
  },
};

export function ChallengesView() {
  const { user, setView } = useApp();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Submission dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Expanded instructions (track by challenge id)
  const [openInstructions, setOpenInstructions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user?.umkm) return;
    setLoading(true);
    api
      .challenges(user.umkm.id)
      .then((res) => setChallenges(res.challenges))
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "Gagal memuat challenge");
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Auth guard — safety net (parent page.tsx already redirects when !user)
  if (!user) {
    return (
      <div className="bg-brand-gradient-soft">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-gradient shadow-lg">
            <LogIn className="size-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold">Masuk untuk mengikuti Challenge</h2>
          <p className="text-sm text-muted-foreground">
            Challenge & pendampingan mentor hanya tersedia untuk peserta yang telah masuk.
            Silakan login dengan akun UMKM Anda.
          </p>
          <Button onClick={() => setView("login")} className="bg-brand-gradient text-white">
            Masuk Sekarang <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (user && !user.umkm) {
    return (
      <div className="bg-brand-gradient-soft">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-lg">
            <Store className="size-8" />
          </div>
          <h2 className="font-display text-2xl font-bold">Akun Anda belum terhubung ke profil UMKM</h2>
          <p className="text-sm text-muted-foreground">
            Hubungi admin program untuk menghubungkan akun ini dengan profil UMKM Anda agar dapat
            mengikuti challenge mingguan.
          </p>
          <Button onClick={() => setView("landing")} variant="outline">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const totalChallenges = challenges.length || 5;
  const selesaiCount = challenges.filter((c) => getStatus(c) === "selesai").length;
  const prosesCount = challenges.filter((c) => getStatus(c) === "proses").length;
  const belumCount = challenges.filter((c) => getStatus(c) === "belum").length;

  const openSubmissionDialog = (challenge: Challenge) => {
    const sub = getSubmission(challenge);
    setActiveChallengeId(challenge.id);
    setDraftContent(sub?.content ?? "");
    setDialogOpen(true);
  };

  const handleSave = async (kind: "draft" | "submit") => {
    if (!user?.umkm || !activeChallengeId) return;
    if (!draftContent.trim()) {
      toast.error("Tuliskan hasil praktik Anda terlebih dahulu");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        challengeId: activeChallengeId,
        umkmId: user.umkm.id,
        status: "proses" as const,
        content: draftContent.trim(),
      };
      await api.saveSubmission(payload);
      // Update local state
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id !== activeChallengeId) return c;
          const existing = c.submissions?.[0];
          const newSub: ChallengeSubmission = {
            id: existing?.id ?? `tmp-${Date.now()}`,
            challengeId: c.id,
            umkmId: user.umkm!.id,
            status: "proses",
            content: draftContent.trim(),
            feedback: existing?.feedback ?? null,
            mentorId: existing?.mentorId ?? null,
            updatedAt: new Date().toISOString(),
            umkm: existing?.umkm,
          };
          return { ...c, submissions: [newSub] };
        })
      );
      setDialogOpen(false);
      if (kind === "submit") {
        toast.success("Challenge dikumpulkan! Mentor akan memberi feedback.");
      } else {
        toast.success("Draft tersimpan. Lanjutkan kapan saja.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan submission");
    } finally {
      setSaving(false);
    }
  };

  const activeChallenge = challenges.find((c) => c.id === activeChallengeId) ?? null;

  return (
    <div className="bg-brand-gradient-soft">
      {/* Page header */}
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Challenge & Pendampingan"
          title="Tantangan Mingguan Bersama Mentor"
          description="Selesaikan challenge setiap minggu, unggah hasil praktik, dan dapatkan feedback langsung dari mentor pendamping."
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Summary stats row */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatChip
            icon={Trophy}
            label="Total Challenge"
            value={totalChallenges}
            color="bg-brand-gradient text-white"
          />
          <StatChip
            icon={CheckCircle2}
            label="Selesai"
            value={selesaiCount}
            color="bg-green-100 text-green-700"
          />
          <StatChip
            icon={Clock}
            label="Dalam Proses"
            value={prosesCount}
            color="bg-blue-100 text-blue-700"
          />
          <StatChip
            icon={Lock}
            label="Belum Mulai"
            value={belumCount}
            color="bg-muted text-muted-foreground"
          />
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : challenges.length === 0 ? (
          <Card className="rounded-2xl border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <Trophy className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Belum ada challenge tersedia. Silakan kembali lagi nanti.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative flex flex-col gap-4">
            {challenges.map((challenge, idx) => {
              const status = getStatus(challenge);
              const sub = getSubmission(challenge);
              const meta = STATUS_META[status];
              const isLast = idx === challenges.length - 1;
              const instructions = challenge.instructions
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              const instrOpen = !!openInstructions[challenge.id];

              return (
                <div key={challenge.id} className="relative flex gap-4 sm:gap-5">
                  {/* Timeline rail (left column) */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-full font-display text-base font-extrabold shadow-md",
                        meta.ringColor
                      )}
                    >
                      {status === "selesai" ? (
                        <CheckCircle2 className="size-6" />
                      ) : (
                        challenge.week
                      )}
                    </div>
                    {!isLast && (
                      <div className="mt-1 w-0.5 flex-1 bg-gradient-to-b from-border to-border/40" />
                    )}
                  </div>

                  {/* Challenge card */}
                  <Card
                    className={cn(
                      "flex-1 overflow-hidden rounded-2xl transition-all",
                      status === "proses" && "border-primary/30 shadow-md",
                      status === "selesai" && "border-green-200/60"
                    )}
                  >
                    <CardContent className="flex flex-col gap-4 py-5">
                      {/* Top row: badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="gap-1 rounded-full bg-brand-gradient text-white">
                          <Calendar className="size-3" /> Minggu {challenge.week}
                        </Badge>
                        <Badge className={cn("rounded-full", meta.badge)}>{meta.label}</Badge>
                        {challenge.module && (
                          <button
                            onClick={() => setView("learning")}
                            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            <BookOpen className="size-3.5" /> Lihat di Modul
                            <ArrowRight className="size-3" />
                          </button>
                        )}
                      </div>

                      {/* Title + description */}
                      <div>
                        <h3 className="font-display text-lg font-bold tracking-tight">
                          {challenge.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{challenge.description}</p>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>Deadline: {challenge.deadline}</span>
                      </div>

                      {/* Collapsible instructions */}
                      <Collapsible
                        open={instrOpen}
                        onOpenChange={(o) =>
                          setOpenInstructions((p) => ({ ...p, [challenge.id]: o }))
                        }
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2 text-xs font-semibold text-primary hover:bg-primary/5"
                          >
                            <PlayCircle className="size-3.5" />
                            {instrOpen ? "Sembunyikan Instruksi" : "Lihat Instruksi"}
                            <ChevronDown
                              className={cn(
                                "size-3.5 transition-transform",
                                instrOpen && "rotate-180"
                              )}
                            />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-2 rounded-xl border border-border/60 bg-muted/30 p-4">
                            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              <Sparkles className="size-3.5 text-primary" /> Instruksi Pengerjaan
                            </div>
                            <ol className="flex flex-col gap-1.5">
                              {instructions.map((ins, i) => (
                                <li key={i} className="flex gap-2 text-sm text-foreground">
                                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                                    {i + 1}
                                  </span>
                                  <span className="leading-relaxed">{ins}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      <Separator />

                      {/* Status-aware action area */}
                      {status === "belum" && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <AlertCircle className="size-3.5" />
                            Mulai kerjakan challenge ini untuk membuka pendampingan mentor.
                          </p>
                          <Button
                            onClick={() => openSubmissionDialog(challenge)}
                            className="bg-brand-gradient text-white"
                          >
                            <Upload className="size-4" /> Mulai Challenge
                          </Button>
                        </div>
                      )}

                      {status === "proses" && (
                        <div className="flex flex-col gap-3">
                          {sub?.content && (
                            <div className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-3">
                              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                                <Upload className="size-3.5" /> Hasil Praktik Anda
                              </div>
                              <p className="whitespace-pre-wrap text-sm text-foreground">
                                {sub.content}
                              </p>
                            </div>
                          )}
                          {!sub?.feedback ? (
                            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                              <Clock className="size-3.5" />
                              Menunggu feedback mentor. Anda masih dapat memperbarui hasil praktik.
                            </div>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              onClick={() => openSubmissionDialog(challenge)}
                              className="bg-brand-gradient text-white"
                            >
                              <Upload className="size-4" /> Lanjutkan / Unggah Hasil
                            </Button>
                          </div>
                        </div>
                      )}

                      {status === "selesai" && (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700">
                            <CheckCircle2 className="size-5" />
                            Challenge selesai! Kerja bagus 🎉
                          </div>
                          {sub?.content && (
                            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                <Upload className="size-3.5" /> Hasil Praktik Anda
                              </div>
                              <p className="whitespace-pre-wrap text-sm text-foreground">
                                {sub.content}
                              </p>
                            </div>
                          )}
                          {sub?.feedback ? (
                            <FeedbackCard feedback={sub.feedback} mentorId={sub.mentorId} />
                          ) : (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                              <MessageSquare className="mr-1.5 inline size-3.5" />
                              Mentor belum menambahkan feedback untuk challenge ini.
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient shadow-md">
              <Upload className="size-5 text-white" />
            </div>
            <DialogTitle className="font-display text-xl">
              {activeChallenge?.title ?? "Unggah Hasil Praktik"}
            </DialogTitle>
            <DialogDescription>
              {activeChallenge
                ? `Minggu ${activeChallenge.week} · Tuliskan atau tempel hasil praktik Anda di bawah ini.`
                : "Tuliskan hasil praktik Anda di bawah ini."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="draft-content">Hasil Praktik Anda</Label>
            <Textarea
              id="draft-content"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder="Contoh: Caption Instagram untuk promosi sambal bu Ani: 'Sambal tradisional resep turun temurun, pedasnya pas bikin nagih…'"
              className="min-h-[180px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Anda dapat menyimpan sebagai draft dan melanjutkan nanti, atau mengumpulkan untuk
              mendapatkan feedback dari mentor.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={saving || !draftContent.trim()}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Clock className="size-4" />}
              Simpan sebagai Draft
            </Button>
            <Button
              onClick={() => handleSave("submit")}
              disabled={saving || !draftContent.trim()}
              className="bg-brand-gradient text-white"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Kumpulkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Trophy;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
      <div className={cn("flex size-10 items-center justify-center rounded-xl", color)}>
        <Icon className="size-5" />
      </div>
      <div>
        <div className="font-display text-xl font-extrabold leading-none">{value}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function FeedbackCard({
  feedback,
  mentorId,
}: {
  feedback: string;
  mentorId?: string | null;
}) {
  return (
    <div className="rounded-xl border-l-4 border-l-green-500 border border-border/60 bg-green-50/40 p-4">
      <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-green-700">
        <MessageSquare className="size-4" />
        Feedback dari Mentor
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{feedback}</p>
      {mentorId && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex size-6 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
            M
          </div>
          <span>Mentor Pendamping</span>
        </div>
      )}
    </div>
  );
}
