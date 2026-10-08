import { FaqManager } from "@/components/admin/faq-manager";
import { getStore, withCategory } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const store = await getStore();
  const categories = store.categories
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ id: c.id, name: c.name }));

  const activeFaqs = store.faqs
    .filter((faq) => !faq.isArchived)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const total = activeFaqs.length;
  const items = activeFaqs.slice(0, 20).map((item) => ({
    ...withCategory(item, store.categories),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return (
    <FaqManager
      categories={categories}
      initialTotal={total}
      initialItems={items}
    />
  );
}
