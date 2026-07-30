import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning existing data...");
  const tables = [
    "FavoritePrompt",
    "Notification",
    "Showcase",
    "ChallengeSubmission",
    "Challenge",
    "Progress",
    "Lesson",
    "Module",
    "Template",
    "Prompt",
    "Umkm",
    "User",
  ];
  for (const t of tables) {
    // @ts-expect-error dynamic table
    await db[t].deleteMany();
  }

  // ─── USERS ───────────────────────────────────────────────
  console.log("👤 Seeding users...");
  const admin = await db.user.create({
    data: {
      email: "admin@umkmai.id",
      name: "Dewi Anjani",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dewi%20Anjani&backgroundColor=2563eb",
    },
  });
  const mentor = await db.user.create({
    data: {
      email: "mentor@umkmai.id",
      name: "Rizki Pratama",
      role: "mentor",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rizki%20Pratama&backgroundColor=16a34a",
    },
  });
  const buAni = await db.user.create({
    data: {
      email: "ani@umkmai.id",
      name: "Bu Ani",
      role: "peserta",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bu%20Ani&backgroundColor=f59e0b",
    },
  });
  const pakBudi = await db.user.create({
    data: {
      email: "budi@umkmai.id",
      name: "Pak Budi",
      role: "peserta",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Pak%20Budi&backgroundColor=0ea5e9",
    },
  });

  // ─── UMKM ────────────────────────────────────────────────
  console.log("🏪 Seeding UMKM...");
  const umkmAni = await db.umkm.create({
    data: {
      ownerId: buAni.id,
      name: "Sambal Tradisional Bu Ani",
      category: "kuliner",
      description:
        "Sambal tradisional buatan rumahan dengan bahan segar dari kebun sendiri di Desa Bringin.",
      story:
        "Berawal dari hobi membuat sambal untuk keluarga, kini Bu Ani memproduksi 5 varian sambal yang dipasarkan ke warung dan pengepul.",
      digitization: 80,
      village: "Desa Bringin",
      district: "Kec. Srumbung",
      regency: "Kab. Magelang",
    },
  });
  const umkmBudi = await db.umkm.create({
    data: {
      ownerId: pakBudi.id,
      name: "Kerajinan Bambu Budi",
      category: "kerajinan",
      description:
        "Aneka kerajinan bambu fungsional: tempat pensil, lampu hias, dan wadah buah.",
      story:
        "Pak Budi mewarisi keahlian mengolah bambu dari ayahnya, kini berinovasi membuat produk yang sesuai selera pasar muda.",
      digitization: 55,
    },
  });
  // Extra UMKM (no login user, for showcase + admin stats)
  const extraUmkm = [
    { name: "Kopi Sumbing Mantap", category: "kuliner", digitization: 90, desc: "Kopi robusta dari lereng Gunung Sumbing." },
    { name: "Batik Sumbing Magelang", category: "fashion", digitization: 70, desc: "Batik dengan motif khas Magelang." },
    { name: "Madu Hutan Bringin", category: "pertanian", digitization: 45, desc: "Madu murni dari hutan sekitar Desa Bringin." },
    { name: "Kue Kering Mak Yem", category: "kuliner", digitization: 65, desc: "Kue kering lebaran aneka rasa." },
    { name: "Anyaman Pandan Sari", category: "kerajinan", digitization: 40, desc: "Anyaman pandan untuk tas dan tempat tisu." },
    { name: "Peternakan Ayam Pak Slamet", category: "pertanian", digitization: 35, desc: "Telur ayam kampung segar harian." },
    { name: "Jahit Mansur Tailor", category: "jasa", digitization: 50, desc: "Jasa jahit pakaian pria dan seragam." },
    { name: "Warung Kopi Kopi Tani", category: "jasa", digitization: 60, desc: "Kedai kopi sederhana untuk warga desa." },
    { name: "Tahu Tempe Bu Wati", category: "kuliner", digitization: 30, desc: "Produsen tahu tempe tradisional harian." },
    { name: "Bunga Potong Mekar Jaya", category: "pertanian", digitization: 25, desc: "Budidaya bunga potong untuk pernikahan." },
    { name: "Keripik Singkong Srumbung", category: "kuliner", digitization: 75, desc: "Keripik singkung aneka rasa." },
    { name: "Sabun Herbal Alami", category: "jasa", digitization: 85, desc: "Sabun herbal handmade dari minyak esensial." },
    { name: "Konveksi Anak Desa", category: "fashion", digitization: 68, desc: "Konveksi kaos dan kain sablon." },
    { name: "Tomat Hidroponik Bringin", category: "pertanian", digitization: 52, desc: "Tomat hidroponik segar tanpa pestisida." },
    { name: "Roti Bakar Magelang", category: "kuliner", digitization: 48, desc: "Roti bakar aneka topping." },
    { name: "Souvenir Pernikahan Elok", category: "kerajinan", digitization: 62, desc: "Souvenir pernikahan handmade." },
    { name: "Lontong Sayur Bu Tini", category: "kuliner", digitization: 38, desc: "Lontong sayur untuk acara desa." },
    { name: "Garmen Muslimah Berkah", category: "fashion", digitization: 58, desc: "Garmen muslimah ukuran besar." },
    { name: "Sayur Organik Pakemin", category: "pertanian", digitization: 42, desc: "Sayur organik langsung dari kebun." },
    { name: "Service Elektronik Jaya", category: "jasa", digitization: 33, desc: "Service TV dan kipas angin." },
    { name: "Donat Kentang Manis", category: "kuliner", digitization: 72, desc: "Donat kentang lembut aneka topping." },
    { name: "Topi Rajut Mama", category: "fashion", digitization: 47, desc: "Topi rajut hangat untuk anak." },
    { name: "Vas Bunga Keramik", category: "kerajinan", digitization: 55, desc: "Vas bunga keramik lukis tangan." },
    { name: "Bibit Cabai Unggul", category: "pertanian", digitization: 28, desc: "Bibit cabai hibrida siap tanam." },
    { name: "Catering Bu Rina", category: "jasa", digitization: 66, desc: "Catering harian dan acara." },
    { name: "Es Krim Tradisional", category: "kuliner", digitization: 44, desc: "Es krim rasa lokal: durian, nangka." },
    { name: "Sandal Kulit Asli", category: "fashion", digitization: 51, desc: "Sandal kulit sapi handmade." },
    { name: "Lukisan Bambu Seni", category: "kerajinan", digitization: 39, desc: "Lukisan di atas media bambu." },
  ];
  for (const u of extraUmkm) {
    const owner = await db.user.create({
      data: {
        email: `umkm-${u.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20)}@umkmai.id`,
        name: `Pemilik ${u.name}`.slice(0, 40),
        role: "peserta",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=94a3b8`,
      },
    });
    await db.umkm.create({
      data: {
        ownerId: owner.id,
        name: u.name,
        category: u.category,
        description: u.desc,
        digitization: u.digitization,
      },
    });
  }

  // ─── MODULES & LESSONS ───────────────────────────────────
  console.log("📚 Seeding modules & lessons...");
  const moduleData = [
    {
      order: 1,
      title: "AI untuk Transformasi UMKM",
      subtitle: "Mengenal dasar AI dan perannya bagi usaha kecil",
      description:
        "Modul pengenalan membangun pemahaman dasar tentang Artificial Intelligence dan bagaimana AI dapat membantu UMKM desa berkembang.",
      icon: "sparkles",
      duration: "45 menit",
      lessons: [
        { type: "materi", title: "Apa itu Artificial Intelligence", content: "Penjelasan sederhana tentang AI: komputer yang bisa belajar dan membantu manusia menyelesaikan tugas, seperti membuat teks, gambar, atau ide. AI bekerja dengan mempelajari banyak data lalu meniru pola tersebut." },
        { type: "materi", title: "Peran AI dalam Bisnis Kecil", content: "AI membantu UMKM menghemat waktu: menulis caption, membuat deskripsi produk, merancang ide promosi, hingga menganalisis pelanggan. UMKM tidak perlu ahli IT—cukup bisa menulis instruksi (prompt)." },
        { type: "video", title: "Contoh Penggunaan AI Sehari-hari", content: "Video 5 menit menunjukkan Bu Ani menggunakan AI untuk membuat caption sambalnya. Lihat bagaimana 1 menit prompt menghasilkan 10 ide konten." },
        { type: "kasus", title: "Studi Kasus: Sambal Bu Ani", content: "Sebelum AI: Bu Ani kebingungan menulis deskripsi. Setelah AI: deskripsi menarik dan caption Instagram rapi dalam hitungan menit. Omzet naik 30%." },
        { type: "latihan", title: "Latihan: Coba AI Pertama Kali", content: "Buka chatbot AI, ketik 'Halo, saya punya usaha sambal. Tolong beri 3 ide nama brand yang menarik'. Simpan hasilnya sebagai tugas modul ini." },
      ],
    },
    {
      order: 2,
      title: "Membangun Branding Digital UMKM",
      subtitle: "Menciptakan identitas usaha yang kuat dan berkesan",
      description:
        "Modul ini membantu UMKM menemukan nilai unik produk, menyusun identitas brand, dan menentukan target pelanggan yang tepat.",
      icon: "palette",
      duration: "60 menit",
      lessons: [
        { type: "materi", title: "Mengenali Nilai Unik Produk", content: "Setiap produk punya keistimewaan. Sambal Bu Ani unik karena bahan dari kebun sendiri. Latihan: tulis 3 keunikan produk Anda." },
        { type: "materi", title: "Membuat Identitas Brand", content: "Brand bukan sekadar logo. Brand adalah cerita, warna, gaya bahasa, dan perasaan yang timbul. AI membantu menyusun nama, tagline, dan palet warna." },
        { type: "materi", title: "Menentukan Target Pelanggan", content: "Siapa yang akan membeli? Ibu rumah tangga? Anak muda? Turis? AI membantu membuat profil pelanggan ideal (buyer persona)." },
        { type: "kasus", title: "Studi Kasus: Kerajinan Bambu Budi", content: "Pak Budi awalnya menjual ke semua orang. Setelah difokuskan ke pelanggan anak muda yang suka dekorasi kamar, desain produk disesuaikan dan harga naik 40%." },
        { type: "latihan", title: "Latihan: Buat Cerita Usaha", content: "Gunakan template Brand Story. Tulis cerita usaha Anda dalam 3 paragraf: awal mula, proses, dan harapan ke depan." },
      ],
    },
    {
      order: 3,
      title: "AI untuk Konten Marketing",
      subtitle: "Membuat caption, ide konten, dan strategi media sosial",
      description:
        "Modul praktis membuat konten pemasaran dengan bantuan AI: dari menulis prompt yang efektif hingga menyusun kalender konten 30 hari.",
      icon: "megaphone",
      duration: "75 menit",
      lessons: [
        { type: "materi", title: "Dasar Membuat Prompt", content: "Prompt baik = jelas + konteks + tujuan. Rumus: [siapa saya] + [produk] + [tujuan] + [gaya]. Contoh: 'Saya pemilik sambal, buat caption Instagram yang ramah untuk ibu rumah tangga'." },
        { type: "materi", title: "Membuat Ide Konten", content: "AI bisa menghasilkan 30 ide konten sekaligus. Kategori: edukasi, behind-the-scene, testimoni, promo, dan storytelling." },
        { type: "video", title: "Membuat Caption Promosi", content: "Demo langkah demi langkah membuat caption promosi yang convert. Termasuk penggunaan emoji, hashtag, dan call-to-action." },
        { type: "materi", title: "Strategi Konten Media Sosial", content: "Aturan 80/20: 80% konten bermanfaat, 20% jualan. Konsistensi posting lebih penting daripada jumlah." },
        { type: "latihan", title: "Latihan: Kalender Konten 7 Hari", content: "Buat kalender konten 7 hari untuk usaha Anda menggunakan AI. Setiap hari 1 ide konten + caption." },
      ],
    },
    {
      order: 4,
      title: "Digitalisasi Produk UMKM",
      subtitle: "Membawa produk UMKM ke ranah digital & marketplace",
      description:
        "Modul ini membantu UMKM membuat katalog digital, deskripsi produk yang menjual, dan mempersiapkan diri masuk marketplace.",
      icon: "shopping-bag",
      duration: "70 menit",
      lessons: [
        { type: "materi", title: "Membuat Katalog Digital", content: "Katalog digital = daftar produk dengan foto, nama, harga, deskripsi. Bisa berbentuk PDF, Google Drive, atau Canva." },
        { type: "materi", title: "Menulis Deskripsi Produk", content: "Deskripsi baik = manfaat + bahan + cara pakai + keunikan. AI membantu menyusunnya dengan gaya bahasa yang sesuai target." },
        { type: "video", title: "Meningkatkan Tampilan Produk", content: "Tips foto produk pakai HP: pencahayaan alami, latar bersih, sudut variasi. Tools AI enhancement opsional." },
        { type: "materi", title: "Persiapan Masuk Marketplace", content: "Marketplace: Shopee, Tokopedia, TikTok Shop. Siapkan: NIK, rekening, foto KTP, katalog, deskripsi, kebijakan pengiriman." },
        { type: "latihan", title: "Latihan: Upload 1 Produk", content: "Pilih 1 produk unggulan, buat deskripsi dengan AI, foto dengan HP, lalu upload ke marketplace pilihan Anda." },
      ],
    },
    {
      order: 5,
      title: "Strategi Pengembangan UMKM Digital",
      subtitle: "Evaluasi, perencanaan, dan pertumbuhan berkelanjutan",
      description:
        "Modul penutup membantu UMKM mengevaluasi promosi, memahami pelanggan, dan menyusun rencana bisnis berkelanjutan.",
      icon: "trending-up",
      duration: "65 menit",
      lessons: [
        { type: "materi", title: "Mengenal Pelanggan", content: "Pelanggan adalah raja. AI membantu menganalisis siapa pembeli, kapan beli, dan apa yang mereka suka dari data sederhana." },
        { type: "materi", title: "Evaluasi Promosi", content: "Setiap akhir bulan, tanya: konten mana yang paling banyak disuka? Produk mana paling laku? AI bantu ringkas insight." },
        { type: "materi", title: "Perencanaan Bisnis", content: "Buat target bulanan: jumlah posting, produk baru, omzet. AI bantu pecah target jadi aksi mingguan." },
        { type: "kasus", title: "Studi Kasus: Kopi Sumbing Mantap", content: "Setelah evaluasi rutin, omzet kopi Sumbing naik 3x dalam 6 bulan. Kuncinya: konsistensi konten dan respons cepat ke pembeli." },
        { type: "latihan", title: "Latihan: Rencana 90 Hari", content: "Susun rencana bisnis 90 hari ke depan dengan AI. Minimal: 3 target, 9 aksi bulanan, dan 1 mimpi jangka panjang." },
      ],
    },
  ];
  const moduleIds: Record<number, string> = {};
  for (const m of moduleData) {
    const mod = await db.module.create({
      data: {
        order: m.order,
        title: m.title,
        subtitle: m.subtitle,
        description: m.description,
        icon: m.icon,
        duration: m.duration,
        level: "Pemula",
      },
    });
    moduleIds[m.order] = mod.id;
    for (let i = 0; i < m.lessons.length; i++) {
      const l = m.lessons[i];
      await db.lesson.create({
        data: {
          moduleId: mod.id,
          order: i + 1,
          title: l.title,
          type: l.type,
          content: l.content,
          duration: l.type === "video" ? "5-8 menit" : "10-15 menit",
        },
      });
    }
  }

  // ─── PROGRESS for Bu Ani ─────────────────────────────────
  console.log("📈 Seeding progress...");
  const aniUmkm = umkmAni;
  const allLessons = await db.lesson.findMany({ orderBy: { order: "asc" } });
  // Complete first 2 modules + some of module 3
  for (const lesson of allLessons) {
    const mod = await db.module.findUnique({ where: { id: lesson.moduleId } });
    if (!mod) continue;
    let completed = false;
    if (mod.order <= 2) completed = true;
    else if (mod.order === 3 && lesson.order <= 3) completed = true;
    if (completed) {
      await db.progress.create({
        data: {
          umkmId: aniUmkm.id,
          lessonId: lesson.id,
          completed: true,
          completedAt: new Date(),
        },
      });
    }
  }
  // Budi: complete module 1 only
  for (const lesson of allLessons) {
    const mod = await db.module.findUnique({ where: { id: lesson.moduleId } });
    if (mod && mod.order === 1) {
      await db.progress.create({
        data: {
          umkmId: umkmBudi.id,
          lessonId: lesson.id,
          completed: true,
          completedAt: new Date(),
        },
      });
    }
  }

  // ─── PROMPTS (50+) ───────────────────────────────────────
  console.log("💬 Seeding AI prompts...");
  type P = { t: string; c: string; p: string; purpose: string; tips?: string; d?: string };
  const promptsByCat: Record<string, P[]> = {
    kuliner: [
      { t: "Caption Instagram Kuliner", c: "kuliner", purpose: "caption", d: "Mudah", p: "Saya pemilik usaha [nama usaha] yang menjual [produk]. Bahan utamanya dari [bahan]. Target pelanggan saya [target]. Bantu saya membuat caption Instagram yang menggugah selera, ramah, dan disertai ajakan beli. Sertakan 5 hashtag yang relevan.", tips: "Ganti bagian dalam kurung siku dengan detail usaha Anda." },
      { t: "Deskripsi Menu untuk Katalog", c: "kuliner", purpose: "deskripsi", d: "Mudah", p: "Buatkan deskripsi singkat (3-4 kalimat) untuk menu [nama menu] di usaha kuliner saya. Highlight bahan, rasa, dan kenapa pelanggan harus mencoba. Gaya bahasa: hangat dan mengundang selera." },
      { t: "Ide Konten 30 Hari Kuliner", c: "kuliner", purpose: "ide", d: "Sedang", p: "Saya butuh 30 ide konten Instagram untuk usaha kuliner [jenis kuliner]. Bagi ke dalam kategori: resep, behind the scene, testimoni, edukasi, dan promo. Untuk setiap ide beri 1 baris deskripsi." },
      { t: "Respon Ulasan Pelanggan", c: "kuliner", purpose: "strategi", d: "Mudah", p: "Pelanggan mengirim ulasan: '[ulasan pelanggan]'. Bantu saya membuat balasan yang sopan, apresiatif, dan profesional. Maksimal 3 kalimat." },
      { t: "Caption Story Telling Usaha Kuliner", c: "kuliner", purpose: "branding", d: "Sedang", p: "Ceritakan kisah usaha kuliner saya: berawal dari [awal mula], proses membuat [proses], harapan ke depan [harapan]. Susun jadi caption Instagram storytelling yang menyentuh, 4 paragraf." },
      { t: "Ide Nama Menu Unik", c: "kuliner", purpose: "ide", d: "Mudah", p: "Saya punya menu [deskripsi menu]. Beri 10 ide nama menu yang unik, mudah diingat, dan sesuai karakter usaha kuliner desa." },
      { t: "Pesan Broadcast WhatsApp Pelanggan", c: "kuliner", purpose: "strategi", d: "Mudah", p: "Buat pesan WhatsApp broadcast untuk pelanggan setia usaha [nama usaha]. Isi: info menu baru [menu], harga, dan promo awal. Gaya: ramah, tidak menjual jualan, ajakan halus." },
      { t: "Caption Promo Spesial Lebaran", c: "kuliner", purpose: "caption", d: "Mudah", p: "Buat caption Instagram untuk promo Lebaran usaha kuliner [jenis]. Produk: [produk], harga promo: [harga], masa berlaku: [tanggal]. Tambahkan urgensi dan call-to-action." },
      { t: "Deskripsi untuk GoFood/GrabFood", c: "kuliner", purpose: "deskripsi", d: "Mudah", p: "Tulis deskripsi menu [nama menu] untuk aplikasi GoFood/GrabFood. Maks 200 karakter. Sertakan bahan utama dan keunggulan rasa. Gaya: singkat dan menarik." },
      { t: "Jawaban FAQ Pelanggan Kuliner", c: "kuliner", purpose: "strategi", d: "Sedang", p: "Buat 5 FAQ untuk usaha kuliner [jenis] beserta jawabannya. Pertanyaan mencakup: cara pesan, lama pengiriman, area layanan, pembayaran, dan masa simpan." },
      { t: "Caption Reels Resep Singkat", c: "kuliner", purpose: "caption", d: "Mudah", p: "Saya membuat video Reels cara membuat [nama menu]. Bantu caption singkat yang membuat orang ingin menyimak + ajakan save dan share." },
      { t: "Ide Bundling Produk Kuliner", c: "kuliner", purpose: "ide", d: "Sedang", p: "Saya jual [produk A], [produk B], [produk C]. Beri 5 ide bundling yang menarik dengan nama paket, isi, dan saran harga bundling." },
    ],
    fashion: [
      { t: "Caption Instagram Produk Fashion", c: "fashion", purpose: "caption", d: "Mudah", p: "Saya penjual [jenis pakaian] dengan produk [nama produk]. Bahan [bahan], cocok untuk [acara/target]. Buatkan caption Instagram yang stylish, percaya diri, dan disertai ajakan beli + 5 hashtag." },
      { t: "Deskripsi Produk Baju", c: "fashion", purpose: "deskripsi", d: "Mudah", p: "Buat deskripsi produk [nama baju] untuk toko online. Sertakan: bahan, ukuran tersedia, warna, cara perawatan, dan keunggulan. Maks 150 kata." },
      { t: "Ide Konten 30 Hari Fashion", c: "fashion", purpose: "ide", d: "Sedang", p: "30 ide konten Instagram untuk usaha fashion [jenis]. Variasi: styling tips, behind the scene jahit, testimoni, mix & match, dan promo." },
      { t: "Tips Styling untuk Pelanggan", c: "fashion", purpose: "strategi", d: "Sedang", p: "Buat 3 tips styling untuk [jenis pakaian] agar pelanggan makin sering pakai. Format: judul tip + 2 kalimat penjelasan." },
      { t: "Caption Promo Clearance", c: "fashion", purpose: "caption", d: "Mudah", p: "Caption Instagram untuk promo clearance [jenis produk]. Diskon [X]%, stok terbatas. Gaya: urgency + excitement. Sertakan countdown mental." },
      { t: "Bio Instagram Toko Fashion", c: "fashion", purpose: "branding", d: "Mudah", p: "Buat 3 alternatif bio Instagram untuk toko [jenis fashion]. Sertakan: keunikan, ajakan DM, dan link order. Maks 150 karakter per alternatif." },
      { t: "Pesan Konfirmasi Pesanan", c: "fashion", purpose: "strategi", d: "Mudah", p: "Buat template pesan konfirmasi pesanan untuk pelanggan yang memesan [produk]. Sertakan: terima kasih, detail pesanan, total, estimasi kirim, nomor resi nanti." },
      { t: "Ide Lookbook Produk", c: "fashion", purpose: "ide", d: "Sedang", p: "Saya ingin buat lookbook [jenis fashion]. Beri 6 konsep foto dengan tema, lokasi, dan styling yang berbeda untuk produk saya." },
      { t: "Deskripsi Koleksi Baru", c: "fashion", purpose: "deskripsi", d: "Mudah", p: "Tulis deskripsi koleksi baru [nama koleksi] yang terinspirasi dari [tema]. Tone: elegan dan aspirational. 3 paragraf." },
      { t: "Caption Testimoni Pelanggan", c: "fashion", purpose: "caption", d: "Mudah", p: "Pelanggan mengirim testimoni: '[testimoni]'. Buat caption repost testimoni yang mengapresiasi + ajakan pelanggan lain untuk coba produk." },
      { t: "Strategi Pre-Order Fashion", c: "fashion", purpose: "strategi", d: "Sedang", p: "Saya ingin sistem pre-order untuk [produk]. Buatkan strategi: periode PO, DP, estimasi jadi, dan cara komunikasi ke pelanggan." },
    ],
    kerajinan: [
      { t: "Caption Instagram Kerajinan Tangan", c: "kerajinan", purpose: "caption", d: "Mudah", p: "Usaha saya [jenis kerajinan] dari bahan [bahan]. Produk ini cocok untuk [kegunaan]. Buat caption yang menonjolkan sifat handmade, keunikan, dan nilai seni. 5 hashtag." },
      { t: "Deskripsi Produk Kerajinan", c: "kerajinan", purpose: "deskripsi", d: "Mudah", p: "Deskripsikan produk [nama produk] kerajinan [bahan]. Sertakan: bahan, proses pembuatan, dimensi, keunikan, dan perawatan. Maks 120 kata." },
      { t: "Cerita di Balik Produk", c: "kerajinan", purpose: "branding", d: "Sedang", p: "Buat storytelling 'behind the scene' produk [nama produk]. Ceritakan proses dari bahan mentah hingga jadi, filosofi, dan tangan-tangan yang membuatnya. 4 paragraf." },
      { t: "Ide Konten 30 Hari Kerajinan", c: "kerajinan", purpose: "ide", d: "Sedang", p: "30 ide konten Instagram untuk usaha kerajinan [jenis]. Variasi: proses pembuatan, inspirasi, tips perawatan, testimoni, dan edukasi bahan." },
      { t: "Pesan Custom Order", c: "kerajinan", purpose: "strategi", d: "Mudah", p: "Buat template balasan untuk pelanggan yang minta custom order [produk]. Sertakan: terima kasih, pertanyaan detail, estimasi harga & waktu, DP." },
      { t: "Caption Edukasi Bahan", c: "kerajinan", purpose: "caption", d: "Sedang", p: "Buat caption edukatif tentang bahan [nama bahan] yang saya gunakan: asal, keunggulan, dan kenapa lebih baik dari alternatif. 3 paragraf + ajakan save." },
      { t: "Deskripsi untuk Marketplace", c: "kerajinan", purpose: "deskripsi", d: "Mudah", p: "Deskripsi produk [nama produk] untuk marketplace (Etsy/Shopee). Sertakan SEO keywords alami, benefit, dan spec. Maks 250 kata." },
      { t: "Ide Paket Hadiah Kerajinan", c: "kerajinan", purpose: "ide", d: "Sedang", p: "Saya jual [produk A, B, C]. Buat 5 ide paket hadiah dengan tema (ulang tahun, pernikahan, souvenir acara) lengkap dengan isi dan saran harga." },
      { t: "Caption Lebaran Souvenir", c: "kerajinan", purpose: "caption", d: "Mudah", p: "Caption promo souvenir Lebaran [jenis kerajinan]. Sertakan: minimum order, harga, estimasi, dan ajakan pesan awal agar tidak kehabisan." },
      { t: "Tips Packing Aman Kirim", c: "kerajinan", purpose: "strategi", d: "Mudah", p: "Buat panduan packing aman untuk produk kerajinan [bahan] yang mudah pecah/rusak saat pengiriman. 5 langkah praktis." },
      { t: "Prompt Ide Produk Baru", c: "kerajinan", purpose: "ide", d: "Sedang", p: "Saya ahli kerajinan [bahan]. Beri 8 ide produk baru yang sedang tren dan cocok untuk pasar anak muda, lengkap dengan deskripsi singkat." },
    ],
    pertanian: [
      { t: "Caption Instagram Produk Pertanian", c: "pertanian", purpose: "caption", d: "Mudah", p: "Usaha saya [jenis produk pertanian] dari lahan di [lokasi]. Tanpa pestisida/organik. Buat caption yang menonjolkan kesegaran, keaslian, dan kesehatan. 5 hashtag." },
      { t: "Deskripsi Produk Segar", c: "pertanian", purpose: "deskripsi", d: "Mudah", p: "Deskripsikan [produk pertanian] untuk online shop. Sertakan: varietas, asal, cara panen, manfaat gizi, dan tips penyimpanan. Maks 130 kata." },
      { t: "Edukasi Manfaat Produk", c: "pertanian", purpose: "caption", d: "Sedang", p: "Buat caption edukatif tentang manfaat [produk pertanian] untuk kesehatan. Sertakan 3 manfaat utama + 1 cara konsumsi. Tone: informatif dan ramah." },
      { t: "Ide Konten 30 Hari Pertanian", c: "pertanian", purpose: "ide", d: "Sedang", p: "30 ide konten Instagram untuk usaha pertanian [jenis]. Variasi: proses tanam, panen, edukasi, resep, testimoni, dan promo musim." },
      { t: "Pesan Pre-Harvest Order", c: "pertanian", purpose: "strategi", d: "Mudah", p: "Buat pesan pre-harvest order untuk [produk]. Estimasi panen [tanggal], harga [harga], minimum order [jumlah]. Tone: ajakan ramah + urgency musim." },
      { t: "Caption Story Petani", c: "pertanian", purpose: "branding", d: "Sedang", p: "Ceritakan keseharian sebagai petani [jenis tanaman] di [desa]: rutinitas pagi, tantangan, dan kebanggaan. 4 paragraf storytelling yang hangat." },
      { t: "Deskripsi untuk Grosir/Resto", c: "pertanian", purpose: "deskripsi", d: "Sedang", p: "Deskripsi B2B untuk [produk pertanian] yang ditawarkan ke resto/grosir. Sertakan: supply mingguan, mutu, harga grosir, dan fleksibilitas pengiriman." },
      { t: "Tips Memilih Produk Segar", c: "pertanian", purpose: "strategi", d: "Mudah", p: "Buat 5 tips memilih [produk pertanian] yang segar untuk pelanggan. Format: tip singkat + 1 kalimat penjelasan. Edukatif dan mudah diingat." },
      { t: "Caption Promo Panen Raya", c: "pertanian", purpose: "caption", d: "Mudah", p: "Caption promo panen raya [produk]. Harga spesial [harga], stok melimpah, masa terbatas. Tone: semangat + urgency + ajakan borong." },
      { t: "Resep Olahan Produk", c: "pertanian", purpose: "ide", d: "Sedang", p: "Buat 3 resep olahan sederhana dari [produk pertanian] saya. Format: nama resep, bahan, langkah singkat. Cocok untuk konten edukatif." },
      { t: "Pertanyaan Pelanggan Organik", c: "pertanian", purpose: "strategi", d: "Mudah", p: "Pelanggan bertanya 'apakah benar organik?'. Buat jawaban meyakinkan, jujur, dan edukatif tentang praktik organik saya. 3-4 kalimat." },
    ],
    jasa: [
      { t: "Caption Instagram Jasa", c: "jasa", purpose: "caption", d: "Mudah", p: "Usaha jasa saya [jenis jasa] untuk [target]. Keunggulan [keunggulan]. Buat caption Instagram yang membangun kepercayaan dan ajakan coba. 5 hashtag." },
      { t: "Deskripsi Paket Layanan", c: "jasa", purpose: "deskripsi", d: "Mudah", p: "Buat deskripsi paket [nama paket] untuk usaha jasa [jenis]. Sertakan: apa yang didapat, durasi, harga, dan benefit utama. Maks 120 kata." },
      { t: "Ide Konten 30 Hari Jasa", c: "jasa", purpose: "ide", d: "Sedang", p: "30 ide konten Instagram untuk usaha jasa [jenis]. Variasi: tips, portofolio, testimoni, edukasi, dan promo." },
      { t: "Pesan Konfirmasi Booking", c: "jasa", purpose: "strategi", d: "Mudah", p: "Template konfirmasi booking jasa [jenis] untuk pelanggan. Sertakan: tanggal, waktu, lokasi, total, dan catatan. Gaya: profesional dan ramah." },
      { t: "Caption Testimoni Pelanggan", c: "jasa", purpose: "caption", d: "Mudah", p: "Pelanggan kirim testimoni: '[testimoni]'. Buat caption repost yang mengapresiasi + ajakan pelanggan lain pakai jasa." },
      { t: "FAQ Jasa", c: "jasa", purpose: "strategi", d: "Sedang", p: "Buat 5 FAQ untuk usaha jasa [jenis] + jawabannya. Mencakup: cara booking, pembayaran, area layanan, reschedule, dan garansi." },
      { t: "Deskripsi Profil Bisnis", c: "jasa", purpose: "branding", d: "Sedang", p: "Tulis profil bisnis jasa [jenis] untuk website/Google Business. Sertakan: latar belakang, layanan, keunggulan, dan kontak. 3 paragraf." },
      { t: "Caption Promo Perdana", c: "jasa", purpose: "caption", d: "Mudah", p: "Caption promo perdana [jenis jasa]. Diskon [X]% untuk 10 pelanggan pertama. Tone: scarcity + excitement." },
      { t: "Tips Edukatif Jasa", c: "jasa", purpose: "ide", d: "Sedang", p: "Buat 5 tips edukatif seputar [bidang jasa]. Tiap tip 2 kalimat. Tujuan: membangun otoritas dan kepercayaan." },
      { t: "Pesan Follow Up Pelanggan", c: "jasa", purpose: "strategi", d: "Mudah", p: "Template follow up 3 hari setelah layanan jasa [jenis] diberikan. Tanya kepuasan, minta testimoni, dan tawarkan layanan lanjutan." },
      { t: "Ide Paket Bundling Jasa", c: "jasa", purpose: "ide", d: "Sedang", p: "Saya punya jasa [A, B, C]. Buat 4 ide paket bundling dengan nama paket, isi, dan saran harga hemat untuk pelanggan." },
    ],
  };
  let promptCount = 0;
  for (const [cat, items] of Object.entries(promptsByCat)) {
    for (const it of items) {
      await db.prompt.create({
        data: {
          title: it.t,
          category: cat,
          purpose: it.purpose,
          body: it.p,
          tips: it.tips ?? null,
          difficulty: it.d ?? "Mudah",
        },
      });
      promptCount++;
    }
  }
  console.log(`  → ${promptCount} prompts seeded`);

  // ─── TEMPLATES ───────────────────────────────────────────
  console.log("📄 Seeding templates...");
  const templates = [
    {
      title: "Profil Usaha Digital",
      description: "Identitas lengkap usaha Anda dalam satu halaman siap dibagikan.",
      category: "branding",
      icon: "store",
      fields: JSON.stringify([
        { key: "nama", label: "Nama Usaha", type: "text", placeholder: "Sambal Tradisional Bu Ani" },
        { key: "kategori", label: "Kategori Usaha", type: "select", options: ["Kuliner", "Fashion", "Kerajinan", "Pertanian", "Jasa"] },
        { key: "cerita", label: "Cerita Usaha", type: "textarea", placeholder: "Ceritakan awal mula usaha Anda..." },
        { key: "unggulan", label: "Produk Unggulan", type: "textarea", placeholder: "Sebutkan 3 produk unggulan" },
        { key: "keunikan", label: "Keunikan Usaha", type: "textarea", placeholder: "Apa yang membuat usaha Anda berbeda?" },
        { key: "kontak", label: "Kontak / WhatsApp", type: "text", placeholder: "08xx-xxxx-xxxx" },
      ]),
      preview: JSON.stringify({
        nama: "Sambal Tradisional Bu Ani",
        kategori: "Kuliner",
        cerita: "Berawal dari hobi membuat sambal untuk keluarga, kini Bu Ani memproduksi 5 varian sambal...",
        unggulan: "Sambal Bawal, Sambal Terasi, Sambal Matah",
        keunikan: "Bahan segar dari kebun sendiri, tanpa pengawet",
        kontak: "0812-3456-7890",
      }),
    },
    {
      title: "Template Bio Instagram",
      description: "Bio Instagram profesional yang menarik dan informatif untuk usaha Anda.",
      category: "sosmed",
      icon: "instagram",
      fields: JSON.stringify([
        { key: "nama", label: "Nama Usaha", type: "text", placeholder: "Sambal Bu Ani" },
        { key: "tagline", label: "Tagline Singkat", type: "text", placeholder: "Sambal segar dari kebun sendiri" },
        { key: "keunikan", label: "Keunikan (1 kata)", type: "text", placeholder: "100% Bahan Alam" },
        { key: "lokasi", label: "Lokasi", type: "text", placeholder: "Magelang, Jawa Tengah" },
        { key: "cta", label: "Ajakan (Call to Action)", type: "text", placeholder: "Pesan via WA 👇" },
        { key: "link", label: "Link Pemesanan", type: "text", placeholder: "wa.me/62..." },
      ]),
      preview: JSON.stringify({
        lines: [
          "🌶️ Sambal Bu Ani",
          "Sambal segar dari kebun sendiri",
          "✨ 100% Bahan Alam | No Pengawet",
          "📍 Magelang, Jawa Tengah",
          "📦 Pengiriman se-Jateng & Jogja",
          "👇 Pesan via WhatsApp",
        ],
      }),
    },
    {
      title: "Kalender Konten 30 Hari",
      description: "Rencana konten Instagram/TikTok 30 hari dengan tema dan caption ringkas.",
      category: "konten",
      icon: "calendar",
      fields: JSON.stringify([
        { key: "usaha", label: "Nama Usaha", type: "text", placeholder: "Sambal Bu Ani" },
        { key: "kategori", label: "Kategori", type: "select", options: ["Kuliner", "Fashion", "Kerajinan", "Pertanian", "Jasa"] },
        { key: "platform", label: "Platform Utama", type: "select", options: ["Instagram", "TikTok", "Facebook", "WhatsApp Status"] },
        { key: "tujuan", label: "Tujuan Konten", type: "text", placeholder: "Meningkatkan penjualan & awareness" },
      ]),
      preview: JSON.stringify({
        week1: "Hari 1-7: Perkenalan brand, cerita usaha, produk unggulan",
        week2: "Hari 8-14: Behind the scene, proses produksi, tips",
        week3: "Hari 15-21: Testimoni pelanggan, edukasi manfaat, FAQ",
        week4: "Hari 22-30: Promo, flash sale, recap, ajakan follow",
      }),
    },
    {
      title: "Deskripsi Produk Jualan",
      description: "Deskripsi produk yang menjual untuk marketplace dan katalog online.",
      category: "produk",
      icon: "package",
      fields: JSON.stringify([
        { key: "produk", label: "Nama Produk", type: "text", placeholder: "Sambal Bawang Putih 250gr" },
        { key: "bahan", label: "Bahan Utama", type: "text", placeholder: "Cabai rawit, bawang putih, minyak sayur" },
        { key: "manfaat", label: "Manfaat / Keunggulan", type: "textarea", placeholder: "Pedas pas, tanpa pengawet..." },
        { key: "ukuran", label: "Ukuran / Berat", type: "text", placeholder: "250 gram" },
        { key: "harga", label: "Harga", type: "text", placeholder: "Rp 25.000" },
        { key: "cara", label: "Cara Pakai / Simpan", type: "textarea", placeholder: "Simpan di kulkas, tahan 2 minggu..." },
      ]),
      preview: JSON.stringify({
        produk: "Sambal Bawang Putih 250gr",
        desc: "Sambal bawang putih homemade dengan cabai rawit pilihan dari kebun sendiri. Pedas pas, gurih, tanpa pengawet. Cocok untuk lauk nasi, mie, atau cemilan.",
        spec: "Berat 250gr | Harga Rp 25.000 | Simpan kulkas 2 minggu",
      }),
    },
    {
      title: "Ide Promosi Bulanan",
      description: "Daftar ide promosi 4 minggu untuk meningkatkan penjualan UMKM Anda.",
      category: "marketing",
      icon: "megaphone",
      fields: JSON.stringify([
        { key: "usaha", label: "Nama Usaha", type: "text", placeholder: "Sambal Bu Ani" },
        { key: "target", label: "Target Omzet Bulan Ini", type: "text", placeholder: "Rp 5.000.000" },
        { key: "anggaran", label: "Anggaran Promosi", type: "text", placeholder: "Rp 300.000" },
      ]),
      preview: JSON.stringify({
        minggu1: "Minggu 1: Buy 1 Get 1 untuk pelanggan baru",
        minggu2: "Minggu 2: Flash sale 24 jam di Instagram Story",
        minggu3: "Minggu 3: Bundling hemat untuk hadiah",
        minggu4: "Minggu 4: Giveaway + ajakan follow + tag teman",
      }),
    },
    {
      title: "Brand Story Usaha",
      description: "Cerita brand yang menyentuh untuk membangun koneksi emosional dengan pelanggan.",
      category: "branding",
      icon: "book-open",
      fields: JSON.stringify([
        { key: "nama", label: "Nama Usaha", type: "text", placeholder: "Sambal Bu Ani" },
        { key: "awal", label: "Awal Mula Usaha", type: "textarea", placeholder: "Bagaimana usaha ini dimulai?" },
        { key: "proses", label: "Proses & Filosofi", type: "textarea", placeholder: "Bagaimana proses pembuatannya? Apa filosofinya?" },
        { key: "harapan", label: "Harapan Ke Depan", type: "textarea", placeholder: "Apa mimpi usaha Anda?" },
      ]),
      preview: JSON.stringify({
        judul: "Dari Dapur Rumah ke Meja Pelanggan",
        isi: "Berawal dari hobi membuat sambal untuk keluarga, Bu Ani melihat peluang saat tetangga mulai meminta... Setiap botol sambal dibuat dengan bahan segar dari kebun sendiri... Harapan ke depan, sambal Bu Ani bisa dinikmati pelanggan di seluruh Indonesia.",
      }),
    },
  ];
  for (const t of templates) {
    await db.template.create({
      data: {
        title: t.title,
        description: t.description,
        category: t.category,
        icon: t.icon,
        fields: t.fields,
        preview: t.preview,
        usageCount: Math.floor(Math.random() * 40) + 5,
      },
    });
  }

  // ─── CHALLENGES ──────────────────────────────────────────
  console.log("🏆 Seeding challenges...");
  const challenges = [
    {
      week: 1,
      title: "Membuat Profil Digital Usaha",
      description: "Susun profil usaha digital pertama Anda menggunakan template Profil Usaha Digital.",
      instructions: "1. Buka menu Template → Profil Usaha Digital.\n2. Isi semua field dengan data usaha Anda.\n3. Simpan & unggah hasilnya di sini.\n4. Mentor akan memberi feedback dalam 2 hari.",
      moduleId: moduleIds[1],
      deadline: "Minggu ini",
    },
    {
      week: 2,
      title: "Membuat 3 Caption Instagram Pertama",
      description: "Gunakan AI Prompt Library untuk membuat 3 caption promosi produk Anda.",
      instructions: "1. Buka AI Prompt Library, pilih kategori usaha Anda.\n2. Pilih 3 prompt caption, isi dengan data usaha.\n3. Copy hasil ke notes, unggah sebagai submission.",
      moduleId: moduleIds[3],
      deadline: "Minggu ini",
    },
    {
      week: 3,
      title: "Foto Produk dengan HP",
      description: "Ambil 5 foto produk terbaik menggunakan tips dari Modul 4.",
      instructions: "1. Siapkan 1 produk unggulan.\n2. Foto dengan pencahayaan alami, 5 sudut berbeda.\n3. Pilih 3 foto terbaik, unggah di sini.",
      moduleId: moduleIds[4],
      deadline: "Minggu ini",
    },
    {
      week: 4,
      title: "Buat Kalender Konten 7 Hari",
      description: "Susun kalender konten 7 hari untuk media sosial usaha Anda.",
      instructions: "1. Gunakan template Kalender Konten 30 Hari.\n2. Fokus ke 7 hari pertama.\n3. Setiap hari: 1 ide + 1 caption ringkas.\n4. Unggah hasilnya.",
      moduleId: moduleIds[3],
      deadline: "Minggu ini",
    },
    {
      week: 5,
      title: "Upload 1 Produk ke Marketplace",
      description: "Bawa 1 produk unggulan Anda ke marketplace pilihan.",
      instructions: "1. Pilih 1 produk unggulan.\n2. Buat deskripsi dengan AI.\n3. Upload ke Shopee/Tokopedia/TikTok Shop.\n4. Screenshot listing, unggah di sini.",
      moduleId: moduleIds[4],
      deadline: "Minggu ini",
    },
  ];
  for (const c of challenges) {
    await db.challenge.create({ data: c });
  }

  // Bu Ani submissions
  const ch1 = await db.challenge.findFirst({ where: { week: 1 } });
  const ch2 = await db.challenge.findFirst({ where: { week: 2 } });
  const ch3 = await db.challenge.findFirst({ where: { week: 3 } });
  if (ch1)
    await db.challengeSubmission.create({
      data: {
        challengeId: ch1.id,
        umkmId: umkmAni.id,
        status: "selesai",
        content: "Profil usaha sudah lengkap. Nama: Sambal Tradisional Bu Ani, 5 varian sambal, bahan dari kebun sendiri.",
        feedback: "Keren Bu Ani! Profilnya jelas dan menarik. Lanjutkan ke challenge minggu 2 ya.",
        mentorId: mentor.id,
      },
    });
  if (ch2)
    await db.challengeSubmission.create({
      data: {
        challengeId: ch2.id,
        umkmId: umkmAni.id,
        status: "selesai",
        content: "3 caption sudah jadi untuk varian Sambal Bawang, Sambal Terasi, Sambal Matah.",
        feedback: "Captionnya bagus dan konsisten. Coba tambahkan emoji lebih banyak untuk engagement.",
        mentorId: mentor.id,
      },
    });
  if (ch3)
    await db.challengeSubmission.create({
      data: {
        challengeId: ch3.id,
        umkmId: umkmAni.id,
        status: "proses",
        content: "Sudah foto 3 dari 5 sudut, akan dilanjutkan besok pagi.",
      },
    });
  // Budi: week 1 selesai
  if (ch1)
    await db.challengeSubmission.create({
      data: {
        challengeId: ch1.id,
        umkmId: umkmBudi.id,
        status: "selesai",
        content: "Profil usaha kerajinan bambu sudah dibuat.",
        feedback: "Bagus Pak Budi! Keunikan produk sudah tertulis dengan jelas.",
        mentorId: mentor.id,
      },
    });

  // ─── SHOWCASE ────────────────────────────────────────────
  console.log("🌟 Seeding showcase...");
  const showcases = [
    {
      umkm: "Sambal Tradisional Bu Ani",
      headline: "Dari Dapur Rumah ke Pelanggan Se-Jawa Tengah",
      beforeStory: "Sebelum program, Bu Ani hanya menjual sambal ke tetangga dan warung sekitar. Tidak punya foto produk, tidak punya Instagram, promosi hanya dari mulut ke mulut.",
      afterStory: "Setelah 2 bulan program, Bu Ani punya Instagram aktif, katalog digital, dan caption promosi yang menarik. Omzet naik 35% dan pelanggan bertambah dari luar desa.",
      achievements: ["Instagram aktif dengan 320 followers", "5 caption promosi siap pakai", "Katalog digital 5 varian sambal", "Pelanggan baru dari 3 kota"],
      digitization: 80,
    },
    {
      umkm: "Kopi Sumbing Mantap",
      headline: "Kopi Desa Naik Kelas dengan Branding Digital",
      beforeStory: "Pak Slamet menjual kopi dalam kemasan polos tanpa label. Pembeli hanya dari pasar lokal.",
      afterStory: "Kini kopi Sumbing punya brand, label menarik, dan terjual online ke berbagai kota. Omzet naik 3x lipat.",
      achievements: ["Brand & label kemasan baru", "Toko online di 2 marketplace", "200+ transaksi online", "Omzet naik 300%"],
      digitization: 90,
    },
    {
      umkm: "Kerajinan Bambu Budi",
      headline: "Kerajinan Bambu Incar Pasar Anak Muda",
      beforeStory: "Pak Budi membuat produk bambu tradisional yang sulit bersaing dengan produk pabrik.",
      afterStory: "Setelah difokuskan ke pasar anak muda dengan desain modern, harga jual naik 40% dan pesanan custom meningkat.",
      achievements: ["Desain produk modern", "Target pelanggan jelas", "Harga jual naik 40%", "10 pesanan custom/bulan"],
      digitization: 55,
    },
    {
      umkm: "Batik Sumbing Magelang",
      headline: "Batik Lokal Temukan Cerita Brandnya",
      beforeStory: "Bu Ratna menjual batik tanpa cerita brand, sulit dibedakan dari batik lain.",
      afterStory: "Dengan brand story yang kuat dan konten edukatif, pelanggan kini datang karena tertarik dengan filosofi motifnya.",
      achievements: ["Brand story menarik", "Konten edukatif motif batik", "500 followers Instagram", "Kolaborasi dengan 2 butik"],
      digitization: 70,
    },
    {
      umkm: "Sabun Herbal Alami",
      headline: "Sabun Herbal Temui Pelanggan Online",
      beforeStory: "Produksi sabun terbatas, pemasaran hanya lewat WhatsApp keluarga.",
      afterStory: "Dengan katalog digital dan konten edukasi manfaat, sabun herbal kini terjual ke 5 kota.",
      achievements: ["Katalog digital lengkap", "Konten edukasi manfaat", "Pelanggan di 5 kota", "Produksi naik 2x"],
      digitization: 85,
    },
  ];
  for (const s of showcases) {
    const umkm = await db.umkm.findFirst({ where: { name: s.umkm } });
    if (umkm) {
      await db.showcase.create({
        data: {
          umkmId: umkm.id,
          headline: s.headline,
          beforeStory: s.beforeStory,
          afterStory: s.afterStory,
          achievements: JSON.stringify(s.achievements),
        },
      });
    }
  }

  // ─── NOTIFICATIONS ───────────────────────────────────────
  console.log("🔔 Seeding notifications...");
  await db.notification.createMany({
    data: [
      {
        userId: buAni.id,
        title: "Feedback Mentor",
        message: "Pak Rizki memberi feedback pada Challenge Minggu 2 Anda. Lihat sekarang!",
        type: "feedback",
      },
      {
        userId: buAni.id,
        title: "Challenge Baru",
        message: "Challenge Minggu 3: Foto Produk dengan HP sudah dibuka.",
        type: "challenge",
      },
      {
        userId: buAni.id,
        title: "Selamat!",
        message: "Anda menyelesaikan Modul 2: Membangun Branding Digital UMKM.",
        type: "success",
      },
      {
        userId: buAni.id,
        title: "Tips Hari Ini",
        message: "Coba prompt 'Caption Instagram Kuliner' di AI Prompt Library untuk produk terbaru Anda.",
        type: "info",
      },
    ],
  });

  console.log("\n✅ Seed selesai!");
  console.log("   - 4 users (1 admin, 1 mentor, 2 peserta)");
  console.log("   - 30 UMKM");
  console.log("   - 5 modul + 25 lessons");
  console.log(`   - ${promptCount} prompts`);
  console.log("   - 6 templates");
  console.log("   - 5 challenges + submissions");
  console.log("   - 5 showcase stories");
  console.log("   - notifications");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
