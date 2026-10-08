import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateAdmin, createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const user = await authenticateAdmin(body.email, body.password);
    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 },
      );
    }
    await createSession(user);
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data login tidak valid." },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Gagal masuk." }, { status: 500 });
  }
}
