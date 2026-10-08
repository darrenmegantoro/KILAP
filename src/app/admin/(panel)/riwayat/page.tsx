import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHistoryPage() {
  const store = await getStore();
  const logs = store.changeLogs.slice(0, 100).map((log) => ({
    ...log,
    actor: log.actorName
      ? { name: log.actorName, email: log.actorEmail || "" }
      : null,
    faq: log.faqId
      ? {
          pertanyaan:
            store.faqs.find((faq) => faq.id === log.faqId)?.pertanyaan || null,
        }
      : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#293F70]">Riwayat Perubahan</h2>
        <p className="mt-1 text-sm text-slate-500">
          Jejak create, update, publish, disable, delete, dan impor FAQ.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {logs.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            Belum ada riwayat perubahan.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {logs.map((log) => (
              <li key={log.id} className="px-4 py-4 md:px-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-[#293F70]/10 px-2 py-0.5 font-semibold text-[#293F70]">
                    {log.action}
                  </span>
                  <span>
                    {new Date(log.createdAt).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    })}
                  </span>
                  <span>·</span>
                  <span>{log.actor?.name || "Sistem"}</span>
                </div>
                <p className="mt-2 text-sm text-slate-800">{log.summary}</p>
                {log.faq?.pertanyaan && (
                  <p className="mt-1 text-xs text-slate-500">{log.faq.pertanyaan}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
