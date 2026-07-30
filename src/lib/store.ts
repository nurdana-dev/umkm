"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, ViewKey } from "./types";

interface AppState {
  // navigation
  view: ViewKey;
  setView: (v: ViewKey) => void;
  // optional sub-context (e.g. selected module)
  context: Record<string, unknown>;
  setContext: (c: Record<string, unknown>) => void;
  // auth
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  // notifications
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
  // mobile nav
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  // theme (light only for this prototype)
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      view: "landing",
      setView: (v) => {
        set({ view: v, mobileNavOpen: false });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      context: {},
      setContext: (c) => set({ context: c }),
      user: null,
      login: (u) => set({ user: u }),
      logout: () => set({ user: null, view: "landing" }),
      notifOpen: false,
      setNotifOpen: (v) => set({ notifOpen: v }),
      mobileNavOpen: false,
      setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
    }),
    {
      name: "umkm-ai-store",
      partialize: (s) => ({ user: s.user, view: s.view }),
    }
  )
);
