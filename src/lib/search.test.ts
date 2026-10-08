import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { redactQuery, searchFaqs, type SearchableFaq } from "./search";

const sample: SearchableFaq[] = [
  {
    id: "1",
    pertanyaan: "Bagaimana cara mengajukan permohonan informasi publik?",
    jawaban: "Permohonan dapat diajukan melalui portal e-PPID secara daring.",
    keywords: "permohonan e-PPID",
    categoryId: "permohonan_informasi",
    categoryName: "Pengelolaan Permohonan Informasi",
    levelKemahiran: 1,
    bloomLabel: "Remembering",
    indikatorPerilaku: "Mengetahui kanal",
    sortOrder: 1,
    categorySort: 3,
  },
  {
    id: "2",
    pertanyaan: "Apakah saya harus membayar untuk memperoleh informasi publik dari Bank Indonesia?",
    jawaban: "Tidak. Informasi publik disediakan secara gratis.",
    keywords: "biaya gratis",
    categoryId: "biaya_perolehan_informasi_publik",
    categoryName: "Pengenaan Biaya Perolehan Informasi Publik",
    levelKemahiran: 1,
    bloomLabel: "Remembering",
    indikatorPerilaku: "Mengetahui gratis",
    sortOrder: 1,
    categorySort: 2,
  },
];

describe("searchFaqs", () => {
  it("menemukan FAQ biaya dengan typo ringan", () => {
    const result = searchFaqs(sample, "bayar informsi publik", { minScore: 8 });
    assert.equal(result[0]?.faq.id, "2");
  });

  it("menemukan FAQ permohonan", () => {
    const result = searchFaqs(sample, "cara ajukan permohonan", { minScore: 8 });
    assert.equal(result[0]?.faq.id, "1");
  });
});

describe("redactQuery", () => {
  it("menyembunyikan email dan telepon", () => {
    const redacted = redactQuery("hubungi saya di nama@contoh.id atau 081234567890");
    assert.match(redacted, /\[email\]/);
    assert.match(redacted, /\[telepon\]/);
  });
});
