"use client";

import { useApp } from "@/lib/store";
import { api, CATEGORY_META, PURPOSE_META } from "@/lib/api";
import type { Prompt } from "@/lib/types";
import { SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Copy,
  Heart,
  Check,
  Sparkles,
  Filter,
  X,
  Bookmark,
  Lightbulb,
  Loader2,
  MessageSquareQuote,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = ["kuliner", "fashion", "kerajinan", "pertanian", "jasa"] as const;

const DIFFICULTY_META: Record<string, { label: string; className: string }> = {
  mudah: { label: "Mudah", className: "bg-green-100 text-green-700" },
  sedang: { label: "Sedang", className: "bg-amber-100 text-amber-700" },
  sulit: { label: "Sulit", className: "bg-rose-100 text-rose-700" },
};

/** Render prompt body, highlighting `[placeholder]` segments with primary color. */
function HighlightedBody({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => text.split(/(\[[^\]]+\])/g), [text]);
  return (
    <p className={cn("whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80", className)}>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span key={i} className="font-semibold text-primary">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export function PromptsView() {
  const { user, setView } = useApp();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [favOnly, setFavOnly] = useState(false);

  const [selected, setSelected] = useState<Prompt | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Fetch prompts when filters change
  useEffect(() => {
    setLoading(true);
    api
      .prompts({
        category: category === "all" ? undefined : category,
        search: debouncedSearch.trim() || undefined,
        userId: user?.id,
        fav: favOnly,
      })
      .then((r) => {
        setPrompts(r.prompts);
        setTotal(r.total);
      })
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "Gagal memuat prompt");
        setPrompts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [category, debouncedSearch, favOnly, user?.id]);

  const handleCopy = useCallback(async (prompt: Prompt, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt.body);
      } else {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = prompt.body;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedId(prompt.id);
      toast.success("Prompt disalin!");
      setTimeout(() => setCopiedId((id) => (id === prompt.id ? null : id)), 1800);
    } catch {
      toast.error("Gagal menyalin prompt");
    }
  }, []);

  const handleFav = useCallback(
    async (prompt: Prompt, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!user) {
        toast.error("Masuk terlebih dahulu untuk menyimpan favorit");
        setView("login");
        return;
      }
      setTogglingId(prompt.id);
      try {
        const { favorited } = await api.toggleFav(user.id, prompt.id);
        setPrompts((prev) =>
          prev
            .map((p) => (p.id === prompt.id ? { ...p, favorited } : p))
            .filter((p) => !favOnly || p.favorited)
        );
        setTotal((t) => (favOnly ? Math.max(0, t - (favorited ? 0 : 1)) : t));
        setSelected((s) => (s && s.id === prompt.id ? { ...s, favorited } : s));
        toast.success(favorited ? "Ditambahkan ke favorit" : "Dihapus dari favorit");
      } catch {
        toast.error("Gagal memperbarui favorit");
      } finally {
        setTogglingId(null);
      }
    },
    [user, favOnly, setView]
  );

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("all");
    setFavOnly(false);
  };

  const hasActiveFilter =
    category !== "all" || favOnly || debouncedSearch.trim().length > 0;

  return (
    <div className="bg-brand-gradient-soft">
      {/* ─── HEADER ─── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-8 size-64 rounded-full bg-primary/15 blur-3xl animate-blob" />
          <div
            className="absolute -right-10 bottom-0 size-72 rounded-full bg-green-300/25 blur-3xl animate-blob"
            style={{ animationDelay: "4s" }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeader
            align="left"
            eyebrow="AI Prompt Library"
            title="Panduan Komunikasi dengan AI"
            description="Kumpulan prompt siap pakai untuk membantu UMKM membuat caption, deskripsi, ide konten, dan strategi pemasaran bersama AI."
            className="max-w-3xl"
          />
        </div>
      </section>

      {/* ─── TOOLBAR ─── */}
      <section className="sticky top-[64px] z-30 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3">
            {/* Search + fav toggle row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari prompt berdasarkan judul, isi, atau tujuan…"
                  className="h-11 rounded-xl border-border/60 bg-card pl-10 pr-10 shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Hapus pencarian"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button
                type="button"
                variant={favOnly ? "default" : "outline"}
                onClick={() => setFavOnly((v) => !v)}
                disabled={!user}
                className={cn(
                  "h-11 shrink-0 gap-2 rounded-xl px-4",
                  favOnly && "bg-brand-gradient text-white shadow-md hover:opacity-90"
                )}
                title={user ? "Tampilkan prompt favorit saja" : "Masuk untuk menyimpan favorit"}
              >
                <Bookmark className={cn("size-4", favOnly && "fill-current")} />
                <span className="hidden sm:inline">Favorit</span>
              </Button>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 hidden items-center gap-1 text-xs font-medium text-muted-foreground sm:inline-flex">
                <Filter className="size-3.5" /> Kategori:
              </span>
              <CategoryPill
                active={category === "all"}
                onClick={() => setCategory("all")}
                label="Semua"
                emoji="✨"
              />
              {CATEGORY_ORDER.map((c) => {
                const meta = CATEGORY_META[c];
                return (
                  <CategoryPill
                    key={c}
                    active={category === c}
                    onClick={() => setCategory(c)}
                    label={meta.label}
                    emoji={meta.emoji}
                  />
                );
              })}
              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="ml-1 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-3" /> Reset
                </button>
              )}
              <span className="ml-auto text-xs font-medium text-muted-foreground">
                {loading ? "Memuat…" : `${total} prompt ditemukan`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <EmptyState
            hasFilter={hasActiveFilter}
            onReset={clearFilters}
            onLogin={() => setView("login")}
            isFavOnly={favOnly}
            isLoggedIn={!!user}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                copied={copiedId === p.id}
                toggling={togglingId === p.id}
                onCopy={(e) => handleCopy(p, e)}
                onFav={(e) => handleFav(p, e)}
                onOpen={() => setSelected(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ─── DETAIL DIALOG ─── */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={cn(
                      "gap-1 rounded-full border-transparent",
                      CATEGORY_META[selected.category]?.color ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    <span>{CATEGORY_META[selected.category]?.emoji ?? "📂"}</span>
                    {CATEGORY_META[selected.category]?.label ?? selected.category}
                  </Badge>
                  <Badge className="gap-1 rounded-full border-transparent bg-primary/10 text-primary">
                    <span>{PURPOSE_META[selected.purpose]?.emoji ?? "💬"}</span>
                    {PURPOSE_META[selected.purpose]?.label ?? selected.purpose}
                  </Badge>
                  <Badge
                    className={cn(
                      "rounded-full border-transparent",
                      DIFFICULTY_META[selected.difficulty]?.className ??
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {DIFFICULTY_META[selected.difficulty]?.label ?? selected.difficulty}
                  </Badge>
                </div>
                <DialogTitle className="mt-2 font-display text-xl font-extrabold">
                  {selected.title}
                </DialogTitle>
                <DialogDescription>
                  Salin prompt ini ke AI pilihan Anda (ChatGPT, Gemini, dsb.) lalu sesuaikan.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-primary/20 bg-brand-gradient-soft p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Isi Prompt
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Klik di dalam kotak untuk menyeleksi
                    </span>
                  </div>
                  <HighlightedBody
                    text={selected.body}
                    className="select-text text-sm leading-relaxed"
                  />
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <span>
                    Ganti bagian dalam <strong>[kurung siku]</strong> dengan data usaha Anda.
                  </span>
                </div>

                {selected.tips && (
                  <div className="rounded-lg border border-border/60 bg-card p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="size-3.5 text-primary" /> Tips Penggunaan
                    </div>
                    <p className="text-sm text-foreground/80">{selected.tips}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    onClick={(e) => handleCopy(selected, e)}
                    className="flex-1 gap-2 bg-brand-gradient text-white shadow-md hover:opacity-90"
                  >
                    {copiedId === selected.id ? (
                      <>
                        <Check className="size-4" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" /> Salin Prompt
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => handleFav(selected, e)}
                    disabled={togglingId === selected.id}
                    className="gap-2"
                  >
                    {togglingId === selected.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Heart
                        className={cn(
                          "size-4 transition-colors",
                          selected.favorited && "fill-rose-500 text-rose-500"
                        )}
                      />
                    )}
                    {selected.favorited ? "Favorit" : "Simpan Favorit"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function CategoryPill({
  active,
  onClick,
  label,
  emoji,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
        active
          ? "border-transparent bg-brand-gradient text-white shadow-md shadow-primary/20"
          : "border-border/60 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
      )}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}

function PromptCard({
  prompt,
  copied,
  toggling,
  onCopy,
  onFav,
  onOpen,
}: {
  prompt: Prompt;
  copied: boolean;
  toggling: boolean;
  onCopy: (e: React.MouseEvent) => void;
  onFav: (e: React.MouseEvent) => void;
  onOpen: () => void;
}) {
  const cat = CATEGORY_META[prompt.category] ?? {
    label: prompt.category,
    emoji: "📂",
    color: "bg-muted text-muted-foreground",
  };
  const purpose = PURPOSE_META[prompt.purpose] ?? { label: prompt.purpose, emoji: "💬" };
  const diff = DIFFICULTY_META[prompt.difficulty] ?? {
    label: prompt.difficulty,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Card
      className={cn(
        "group relative gap-0 overflow-hidden rounded-2xl border-border/60 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
      )}
    >
      {/* Top row: category + difficulty */}
      <div className="flex items-start justify-between gap-2">
        <Badge className={cn("gap-1 rounded-full border-transparent", cat.color)}>
          <span>{cat.emoji}</span>
          {cat.label}
        </Badge>
        <Badge className={cn("rounded-full border-transparent", diff.className)}>
          {diff.label}
        </Badge>
      </div>

      {/* Clickable body */}
      <button
        onClick={onOpen}
        className="mt-3 flex w-full flex-col items-start gap-2 text-left"
        aria-label={`Buka detail ${prompt.title}`}
      >
        <Badge className="gap-1 rounded-full border-transparent bg-primary/10 text-primary">
          <span>{purpose.emoji}</span>
          {purpose.label}
        </Badge>
        <h3 className="font-display text-base font-bold leading-snug text-foreground group-hover:text-primary">
          {prompt.title}
        </h3>
        <HighlightedBody
          text={prompt.body}
          className="line-clamp-3 max-w-full"
        />
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Lihat detail <MessageSquareQuote className="size-3" />
        </span>
      </button>

      {/* Bottom action row */}
      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={onCopy}
          className="gap-1.5 rounded-lg"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-600" />
              <span className="text-green-600">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Salin
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onFav}
          disabled={toggling}
          className={cn(
            "gap-1.5 rounded-lg",
            prompt.favorited
              ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {toggling ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Heart className={cn("size-3.5", prompt.favorited && "fill-current")} />
          )}
          {prompt.favorited ? "Favorit" : "Simpan"}
        </Button>
      </div>
    </Card>
  );
}

function EmptyState({
  hasFilter,
  onReset,
  onLogin,
  isFavOnly,
  isLoggedIn,
}: {
  hasFilter: boolean;
  onReset: () => void;
  onLogin: () => void;
  isFavOnly: boolean;
  isLoggedIn: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/60 bg-card/60 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-gradient-soft">
        {isFavOnly ? (
          <Bookmark className="size-8 text-primary" />
        ) : (
          <Search className="size-8 text-primary" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-bold">
          {isFavOnly ? "Belum ada prompt favorit" : "Tidak ada prompt yang cocok"}
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isFavOnly
            ? isLoggedIn
              ? "Simpan prompt yang menarik dengan menekan tombol hati, lalu kembali ke sini."
              : "Masuk terlebih dahulu untuk menyimpan dan melihat prompt favorit Anda."
            : hasFilter
              ? "Coba kata kunci lain atau ubah filter kategori."
              : "Belum ada prompt tersedia saat ini."}
        </p>
      </div>
      <div className="flex gap-2">
        {hasFilter && (
          <Button onClick={onReset} variant="outline" className="gap-2">
            <X className="size-4" /> Reset filter
          </Button>
        )}
        {isFavOnly && !isLoggedIn && (
          <Button onClick={onLogin} className="gap-2 bg-brand-gradient text-white">
            Masuk Akun
          </Button>
        )}
      </div>
    </div>
  );
}
