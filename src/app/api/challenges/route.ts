import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET challenges with submissions (optionally filtered by umkmId)
export async function GET(req: NextRequest) {
  const umkmId = req.nextUrl.searchParams.get("umkmId");
  const challenges = await db.challenge.findMany({
    include: {
      submissions: umkmId ? { where: { umkmId }, include: { umkm: true } } : { include: { umkm: true } },
      module: true,
    },
    orderBy: { week: "asc" },
  });
  const result = challenges.map((c) => ({
    ...c,
    submissions: c.submissions.map((s) => ({
      ...s,
    })),
  }));
  return NextResponse.json({ challenges: result });
}

// POST upsert submission (status update / feedback)
export async function POST(req: NextRequest) {
  try {
    const { challengeId, umkmId, status, content, feedback, mentorId } = await req.json();
    if (!challengeId || !umkmId) {
      return NextResponse.json({ error: "challengeId & umkmId wajib" }, { status: 400 });
    }
    const existing = await db.challengeSubmission.findUnique({
      where: { challengeId_umkmId: { challengeId, umkmId } },
    });
    let sub;
    if (existing) {
      sub = await db.challengeSubmission.update({
        where: { id: existing.id },
        data: {
          status: status ?? existing.status,
          content: content ?? existing.content,
          feedback: feedback ?? existing.feedback,
          mentorId: mentorId ?? existing.mentorId,
        },
      });
    } else {
      sub = await db.challengeSubmission.create({
        data: { challengeId, umkmId, status, content, feedback, mentorId },
      });
    }
    return NextResponse.json({ submission: sub });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menyimpan submission" }, { status: 500 });
  }
}
