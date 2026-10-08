import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSessionUser } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: PropsWithChildren) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return <AdminShell userName={user.name}>{children}</AdminShell>;
}
