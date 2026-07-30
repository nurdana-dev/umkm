"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Info, Trophy, MessageSquare, BellOff } from "lucide-react";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const ICON_MAP: Record<string, { Icon: typeof Info; color: string }> = {
  info: { Icon: Info, color: "text-blue-500 bg-blue-50" },
  success: { Icon: CheckCircle2, color: "text-green-500 bg-green-50" },
  challenge: { Icon: Trophy, color: "text-amber-500 bg-amber-50" },
  feedback: { Icon: MessageSquare, color: "text-purple-500 bg-purple-50" },
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const day = Math.floor(h / 24);
  return `${day} hari lalu`;
}

export function NotificationsPanel({
  notifs,
  open,
  setOpen,
  onRead,
  trigger,
}: {
  notifs: Notification[];
  open: boolean;
  setOpen: (v: boolean) => void;
  onRead: (id: string) => void;
  trigger: ReactNode;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold">Notifikasi</span>
          <span className="text-xs text-muted-foreground">{notifs.length} total</span>
        </div>
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <BellOff className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Belum ada notifikasi</p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="flex flex-col">
              {notifs.map((n) => {
                const { Icon, color } = ICON_MAP[n.type] ?? ICON_MAP.info;
                return (
                  <button
                    key={n.id}
                    onClick={() => onRead(n.id)}
                    className={cn(
                      "flex gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent/50",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", color)}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{n.title}</span>
                        {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                      <span className="mt-1 block text-[10px] text-muted-foreground/70">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
