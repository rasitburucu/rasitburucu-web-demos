"use client";

import Link from "next/link";
import { href, type Locale } from "@/content/damar/routes";
import { dict } from "@/lib/damar/dict";
import { hideToast, useDamar } from "@/lib/damar/store";
import { Close } from "../ui/Icons";

/** One line of feedback ("added to your sample box"), read out politely. */
export function Toast({ locale }: { locale: Locale }) {
  const toast = useDamar((s) => s.toast);
  const d = dict(locale);
  return (
    <div className="dm-toast-host" role="status" aria-live="polite">
      {toast && (
        <div className="dm-toast" key={toast.id}>
          <p>{toast.text}</p>
          {toast.link && (
            <Link href={`${href(locale, "samples")}#box`} onClick={hideToast}>
              {d.toast.open}
            </Link>
          )}
          <button type="button" onClick={hideToast} aria-label={d.toast.close}>
            <Close size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
