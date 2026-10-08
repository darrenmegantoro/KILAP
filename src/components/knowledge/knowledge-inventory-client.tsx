"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FaqAccordion, type FaqItem } from "@/components/knowledge/faq-accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchFaqs, type SearchableFaq } from "@/lib/search";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "", label: "Semua" },
  {
    id: "pelayanan_informasi_publik",
    label: "Pengelolaan Pelayanan Informasi Publik",
  },
  {
    id: "biaya_perolehan_informasi_publik",
    label: "Pengenaan Biaya Perolehan Informasi Publik",
  },
  { id: "permohonan_informasi", label: "Pengelolaan Permohonan Informasi" },
  { id: "pengajuan_keberatan", label: "Pengelolaan Pengajuan Keberatan" },
  {
    id: "penyelesaian_sengketa_informasi",
    label: "Pengelolaan Penyelesaian Sengketa Informasi",
  },
];

export function KnowledgeInventoryClient({ faqs }: { faqs: SearchableFaq[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const [category, setCategory] = useState(initialCategory);
  const [draft, setDraft] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);
  const [openId, setOpenId] = useState<string | null>(null);
  const deferredDraft = useDeferredValue(draft);

  const categoryFaqs = useMemo(
    () => (category ? faqs.filter((f) => f.categoryId === category) : faqs),
    [faqs, category],
  );

  const suggestions = useMemo(() => {
    if (!deferredDraft.trim()) return [];
    return searchFaqs(categoryFaqs, deferredDraft, { limit: 6, minScore: 10 });
  }, [categoryFaqs, deferredDraft]);

  const results = useMemo(() => {
    if (!submitted.trim()) {
      return categoryFaqs.map((faq) => ({ faq, score: 0 }));
    }
    return searchFaqs(categoryFaqs, submitted, { limit: 50, minScore: 8 });
  }, [categoryFaqs, submitted]);

  const items: FaqItem[] = results.map(({ faq }) => ({
    id: faq.id,
    pertanyaan: faq.pertanyaan,
    jawaban: faq.jawaban,
    categoryName: faq.categoryName,
    categoryId: faq.categoryId,
    levelKemahiran: faq.levelKemahiran,
    bloomLabel: faq.bloomLabel,
  }));

  function updateUrl(nextCategory: string, nextQuery: string) {
    const params = new URLSearchParams();
    if (nextCategory) params.set("category", nextCategory);
    if (nextQuery) params.set("q", nextQuery);
    const qs = params.toString();
    router.replace(qs ? `/knowledge-inventory?${qs}` : "/knowledge-inventory");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = draft.trim();
    setSubmitted(q);
    updateUrl(category, q);
    if (q) {
      const requestId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-search`;
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "search_submit",
            query: q,
            requestId,
          }),
        });
      } catch {
        // ignore
      }
    }
  }

  function selectCategory(id: string) {
    setCategory(id);
    updateUrl(id, submitted);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="text-lg font-semibold text-[#293F70] md:text-xl">
          Apa yang ingin Anda ketahui?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Gunakan fitur ini untuk menemukan FAQ, panduan, dan jawaban yang relevan
          sesuai kategori knowledge inventory.
        </p>
        <form onSubmit={onSubmit} className="relative mt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ketik pertanyaan terkait layanan informasi publik Bank Indonesia…"
                className="pl-10"
                aria-label="Pencarian Knowledge Inventory"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="sm:w-auto">
              Cari
            </Button>
          </div>
          {suggestions.length > 0 && draft.trim() && draft.trim() !== submitted && (
            <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg sm:max-w-[calc(100%-7.5rem)]">
              {suggestions.map(({ faq }) => (
                <li key={faq.id}>
                  <button
                    type="button"
                    className="block w-full px-4 py-3 text-left text-sm hover:bg-[#F4F6FA]"
                    onClick={() => {
                      setDraft(faq.pertanyaan);
                      setSubmitted(faq.pertanyaan);
                      setOpenId(faq.id);
                      updateUrl(category, faq.pertanyaan);
                    }}
                  >
                    <span className="font-medium text-slate-800">
                      {faq.pertanyaan}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {faq.categoryName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-800">Filter kategori</h2>
          <p className="text-sm text-slate-500">
            Menampilkan {items.length} dari {categoryFaqs.length} pertanyaan.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id || "all"}
              type="button"
              onClick={() => selectCategory(filter.id)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors sm:text-sm",
                category === filter.id
                  ? "border-[#293F70] bg-[#293F70] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#293F70]/40",
              )}
            >
              <span className="block max-w-[220px] whitespace-normal leading-snug">
                {filter.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {submitted.trim() && items.length > 0 && (
        <section className="rounded-2xl border border-[#293F70]/15 bg-[#F4F6FA] p-4 md:p-5">
          <h3 className="text-sm font-semibold text-[#293F70]">
            Hasil pencarian
          </h3>
          <ul className="mt-3 space-y-2">
            {items.slice(0, 5).map((faq) => (
              <li key={`chat-${faq.id}`}>
                <button
                  type="button"
                  className="w-full rounded-xl bg-white px-4 py-3 text-left text-sm shadow-sm hover:ring-1 hover:ring-[#293F70]/20"
                  onClick={() => setOpenId(faq.id)}
                >
                  <span className="font-medium text-slate-900">{faq.pertanyaan}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {faq.categoryName}
                  </span>
                  <span className="mt-2 block line-clamp-2 text-slate-600">
                    {faq.jawaban}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <FaqAccordion items={items} openId={openId} onOpenChange={setOpenId} />
        {items.length === 0 && submitted.trim() && (
          <p className="mt-3 text-center text-sm text-slate-500">
            Belum ditemukan FAQ yang sesuai. Coba gunakan kata kunci lain atau pilih
            kategori terkait.{" "}
            <Link href="/" className="text-[#293F70] underline-offset-2 hover:underline">
              Kembali ke beranda
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
