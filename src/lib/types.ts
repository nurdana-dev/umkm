// Shared types for the UMKM AI platform

export type Role = "peserta" | "mentor" | "admin";

export type ViewKey =
  | "landing"
  | "dashboard"
  | "learning"
  | "prompts"
  | "templates"
  | "challenges"
  | "showcase"
  | "admin"
  | "about"
  | "login";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  umkm?: Umkm | null;
}

export interface Umkm {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  story?: string | null;
  logo?: string | null;
  village: string;
  district: string;
  regency: string;
  digitization: number;
  joinedAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  type: string;
  content: string;
  duration: string;
  completed?: boolean;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  duration: string;
  level: string;
  lessons: Lesson[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export interface Prompt {
  id: string;
  title: string;
  category: string;
  purpose: string;
  body: string;
  tips?: string | null;
  difficulty: string;
  favorited: boolean;
}

export interface TemplateField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  fields: TemplateField[];
  preview: Record<string, unknown>;
  usageCount: number;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  umkmId: string;
  status: string;
  content?: string | null;
  feedback?: string | null;
  mentorId?: string | null;
  updatedAt: string;
  umkm?: Umkm;
}

export interface Challenge {
  id: string;
  week: number;
  title: string;
  description: string;
  instructions: string;
  moduleId?: string | null;
  deadline: string;
  submissions: ChallengeSubmission[];
  module?: { id: string; title: string } | null;
}

export interface Showcase {
  id: string;
  umkmId: string;
  headline: string;
  beforeStory: string;
  afterStory: string;
  achievements: string[];
  image?: string | null;
  publishedAt: string;
  umkm: Umkm;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  stats: {
    totalUmkm: number;
    activeUmkm: number;
    totalModules: number;
    totalPrompts: number;
    totalTemplates: number;
    totalShowcase: number;
    avgDigitization: number;
    completionRate: number;
    contentProduced: number;
  };
  categoryDist: { category: string; _count: number }[];
  digitizationBuckets: number[];
  moduleStats: {
    id: string;
    title: string;
    order: number;
    completedLessons: number;
    totalLessons: number;
    percent: number;
  }[];
  topUmkm: {
    id: string;
    name: string;
    category: string;
    digitization: number;
    completedLessons: number;
  }[];
}
