"use client";

import type { Locale } from "@/content/damar/routes";
import { STONE_IDS, STONES, type StoneId } from "@/content/damar/stones";
import { dict } from "@/lib/damar/dict";

/** "Stones in stock": the book's table of contents. On phones it becomes a
 *  row of four names under the book. */
export function Toc({ locale, current, onStone }: { locale: Locale; current: StoneId; onStone: (id: StoneId) => void }) {
  const d = dict(locale);
  return (
    <nav className="dm-toc" aria-labelledby="dm-toc-h">
      <h2 id="dm-toc-h" className="dm-label">
        {d.home.toc}
      </h2>
      <ol>
        {STONE_IDS.map((id) => {
          const s = STONES[id];
          return (
            <li key={id}>
              <button type="button" aria-current={id === current ? "true" : undefined} onClick={() => onStone(id)}>
                <span className="dm-toc-name">{s.name}</span>
                <span className="dm-toc-dots" aria-hidden="true" />
                <span className="dm-toc-no">
                  <span className="dm-sr">{d.home.tocBlock(s.block.id)}</span>
                  <span aria-hidden="true">{s.block.id}</span>
                </span>
                <span className="dm-toc-line">{d.stones[id].line}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
