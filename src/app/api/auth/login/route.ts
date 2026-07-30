import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simple demo login — returns user + umkm by email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { umkm: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan. Coba: ani@umkmai.id / budi@umkmai.id / mentor@umkmai.id / admin@umkmai.id" },
        { status: 404 }
      );
    }
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: "Gagal login" }, { status: 500 });
  }
}
