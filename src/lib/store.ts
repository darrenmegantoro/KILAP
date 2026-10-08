import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { categories as seedCategories, faqs as seedFaqs } from "@/data/seed-data";

export type CategoryRecord = {
  id: string;
  name: string;
  jenis: string;
  description: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FaqRecord = {
  id: string;
  sourceKey: string;
  categoryId: string;
  levelKemahiran: number;
  bloomLabel: string;
  indikatorPerilaku: string;
  pertanyaan: string;
  jawaban: string;
  keywords: string;
  status: "draft" | "published";
  isActive: boolean;
  isArchived: boolean;
  sortOrder: number;
  excelRow: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AnalyticsEventRecord = {
  id: string;
  type: "search_submit" | "faq_open";
  faqId: string | null;
  categoryId: string | null;
  queryRedacted: string | null;
  anonymousSessionId: string | null;
  requestId: string | null;
  createdAt: Date;
};

export type ChangeLogRecord = {
  id: string;
  faqId: string | null;
  actorId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  action: string;
  summary: string;
  createdAt: Date;
};

export type AdminCredentials = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
};

type MemoryStore = {
  categories: CategoryRecord[];
  faqs: FaqRecord[];
  events: AnalyticsEventRecord[];
  changeLogs: ChangeLogRecord[];
  admin: AdminCredentials | null;
  hydrated: boolean;
};

const globalForStore = globalThis as unknown as { __kilapStore?: MemoryStore };

function createEmptyStore(): MemoryStore {
  return {
    categories: [],
    faqs: [],
    events: [],
    changeLogs: [],
    admin: null,
    hydrated: false,
  };
}

function hydrateFromSeed(store: MemoryStore) {
  const now = new Date();
  store.categories = seedCategories.map((category) => ({
    id: category.id,
    name: category.name,
    jenis: category.jenis,
    description: category.description,
    sortOrder: category.sortOrder,
    createdAt: now,
    updatedAt: now,
  }));

  store.faqs = seedFaqs.map((faq, index) => ({
    id: randomUUID(),
    sourceKey: `excel-row-${faq.baris_excel}`,
    categoryId: faq.kategori_id,
    levelKemahiran: faq.level_kemahiran,
    bloomLabel: faq.bloom_label,
    indikatorPerilaku: faq.indikator_perilaku,
    pertanyaan: faq.pertanyaan,
    jawaban: faq.jawaban,
    keywords: "",
    status: "published" as const,
    isActive: true,
    isArchived: false,
    sortOrder: index + 1,
    excelRow: faq.baris_excel,
    createdAt: now,
    updatedAt: now,
  }));
}

async function syncAdminFromEnv(store: MemoryStore) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin KILAP KEPRI";

  if (!email || !password) {
    store.admin = null;
    return;
  }

  // Re-hash when email/password env changes on a warm instance.
  if (
    store.admin &&
    store.admin.email === email &&
    (await bcrypt.compare(password, store.admin.passwordHash))
  ) {
    store.admin.name = name;
    return;
  }

  store.admin = {
    id: "admin",
    email,
    name,
    passwordHash: await bcrypt.hash(password, 12),
  };
}

export async function getStore(): Promise<MemoryStore> {
  if (!globalForStore.__kilapStore) {
    globalForStore.__kilapStore = createEmptyStore();
  }

  const store = globalForStore.__kilapStore;
  if (!store.hydrated) {
    hydrateFromSeed(store);
    store.hydrated = true;
  }

  await syncAdminFromEnv(store);
  return store;
}

export function newId() {
  return randomUUID();
}

export function withCategory(faq: FaqRecord, categories: CategoryRecord[]) {
  const category = categories.find((c) => c.id === faq.categoryId);
  if (!category) {
    throw new Error(`Kategori tidak ditemukan untuk FAQ ${faq.id}`);
  }
  return { ...faq, category };
}
