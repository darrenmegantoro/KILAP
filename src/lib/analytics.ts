import { getStore, newId } from "@/lib/db";
import { redactQuery } from "@/lib/search";
import {
  startOfJakartaDay,
  startOfJakartaMonth,
  startOfJakartaYear,
} from "@/lib/timezone";

export type AnalyticsEventType = "search_submit" | "faq_open";

export async function recordAnalyticsEvent(input: {
  type: AnalyticsEventType;
  faqId?: string | null;
  categoryId?: string | null;
  query?: string | null;
  anonymousSessionId?: string | null;
  requestId?: string | null;
}) {
  const store = await getStore();

  if (input.requestId) {
    const existing = store.events.find((e) => e.requestId === input.requestId);
    if (existing) return existing;
  }

  const event = {
    id: newId(),
    type: input.type,
    faqId: input.faqId || null,
    categoryId: input.type === "faq_open" ? input.categoryId || null : null,
    queryRedacted: input.query ? redactQuery(input.query) : null,
    anonymousSessionId: input.anonymousSessionId || null,
    requestId: input.requestId || null,
    createdAt: new Date(),
  };

  store.events.push(event);
  return event;
}

export async function getDashboardMetrics() {
  const store = await getStore();
  const now = new Date();
  const dayStart = startOfJakartaDay(now);
  const monthStart = startOfJakartaMonth(now);
  const yearStart = startOfJakartaYear(now);

  const events = store.events;
  const totalInteraksi = events.length;
  const totalInteraksiTahunIni = events.filter((e) => e.createdAt >= yearStart).length;
  const totalInteraksiBulanIni = events.filter((e) => e.createdAt >= monthStart).length;
  const totalInteraksiHariIni = events.filter((e) => e.createdAt >= dayStart).length;

  const categoryCounts = new Map<string, number>();
  const faqCounts = new Map<string, number>();

  for (const event of events) {
    if (event.type !== "faq_open") continue;
    if (event.categoryId) {
      categoryCounts.set(
        event.categoryId,
        (categoryCounts.get(event.categoryId) || 0) + 1,
      );
    }
    if (event.faqId) {
      faqCounts.set(event.faqId, (faqCounts.get(event.faqId) || 0) + 1);
    }
  }

  let kategoriTerbanyak: { name: string; count: number } | null = null;
  let topCategoryId: string | null = null;
  let topCategoryCount = 0;
  for (const [id, count] of categoryCounts) {
    if (count > topCategoryCount) {
      topCategoryId = id;
      topCategoryCount = count;
    }
  }
  if (topCategoryId) {
    const category = store.categories.find((c) => c.id === topCategoryId);
    if (category) {
      kategoriTerbanyak = { name: category.name, count: topCategoryCount };
    }
  }

  let pertanyaanTerbanyak: { text: string; count: number } | null = null;
  let topFaqId: string | null = null;
  let topFaqCount = 0;
  for (const [id, count] of faqCounts) {
    if (count > topFaqCount) {
      topFaqId = id;
      topFaqCount = count;
    }
  }
  if (topFaqId) {
    const faq = store.faqs.find((f) => f.id === topFaqId);
    if (faq) {
      pertanyaanTerbanyak = { text: faq.pertanyaan, count: topFaqCount };
    }
  }

  return {
    totalInteraksi,
    totalInteraksiTahunIni,
    totalInteraksiBulanIni,
    totalInteraksiHariIni,
    kategoriTerbanyak,
    pertanyaanTerbanyak,
  };
}
