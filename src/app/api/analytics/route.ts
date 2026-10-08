import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordAnalyticsEvent } from "@/lib/analytics";

const schema = z.object({
  type: z.enum(["search_submit", "faq_open"]),
  faqId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  query: z.string().max(500).optional().nullable(),
  anonymousSessionId: z.string().max(80).optional().nullable(),
  requestId: z.string().max(80).optional().nullable(),
});

const recent = new Map<string, number>();

function rateLimited(ip: string) {
  const now = Date.now();
  const key = ip || "unknown";
  const last = recent.get(key) || 0;
  if (now - last < 200) return true;
  recent.set(key, now);
  if (recent.size > 5000) {
    for (const [k, t] of recent) {
      if (now - t > 60_000) recent.delete(k);
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar." },
      { status: 429 },
    );
  }

  try {
    const body = schema.parse(await req.json());
    if (body.type === "faq_open" && !body.faqId) {
      return NextResponse.json(
        { error: "faqId wajib untuk faq_open." },
        { status: 400 },
      );
    }
    const event = await recordAnalyticsEvent(body);
    return NextResponse.json({ ok: true, id: event.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal mencatat peristiwa." }, { status: 500 });
  }
}
