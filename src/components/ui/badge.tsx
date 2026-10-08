import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg bg-[#293F70]/10 px-2.5 py-1 text-xs font-medium text-[#293F70]",
        className,
      )}
    >
      {children}
    </span>
  );
}
