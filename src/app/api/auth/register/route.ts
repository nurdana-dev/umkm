import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Register a new UMKM account (role: peserta)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      businessName,
      category,
      description,
      village,
    } = body;

    // Validation
    if (!name || !email || !businessName || !category) {
      return NextResponse.json(
        { error: "Nama, email, nama usaha, dan kategori wajib diisi" },
        { status: 400 }
      );
    }

    const validCategories = ["kuliner", "fashion", "kerajinan", "pertanian", "jasa"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Kategori tidak valid" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan masuk dengan email tersebut." },
        { status: 409 }
      );
    }

    // Create User + Umkm in a transaction
    const user = await db.user.create({
      data: {
        email: cleanEmail,
        name: name.trim(),
        role: "peserta",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=2563eb`,
        umkm: {
          create: {
            name: businessName.trim(),
            category,
            description: (description ?? "").trim() || `Usaha ${category} di Desa Bringin.`,
            village: village?.trim() || "Desa Bringin",
            district: "Kec. Srumbung",
            regency: "Kab. Magelang",
            digitization: 0,
          },
        },
      },
      include: { umkm: true },
    });

    // Welcome notification
    await db.notification.create({
      data: {
        userId: user.id,
        title: "Selamat Datang di UMKM Naik Kelas!",
        message: `Halo ${user.name}! Akun UMKM Anda sudah aktif. Mulai perjalanan digital Anda dengan membuka Modul 1: AI untuk Transformasi UMKM.`,
        type: "success",
      },
    });
    await db.notification.create({
      data: {
        userId: user.id,
        title: "Challenge Minggu 1 Tersedia",
        message: "Challenge 'Membuat Profil Digital Usaha' sudah bisa dikerjakan. Yuk mulai!",
        type: "challenge",
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    console.error("[register]", e);
    return NextResponse.json({ error: "Gagal mendaftar. Coba lagi." }, { status: 500 });
  }
}
