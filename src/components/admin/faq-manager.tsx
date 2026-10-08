"use client";

import { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Category = { id: string; name: string };
type FaqRow = {
  id: string;
  pertanyaan: string;
  jawaban: string;
  categoryId: string;
  levelKemahiran: number;
  bloomLabel: string;
  indikatorPerilaku: string;
  keywords: string;
  status: string;
  isActive: boolean;
  updatedAt: string;
  category: Category;
};

const BLOOM: Record<number, string> = {
  1: "Remembering",
  2: "Understanding",
  3: "Applying",
  4: "Analyzing",
  5: "Evaluating",
  6: "Creating",
};

const emptyForm = {
  categoryId: "pelayanan_informasi_publik",
  pertanyaan: "",
  jawaban: "",
  levelKemahiran: 1,
  bloomLabel: "Remembering",
  indikatorPerilaku: "",
  keywords: "",
  status: "draft",
  isActive: true,
};

export function FaqManager({
  categories,
  initialItems,
  initialTotal,
}: {
  categories: Category[];
  initialItems: FaqRow[];
  initialTotal: number;
}) {
  const [items, setItems] = useState<FaqRow[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function load() {
    setError(null);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("categoryId", categoryId);
    const res = await fetch(`/api/faqs?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal memuat FAQ");
    setItems(data.items);
    setTotal(data.total);
  }

  function refresh() {
    startTransition(() => {
      void load().catch((e) => {
        setError(e instanceof Error ? e.message : "Gagal memuat");
      });
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      levelKemahiran: Number(form.levelKemahiran),
      bloomLabel: BLOOM[Number(form.levelKemahiran)] || form.bloomLabel,
    };
    const res = await fetch(editingId ? `/api/faqs/${editingId}` : "/api/faqs", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Gagal menyimpan");
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    refresh();
  }

  async function removeFaq(id: string) {
    if (!confirm("Arsipkan FAQ ini? Data analitik historis tetap tersimpan.")) return;
    const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menghapus");
      return;
    }
    refresh();
  }

  async function togglePublish(item: FaqRow) {
    const nextStatus = item.status === "published" ? "draft" : "published";
    await fetch(`/api/faqs/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        isActive: nextStatus === "published" ? true : item.isActive,
      }),
    });
    refresh();
  }

  async function toggleActive(item: FaqRow) {
    await fetch(`/api/faqs/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    refresh();
  }

  async function onImport(file: File | null) {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/faqs/import", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Impor gagal");
      return;
    }
    setImportSummary(
      `Impor selesai: ${data.success} berhasil, ${data.failed} gagal.`,
    );
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#293F70]">Kelola FAQ</h2>
          <p className="text-sm text-slate-500">{total} FAQ aktif di basis data.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              void (async () => {
                const res = await fetch("/api/faqs/export");
                if (!res.ok) {
                  setError("Gagal mengekspor FAQ.");
                  return;
                }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "kilap-kepri-faq.xlsx";
                a.click();
                URL.revokeObjectURL(url);
              })();
            }}
          >
            Ekspor Excel
          </Button>
          <label className="inline-flex h-11 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#293F70] hover:bg-slate-50">
            Impor Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => void onImport(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      {importSummary && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {importSummary}
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
      >
        <h3 className="font-semibold text-slate-800">
          {editingId ? "Edit FAQ" : "Tambah FAQ"}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Kategori</span>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Level kemahiran (1–6)
            </span>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={form.levelKemahiran}
              onChange={(e) =>
                setForm({
                  ...form,
                  levelKemahiran: Number(e.target.value),
                  bloomLabel: BLOOM[Number(e.target.value)],
                })
              }
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} · {BLOOM[n]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Pertanyaan</span>
          <Input
            required
            value={form.pertanyaan}
            onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Jawaban</span>
          <Textarea
            required
            value={form.jawaban}
            onChange={(e) => setForm({ ...form, jawaban: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Indikator perilaku
          </span>
          <Textarea
            required
            value={form.indikatorPerilaku}
            onChange={(e) =>
              setForm({ ...form, indikatorPerilaku: e.target.value })
            }
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Kata kunci (opsional)
            </span>
            <Input
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Status</span>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit">{editingId ? "Simpan perubahan" : "Tambah FAQ"}</Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Batal
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 md:flex-row">
          <Input
            placeholder="Cari pertanyaan atau jawaban…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Button type="button" variant="secondary" onClick={refresh} disabled={pending}>
            {pending ? "Memuat…" : "Filter"}
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">Tidak ada FAQ.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-2 py-2">Pertanyaan</th>
                  <th className="px-2 py-2">Kategori</th>
                  <th className="px-2 py-2">Level</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 align-top">
                    <td className="max-w-xs px-2 py-3 font-medium text-slate-800">
                      {item.pertanyaan}
                    </td>
                    <td className="px-2 py-3 text-slate-600">{item.category.name}</td>
                    <td className="px-2 py-3">{item.levelKemahiran}</td>
                    <td className="px-2 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge
                          className={
                            item.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }
                        >
                          {item.status}
                        </Badge>
                        <Badge
                          className={
                            item.isActive
                              ? "bg-slate-100 text-slate-600"
                              : "bg-red-50 text-red-700"
                          }
                        >
                          {item.isActive ? "aktif" : "nonaktif"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="text-left text-xs font-semibold text-[#293F70]"
                          onClick={() => {
                            setEditingId(item.id);
                            setForm({
                              categoryId: item.categoryId,
                              pertanyaan: item.pertanyaan,
                              jawaban: item.jawaban,
                              levelKemahiran: item.levelKemahiran,
                              bloomLabel: item.bloomLabel,
                              indikatorPerilaku: item.indikatorPerilaku,
                              keywords: item.keywords,
                              status: item.status,
                              isActive: item.isActive,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-left text-xs font-semibold text-[#293F70]"
                          onClick={() => void togglePublish(item)}
                        >
                          {item.status === "published" ? "Jadikan draft" : "Terbitkan"}
                        </button>
                        <button
                          type="button"
                          className="text-left text-xs font-semibold text-[#293F70]"
                          onClick={() => void toggleActive(item)}
                        >
                          {item.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          type="button"
                          className="text-left text-xs font-semibold text-red-600"
                          onClick={() => void removeFaq(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
