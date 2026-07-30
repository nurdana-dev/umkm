"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Menu,
  Sparkles,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { NotificationsPanel } from "./notifications";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Notification, ViewKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { key: string; label: string; view: ViewKey }[] = [
  { key: "home", label: "Beranda", view: "landing" },
  { key: "learn", label: "Belajar AI", view: "learning" },
  { key: "prompts", label: "Prompt Library", view: "prompts" },
  { key: "templates", label: "Template", view: "templates" },
  { key: "challenges", label: "Challenge", view: "challenges" },
  // { key: "showcase", label: "Showcase", view: "showcase" },
  { key: "about", label: "Tentang", view: "about" },
];

export function Navbar() {
  const { view, setView, user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    api
      .notifications(user.id)
      .then((r) => {
        if (active) setNotifs(r.notifications);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user, view]);

  const unread = notifs.filter((n) => !n.read).length;

  const go = (v: ViewKey) => {
    setView(v);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => go("landing")}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-brand-gradient shadow-md transition-transform group-hover:scale-105">
            <Sparkles className="size-5 text-white" />
          </div>
          <div className="text-left leading-tight">
            <div className="font-display text-sm font-extrabold tracking-tight text-foreground">
              UMKM Naik Kelas
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Bersama AI
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => go(item.view)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                view === item.view
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {user && (
            <NotificationsPanel
              notifs={notifs}
              open={notifOpen}
              setOpen={setNotifOpen}
              onRead={async (id) => {
                await api.markNotifRead(user.id, id);
                setNotifs((prev) =>
                  prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
                );
              }}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifikasi"
                >
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Button>
              }
            />
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 pl-1 pr-2 hover:bg-accent"
                >
                  <Avatar className="size-7">
                    <AvatarImage
                      src={user.avatar ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-brand-gradient text-white text-xs font-bold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-semibold">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span>{user.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "mt-1 w-fit",
                      user.role === "admin" && "bg-primary/10 text-primary",
                      user.role === "mentor" && "bg-green-100 text-green-700",
                      user.role === "peserta" && "bg-amber-100 text-amber-700",
                    )}
                  >
                    {user.role === "admin" && (
                      <ShieldCheck className="mr-1 size-3" />
                    )}
                    {user.role === "mentor" && (
                      <GraduationCap className="mr-1 size-3" />
                    )}
                    {user.role === "peserta" && (
                      <Sparkles className="mr-1 size-3" />
                    )}
                    {user.role === "admin"
                      ? "Admin"
                      : user.role === "mentor"
                        ? "Mentor"
                        : "Peserta UMKM"}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "peserta" && (
                  <button
                    onClick={() => go("dashboard")}
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
                  >
                    <LayoutDashboard className="mr-2 size-4" /> Dashboard Saya
                  </button>
                )}
                {(user.role === "mentor" || user.role === "admin") && (
                  <button
                    onClick={() => go("admin")}
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
                  >
                    <LayoutDashboard className="mr-2 size-4" /> Dashboard
                    Admin/Mentor
                  </button>
                )}
                <button
                  onClick={() => go("learning")}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
                >
                  <GraduationCap className="mr-2 size-4" /> Learning Center
                </button>
                <DropdownMenuSeparator />
                <button
                  onClick={() => {
                    logout();
                    setNotifs([]);
                    setView("landing");
                  }}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 size-4" /> Keluar
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => go("login")}
              className="hidden sm:inline-flex bg-brand-gradient text-white shadow-md hover:opacity-90"
            >
              Masuk
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-85">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  UMKM Naik Kelas
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => go(item.view)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                      view === item.view
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                {!user && (
                  <Button
                    onClick={() => go("login")}
                    className="mt-4 bg-brand-gradient text-white"
                  >
                    Masuk Akun
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
