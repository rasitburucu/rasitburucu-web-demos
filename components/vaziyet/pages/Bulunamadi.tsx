"use client";

import Link from "next/link";
import { useMemo } from "react";
import { tr } from "@/content/vaziyet/tr";
import { hesapla, VARSAYILAN } from "@/lib/vaziyet/hesap";
import { Plan } from "../arac/Plan";

/** "Bu parselde bir şey yok": an empty cork plot on the mat, two ways back. */
export function Bulunamadi() {
  const n = tr.notFound;
  const d = useMemo(() => ({ ...VARSAYILAN, W: 24, D: 18 }), []);
  const s = useMemo(() => hesapla(d), [d]);
  return (
    <section className="vz-404 vz-mat">
      <div className="vz-wrap vz-404-in">
        <div className="vz-404-yazi">
          <h1 className="vz-h1">{n.baslik}</h1>
          <p className="vz-lead">{n.metin}</p>
          <div className="vz-row">
            <Link href={`${tr.base}/`} className="vz-btn vz-btn--kobalt vz-btn--big">
              {n.ana}
            </Link>
            <Link href={`${tr.base}/modeller/`} className="vz-btn vz-btn--cizgi vz-btn--big">
              {n.modeller}
            </Link>
          </div>
        </div>
        <div className="vz-404-plan" aria-hidden="true">
          <Plan durum={d} sonuc={s} tur="bos" />
        </div>
      </div>
    </section>
  );
}
