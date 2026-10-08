import {
  Activity,
  CalendarDays,
  CalendarRange,
  HelpCircle,
  Layers,
  Sun,
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { getDashboardMetrics } from "@/lib/analytics";
import { truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#293F70]">Dashboard Analitik FAQ</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan interaksi pencarian dan pembukaan FAQ Knowledge Inventory.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="TOTAL INTERAKSI"
          value={metrics.totalInteraksi}
          icon={Activity}
        />
        <MetricCard
          label="TOTAL INTERAKSI TAHUN INI"
          value={metrics.totalInteraksiTahunIni}
          icon={CalendarRange}
        />
        <MetricCard
          label="TOTAL INTERAKSI BULAN INI"
          value={metrics.totalInteraksiBulanIni}
          icon={CalendarDays}
        />
        <MetricCard
          label="TOTAL INTERAKSI HARI INI"
          value={metrics.totalInteraksiHariIni}
          icon={Sun}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="KATEGORI TERBANYAK"
          value={
            metrics.kategoriTerbanyak
              ? `${metrics.kategoriTerbanyak.name} (${metrics.kategoriTerbanyak.count})`
              : "Belum ada data"
          }
          icon={Layers}
          title={metrics.kategoriTerbanyak?.name}
        />
        <MetricCard
          label="PERTANYAAN TERBANYAK"
          value={
            metrics.pertanyaanTerbanyak
              ? `${truncate(metrics.pertanyaanTerbanyak.text, 56)} (${metrics.pertanyaanTerbanyak.count})`
              : "Belum ada data"
          }
          icon={HelpCircle}
          title={metrics.pertanyaanTerbanyak?.text}
        />
      </div>
    </div>
  );
}
