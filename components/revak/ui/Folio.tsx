/**
 * Almanac section mark: "§ 03" on a hairline. With children it is the
 * section's (small) heading; without, a decorative folio above a larger h2.
 */
export function Folio({ n, id, children }: { n: string; id?: string; children?: React.ReactNode }) {
  if (children)
    return (
      <h2 className="rv-folio" id={id}>
        <span className="rv-folio-n">{n}</span>
        <span>{children}</span>
      </h2>
    );
  return (
    <p className="rv-folio" aria-hidden="true">
      <span className="rv-folio-n">{n}</span>
    </p>
  );
}
