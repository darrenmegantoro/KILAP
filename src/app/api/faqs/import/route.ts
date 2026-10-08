import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getSessionUser } from "@/lib/auth";
import { getStore, newId } from "@/lib/db";

type ImportRow = {
  category_id?: string;
  category?: string;
  bloom?: string;
  level?: number | string;
  indikator_perilaku?: string;
  pertanyaan?: string;
  jawaban?: string;
  keywords?: string;
  status?: string;
};

const BLOOM_BY_LEVEL: Record<number, string> = {
  1: "Remembering",
  2: "Understanding",
  3: "Applying",
  4: "Analyzing",
  5: "Evaluating",
  6: "Creating",
};

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ImportRow>(sheet, { defval: "" });

    const store = await getStore();
    const byId = new Map(store.categories.map((c) => [c.id, c]));
    const byName = new Map(store.categories.map((c) => [c.name.toLowerCase(), c]));

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const [index, row] of rows.entries()) {
      const pertanyaan = String(row.pertanyaan || "").trim();
      const jawaban = String(row.jawaban || "").trim();
      if (!pertanyaan || !jawaban) {
        failed += 1;
        errors.push(`Baris ${index + 2}: pertanyaan/jawaban kosong.`);
        continue;
      }

      const category =
        (row.category_id && byId.get(String(row.category_id))) ||
        (row.category && byName.get(String(row.category).toLowerCase()));
      if (!category) {
        failed += 1;
        errors.push(`Baris ${index + 2}: kategori tidak dikenali.`);
        continue;
      }

      const level = Number(row.level || 1);
      if (!Number.isInteger(level) || level < 1 || level > 6) {
        failed += 1;
        errors.push(`Baris ${index + 2}: level tidak valid.`);
        continue;
      }

      const existing = store.faqs.find(
        (faq) =>
          !faq.isArchived &&
          faq.categoryId === category.id &&
          faq.pertanyaan === pertanyaan,
      );

      const now = new Date();
      if (existing) {
        existing.jawaban = jawaban;
        existing.levelKemahiran = level;
        existing.bloomLabel = String(row.bloom || BLOOM_BY_LEVEL[level]);
        existing.indikatorPerilaku = String(
          row.indikator_perilaku || existing.indikatorPerilaku,
        );
        existing.keywords = String(row.keywords || existing.keywords || "");
        existing.status =
          row.status === "draft" || row.status === "published"
            ? row.status
            : existing.status;
        existing.updatedAt = now;
      } else {
        const status: "draft" | "published" =
          row.status === "draft" || row.status === "published"
            ? row.status
            : "published";
        const faq = {
          id: newId(),
          sourceKey: `import-${Date.now()}-${index}`,
          categoryId: category.id,
          pertanyaan,
          jawaban,
          levelKemahiran: level,
          bloomLabel: String(row.bloom || BLOOM_BY_LEVEL[level]),
          indikatorPerilaku: String(
            row.indikator_perilaku || "Indikator perilaku belum diisi.",
          ),
          keywords: String(row.keywords || ""),
          status,
          isActive: true,
          isArchived: false,
          sortOrder: store.faqs.length + 1,
          excelRow: null,
          createdAt: now,
          updatedAt: now,
        };
        store.faqs.push(faq);
        store.changeLogs.unshift({
          id: newId(),
          faqId: faq.id,
          actorId: user.id,
          actorName: user.name,
          actorEmail: user.email,
          action: "import",
          summary: `Impor FAQ: ${pertanyaan.slice(0, 80)}`,
          createdAt: now,
        });
      }
      success += 1;
    }

    return NextResponse.json({
      ok: true,
      success,
      failed,
      errors: errors.slice(0, 20),
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengimpor file." }, { status: 500 });
  }
}
