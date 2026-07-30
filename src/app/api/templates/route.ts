import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const templates = await db.template.findMany({
    orderBy: { createdAt: "asc" },
  });
  const result = templates.map((t) => ({
    ...t,
    fields: JSON.parse(t.fields),
    preview: JSON.parse(t.preview),
  }));
  return NextResponse.json({ templates: result });
}
