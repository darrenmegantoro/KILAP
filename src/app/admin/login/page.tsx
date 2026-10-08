import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");
  return <LoginForm />;
}
