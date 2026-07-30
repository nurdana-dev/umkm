import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [totalUmkm, totalModules, totalPrompts, totalTemplates, totalLessons, totalShowcase] = await Promise.all([
    db.umkm.count(),
    db.module.count(),
    db.prompt.count(),
    db.template.count(),
    db.lesson.count(),
    db.showcase.count(),
  ]);

  const umkms = await db.umkm.findMany({ include: { progress: true } });
  const activeUmkm = umkms.filter((u) => u.digitization > 0).length;
  const avgDigitization = umkms.length
    ? Math.round(umkms.reduce((a, u) => a + u.digitization, 0) / umkms.length)
    : 0;

  // Completed lessons across all UMKM
  const completedProgress = await db.progress.count({ where: { completed: true } });
  const completionRate = totalLessons > 0 ? Math.round((completedProgress / (totalLessons * umkms.length)) * 100) : 0;

  // Content produced (submissions + showcase + favorites as proxy)
  const submissions = await db.challengeSubmission.count();
  const contentProduced = submissions * 3 + totalShowcase * 5;

  // Category distribution
  const categoryDist = await db.umkm.groupBy({
    by: ["category"],
    _count: true,
  });

  // Weekly progress (synthetic from digitization buckets)
  const buckets = [0, 0, 0, 0, 0]; // 0-20, 21-40, 41-60, 61-80, 81-100
  for (const u of umkms) {
    if (u.digitization <= 20) buckets[0]++;
    else if (u.digitization <= 40) buckets[1]++;
    else if (u.digitization <= 60) buckets[2]++;
    else if (u.digitization <= 80) buckets[3]++;
    else buckets[4]++;
  }

  // Module completion across all UMKM
  const modules = await db.module.findMany({
    include: { lessons: true },
  });
  const moduleStats = await Promise.all(
    modules.map(async (m) => {
      const lessonIds = m.lessons.map((l) => l.id);
      const done = await db.progress.count({
        where: { lessonId: { in: lessonIds }, completed: true },
      });
      const totalPossible = lessonIds.length * umkms.length;
      return {
        id: m.id,
        title: m.title,
        order: m.order,
        completedLessons: done,
        totalLessons: lessonIds.length,
        percent: totalPossible > 0 ? Math.round((done / totalPossible) * 100) : 0,
      };
    })
  );

  // Recent UMKM with progress (top 8)
  const topUmkm = umkms
    .map((u) => ({
      id: u.id,
      name: u.name,
      category: u.category,
      digitization: u.digitization,
      completedLessons: u.progress.filter((p) => p.completed).length,
    }))
    .sort((a, b) => b.digitization - a.digitization)
    .slice(0, 8);

  return NextResponse.json({
    stats: {
      totalUmkm,
      activeUmkm,
      totalModules,
      totalPrompts,
      totalTemplates,
      totalShowcase,
      avgDigitization,
      completionRate,
      contentProduced,
    },
    categoryDist,
    digitizationBuckets: buckets,
    moduleStats,
    topUmkm,
  });
}
