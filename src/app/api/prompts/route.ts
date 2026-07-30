import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const search = req.nextUrl.searchParams.get("search");
  const userId = req.nextUrl.searchParams.get("userId");
  const onlyFav = req.nextUrl.searchParams.get("fav") === "1";

  const where: Record<string, unknown> = {};
  if (category && category !== "all") where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { body: { contains: search } },
      { purpose: { contains: search } },
    ];
  }

  const prompts = await db.prompt.findMany({
    where,
    include: { favorites: userId ? { where: { userId } } : false },
    orderBy: { createdAt: "asc" },
  });

  let result = prompts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    purpose: p.purpose,
    body: p.body,
    tips: p.tips,
    difficulty: p.difficulty,
    favorited: userId ? p.favorites.length > 0 : false,
  }));

  if (onlyFav) result = result.filter((p) => p.favorited);

  return NextResponse.json({ prompts: result, total: result.length });
}

// Toggle favorite
export async function POST(req: NextRequest) {
  try {
    const { userId, promptId } = await req.json();
    if (!userId || !promptId) {
      return NextResponse.json({ error: "userId & promptId wajib" }, { status: 400 });
    }
    const existing = await db.favoritePrompt.findUnique({
      where: { userId_promptId: { userId, promptId } },
    });
    if (existing) {
      await db.favoritePrompt.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    } else {
      await db.favoritePrompt.create({ data: { userId, promptId } });
      return NextResponse.json({ favorited: true });
    }
  } catch (e) {
    return NextResponse.json({ error: "Gagal update favorit" }, { status: 500 });
  }
}
