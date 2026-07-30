"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Store,
  Loader2,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  {
    email: "ani@umkmai.id",
    name: "Bu Ani",
    role: "Peserta UMKM",
    desc: "Sambal Tradisional Bu Ani",
    icon: Store,
    color: "bg-amber-100 text-amber-700",
  },
  {
    email: "budi@umkmai.id",
    name: "Pak Budi",
    role: "Peserta UMKM",
    desc: "Kerajinan Bambu Budi",
    icon: Store,
    color: "bg-blue-100 text-blue-700",
  },
  {
    email: "mentor@umkmai.id",
    name: "Rizki Pratama",
    role: "Mentor",
    desc: "Pendamping UMKM desa",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700",
  },
  {
    email: "admin@umkmai.id",
    name: "Dewi Anjani",
    role: "Admin",
    desc: "Pengelola program",
    icon: ShieldCheck,
    color: "bg-primary/10 text-primary",
  },
];

const CATEGORY_OPTIONS = [
  { value: "kuliner", label: "🍳 Kuliner" },
  { value: "fashion", label: "👗 Fashion" },
  { value: "kerajinan", label: "🧺 Kerajinan" },
  { value: "pertanian", label: "🌾 Pertanian" },
  { value: "jasa", label: "🤝 Jasa" },
];

export function LoginView() {
  const { login, setView } = useApp();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regBusiness, setRegBusiness] = useState("");
  const [regCategory, setRegCategory] = useState("");
  const [regDesc, setRegDesc] = useState("");
  const [regVillage, setRegVillage] = useState("");

  const doLogin = async (em: string) => {
    if (!em) {
      toast.error("Masukkan email terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(em);
      login(res.user);
      toast.success(`Selamat datang, ${res.user.name}!`);
      if (res.user.role === "peserta") setView("dashboard");
      else setView("admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    void doLogin(email);
  };

  const quickLogin = (em: string) => {
    setEmail(em);
    void doLogin(em);
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !regName.trim() ||
      !regEmail.trim() ||
      !regBusiness.trim() ||
      !regCategory
    ) {
      toast.error(
        "Lengkapi semua field wajib (Nama, Email, Nama Usaha, Kategori)",
      );
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        name: regName,
        email: regEmail,
        businessName: regBusiness,
        category: regCategory,
        description: regDesc,
        village: regVillage || undefined,
      });
      login(res.user);
      toast.success(
        `Akun UMKM berhasil dibuat. Selamat datang, ${res.user.name}!`,
      );
      setView("dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-brand-gradient-soft py-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 size-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div
          className="absolute right-0 bottom-10 size-80 rounded-full bg-green-300/30 blur-3xl animate-blob"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        {/* Left: branding + demo accounts */}
        <div className="flex flex-col gap-5">
          <Badge className="w-fit gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-primary backdrop-blur">
            <Sparkles className="size-3.5" />{" "}
            {mode === "login" ? "Masuk ke Akun Anda" : "Daftar Akun UMKM Baru"}
          </Badge>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            {mode === "login" ? (
              <>
                Lanjutkan Perjalanan
                <span className="block text-brand-gradient">
                  Digital UMKM Anda
                </span>
              </>
            ) : (
              <>
                Bergabung & Mulai
                <span className="block text-brand-gradient">
                  Naik Kelas Bersama AI
                </span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground">
            {mode === "login"
              ? "Masuk untuk mengakses dashboard pribadi, melanjutkan pembelajaran, dan mengikuti challenge mingguan bersama mentor."
              : "Daftarkan usaha Anda untuk mengikuti program pembelajaran AI, dapatkan pendampingan mentor, dan kembangkan bisnis digital Anda."}
          </p>

          {/* {mode === "login" && (
            <div className="rounded-2xl border border-border/60 bg-white/60 p-5 backdrop-blur">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Akun Demo (Klik untuk Masuk)
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <button
                    key={a.email}
                    onClick={() => quickLogin(a.email)}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-white p-3 text-left transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        a.color,
                      )}
                    >
                      <a.icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {a.name}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {a.role}
                      </div>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* {mode === "register" && (
            <div className="rounded-2xl border border-border/60 bg-white/60 p-5 backdrop-blur">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                Keuntungan Mendaftar
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Akses 5 modul pembelajaran AI praktis untuk UMKM
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  50+ prompt bisnis siap pakai di AI Prompt Library
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Pendampingan mentor lewat challenge mingguan
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Tracking perkembangan digitalisasi usaha Anda
                </li>
              </ul>
            </div>
          )} */}
        </div>

        {/* Right: auth form */}
        <Card className="border-border/60 shadow-xl">
          <CardHeader>
            {/* Mode toggle */}
            <div className="mb-2 grid grid-cols-1 gap-1 rounded-xl bg-muted p-1">
              <button
                onClick={() => setMode("login")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  mode === "login"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LogIn className="size-3.5" /> Masuk
              </button>
              {/* <button
                onClick={() => setMode("register")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  mode === "register"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <UserPlus className="size-3.5" /> Daftar
              </button> */}
            </div>

            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-md">
              {mode === "login" ? (
                <Mail className="size-6 text-white" />
              ) : (
                <Store className="size-6 text-white" />
              )}
            </div>
            <CardTitle className="mt-2 font-display text-2xl">
              {mode === "login" ? "Masuk dengan Email" : "Daftar Akun UMKM"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Untuk prototype ini, cukup masukkan email akun demo di samping."
                : "Isi data diri & usaha Anda untuk membuat akun peserta UMKM."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "login" ? (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ani@umkmai.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pw">Password</Label>
                  <Input
                    id="pw"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="demo123"
                    className="h-11"
                  />
                  {/* <p className="text-xs text-muted-foreground">
                    Prototype: password apa pun diterima.
                  </p> */}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="mt-2 bg-brand-gradient text-white shadow-lg shadow-primary/25 hover:opacity-90"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {loading ? "Memproses..." : "Masuk Sekarang"}
                </Button>
                {/* <p className="text-center text-xs text-muted-foreground">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-primary hover:underline"
                  >
                    Daftar sebagai UMKM →
                  </button>
                </p> */}
              </form>
            ) : (
              <form onSubmit={submitRegister} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="regName">
                      Nama Pemilik <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="regName"
                      placeholder="Bu Ani"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="regEmail">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="regEmail"
                      type="email"
                      placeholder="ani@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="regBusiness">
                    Nama Usaha <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="regBusiness"
                    placeholder="Sambal Tradisional Bu Ani"
                    value={regBusiness}
                    onChange={(e) => setRegBusiness(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="regCategory">
                      Kategori Usaha <span className="text-destructive">*</span>
                    </Label>
                    <Select value={regCategory} onValueChange={setRegCategory}>
                      <SelectTrigger id="regCategory" className="h-11">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="regVillage">Desa / Lokasi</Label>
                    <Input
                      id="regVillage"
                      placeholder="Desa Bringin"
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="regDesc">Deskripsi Usaha</Label>
                  <Textarea
                    id="regDesc"
                    placeholder="Ceritakan singkat tentang usaha Anda: produk utama, keunikan, dll."
                    value={regDesc}
                    onChange={(e) => setRegDesc(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="mt-2 bg-brand-gradient text-white shadow-lg shadow-primary/25 hover:opacity-90"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-primary hover:underline"
                  >
                    ← Masuk di sini
                  </button>
                </p>
              </form>
            )}

            <div className="mt-5 flex items-center justify-between text-xs">
              <button
                onClick={() => setView("landing")}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="size-3" /> Beranda
              </button>
              <button
                onClick={() => setView("learning")}
                className="font-medium text-primary hover:underline"
              >
                Belajar tanpa login →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
