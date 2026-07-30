import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ notifications: [] });
  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ notifications });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, id } = await req.json();
    if (!userId || !id) {
      return NextResponse.json({ error: "userId & id wajib" }, { status: 400 });
    }
    await db.notification.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal update notifikasi" }, { status: 500 });
  }
}
