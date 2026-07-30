import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const umkms = await db.umkm.findMany({
    include: {
      owner: true,
      showcase: true,
    },
    orderBy: { digitization: "desc" },
  });
  return NextResponse.json({ umkms });
}
