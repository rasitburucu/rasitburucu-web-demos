"use client";

import { useId } from "react";
import { ILLER } from "@/lib/vaziyet/hesap";
import { tr } from "@/content/vaziyet/tr";

const sirali = [...ILLER].sort((a, b) => a.ad.localeCompare(b.ad, "tr"));

/** Province picker for the transport line; the distance source sits under it. */
export function IlSec({ il, onSec, kaynak = true, className }: { il: number; onSec: (plaka: number) => void; kaynak?: boolean; className?: string }) {
  const id = useId();
  return (
    <div className={`vz-ilsec ${className ?? ""}`}>
      <label htmlFor={id}>{tr.maliyet.il}</label>
      <select id={id} value={il} onChange={(e) => onSec(Number(e.target.value))}>
        {sirali.map((i) => (
          <option key={i.plaka} value={i.plaka}>
            {i.ad}
          </option>
        ))}
      </select>
      {kaynak && <p className="vz-ilsec-kaynak">{tr.maliyet.mesafeKaynak}</p>}
    </div>
  );
}
