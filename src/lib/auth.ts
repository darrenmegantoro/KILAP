import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getStore } from "@/lib/db";

const COOKIE_NAME = "kilap_session";
const SESSION_HOURS = 12;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET harus di-set minimal 32 karakter.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function authenticateAdmin(email: string, password: string) {
  const store = await getStore();
  const admin = store.admin;
  if (!admin) return null;
  if (admin.email !== email.trim().toLowerCase()) return null;
  if (!(await verifyPassword(password, admin.passwordHash))) return null;
  return { id: admin.id, email: admin.email, name: admin.name } satisfies SessionUser;
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;

    const store = await getStore();
    const admin = store.admin;
    if (!admin || admin.id !== payload.sub || admin.email !== payload.email) {
      return null;
    }

    return { id: admin.id, email: admin.email, name: admin.name };
  } catch {
    return null;
  }
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
