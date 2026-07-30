import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET modules with lessons; if umkmId provided, include progress
export async function GET(req: NextRequest) {
  const umkmId = req.nextUrl.searchParams.get("umkmId");
  const modules = await db.module.findMany({
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });

  let progressMap: Record<string, boolean> = {};
  if (umkmId) {
    const progress = await db.progress.findMany({
      where: { umkmId },
    });
    progressMap = Object.fromEntries(progress.map((p) => [p.lessonId, p.completed]));
  }

  const result = modules.map((m) => {
    const lessons = m.lessons.map((l) => ({
      ...l,
      completed: progressMap[l.id] ?? false,
    }));
    const completedCount = lessons.filter((l) => l.completed).length;
    return {
      ...m,
      lessons,
      completedCount,
      totalCount: lessons.length,
      progressPercent: Math.round((completedCount / lessons.length) * 100),
    };
  });

  return NextResponse.json({ modules: result });
}

// POST toggle lesson completion
export async function POST(req: NextRequest) {
  try {
    const { umkmId, lessonId, completed } = await req.json();
    if (!umkmId || !lessonId) {
      return NextResponse.json({ error: "umkmId & lessonId wajib" }, { status: 400 });
    }
    const existing = await db.progress.findUnique({
      where: { umkmId_lessonId: { umkmId, lessonId } },
    });
    if (existing) {
      await db.progress.update({
        where: { id: existing.id },
        data: { completed, completedAt: completed ? new Date() : null },
      });
    } else {
      await db.progress.create({
        data: { umkmId, lessonId, completed, completedAt: completed ? new Date() : null },
      });
    }
    // Recompute digitization
    const allLessons = await db.lesson.count();
    const done = await db.progress.count({ where: { umkmId, completed: true } });
    const digitization = Math.round((done / allLessons) * 100);
    await db.umkm.update({ where: { id: umkmId }, data: { digitization } });
    return NextResponse.json({ ok: true, digitization });
  } catch (e) {
    return NextResponse.json({ error: "Gagal update progress" }, { status: 500 });
  }
}
