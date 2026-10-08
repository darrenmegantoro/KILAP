import Link from "next/link";
import { BRAND, LOGO_AVAILABLE } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  compact = false,
  light = false,
  className,
  showText = true,
}: {
  href?: string;
  compact?: boolean;
  light?: boolean;
  className?: string;
  /** When false, only the logo image is shown (useful if space is tight). */
  showText?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-3 min-w-0", className)}
      aria-label={`${BRAND.title} — ${BRAND.subtitle}`}
    >
      {LOGO_AVAILABLE ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={BRAND.logoSrc}
          alt={`Logo ${BRAND.title}`}
          className={cn(
            "shrink-0 object-contain",
            compact ? "h-11 w-11" : "h-12 w-12 md:h-14 md:w-14",
            light && "rounded-lg bg-white/95 p-0.5",
          )}
        />
      ) : (
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold tracking-wide",
            light
              ? "bg-white/15 text-white ring-1 ring-white/25"
              : "bg-[#293F70] text-white",
          )}
          aria-hidden
        >
          KK
        </span>
      )}
      {showText && (
        <span className="min-w-0">
          <span
            className={cn(
              "block font-semibold tracking-tight leading-tight",
              compact ? "text-base" : "text-lg",
              light ? "text-white" : "text-[#293F70]",
            )}
          >
            {BRAND.title}
          </span>
          {!compact && (
            <span
              className={cn(
                "block text-xs leading-snug line-clamp-2",
                light ? "text-white/80" : "text-slate-500",
              )}
            >
              {BRAND.subtitle}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
