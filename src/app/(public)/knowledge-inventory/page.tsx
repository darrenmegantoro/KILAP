import { Suspense } from "react";
import { KnowledgeInventoryClient } from "@/components/knowledge/knowledge-inventory-client";
import { getPublicFaqs, toSearchable } from "@/lib/faqs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Knowledge Inventory",
  description:
    "Telusuri pengetahuan, pertanyaan umum, dan panduan singkat mengenai layanan informasi publik Bank Indonesia.",
};

export default async function KnowledgeInventoryPage() {
  const faqs = toSearchable(await getPublicFaqs());

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-[#293F70]">Knowledge Inventory</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
          Telusuri pengetahuan, pertanyaan umum, dan panduan singkat mengenai layanan
          informasi publik Bank Indonesia untuk mendukung pemahaman SDM internal KPw BI
          Kepulauan Riau.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">Memuat Knowledge Inventory…</p>}>
        <KnowledgeInventoryClient faqs={faqs} />
      </Suspense>
    </div>
  );
}
