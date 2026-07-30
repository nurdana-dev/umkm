import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const showcases = await db.showcase.findMany({
    include: { umkm: true },
    orderBy: { publishedAt: "desc" },
  });
  const result = showcases.map((s) => ({
    ...s,
    achievements: JSON.parse(s.achievements),
  }));
  return NextResponse.json({ showcases: result });
}
