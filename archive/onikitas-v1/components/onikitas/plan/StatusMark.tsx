import { tr } from "@/content/onikitas/tr";
import type { Villa } from "@/content/onikitas/villas";

/** Status shown the way the printed plan legend shows it. */
export function StatusMark({ status, className = "" }: { status: Villa["status"]; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap text-[0.85rem] ${status === "available" ? "text-tile-ink" : ""} ${className}`}>
      <svg width="12" height="12" aria-hidden className="shrink-0">
        {status === "available" ? (
          <rect x="0.5" y="0.5" width="11" height="11" fill="#b5532c" />
        ) : status === "reserved" ? (
          <rect x="1" y="1" width="10" height="10" fill="none" stroke="#3b3a2e" strokeWidth="1.6" strokeDasharray="0.1 3" strokeLinecap="round" />
        ) : (
          <>
            <rect x="0.5" y="0.5" width="11" height="11" fill="none" stroke="#3b3a2e" />
            <path d="M0 12 L12 0 M-3 9 L9 -3 M3 15 L15 3" stroke="#3b3a2e" strokeWidth="1" />
          </>
        )}
      </svg>
      {tr.status[status]}
    </span>
  );
}
