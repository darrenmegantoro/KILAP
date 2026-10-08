import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { getStore } from "@/lib/db";

export async function GET() {
  const store = await getStore();
  const items = store.categories
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      ...category,
      _count: {
        faqs: store.faqs.filter(
          (faq) => faq.categoryId === category.id && !faq.isArchived,
        ).length,
      },
    }));
  return NextResponse.json({ items });
}

const updateSchema = z.object({
  id: z.string(),
  description: z.string().min(20),
  sortOrder: z.number().int().min(1).max(5).optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const body = updateSchema.parse(await req.json());
    if (!body.description.startsWith("Pelajari tentang")) {
      return NextResponse.json(
        { error: "Deskripsi harus diawali 'Pelajari tentang...'." },
        { status: 400 },
      );
    }

    const store = await getStore();
    const category = store.categories.find((c) => c.id === body.id);
    if (!category) {
      return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 404 });
    }

    category.description = body.description;
    if (body.sortOrder != null) category.sortOrder = body.sortOrder;
    category.updatedAt = new Date();

    return NextResponse.json({ ok: true, item: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal memperbarui kategori." }, { status: 500 });
  }
}
