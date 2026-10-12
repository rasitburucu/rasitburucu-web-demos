import type { Locale } from "@/content/damar/routes";
import { STONE_IDS, STONES, USE_KEYS, type StoneId, type Use, type Values } from "@/content/damar/stones";
import { dict, num } from "@/lib/damar/dict";

export const VALUE_KEYS: (keyof Values)[] = ["density", "porosity", "absorption", "flexural", "compressive", "abrasion"];
const DIGITS: Record<keyof Values, number> = { density: 2, porosity: 2, absorption: 2, flexural: 1, compressive: 0, abrasion: 1 };

export const valueText = (locale: Locale, k: keyof Values, v: number) => num(locale, v, DIGITS[k]);

/** One stone's test values with the standard each one comes from. */
export function ValuesTable({ locale, stone, caption }: { locale: Locale; stone: StoneId; caption?: string }) {
  const d = dict(locale);
  const v = STONES[stone].values;
  return (
    <table className="dm-table dm-values">
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          <th scope="col">{d.values.title}</th>
          <th scope="col">{d.values.test}</th>
          <th scope="col" className="dm-r">
            <span className="dm-sr">{STONES[stone].name}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {VALUE_KEYS.map((k) => (
          <tr key={k}>
            <th scope="row">{d.values[k].label}</th>
            <td className="dm-std">{d.values[k].std}</td>
            <td className="dm-r dm-num">
              {valueText(locale, k, v[k])} <span className="dm-unit">{d.values[k].unit}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The four stones side by side. */
export function CompareTable({ locale }: { locale: Locale }) {
  const d = dict(locale);
  return (
    <div className="dm-scroll" role="region" aria-label={d.stonesPage.compare} tabIndex={0}>
      <table className="dm-table dm-compare">
        <thead>
          <tr>
            <th scope="col">{d.values.title}</th>
            <th scope="col">{d.values.test}</th>
            {STONE_IDS.map((id) => (
              <th key={id} scope="col" className="dm-r">
                {STONES[id].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VALUE_KEYS.map((k) => (
            <tr key={k}>
              <th scope="row">
                {d.values[k].label} <span className="dm-unit">({d.values[k].unit})</span>
              </th>
              <td className="dm-std">{d.values[k].std}</td>
              {STONE_IDS.map((id) => (
                <td key={id} className="dm-r dm-num">
                  {valueText(locale, k, STONES[id].values[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Mark({ level }: { level: Use }) {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" className="dm-use-mark">
      {level === "good" && <circle cx="7" cy="7" r="6" fill="currentColor" />}
      {level === "care" && (
        <>
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 1.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" />
        </>
      )}
      {level === "no" && <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}

export function UseMark({ level, label }: { level: Use; label: string }) {
  return (
    <span className="dm-use" data-level={level}>
      <Mark level={level} />
      <span className="dm-use-text">{label}</span>
    </span>
  );
}

/** Where each stone works: five uses × four stones. */
export function UsesMatrix({ locale }: { locale: Locale }) {
  const d = dict(locale);
  return (
    <div className="dm-scroll" role="region" aria-label={d.stonesPage.usesTitle} tabIndex={0}>
      <table className="dm-table dm-uses">
        <thead>
          <tr>
            <th scope="col">
              <span className="dm-sr">{d.stonesPage.usesTitle}</span>
            </th>
            {STONE_IDS.map((id) => (
              <th key={id} scope="col">
                {STONES[id].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {USE_KEYS.map((u) => (
            <tr key={u}>
              <th scope="row">{d.uses[u]}</th>
              {STONE_IDS.map((id) => {
                const level = STONES[id].uses[u];
                return (
                  <td key={id}>
                    <UseMark level={level} label={d.useLevel[level]} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** One stone's uses as a list. */
export function UsesList({ locale, stone }: { locale: Locale; stone: StoneId }) {
  const d = dict(locale);
  return (
    <ul className="dm-useslist">
      {USE_KEYS.map((u) => {
        const level = STONES[stone].uses[u];
        return (
          <li key={u} data-level={level}>
            <span className="dm-useslist-name">{d.uses[u]}</span>
            <UseMark level={level} label={d.useLevel[level]} />
          </li>
        );
      })}
    </ul>
  );
}
