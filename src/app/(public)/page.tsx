import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { getPublicCategories } from "@/lib/faqs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getPublicCategories();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="absolute inset-0 bg-gradient-to-br from-[#293F70] via-[#3A538C] to-[#1E2F56]" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h1 className="animate-rise max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
            {BRAND.heroTitle}
          </h1>
          <p className="animate-rise-delay mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {BRAND.heroDescription}
          </p>
          <div className="animate-rise-delay mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/knowledge-inventory"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-[#293F70] transition-colors hover:bg-slate-100"
            >
              Akses Knowledge Inventory
              <ArrowRight size={18} />
            </Link>
            <a
              href={BRAND.biInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/35 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Layanan Informasi Bank Indonesia
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-[#293F70] md:text-3xl">
            Kategori Knowledge Inventory
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            Pilih kategori untuk memahami ruang lingkup utama layanan informasi publik
            yang perlu diketahui dan diterapkan oleh SDM internal KPw BI Kepulauan Riau.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/knowledge-inventory?category=${category.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#293F70]/30 hover:shadow-md"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#293F70]/10 text-[#293F70]">
                  <BookOpen size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#293F70]">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {category.description}
                  </p>
                  <p className="mt-3 text-xs font-medium text-[#293F70]">
                    {category._count.faqs} FAQ · Telusuri kategori
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
