import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { getStore, newId, withCategory } from "@/lib/db";

const updateSchema = z.object({
  categoryId: z.string().min(1).optional(),
  pertanyaan: z.string().min(5).optional(),
  jawaban: z.string().min(5).optional(),
  levelKemahiran: z.number().int().min(1).max(6).optional(),
  bloomLabel: z.string().min(1).optional(),
  indikatorPerilaku: z.string().min(3).optional(),
  keywords: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  isActive: z.boolean().optional(),
});

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) return null;
  return user;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  const { id } = await params;
  const store = await getStore();
  const faq = store.faqs.find((item) => item.id === id && !item.isArchived);
  if (!faq) {
    return NextResponse.json({ error: "FAQ tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ item: withCategory(faq, store.categories) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = updateSchema.parse(await req.json());
    const store = await getStore();
    const existing = store.faqs.find((item) => item.id === id && !item.isArchived);
    if (!existing) {
      return NextResponse.json({ error: "FAQ tidak ditemukan." }, { status: 404 });
    }

    if (body.categoryId) {
      const category = store.categories.find((c) => c.id === body.categoryId);
      if (!category) {
        return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 400 });
      }
    }

    const previousStatus = existing.status;
    const previousActive = existing.isActive;

    Object.assign(existing, body, { updatedAt: new Date() });

    let action = "update";
    if (body.status === "published" && previousStatus !== "published") action = "publish";
    if (body.isActive === false && previousActive) action = "disable";

    store.changeLogs.unshift({
      id: newId(),
      faqId: existing.id,
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action,
      summary: `Memperbarui FAQ (${action}): ${existing.pertanyaan.slice(0, 80)}`,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, item: existing });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal memperbarui FAQ." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await params;
  const store = await getStore();
  const existing = store.faqs.find((item) => item.id === id && !item.isArchived);
  if (!existing) {
    return NextResponse.json({ error: "FAQ tidak ditemukan." }, { status: 404 });
  }

  existing.isArchived = true;
  existing.isActive = false;
  existing.status = "draft";
  existing.updatedAt = new Date();

  store.changeLogs.unshift({
    id: newId(),
    faqId: existing.id,
    actorId: user.id,
    actorName: user.name,
    actorEmail: user.email,
    action: "delete",
    summary: `Mengarsipkan FAQ: ${existing.pertanyaan.slice(0, 80)}`,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
