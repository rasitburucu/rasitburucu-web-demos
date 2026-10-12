// A room seen through its door: the photo stands only inside the drawn
// opening (stone lintel, timber frame, threshold, one leaf folded back).

import type { Lang } from "@/lib/yedipencere/dates";
import { PHOTOS, photoSrc, type PhotoKey } from "@/content/yedipencere/photos";
import { INK } from "./geom";

export function DoorPhoto({ photo, lang, id, width = 420, arch = false }: { photo: PhotoKey; lang: Lang; id: string; width?: number; arch?: boolean }) {
  // opening 180 × 300 (3:5), the proportion the photos are cut to
  const x = 70;
  const y = 52;
  const w = 180;
  const h = 300;
  const clip = `yp-door-${id}`;
  const top = arch ? `M${x} ${y + 60}A${w / 2} ${w / 2 - 30} 0 0 1 ${x + w} ${y + 60}` : `M${x} ${y}H${x + w}`;
  const opening = arch ? `${top}V${y + h}H${x}Z` : `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
  return (
    <svg viewBox="0 0 320 400" role="img" aria-label={PHOTOS[photo].alt[lang]}>
      <defs>
        <clipPath id={clip}>
          <path d={opening} />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="320" height="400" fill="url(#yp-moloz)" />
      <rect x="0" y="0" width="320" height="400" fill="#FAFAF8" fillOpacity="0.35" />
      {/* lintel and jambs in cut stone */}
      {!arch && <rect x={x - 22} y={y - 30} width={w + 44} height="30" fill="#EDEAE3" stroke={INK} strokeWidth="1.4" />}
      {!arch && <path d={`M${x - 22} ${y - 15}H${x + w + 22}M${x + 40} ${y - 30}V${y - 15}M${x + 120} ${y - 15}V${y}`} stroke={INK} strokeWidth="0.6" />}
      {arch && <path d={`M${x - 16} ${y + h}V${y + 60}A${w / 2 + 16} ${w / 2 - 14} 0 0 1 ${x + w + 16} ${y + 60}V${y + h}`} fill="#EDEAE3" stroke={INK} strokeWidth="1.4" />}
      <path d={opening} fill="#DCE5EA" />
      <image href={photoSrc(photo, width * 2)} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
      <path d={opening} fill="none" stroke={INK} strokeWidth="2.4" />
      <path d={arch ? `M${x + 6} ${y + h}V${y + 62}` : `M${x + 6} ${y + 6}V${y + h}M${x + 6} ${y + 6}H${x + w - 6}V${y + h}`} fill="none" stroke={INK} strokeWidth="0.8" />
      {/* a leaf folded back against the reveal */}
      <path d={`M${x + w} ${y + (arch ? 70 : 8)}L${x + w + 26} ${y + (arch ? 84 : 22)}V${y + h + 12}L${x + w} ${y + h}Z`} fill="url(#yp-ahsap)" stroke={INK} strokeWidth="1.2" />
      {/* threshold */}
      <rect x={x - 26} y={y + h} width={w + 52} height="12" fill="#EDEAE3" stroke={INK} strokeWidth="1.4" />
      <line x1="0" y1={y + h + 30} x2="320" y2={y + h + 30} stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}
