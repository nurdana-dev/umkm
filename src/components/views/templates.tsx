"use client";

import { useApp } from "@/lib/store";
import { api } from "@/lib/api";
import type { Template, TemplateField } from "@/lib/types";
import { SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Store,
  Instagram,
  Calendar,
  Package,
  Megaphone,
  BookOpen,
  FileText,
  Loader2,
  Copy,
  Phone,
  Tag,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Static lookups ──────────────────────────────────────────
const ICON_MAP: Record<string, typeof Store> = {
  store: Store,
  instagram: Instagram,
  calendar: Calendar,
  package: Package,
  megaphone: Megaphone,
  "book-open": BookOpen,
};

const TEMPLATE_CATEGORY_META: Record<string, { label: string; color: string }> =
  {
    branding: {
      label: "Branding",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    sosmed: {
      label: "Sosmed",
      color: "bg-pink-100 text-pink-700 border-pink-200",
    },
    konten: {
      label: "Konten",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    produk: {
      label: "Produk",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    marketing: {
      label: "Marketing",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

function TemplateIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon className={className} />;
}

function categoryMeta(cat: string) {
  return (
    TEMPLATE_CATEGORY_META[cat] ?? {
      label: cat,
      color: "bg-muted text-muted-foreground border-border",
    }
  );
}

// ─── Preview renderers ───────────────────────────────────────
type ValMap = Record<string, string>;

function PreviewProfilUsaha(v: ValMap) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="bg-brand-gradient h-20" />
      <CardContent className="-mt-10 space-y-4 px-5 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-border">
            <Store className="size-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold leading-tight">
              {v.nama || "Nama Usaha Anda"}
            </h3>
            {v.kategori && (
              <Badge variant="secondary" className="mt-1 bg-secondary">
                {v.kategori}
              </Badge>
            )}
          </div>
        </div>
        {v.cerita && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Cerita Usaha
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {v.cerita}
            </p>
          </div>
        )}
        {v.unggulan && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Produk Unggulan
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {v.unggulan}
            </p>
          </div>
        )}
        {v.keunikan && (
          <div className="rounded-xl bg-brand-gradient-soft p-3">
            <p className="text-[11px] font-semibold text-primary">
              Keunikan Usaha
            </p>
            <p className="mt-1 text-sm leading-relaxed">{v.keunikan}</p>
          </div>
        )}
        {v.kontak && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-4 text-primary" />
            <span>{v.kontak}</span>
          </div>
        )}
        {!v.nama && !v.cerita && (
          <p className="text-sm italic text-muted-foreground">
            Isi formulir untuk melihat profil usaha Anda…
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PreviewBioInstagram({ values }: { values: ValMap }) {
  const lines: string[] = [];
  if (values.nama) lines.push(`🌶️ ${values.nama}`);
  if (values.tagline) lines.push(values.tagline);
  if (values.keunikan) lines.push(`✨ ${values.keunikan}`);
  if (values.lokasi) lines.push(`📍 ${values.lokasi}`);
  if (values.cta) lines.push(`👇 ${values.cta}`);
  const username = (values.nama || "nama_usaha")
    .toLowerCase()
    .replace(/\s+/g, "_");
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-lg">
      <div className="flex items-center gap-3 border-b bg-muted/40 p-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-gradient text-white">
          <Instagram className="size-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate font-display text-base font-bold leading-tight">
            {username}
          </p>
          <p className="text-xs text-muted-foreground">Akun Bisnis</p>
        </div>
        <Button size="sm" className="bg-brand-gradient text-white">
          Ikuti
        </Button>
      </div>
      <div className="space-y-1.5 p-4">
        {lines.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            Isi formulir untuk melihat bio Instagram Anda…
          </p>
        ) : (
          lines.map((l, i) => (
            <p key={i} className="text-sm font-medium leading-relaxed">
              {l}
            </p>
          ))
        )}
        {values.link && (
          <p className="mt-2 truncate rounded-lg bg-muted px-3 py-1.5 text-xs text-primary">
            {values.link}
          </p>
        )}
      </div>
    </div>
  );
}

function PreviewKalenderKonten({
  values,
  template,
}: {
  values: ValMap;
  template: Template;
}) {
  const preview = template.preview as Record<string, string>;

  const weeks = [
    {
      label: "Minggu 1",
      theme: "Perkenalan & Brand",
      desc:
        preview.week1 ??
        "Hari 1-7: Perkenalan brand, cerita usaha, produk unggulan.",
    },
    {
      label: "Minggu 2",
      theme: "Behind The Scene",
      desc: preview.week2 ?? "Hari 8-14: Proses produksi, tips, edukasi.",
    },
    {
      label: "Minggu 3",
      theme: "Testimoni & Edukasi",
      desc: preview.week3 ?? "Hari 15-21: Testimoni pelanggan, manfaat, FAQ.",
    },
    {
      label: "Minggu 4",
      theme: "Promo & Closing",
      desc:
        preview.week4 ?? "Hari 22-30: Promo, flash sale, recap, ajakan follow.",
    },
  ];
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-brand-gradient text-white">
        <CardTitle className="flex items-center gap-2 font-display">
          <Calendar className="size-5" />
          {values.usaha || "Kalender Konten 30 Hari"}
        </CardTitle>
        <p className="text-xs text-white/80">
          {[values.kategori, values.platform, values.tujuan]
            .filter(Boolean)
            .join(" · ") ||
            "Lengkapi formulir untuk melihat rencana konten Anda"}
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
        {weeks.map((w, i) => (
          <div
            key={i}
            className="rounded-xl border bg-linear-to-br from-background to-muted/40 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {w.label}
              </span>
              <span className="text-[11px] font-medium text-foreground/80">
                {w.theme}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {w.desc}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PreviewDeskripsiProduk({ values }: { values: ValMap }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="flex aspect-4/3 items-center justify-center bg-brand-gradient-soft">
        <Package className="size-16 text-primary/40" />
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-tight">
            {values.produk || "Nama Produk"}
          </h3>
          {values.harga && (
            <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-bold text-green-700">
              {values.harga}
            </span>
          )}
        </div>
        {values.bahan && (
          <div className="flex items-center gap-2 text-xs">
            <Tag className="size-3.5 shrink-0 text-primary" />
            <span>
              <b>Bahan:</b> {values.bahan}
            </span>
          </div>
        )}
        {values.manfaat && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {values.manfaat}
          </p>
        )}
        {(values.ukuran || values.cara) && (
          <div className="rounded-xl bg-muted/50 p-3 text-xs">
            {values.ukuran && (
              <p>
                <b>Ukuran:</b> {values.ukuran}
              </p>
            )}
            {values.cara && (
              <p className="mt-1">
                <b>Cara Simpan:</b> {values.cara}
              </p>
            )}
          </div>
        )}
        <Button size="sm" className="w-full bg-brand-gradient text-white">
          <ShoppingBag className="size-4" /> Beli Sekarang
        </Button>
      </CardContent>
    </Card>
  );
}

function PreviewIdePromosi({
  values,
  template,
}: {
  values: ValMap;
  template: Template;
}) {
  const preview = template.preview as Record<string, string>;
  const weeks = [
    {
      label: "Minggu 1",
      title: "Buy 1 Get 1",
      desc: preview.minggu1 ?? "Minggu 1: Buy 1 Get 1 untuk pelanggan baru.",
    },
    {
      label: "Minggu 2",
      title: "Flash Sale 24 Jam",
      desc:
        preview.minggu2 ?? "Minggu 2: Flash sale 24 jam di Instagram Story.",
    },
    {
      label: "Minggu 3",
      title: "Bundling Hemat",
      desc: preview.minggu3 ?? "Minggu 3: Bundling hemat untuk hadiah.",
    },
    {
      label: "Minggu 4",
      title: "Giveaway + Follow",
      desc:
        preview.minggu4 ?? "Minggu 4: Giveaway + ajakan follow + tag teman.",
    },
  ];
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-brand-gradient text-white">
        <CardTitle className="flex items-center gap-2 font-display">
          <Megaphone className="size-5" />
          Rencana Promosi {values.usaha || "Usaha Anda"}
        </CardTitle>
        <p className="text-xs text-white/80">
          {[
            values.target ? `Target: ${values.target}` : null,
            values.anggaran ? `Anggaran: ${values.anggaran}` : null,
          ]
            .filter(Boolean)
            .join(" · ") ||
            "Lengkapi formulir untuk melihat rencana promosi Anda"}
        </p>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {weeks.map((w, i) => (
          <div key={i} className="flex gap-3 rounded-xl border p-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
              {i + 1}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">
                <span className="text-primary">{w.label}:</span> {w.title}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {w.desc}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PreviewBrandStory({ values }: { values: ValMap }) {
  const empty =
    !values.nama && !values.awal && !values.proses && !values.harapan;
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="bg-brand-gradient p-5 text-white">
        <p className="text-[11px] uppercase tracking-wider text-white/80">
          Brand Story
        </p>
        <h3 className="mt-1 font-display text-xl font-bold leading-tight">
          {values.nama
            ? `${values.nama} — Sebuah Cerita`
            : "Judul Cerita Brand Anda"}
        </h3>
      </div>
      <CardContent className="space-y-4 p-5">
        {values.awal && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Awal Mula
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {values.awal}
            </p>
          </div>
        )}
        {values.proses && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Proses & Filosofi
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {values.proses}
            </p>
          </div>
        )}
        {values.harapan && (
          <div className="rounded-xl bg-brand-gradient-soft p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Harapan ke Depan
            </p>
            <p className="mt-1 text-sm leading-relaxed">{values.harapan}</p>
          </div>
        )}
        {empty && (
          <p className="text-sm italic text-muted-foreground">
            Isi formulir untuk melihat cerita brand Anda…
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function renderPreview(template: Template, values: ValMap) {
  console.log({
    title: template.title,
    values,
  });
  switch (template.title) {
    case "Profil Usaha Digital":
      return <PreviewProfilUsaha {...values} />;
    case "Template Bio Instagram":
      return <PreviewBioInstagram values={values} />;
    case "Kalender Konten 30 Hari":
      return <PreviewKalenderKonten values={values} template={template} />;
    case "Deskripsi Produk Jualan":
      return <PreviewDeskripsiProduk values={values} />;
    case "Ide Promosi Bulanan":
      return <PreviewIdePromosi values={values} template={template} />;
    case "Brand Story Usaha":
      return <PreviewBrandStory values={values} />;
    default:
      return (
        <Card className="border-0 shadow-lg">
          <CardContent className="space-y-2 p-4">
            {template.fields.map((f) => (
              <div key={f.key}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </p>
                <p className="text-sm text-foreground/90">
                  {values[f.key] || "—"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      );
  }
}

// ─── Helpers ─────────────────────────────────────────────────
function initFormValues(template: Template): ValMap {
  const out: ValMap = {};
  const preview = (template.preview ?? {}) as Record<string, unknown>;
  for (const f of template.fields) {
    const v = preview[f.key];
    out[f.key] = typeof v === "string" ? v : "";
  }
  return out;
}

function buildCopyText(template: Template, values: ValMap): string {
  const header = `${template.title.toUpperCase()}`;
  const divider = "─".repeat(Math.max(20, header.length));
  const body = template.fields
    .map((f) => `${f.label}: ${values[f.key] || ""}`)
    .join("\n");
  return `${header}\n${divider}\n\n${body}`;
}

// ─── Field renderer ──────────────────────────────────────────
function FieldRow({
  field,
  value,
  onChange,
}: {
  field: TemplateField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`field-${field.key}`} className="text-sm font-medium">
        {field.label}
      </Label>
      {field.type === "text" && (
        <Input
          id={`field-${field.key}`}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === "textarea" && (
        <Textarea
          id={`field-${field.key}`}
          value={value}
          rows={3}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.type === "select" && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={`field-${field.key}`} className="w-full">
            <SelectValue placeholder="Pilih salah satu…" />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// ─── Main view ───────────────────────────────────────────────
export function TemplatesView() {
  const { setView } = useApp();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Template | null>(null);
  const [formValues, setFormValues] = useState<ValMap>({});

  useEffect(() => {
    api
      .templates()
      .then((r) => setTemplates(r.templates))
      .catch(() => toast.error("Gagal memuat template"))
      .finally(() => setLoading(false));
  }, []);

  const openDialog = (t: Template) => {
    setActive(t);
    setFormValues(initFormValues(t));
  };

  const closeDialog = () => {
    setActive(null);
    setFormValues({});
  };

  const handleCopy = async () => {
    if (!active) return;
    const text = buildCopyText(active, formValues);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Hasil disalin!");
    } catch {
      toast.error("Gagal menyalin hasil. Coba lagi ya.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* ─── Header ─── */}
      <section className="relative overflow-hidden bg-brand-gradient-soft">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 size-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
          <div
            className="absolute right-0 top-32 size-80 rounded-full bg-green-300/30 blur-3xl animate-blob"
            style={{ animationDelay: "3s" }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeader
            eyebrow="Template Digital"
            title="Template Siap Pakai untuk UMKM"
            description="Kumpulan template praktis untuk membuat aset digital usaha Anda—dari profil usaha, bio Instagram, kalender konten, hingga deskripsi produk."
          />
          {!loading && (
            <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <Sparkles className="size-4 text-primary" />
              <span>
                <b className="text-foreground">{templates.length}</b> template
                tersedia · gratis untuk semua peserta
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ─── Template Grid ─── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Memuat template…</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <FileText className="size-12 text-muted-foreground" />
            <p className="font-display text-lg font-bold">Belum ada template</p>
            <p className="text-sm text-muted-foreground">
              Coba refresh halaman atau hubungi admin.
            </p>
            <Button variant="outline" onClick={() => setView("dashboard")}>
              Kembali ke Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => {
              const cat = categoryMeta(t.category);
              return (
                <Card
                  key={t.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-border/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-md">
                        <TemplateIcon name={t.icon} className="size-6" />
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("rounded-full border", cat.color)}
                      >
                        {cat.label}
                      </Badge>
                    </div>
                    <CardTitle className="font-display text-lg font-bold leading-tight">
                      {t.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4 pt-0">
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {t.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <span className="text-xs text-muted-foreground">
                        Digunakan{" "}
                        <b className="text-foreground">{t.usageCount}</b> kali
                      </span>
                      <Button
                        size="sm"
                        className="bg-brand-gradient text-white"
                        onClick={() => openDialog(t)}
                      >
                        Gunakan Template
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Form Dialog ─── */}
      <Dialog open={!!active} onOpenChange={(o) => (o ? null : closeDialog())}>
        <DialogContent className="flex max-h-[92vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
          {active && (
            <>
              {/* Dialog header */}
              <DialogHeader className="flex flex-row items-center gap-3 border-b bg-brand-gradient-soft p-5 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md">
                  <TemplateIcon name={active.icon} className="size-5" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="font-display text-base font-bold leading-tight">
                    {active.title}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 text-xs">
                    Isi formulir di kiri, lihat preview langsung di kanan.
                  </DialogDescription>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border",
                    categoryMeta(active.category).color,
                  )}
                >
                  {categoryMeta(active.category).label}
                </Badge>
              </DialogHeader>

              {/* Body: form + preview */}
              <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
                {/* Form column */}
                <div className="min-h-0 overflow-y-auto border-b p-5 lg:border-b-0 lg:border-r scrollbar-thin">
                  <div className="space-y-4">
                    {active.fields.map((field) => (
                      <FieldRow
                        key={field.key}
                        field={field}
                        value={formValues[field.key] ?? ""}
                        onChange={(v) =>
                          setFormValues((prev) => ({ ...prev, [field.key]: v }))
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Preview column */}
                <div className="bg-muted/30 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Preview Langsung
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Live
                    </span>
                  </div>
                  <div className="min-h-0">
                    {renderPreview(active, formValues)}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-2 border-t bg-background p-4 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={closeDialog}>
                  Tutup
                </Button>
                <Button
                  onClick={handleCopy}
                  className="bg-brand-gradient text-white"
                >
                  <Copy className="size-4" />
                  Salin Hasil
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
