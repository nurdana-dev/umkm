"use client";

import { useApp } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LandingView } from "@/components/views/landing";
import { DashboardView } from "@/components/views/dashboard";
import { LearningView } from "@/components/views/learning";
import { PromptsView } from "@/components/views/prompts";
import { TemplatesView } from "@/components/views/templates";
import { ChallengesView } from "@/components/views/challenges";
import { ShowcaseView } from "@/components/views/showcase";
import { AdminView } from "@/components/views/admin";
import { AboutView } from "@/components/views/about";
import { LoginView } from "@/components/views/login";
import { useEffect } from "react";

export default function Home() {
  const { view, user, setView } = useApp();

  // Guard: dashboard requires peserta login; admin requires mentor/admin
  useEffect(() => {
    if ((view === "dashboard" || view === "challenges") && !user) {
      setView("login");
    }
    if (view === "admin" && (!user || user.role === "peserta")) {
      setView("login");
    }
  }, [view, user, setView]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {view === "landing" && <LandingView />}
        {view === "dashboard" && <DashboardView />}
        {view === "learning" && <LearningView />}
        {view === "prompts" && <PromptsView />}
        {view === "templates" && <TemplatesView />}
        {view === "challenges" && <ChallengesView />}
        {/* {view === "showcase" && <ShowcaseView />} */}
        {view === "admin" && <AdminView />}
        {view === "about" && <AboutView />}
        {view === "login" && <LoginView />}
      </main>
      <Footer />
    </div>
  );
}
