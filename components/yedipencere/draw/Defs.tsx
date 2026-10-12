// Hatch patterns shared by every drawing on the page. They live in one hidden
// SVG at the top of the demo (patterns inside a display:none SVG would not paint).

export function Defs() {
  return (
    <svg className="yp-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {/* rubble stone (moloz taş) */}
        <pattern id="yp-moloz" width="56" height="34" patternUnits="userSpaceOnUse">
          <rect width="56" height="34" fill="#F1F0EC" />
          <path
            d="M0 9 L11 7 L19 10 L30 8 L41 11 L56 9 M3 9 L4 20 M19 10 L17 21 M41 11 L43 22 M0 21 L13 20 L27 22 L36 20 L49 23 L56 21 M10 21 L8 34 M30 22 L31 34 M49 23 L47 34 M23 0 L24 8 M50 0 L49 10"
            fill="none"
            stroke="#7C726B"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </pattern>
        {/* city wall blocks (sur) */}
        <pattern id="yp-sur" width="64" height="30" patternUnits="userSpaceOnUse">
          <rect width="64" height="30" fill="#EDEAE3" />
          <path d="M0 0 H64 M0 15 H64 M20 0 V15 M52 0 V15 M8 15 V30 M38 15 V30" stroke="#7C726B" strokeWidth="0.7" fill="none" />
          <path d="M26 6 h2 M44 22 h3 M12 9 h1" stroke="#9C938C" strokeWidth="0.6" fill="none" />
        </pattern>
        {/* clay roof tiles (kiremit) */}
        <pattern id="yp-kiremit" width="12" height="7" patternUnits="userSpaceOnUse">
          <rect width="12" height="7" fill="#F4EEEA" />
          <path d="M0 7 Q3 2 6 7 Q9 2 12 7" stroke="#8A5A48" strokeWidth="0.6" fill="none" />
        </pattern>
        {/* cobbles (Arnavut kaldırımı) */}
        <pattern id="yp-arnavut" width="14" height="10" patternUnits="userSpaceOnUse">
          <rect width="14" height="10" fill="#F4F3EF" />
          <ellipse cx="4" cy="3" rx="3.2" ry="2.2" stroke="#7C726B" strokeWidth="0.55" fill="none" />
          <ellipse cx="11" cy="7.5" rx="3" ry="2.1" stroke="#7C726B" strokeWidth="0.55" fill="none" />
        </pattern>
        {/* stone paving (taş kaplama) */}
        <pattern id="yp-tas" width="22" height="12" patternUnits="userSpaceOnUse">
          <rect width="22" height="12" fill="#F3F1EC" />
          <path d="M0 0.5 H22 M0 6.5 H22 M7 0.5 V6.5 M18 6.5 V12" stroke="#8C8279" strokeWidth="0.55" fill="none" />
        </pattern>
        {/* travertine cliff (falez) */}
        <pattern id="yp-traverten" width="46" height="22" patternUnits="userSpaceOnUse">
          <rect width="46" height="22" fill="#E7E0D3" />
          <path d="M0 6 H18 M24 6 H46 M6 14 H30 M34 14 H44 M0 20 H12 M18 20 H40" stroke="#8C8073" strokeWidth="0.55" fill="none" />
          <path d="M9 3 h.1 M31 10 h.1 M40 3 h.1 M15 17 h.1 M27 18 h.1 M3 11 h.1" stroke="#6E625B" strokeWidth="1.6" strokeLinecap="round" />
        </pattern>
        {/* sea */}
        <pattern id="yp-deniz" width="40" height="8" patternUnits="userSpaceOnUse">
          <rect width="40" height="8" fill="#D3DFE6" />
          <path d="M2 3 H14 M20 3 H26 M10 7 H30 M34 7 H38" stroke="#6E8796" strokeWidth="0.6" fill="none" />
        </pattern>
        {/* shadow hatch */}
        <pattern id="yp-golge" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#2A201B" strokeWidth="0.7" />
        </pattern>
        {/* river pebbles (çakıl) */}
        <pattern id="yp-cakil" width="12" height="8" patternUnits="userSpaceOnUse">
          <rect width="12" height="8" fill="#F1F0EC" />
          <ellipse cx="3" cy="2.5" rx="1.8" ry="1.1" fill="#5E544E" />
          <ellipse cx="9" cy="6" rx="1.6" ry="1" fill="none" stroke="#7C726B" strokeWidth="0.5" />
        </pattern>
        {/* timber boards */}
        <pattern id="yp-ahsap" width="7" height="40" patternUnits="userSpaceOnUse">
          <rect width="7" height="40" fill="#F4F1EC" />
          <path d="M0 0 V40" stroke="#7C726B" strokeWidth="0.5" />
        </pattern>
        {/* shutter slats, small (elevations) */}
        <pattern id="yp-lamel" width="6" height="3.2" patternUnits="userSpaceOnUse">
          <rect width="6" height="3.2" fill="#EFE9E3" />
          <line x1="0" y1="2.6" x2="6" y2="2.6" stroke="#2A201B" strokeWidth="0.8" />
        </pattern>
        {/* shutter slats, large (window detail) */}
        <pattern id="yp-lamel-l" width="10" height="6" patternUnits="userSpaceOnUse">
          <rect width="10" height="6" fill="#EFE9E3" />
          <line x1="0" y1="5" x2="10" y2="5" stroke="#2A201B" strokeWidth="1.1" />
        </pattern>
      </defs>
    </svg>
  );
}
