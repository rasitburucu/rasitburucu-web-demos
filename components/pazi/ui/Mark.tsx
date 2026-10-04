// The Pazı mark: a robot arm flexed like an arm showing its biceps ("pazı"),
// standing on a strip of yellow floor tape. Upper arm = the muscle.

export function Mark({ size = 36, title }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title} className="pz-mark">
      <rect x="3" y="34.5" width="34" height="3" fill="#F5A800" />
      <rect x="6" y="28" width="9" height="6.5" rx="0.8" fill="currentColor" />
      {/* upper arm with the biceps bulge */}
      <path d="M9.5 30 L9.5 24.6 C12.5 17.4 20.5 16.2 26.6 22.2 L28.5 24.5 L28.5 30 Z" fill="currentColor" />
      {/* forearm, raised */}
      <rect x="23.5" y="8.5" width="6.4" height="19" rx="1.2" fill="currentColor" />
      {/* tool */}
      <rect x="20.5" y="4" width="12.4" height="3.2" rx="0.6" fill="currentColor" />
      <circle cx="12" cy="27.2" r="2.1" fill="var(--pz-mark-joint, #ECECE6)" />
      <circle cx="26.7" cy="26" r="2.1" fill="var(--pz-mark-joint, #ECECE6)" />
      <circle cx="26.7" cy="10.6" r="1.6" fill="var(--pz-mark-joint, #ECECE6)" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="pz-wordmark">
      <span className="pz-wordmark-name">pazı</span>
      <span className="pz-wordmark-sub">robotik</span>
    </span>
  );
}
