import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getSessionUser } from "@/lib/auth";
import { getStore, withCategory } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const store = await getStore();
  const categoryById = new Map(store.categories.map((c) => [c.id, c]));

  const faqs = store.faqs
    .filter((faq) => !faq.isArchived)
    .map((faq) => withCategory(faq, store.categories))
    .sort((a, b) => {
      const catA = categoryById.get(a.categoryId)?.sortOrder ?? 0;
      const catB = categoryById.get(b.categoryId)?.sortOrder ?? 0;
      if (catA !== catB) return catA - catB;
      if (a.levelKemahiran !== b.levelKemahiran) {
        return a.levelKemahiran - b.levelKemahiran;
      }
      return a.sortOrder - b.sortOrder;
    });

  const rows = faqs.map((faq) => ({
    category_id: faq.categoryId,
    category: faq.category.name,
    bloom: faq.bloomLabel,
    level: faq.levelKemahiran,
    indikator_perilaku: faq.indikatorPerilaku,
    pertanyaan: faq.pertanyaan,
    jawaban: faq.jawaban,
    keywords: faq.keywords,
    status: faq.status,
    aktif: faq.isActive ? "ya" : "tidak",
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "FAQ");
  const buffer = XLSX.write(book, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="kilap-kepri-faq.xlsx"',
    },
  });
}
