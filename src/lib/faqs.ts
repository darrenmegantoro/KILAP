import { getStore, withCategory, type FaqRecord } from "@/lib/db";
import type { SearchableFaq } from "@/lib/search";

export type PublicFaq = FaqRecord & {
  category: {
    id: string;
    name: string;
    jenis: string;
    description: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

export async function getPublicCategories() {
  const store = await getStore();
  return store.categories
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      ...category,
      _count: {
        faqs: store.faqs.filter(
          (faq) =>
            faq.categoryId === category.id &&
            faq.status === "published" &&
            faq.isActive &&
            !faq.isArchived,
        ).length,
      },
    }));
}

export async function getPublicFaqs(categoryId?: string | null): Promise<PublicFaq[]> {
  const store = await getStore();
  const categoryById = new Map(store.categories.map((c) => [c.id, c]));

  return store.faqs
    .filter(
      (faq) =>
        faq.status === "published" &&
        faq.isActive &&
        !faq.isArchived &&
        (!categoryId || faq.categoryId === categoryId),
    )
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
}

export function toSearchable(faqs: PublicFaq[]): SearchableFaq[] {
  return faqs.map((faq) => ({
    id: faq.id,
    pertanyaan: faq.pertanyaan,
    jawaban: faq.jawaban,
    keywords: faq.keywords,
    categoryId: faq.categoryId,
    categoryName: faq.category.name,
    levelKemahiran: faq.levelKemahiran,
    bloomLabel: faq.bloomLabel,
    indikatorPerilaku: faq.indikatorPerilaku,
    sortOrder: faq.sortOrder,
    categorySort: faq.category.sortOrder,
  }));
}

export async function getCategoryCounts() {
  const store = await getStore();
  const counts: Record<string, number> = {};
  for (const faq of store.faqs) {
    if (faq.isArchived) continue;
    counts[faq.categoryId] = (counts[faq.categoryId] || 0) + 1;
  }
  return counts;
}
