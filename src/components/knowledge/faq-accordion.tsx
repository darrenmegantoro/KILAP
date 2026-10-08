"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  pertanyaan: string;
  jawaban: string;
  categoryName: string;
  categoryId: string;
  levelKemahiran: number;
  bloomLabel: string;
};

async function trackFaqOpen(faq: FaqItem) {
  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${faq.id}`;
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "faq_open",
        faqId: faq.id,
        categoryId: faq.categoryId,
        requestId,
      }),
    });
  } catch {
    // ignore network errors for analytics
  }
}

export function FaqAccordion({
  items,
  openId,
  onOpenChange,
}: {
  items: FaqItem[];
  openId: string | null;
  onOpenChange: (id: string | null) => void;
}) {
  const trackedOpenId = useRef<string | null>(null);

  useEffect(() => {
    if (!openId) {
      trackedOpenId.current = null;
      return;
    }
    if (trackedOpenId.current === openId) return;
    trackedOpenId.current = openId;
    const faq = items.find((item) => item.id === openId);
    if (faq) void trackFaqOpen(faq);
  }, [openId, items]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
        Belum ditemukan FAQ yang sesuai. Coba gunakan kata kunci lain atau pilih
        kategori terkait.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((faq) => {
        const open = openId === faq.id;
        return (
          <article
            key={faq.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left md:px-5"
              aria-expanded={open}
              onClick={() => {
                const next = open ? null : faq.id;
                onOpenChange(next);
              }}
            >
              <span className="min-w-0">
                <span className="mb-2 flex flex-wrap gap-2">
                  <Badge>{faq.categoryName}</Badge>
                </span>
                <span className="block text-sm font-semibold text-slate-900 md:text-base">
                  {faq.pertanyaan}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "mt-1 shrink-0 text-slate-400 transition-transform",
                  open && "rotate-180",
                )}
                size={18}
              />
            </button>
            {open && (
              <div className="border-t border-slate-100 px-4 py-4 md:px-5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {faq.jawaban}
                </p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
