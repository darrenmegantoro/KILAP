export type SearchableFaq = {
  id: string;
  pertanyaan: string;
  jawaban: string;
  keywords: string;
  categoryId: string;
  categoryName: string;
  levelKemahiran: number;
  bloomLabel: string;
  indikatorPerilaku: string;
  sortOrder: number;
  categorySort: number;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string) {
  return normalize(text).split(" ").filter((t) => t.length > 1);
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array<number>(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

function tokenMatchScore(queryToken: string, candidateToken: string) {
  if (candidateToken.includes(queryToken) || queryToken.includes(candidateToken)) {
    return 1;
  }
  const distance = levenshtein(queryToken, candidateToken);
  const maxLen = Math.max(queryToken.length, candidateToken.length);
  if (maxLen <= 4 && distance <= 1) return 0.85;
  if (distance <= 1 && maxLen >= 5) return 0.8;
  if (distance <= 2 && maxLen >= 7) return 0.55;
  return 0;
}

export function scoreFaq(query: string, faq: SearchableFaq) {
  const q = normalize(query);
  if (!q) return 0;

  const pertanyaan = normalize(faq.pertanyaan);
  const jawaban = normalize(faq.jawaban);
  const keywords = normalize(faq.keywords);
  const haystack = `${pertanyaan} ${jawaban} ${keywords}`;

  let score = 0;
  if (pertanyaan.includes(q)) score += 120;
  if (keywords.includes(q)) score += 80;
  if (jawaban.includes(q)) score += 40;
  if (haystack.includes(q)) score += 20;

  const qTokens = tokenize(query);
  const pTokens = tokenize(faq.pertanyaan);
  const jTokens = tokenize(faq.jawaban);
  const kTokens = tokenize(faq.keywords);

  for (const qt of qTokens) {
    let best = 0;
    for (const pt of pTokens) best = Math.max(best, tokenMatchScore(qt, pt) * 18);
    for (const kt of kTokens) best = Math.max(best, tokenMatchScore(qt, kt) * 12);
    for (const jt of jTokens) best = Math.max(best, tokenMatchScore(qt, jt) * 6);
    score += best;
  }

  return score;
}

export function searchFaqs(
  faqs: SearchableFaq[],
  query: string,
  options?: { limit?: number; minScore?: number },
) {
  const limit = options?.limit ?? 20;
  const minScore = options?.minScore ?? 12;
  const ranked = faqs
    .map((faq) => ({ faq, score: scoreFaq(query, faq) }))
    .filter((item) => item.score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.faq.categorySort !== b.faq.categorySort) {
        return a.faq.categorySort - b.faq.categorySort;
      }
      if (a.faq.levelKemahiran !== b.faq.levelKemahiran) {
        return a.faq.levelKemahiran - b.faq.levelKemahiran;
      }
      return a.faq.sortOrder - b.faq.sortOrder;
    })
    .slice(0, limit);

  return ranked;
}

export function redactQuery(query: string) {
  return query
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\b08\d{8,12}\b/g, "[telepon]")
    .replace(/\b\+62\d{8,13}\b/g, "[telepon]")
    .slice(0, 200);
}
