import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { getStore, newId, withCategory } from "@/lib/db";

const createSchema = z.object({
  categoryId: z.string().min(1),
  pertanyaan: z.string().min(5),
  jawaban: z.string().min(5),
  levelKemahiran: z.number().int().min(1).max(6),
  bloomLabel: z.string().min(1),
  indikatorPerilaku: z.string().min(3),
  keywords: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const store = await getStore();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";
  const categoryId = searchParams.get("categoryId") || undefined;
  const status = searchParams.get("status") || undefined;
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(50, Math.max(5, Number(searchParams.get("pageSize") || 20)));

  let filtered = store.faqs.filter((faq) => !faq.isArchived);
  if (categoryId) filtered = filtered.filter((faq) => faq.categoryId === categoryId);
  if (status) filtered = filtered.filter((faq) => faq.status === status);
  if (q) {
    filtered = filtered.filter(
      (faq) =>
        faq.pertanyaan.toLowerCase().includes(q) ||
        faq.jawaban.toLowerCase().includes(q) ||
        faq.keywords.toLowerCase().includes(q),
    );
  }

  filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  const total = filtered.length;
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const items = pageItems.map((faq) => withCategory(faq, store.categories));

  return NextResponse.json({ total, page, pageSize, items });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const store = await getStore();
    const body = createSchema.parse(await req.json());
    const category = store.categories.find((c) => c.id === body.categoryId);
    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 400 });
    }

    const duplicate = store.faqs.find(
      (faq) =>
        !faq.isArchived &&
        faq.categoryId === body.categoryId &&
        faq.pertanyaan === body.pertanyaan,
    );
    if (duplicate) {
      return NextResponse.json(
        { error: "FAQ dengan pertanyaan serupa sudah ada pada kategori ini." },
        { status: 409 },
      );
    }

    const now = new Date();
    const faq = {
      id: newId(),
      sourceKey: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      categoryId: body.categoryId,
      pertanyaan: body.pertanyaan,
      jawaban: body.jawaban,
      levelKemahiran: body.levelKemahiran,
      bloomLabel: body.bloomLabel,
      indikatorPerilaku: body.indikatorPerilaku,
      keywords: body.keywords || "",
      status: body.status,
      isActive: body.isActive,
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
      action: "create",
      summary: `Membuat FAQ: ${faq.pertanyaan.slice(0, 80)}`,
      createdAt: now,
    });

    return NextResponse.json({ ok: true, item: faq }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data FAQ tidak valid." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal membuat FAQ." }, { status: 500 });
  }
}
