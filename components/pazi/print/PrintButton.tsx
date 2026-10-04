"use client";

import { tr } from "@/content/pazi/tr";

export function PrintButton() {
  return (
    <button type="button" className="pz-btn pz-btn-primary" onClick={() => window.print()}>
      {tr.sheet.print}
    </button>
  );
}
