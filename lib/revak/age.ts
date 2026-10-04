// "Çocuğum hangi sınıfa başlar?": placement by the Turkish enrolment-age rule.
// MEB Okul Öncesi Eğitim ve İlköğretim Kurumları Yönetmeliği md. 11 (see content/revak/kabul-ek.ts):
// completed months on 30 September of the enrolment year; 69+ months -> 1st grade,
// 66-68 months -> 1st grade on the parent's written request, 69-71 months -> may be deferred
// one year on the parent's request; kindergarten 36-68 months.
// Pure functions, no Intl: server and browser print the same thing.

import type { Kademe } from "./store";

export type Placement =
  | { kind: "young"; months: number; readyYear: number }
  | { kind: "old"; months: number }
  | {
      kind: "class";
      months: number;
      kademe: Kademe;
      sinif: string;
      /** 66-68 months: kindergarten by default, 1st grade on request */
      early: boolean;
      /** 69-71 months: 1st grade by default, may be deferred */
      defer: boolean;
      /** the September the child starts (or would have started) 1st grade */
      firstGradeYear: number;
      /** the September the child is first in the 3-year group */
      kgYear: number;
    };

const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
};

/** Completed months on 30 September of `year`. */
export function monthsOnSept30(birthIso: string, year: number) {
  const b = parse(birthIso);
  // 30 September is the last day of the month, so every birthday in September counts as reached.
  return (year - b.y) * 12 + (9 - b.m);
}

export function validBirth(iso: string, startYear: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const { y, m, d } = parse(iso);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return false;
  return y >= startYear - 25 && monthsOnSept30(iso, startYear) >= 0;
}

/** First September (>= from) on which the child has at least `minMonths` months. */
function firstYear(birthIso: string, minMonths: number, from: number) {
  let y = from;
  while (monthsOnSept30(birthIso, y) < minMonths) y++;
  return y;
}

export function place(birthIso: string, startYear: number): Placement {
  const months = monthsOnSept30(birthIso, startYear);
  const b = parse(birthIso).y;
  const firstGradeYear = firstYear(birthIso, 69, b);
  const kgYear = firstYear(birthIso, 36, b);
  if (months < 36) return { kind: "young", months, readyYear: kgYear };

  if (months <= 68) {
    const sinif = months < 48 ? "3y" : months < 60 ? "4y" : "5y";
    return { kind: "class", months, kademe: "anaokulu", sinif, early: months >= 66, defer: false, firstGradeYear, kgYear };
  }
  const grade = 1 + Math.floor((months - 69) / 12);
  if (grade > 12) return { kind: "old", months };
  const kademe: Kademe = grade <= 4 ? "ilkokul" : grade <= 8 ? "ortaokul" : "lise";
  return { kind: "class", months, kademe, sinif: String(grade), early: false, defer: grade === 1 && months <= 71, firstGradeYear, kgYear };
}

/** The four arches ahead of (and behind) the child: September of each level's first year, age then. */
export function arches(birthIso: string, p: Extract<Placement, { kind: "class" }>) {
  const f = p.firstGradeYear;
  const ageAt = (y: number) => Math.floor(monthsOnSept30(birthIso, y) / 12);
  return [
    { kademe: "anaokulu" as Kademe | null, year: p.kgYear, age: ageAt(p.kgYear) },
    { kademe: "ilkokul" as Kademe | null, year: f, age: ageAt(f) },
    { kademe: "ortaokul" as Kademe | null, year: f + 4, age: ageAt(f + 4) },
    { kademe: "lise" as Kademe | null, year: f + 8, age: ageAt(f + 8) },
    // graduation in June: three months before the September reference
    { kademe: null, year: f + 12, age: Math.floor((monthsOnSept30(birthIso, f + 12) - 3) / 12) },
  ];
}
