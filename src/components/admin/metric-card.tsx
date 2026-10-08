import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  icon: Icon,
  className,
  title,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
      title={title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {label}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {value}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#293F70]/10 text-[#293F70]">
          <Icon size={18} />
        </span>
      </div>
    </div>
  );
}
