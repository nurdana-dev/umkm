"use client";

import type {
  DashboardStats,
  Module,
  Prompt,
  Template,
  Challenge,
  Showcase,
  Notification,
  Umkm,
  User,
} from "./types";

async function j<T>(res: Response | Promise<Response>): Promise<T> {
  const r = await res;
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? "Request gagal");
  }
  return r.json() as Promise<T>;
}

export const api = {
  async login(email: string): Promise<{ user: User }> {
    return j(fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }));
  },
  async register(data: {
    name: string;
    email: string;
    businessName: string;
    category: string;
    description?: string;
    village?: string;
  }): Promise<{ user: User }> {
    return j(fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }));
  },
  async umkms(): Promise<{ umkms: (Umkm & { owner: User; showcase?: unknown })[] }> {
    return j(fetch("/api/umkm"));
  },
  async modules(umkmId?: string): Promise<{ modules: Module[] }> {
    const q = umkmId ? `?umkmId=${umkmId}` : "";
    return j(fetch(`/api/modules${q}`));
  },
  async toggleLesson(umkmId: string, lessonId: string, completed: boolean) {
    return j<{ ok: boolean; digitization: number }>(fetch("/api/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ umkmId, lessonId, completed }),
    }));
  },
  async prompts(opts: { category?: string; search?: string; userId?: string; fav?: boolean } = {}): Promise<{ prompts: Prompt[]; total: number }> {
    const p = new URLSearchParams();
    if (opts.category) p.set("category", opts.category);
    if (opts.search) p.set("search", opts.search);
    if (opts.userId) p.set("userId", opts.userId);
    if (opts.fav) p.set("fav", "1");
    return j(fetch(`/api/prompts?${p}`));
  },
  async toggleFav(userId: string, promptId: string) {
    return j<{ favorited: boolean }>(fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, promptId }),
    }));
  },
  async templates(): Promise<{ templates: Template[] }> {
    return j(fetch("/api/templates"));
  },
  async challenges(umkmId?: string): Promise<{ challenges: Challenge[] }> {
    const q = umkmId ? `?umkmId=${umkmId}` : "";
    return j(fetch(`/api/challenges${q}`));
  },
  async saveSubmission(data: {
    challengeId: string;
    umkmId: string;
    status?: string;
    content?: string;
    feedback?: string;
    mentorId?: string;
  }) {
    return j<{ submission: unknown }>(fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }));
  },
  async showcases(): Promise<{ showcases: Showcase[] }> {
    return j(fetch("/api/showcase"));
  },
  async dashboard(): Promise<DashboardStats> {
    return j(fetch("/api/dashboard"));
  },
  async notifications(userId: string): Promise<{ notifications: Notification[] }> {
    return j(fetch(`/api/notifications?userId=${userId}`));
  },
  async markNotifRead(userId: string, id: string) {
    return j(fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, id }),
    }));
  },
};

export const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  kuliner: { label: "Kuliner", emoji: "🍳", color: "bg-orange-100 text-orange-700" },
  fashion: { label: "Fashion", emoji: "👗", color: "bg-pink-100 text-pink-700" },
  kerajinan: { label: "Kerajinan", emoji: "🧺", color: "bg-amber-100 text-amber-700" },
  pertanian: { label: "Pertanian", emoji: "🌾", color: "bg-green-100 text-green-700" },
  jasa: { label: "Jasa", emoji: "🤝", color: "bg-blue-100 text-blue-700" },
};

export const PURPOSE_META: Record<string, { label: string; emoji: string }> = {
  caption: { label: "Caption", emoji: "✍️" },
  deskripsi: { label: "Deskripsi", emoji: "📝" },
  ide: { label: "Ide Konten", emoji: "💡" },
  branding: { label: "Branding", emoji: "🎨" },
  strategi: { label: "Strategi", emoji: "🎯" },
};

export const LESSON_TYPE_META: Record<string, { label: string; emoji: string; color: string }> = {
  materi: { label: "Materi", emoji: "📖", color: "bg-blue-100 text-blue-700" },
  video: { label: "Video", emoji: "🎬", color: "bg-purple-100 text-purple-700" },
  kasus: { label: "Studi Kasus", emoji: "🔍", color: "bg-amber-100 text-amber-700" },
  latihan: { label: "Latihan", emoji: "✅", color: "bg-green-100 text-green-700" },
};
